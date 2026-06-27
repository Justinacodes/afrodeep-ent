import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db, ticketsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import QRCode from "qrcode";
import { Resend } from "resend";
import { TicketEmail } from "@/emails/ticket-email";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "No session_id provided" }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2026-05-27.dahlia",
  });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Check if ticket is already paid (avoid sending duplicate emails)
      const ticket = await db.query.ticketsTable.findFirst({
        where: eq(ticketsTable.stripeSessionId, sessionId),
      });

      if (ticket && ticket.status !== "paid") {
        // Update ticket status to paid
        await db
          .update(ticketsTable)
          .set({ status: "paid" })
          .where(eq(ticketsTable.stripeSessionId, sessionId));

        // Send confirmation email with QR code
        if (ticket.buyerEmail && ticket.qrToken) {
          await sendTicketEmail({
            buyerName: ticket.buyerName,
            buyerEmail: ticket.buyerEmail,
            qrToken: ticket.qrToken,
            tier: ticket.tier,
          });
        }

        return NextResponse.json({ status: "paid", emailSent: true });
      }

      return NextResponse.json({ status: "paid", emailSent: false });
    }

    return NextResponse.json({ status: session.payment_status });
  } catch (error: any) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function sendTicketEmail(ticket: {
  buyerName: string;
  buyerEmail: string;
  qrToken: string;
  tier: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("RESEND_API_KEY not set, skipping email");
    return;
  }

  const resend = new Resend(resendApiKey);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.afrodeepent.com";
  const checkinUrl = `${baseUrl}/admin/checkin?token=${ticket.qrToken}`;

  // Generate QR code as PNG buffer for inline attachment
  const qrCodeBuffer = await QRCode.toBuffer(checkinUrl, {
    width: 300,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });

  try {
    const { error } = await resend.emails.send({
      from: "AfroDeep Ent <tickets@afrodeepent.com>",
      to: [ticket.buyerEmail],
      subject: `Your Ticket for AfroDeep Ent All White Boat Party 🎉`,
      react: TicketEmail({
        buyerName: ticket.buyerName,
        tier: ticket.tier,
        qrCodeDataUrl: "",
        checkinUrl,
      }),
      attachments: [
        {
          filename: "qrcode.png",
          content: qrCodeBuffer.toString("base64"),
          contentType: "image/png",
        },
      ],
    });

    if (error) {
      console.error("Failed to send ticket email:", error);
    } else {
      console.log(`Ticket email sent to ${ticket.buyerEmail}`);
    }
  } catch (err) {
    console.error("Email send error:", err);
  }
}
