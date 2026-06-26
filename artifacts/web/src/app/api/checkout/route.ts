import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db, ticketsTable, promotersTable } from "@workspace/db";
import { eq, sum } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Stripe is not configured on the server. Make sure to restart the dev server after adding .env.local!" },
        { status: 500 }
      );
    }

    // Initialize Stripe with the secret key from environment
    const stripe = new Stripe(secretKey, {
      apiVersion: "2026-05-27.dahlia", // matching the installed stripe SDK types
    });

    const body = await req.json();
    const { name, price, description, referralCode, capacityTaken = 1 } = body;

    if (!name || !price) {
      return NextResponse.json(
        { error: "Missing required ticket details (name, price)." },
        { status: 400 }
      );
    }

    // CHECK CAPACITY
    const paidTicketsResult = await db
      .select({ totalCapacity: sum(ticketsTable.capacityTaken) })
      .from(ticketsTable)
      .where(eq(ticketsTable.status, "paid"));
    
    const currentSold = Number(paidTicketsResult[0]?.totalCapacity || 0);
    
    if (currentSold + capacityTaken > 360) {
      return NextResponse.json(
        { error: `Sold out! Only ${Math.max(0, 360 - currentSold)} spots remaining.` },
        { status: 400 }
      );
    }

    // LOOKUP PROMOTER
    let promoterId: number | undefined = undefined;
    if (referralCode) {
      const promoter = await db.query.promotersTable.findFirst({
        where: eq(promotersTable.referralCode, referralCode)
      });
      if (promoter) promoterId = promoter.id;
    }

    // Convert price string (e.g. "£35", "£250") to integer pence
    const numericPrice = parseInt(price.replace(/[^0-9]/g, ""), 10);
    if (isNaN(numericPrice)) {
      return NextResponse.json(
        { error: "Invalid price format." },
        { status: 400 }
      );
    }
    const unitAmount = numericPrice * 100; // GBP pence

    const productName = `AfroDeep Ent - ${name}`;

    // Look for existing product
    const existingProducts = await stripe.products.search({
      query: `name:'${productName}' AND active:'true'`,
    });

    let productId = existingProducts.data[0]?.id;

    // Create product if it doesn't exist
    if (!productId) {
      const newProduct = await stripe.products.create({
        name: productName,
        description: description || `Ticket for AfroDeep Ent All White Boat Party`,
        metadata: {
          event: "all-white-boat-party",
        },
      });
      productId = newProduct.id;
    }

    // Check for an existing price for this product
    const existingPrices = await stripe.prices.list({
      product: productId,
      active: true,
      currency: "gbp",
    });

    let priceId = existingPrices.data.find(p => p.unit_amount === unitAmount)?.id;

    // Create price if it doesn't exist
    if (!priceId) {
      const newPrice = await stripe.prices.create({
        product: productId,
        unit_amount: unitAmount,
        currency: "gbp",
      });
      priceId = newPrice.id;
    }

    // Create Checkout Session
    // We need an absolute URL for success/cancel URLs. We can derive this from the request url.
    const origin = new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      client_reference_id: name, // We can store the tier here if we want
      success_url: `${origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
    });

    // INSERT PENDING TICKET
    await db.insert(ticketsTable).values({
      stripeSessionId: session.id,
      tier: name,
      capacityTaken: capacityTaken,
      status: "pending",
      promoterId: promoterId,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during checkout." },
      { status: 500 }
    );
  }
}
