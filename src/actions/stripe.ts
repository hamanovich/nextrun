"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type Stripe from "stripe";
import { z } from "zod";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { stripe } from "@/lib/stripe";
import { getSessionUser, updateUserStripeData } from "./user";

interface StripeProduct {
  id: string;
  object: "product";
  active: boolean;
  attributes: string[];
  created: number;
  default_price: string;
  description: string;
  images: string[];
  livemode: boolean;
  marketing_features: { name: string; description?: string }[];
  metadata: {
    credits?: string;
    [key: string]: string | undefined;
  };
  name: string;
  package_dimensions: null;
  shippable: null;
  statement_descriptor: null;
  tax_code: null;
  type: "service";
  unit_label: null;
  updated: number;
  url: null;
}

export interface PricingProduct {
  id: string;
  amount: number | null;
  currency: string;
  interval: string | null;
  product: {
    id: string;
    name: string;
    description: string;
    images: string[];
    credits: string | undefined;
    marketing_features: { name: string; description?: string }[];
  };
}

const createPayment = async (priceId: string) => {
  const origin = (await headers()).get("origin");
  const baseUrl = env.NEXT_PUBLIC_DOMAIN ?? origin;

  if (!baseUrl) throw new Error("Base URL is not configured");

  const sessionUser = await getSessionUser();

  if (!sessionUser) throw new Error("User not authenticated");

  const { user, userId } = sessionUser;

  let customerId = user.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      name: user.name || undefined,
      metadata: {
        userId: userId,
      },
    });
    customerId = customer.id;

    await updateUserStripeData({ stripeCustomerId: customerId });
  }

  const price = await stripe.prices.retrieve(priceId, { expand: ["product"] });
  if (!price.active) throw new Error("Inactive price");
  if (price.unit_amount == null)
    throw new Error("Unsupported price: unit_amount is null");

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/pricing`,
    client_reference_id: userId,
    metadata: {
      userId: userId,
    },
  });

  if (!checkoutSession.url)
    throw new Error("Failed to create checkout session URL");

  redirect(checkoutSession.url);
};

const priceIdSchema = z.string().startsWith("price_").max(255);

export const createPaymentAction = async (formData: FormData) => {
  const result = priceIdSchema.safeParse(formData.get("priceId"));
  if (!result.success) throw new Error("Invalid Price ID");

  await createPayment(result.data);
};

export const listPricingProducts = async (): Promise<PricingProduct[]> => {
  try {
    const products = await stripe.prices.list({
      active: true,
      expand: ["data.product"],
    });

    return products.data
      .filter((price) => price.unit_amount != null)
      .map((price) => {
        const product = price.product as StripeProduct;

        return {
          id: price.id,
          amount: price.unit_amount,
          currency: price.currency,
          interval: price.recurring?.interval || null,
          product: {
            id: product.id,
            name: product.name,
            description: product.description,
            images: product.images,
            credits: product.metadata.credits,
            marketing_features: product.marketing_features ?? [],
          },
        };
      });
  } catch (error) {
    logger.error("Failed to list pricing products", error);
    throw error;
  }
};

const checkoutSessionIdSchema = z.string().startsWith("cs_").max(255);

export type CheckoutSessionResult =
  | { status: "unauthenticated" }
  | { status: "unauthorized" }
  | { status: "pending" }
  | { status: "paid"; amountTotal: number | null; currency: string | null };

export const getCheckoutSession = async (
  sessionId: string,
): Promise<CheckoutSessionResult> => {
  const parsed = checkoutSessionIdSchema.safeParse(sessionId);
  if (!parsed.success) return { status: "unauthorized" };

  const sessionUser = await getSessionUser();
  if (!sessionUser) return { status: "unauthenticated" };

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(parsed.data);
  } catch (error) {
    logger.error("Failed to get checkout session", error);
    throw error;
  }

  const sessionOwnerId = session.metadata?.userId ?? null;
  const sessionCustomer =
    typeof session.customer === "string"
      ? session.customer
      : (session.customer?.id ?? null);

  if (
    sessionOwnerId !== sessionUser.user.id &&
    sessionCustomer !== sessionUser.user.stripeCustomerId
  ) {
    return { status: "unauthorized" };
  }

  if (session.payment_status !== "paid") return { status: "pending" };

  return {
    status: "paid",
    amountTotal: session.amount_total,
    currency: session.currency,
  };
};
