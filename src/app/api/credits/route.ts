import { NextResponse } from "next/server";
import { getUserCredits } from "@/actions/user";

export async function GET() {
  try {
    const credits = await getUserCredits();
    return NextResponse.json({ credits });
  } catch (error) {
    console.error("Failed to fetch user credits:", error);
    return NextResponse.json({ credits: 0 }, { status: 500 });
  }
}
