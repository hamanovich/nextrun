import { NextResponse } from "next/server";
import { db } from "@/db";
import app from "@app";
import { sql } from "drizzle-orm";
import { env } from "@/lib/env";

interface HealthCheckResult {
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  responseTime: number;
  services: {
    database: ServiceStatus;
    openai: ServiceStatus;
    stripe: ServiceStatus;
  };
}

interface ServiceStatus {
  status: "healthy" | "unhealthy" | "degraded";
  responseTime?: number;
  error?: string;
}

async function checkDatabase(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    await Promise.race([
      db.execute(sql`SELECT 1`),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB timeout")), 3000),
      ),
    ]);
    return {
      status: "healthy",
      responseTime: Date.now() - start,
    };
  } catch (error) {
    return {
      status: "unhealthy",
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : "Unknown database error",
    };
  }
}

async function checkOpenAI(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API returned ${response.status}`);
    }

    return {
      status: "healthy",
      responseTime: Date.now() - start,
    };
  } catch (error) {
    return {
      status: "unhealthy",
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : "OpenAI API check failed",
    };
  }
}

async function checkStripe(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const response = await fetch("https://api.stripe.com/v1/balance", {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Stripe API returned ${response.status}`);
    }

    return {
      status: "healthy",
      responseTime: Date.now() - start,
    };
  } catch (error) {
    return {
      status: "unhealthy",
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : "Stripe API check failed",
    };
  }
}

export async function GET() {
  const startTime = Date.now();

  try {
    const [database, openai, stripe] = await Promise.all([
      checkDatabase(),
      checkOpenAI(),
      checkStripe(),
    ]);

    const responseTime = Date.now() - startTime;

    const serviceStatuses = [database, openai, stripe];
    const unhealthyServices = serviceStatuses.filter(
      (s) => s.status === "unhealthy",
    );
    const degradedServices = serviceStatuses.filter(
      (s) => s.status === "degraded",
    );

    let overallStatus: "healthy" | "unhealthy" | "degraded";
    if (unhealthyServices.length > 0) {
      overallStatus = "unhealthy";
    } else if (degradedServices.length > 0) {
      overallStatus = "degraded";
    } else {
      overallStatus = "healthy";
    }

    const result: HealthCheckResult = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: app.version,
      environment: process.env.NODE_ENV || "unknown",
      uptime: process.uptime(),
      responseTime,
      services: {
        database,
        openai,
        stripe,
      },
    };

    const statusCode = overallStatus === "unhealthy" ? 503 : 200;

    return NextResponse.json(result, {
      status: statusCode,
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    console.error("[/api/health] Unhandled error:", error);
    const fallback: HealthCheckResult = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      version: app.version,
      environment: process.env.NODE_ENV || "unknown",
      uptime: process.uptime(),
      responseTime,
      services: {
        database: { status: "unhealthy", error: "Health check failed" },
        openai: { status: "unhealthy", error: "Health check failed" },
        stripe: { status: "unhealthy", error: "Health check failed" },
      },
    };
    return NextResponse.json(fallback, {
      status: 503,
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  }
}
