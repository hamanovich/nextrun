import { z } from "zod";

const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, { message: "DATABASE_URL is required" }),
  OPENAI_API_KEY: z.string().min(1, { message: "OPENAI_API_KEY is required" }),
  GOOGLE_CLIENT_ID: z
    .string()
    .min(1, { message: "GOOGLE_CLIENT_ID is required" }),
  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, { message: "GOOGLE_CLIENT_SECRET is required" }),
  BETTER_AUTH_URL: z.url({ message: "BETTER_AUTH_URL must be a valid URL" }),
  HEALTH_CHECK_SECRET: z
    .string()
    .min(32, { message: "HEALTH_CHECK_SECRET must be at least 32 characters" }),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, { message: "BETTER_AUTH_SECRET must be at least 32 characters" }),
  NEXT_PUBLIC_DOMAIN: z
    .url({
      message: "NEXT_PUBLIC_DOMAIN must be an absolute URL",
    })
    .transform((v) => v.replace(/\/+$/, "")),
  STRIPE_SECRET_KEY: z
    .string()
    .min(1, { message: "STRIPE_SECRET_KEY is required" }),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .min(1, { message: "STRIPE_WEBHOOK_SECRET is required" }),
  TELEGRAM_BOT_TOKEN: z
    .string()
    .min(1, { message: "TELEGRAM_BOT_TOKEN is required" }),
  NEXT_PUBLIC_UMAMI_URL: z.preprocess(
    emptyToUndefined,
    z
      .url({
        message: "NEXT_PUBLIC_UMAMI_URL must be an absolute URL",
      })
      .transform((v) => v.replace(/\/+$/, ""))
      .optional(),
  ),
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.preprocess(
    emptyToUndefined,
    z.uuid().optional(),
  ),
});

export type Env = z.infer<typeof envSchema>;

const validateEnv = (): Env => {
  if (process.env.SKIP_ENV_VALIDATION) {
    return process.env as unknown as Env;
  }
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((issue) => {
        const path = issue.path.join(".");
        const message = issue.message;
        return `  • ${path}: ${message}`;
      });
      throw new Error(
        `❌ Missing or invalid environment variables:\n${missingVars.join("\n")}\n\nPlease check your .env file and ensure all required variables are set.`,
      );
    }
    throw error;
  }
};

export const env = validateEnv();
