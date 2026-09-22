import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "SKILL X CHANGE",
    platform: "Vercel Serverless App Router",
    tagline: "Learn. Share. Exchange.",
  });
}
