import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, { message: "DATABASE_URL is required" }),
  OPENAI_API_KEY: z.string().min(1, { message: "OPENAI_API_KEY is required" }),
  GOOGLE_CLIENT_ID: z
    .string()
    .min(1, { message: "GOOGLE_CLIENT_ID is required" }),
  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, { message: "GOOGLE_CLIENT_SECRET is required" }),
  NEXTAUTH_URL: z.string().refine(
    (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    { message: "NEXTAUTH_URL must be a valid URL" },
  ),
  NEXTAUTH_URL_INTERNAL: z.string().optional(),
  NEXTAUTH_SECRET: z
    .string()
    .min(1, { message: "NEXTAUTH_SECRET is required" }),
  NEXT_PUBLIC_DOMAIN: z
    .string()
    .min(1, { message: "NEXT_PUBLIC_DOMAIN is required" }),
  STRIPE_SECRET_KEY: z
    .string()
    .min(1, { message: "STRIPE_SECRET_KEY is required" }),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .min(1, { message: "STRIPE_WEBHOOK_SECRET is required" }),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
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
}

export const env = validateEnv();
