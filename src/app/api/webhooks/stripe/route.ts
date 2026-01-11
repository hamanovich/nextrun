import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { updateUserStripeData } from "@/actions/user";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import "@/lib/logger";

export const POST = async (req: NextRequest) => {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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
    console.error("Webhook signature verification failed:", err);
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
              const userData = await db
                .select({
                  stripeCredits: users.stripeCredits,
                  lastSessionId: users.stripeCheckoutSessionId,
                })
                .from(users)
                .where(eq(users.id, userId))
                .limit(1);

              if (userData.length > 0) {
                const { stripeCredits: currentCredits } = userData[0];
                const newCredits = currentCredits + totalCreditsToAdd;

                await updateUserStripeData(userId, {
                  stripeCredits: newCredits,
                  stripeCheckoutSessionId: session.id,
                  stripeCustomerId:
                    typeof session.customer === "string"
                      ? session.customer
                      : session.customer?.id,
                });

                console.info(
                  `Added ${totalCreditsToAdd} credits to user ${userId}. Previous: ${currentCredits}, New total: ${newCredits}`,
                );
              } else {
                console.error(
                  `User not found in database for userId: ${userId}`,
                );
              }
            } else {
              console.warn(
                `No valid credits found to add for session: ${session.id}`,
              );
            }
          }
        }
        break;
      }

      case "customer.created": {
        console.info(`Customer created: ${event.data.object.id}`);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
};
