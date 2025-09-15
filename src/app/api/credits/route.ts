import { NextResponse } from "next/server";
import { getUserCredits } from "@/actions/user";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const credits = await getUserCredits();
    return NextResponse.json({ credits });
  } catch (error) {
    logger.error("Failed to fetch user credits:", error);
    return NextResponse.json({ credits: 0 }, { status: 500 });
  }
}
