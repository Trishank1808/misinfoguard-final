import { NextRequest, NextResponse } from "next/server";
import { analyzeMessage } from "@/lib/analyzer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const message = body?.message;

    if (typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Field 'message' is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message is too long. Maximum 5000 characters." },
        { status: 413 }
      );
    }

    // Simulate a brief analysis delay so the UI's loading state has
    // something real to show for; swap for actual latency once an
    // LLM provider is plugged into analyzeMessage().
    await new Promise((r) => setTimeout(r, 550));

    const result = await analyzeMessage(message);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("[/api/analyze] error:", err);
    return NextResponse.json(
      { error: "Internal analysis error. Please try again." },
      { status: 500 }
    );
  }
}
