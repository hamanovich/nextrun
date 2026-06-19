import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import "@/lib/logger";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export const POST = async (req: NextRequest) => {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") ?? "";
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET" },
      { status: 500 },
    );
  }

  if (!signature) {
    return NextResponse.json(
      { error: "No stripe signature found" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    logger.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status === "paid" && session.metadata?.userId) {
          const { userId } = session.metadata;

          const lineItems = await stripe.checkout.sessions.listLineItems(
            session.id,
            {
              expand: ["data.price.product"],
            },
          );

          if (lineItems.data.length > 0) {
            const totalCreditsToAdd = lineItems.data.reduce((sum, li) => {
              const product = li.price?.product as {
                id?: string;
                metadata?: { credits?: string };
              } | null;
              const qty = li.quantity ?? 1;
              const credits = Number(product?.metadata?.credits ?? 0);
              return Number.isFinite(credits) ? sum + credits * qty : sum;
            }, 0);

            if (totalCreditsToAdd > 0) {
              const granted = await db
                .update(users)
                .set({
                  stripeCredits: sql`${users.stripeCredits} + ${totalCreditsToAdd}`,
                  stripeCheckoutSessionId: session.id,
                  stripeCustomerId:
                    typeof session.customer === "string"
                      ? session.customer
                      : session.customer?.id,
                })
                .where(
                  and(
                    eq(users.id, userId),
                    sql`${users.stripeCheckoutSessionId} is distinct from ${session.id}`,
                  ),
                )
                .returning({ id: users.id });

              if (granted.length === 0) {
                logger.debug(
                  `Webhook skipped (already processed or user missing) for session: ${session.id}`,
                );
                break;
              }

              logger.debug(
                `Added ${totalCreditsToAdd} credits to user ${userId} for session: ${session.id}`,
              );
            } else {
              logger.warn(
                `No valid credits found to add for session: ${session.id}`,
              );
            }
          }
        }
        break;
      }

      case "customer.created": {
        logger.info(`Customer created: ${event.data.object.id}`);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
};
