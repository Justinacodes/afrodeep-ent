import { NextRequest, NextResponse } from "next/server";
import { db, ticketsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "No token provided." },
        { status: 400 }
      );
    }

    const ticket = await db.query.ticketsTable.findFirst({
      where: eq(ticketsTable.qrToken, token),
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Invalid ticket token." },
        { status: 404 }
      );
    }

    if (ticket.status !== "paid") {
      return NextResponse.json(
        { error: "This ticket has not been paid for." },
        { status: 400 }
      );
    }

    if (ticket.checkedIn) {
      return NextResponse.json(
        { error: "This guest has already been checked in." },
        { status: 400 }
      );
    }

    // Mark as checked in
    await db
      .update(ticketsTable)
      .set({
        checkedIn: true,
        checkedInAt: new Date(),
      })
      .where(eq(ticketsTable.qrToken, token));

    return NextResponse.json({
      success: true,
      message: `${ticket.buyerName} has been checked in!`,
    });
  } catch (error: any) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Check-in failed. Please try again." },
      { status: 500 }
    );
  }
}
