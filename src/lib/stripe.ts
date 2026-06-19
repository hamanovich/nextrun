import "server-only";
import Stripe from "stripe";
import { env } from "./env";
import { lazyClient } from "./lazy";

export const stripe = lazyClient(
  () =>
    new Stripe(env.STRIPE_SECRET_KEY, {
      typescript: true,
    }),
);
