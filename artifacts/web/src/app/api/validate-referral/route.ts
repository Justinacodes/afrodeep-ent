import { NextRequest, NextResponse } from "next/server";
import { db, promotersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code || !code.trim()) {
    return NextResponse.json(
      { valid: false, error: "No code provided." },
      { status: 400 }
    );
  }

  const promoter = await db.query.promotersTable.findFirst({
    where: eq(promotersTable.referralCode, code.trim().toUpperCase()),
  });

  if (!promoter) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({ valid: true, name: promoter.name });
}
