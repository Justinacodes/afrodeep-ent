import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db, ticketsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import QRCode from "qrcode";
import { Resend } from "resend";
import { TicketEmail } from "@/emails/ticket-email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-05-27.dahlia",
});

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const signature = req.headers.get("stripe-signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new NextResponse("Stripe webhook secret is not set.", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(bodyText, signature, webhookSecret);
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionId = session.id;

    if (session.payment_status === "paid") {
      try {
        // Mark ticket as paid
        await db
          .update(ticketsTable)
          .set({ status: "paid" })
          .where(eq(ticketsTable.stripeSessionId, sessionId));

        console.log(`Ticket for session ${sessionId} successfully marked as PAID!`);

        // Look up the ticket to get attendee details
        const ticket = await db.query.ticketsTable.findFirst({
          where: eq(ticketsTable.stripeSessionId, sessionId),
        });

        if (ticket && ticket.qrToken && ticket.buyerEmail) {
          await sendTicketEmail(ticket);
        }
      } catch (err) {
        console.error("Database update or email send failed:", err);
        return new NextResponse("Processing Error", { status: 500 });
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}

async function sendTicketEmail(ticket: {
  buyerName: string;
  buyerEmail: string;
  qrToken: string | null;
  tier: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("RESEND_API_KEY not set, skipping email");
    return;
  }

  const resend = new Resend(resendApiKey);

  // Build the check-in URL that the QR code will point to
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
