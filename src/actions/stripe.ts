"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { getSessionUser, updateUserStripeData } from "./user";

export interface StripeProduct {
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

export const createPayment = async (priceId: string) => {
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

    await updateUserStripeData(userId, { stripeCustomerId: customerId });
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

  await updateUserStripeData(userId, {
    stripeCheckoutSessionId: checkoutSession.id,
  });

  if (!checkoutSession.url)
    throw new Error("Failed to create checkout session URL");

  redirect(checkoutSession.url);
};

export const createPaymentAction = async (formData: FormData) => {
  const priceId = formData.get("priceId") as string;

  if (!priceId) throw new Error("Price ID is required");

  await createPayment(priceId);
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
    console.error("Failed to list pricing products", error);
    throw error;
  }
};

export const getCheckoutSession = async (sessionId: string) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error("Failed to get checkout session", error);
    throw error;
  }
};
