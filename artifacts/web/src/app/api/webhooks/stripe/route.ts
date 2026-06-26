import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db, ticketsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-05-27.dahlia", // matching your installed sdk types
});

// Disable body parsing so we can get the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

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

    // The session.id is what we stored in our tickets table
    const sessionId = session.id;

    if (session.payment_status === "paid") {
      try {
        await db
          .update(ticketsTable)
          .set({ status: "paid" })
          .where(eq(ticketsTable.stripeSessionId, sessionId));
          
        console.log(`Ticket for session ${sessionId} successfully marked as PAID!`);
      } catch (err) {
        console.error("Database update failed for paid ticket:", err);
        return new NextResponse("Database Error", { status: 500 });
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}
