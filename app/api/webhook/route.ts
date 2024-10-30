import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (req: NextRequest) => {
  const rawBody = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const customerId = session?.metadata?.customerId;

  // Check for courseId or courseIds in the metadata
  const courseIdsString = session?.metadata?.courseId || session?.metadata?.courseIds;

  // Parse courseIds
  let courseIds: string[];
  if (Array.isArray(courseIdsString)) {
    courseIds = courseIdsString; // Already an array
  } else if (courseIdsString) {
    // If it is a string, we need to handle it based on its format
    try {
      courseIds = JSON.parse(courseIdsString); // Parse as JSON
    } catch (err) {
      // If parsing fails, fall back to single course ID in array
      courseIds = [courseIdsString];
    }
  } else {
    return new NextResponse("Missing course information", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    if (!customerId || !courseIds || courseIds.length === 0) {
      return new NextResponse("Missing metadata", { status: 400 });
    }

    // Loop through each courseId and create a purchase record
    const purchasePromises = courseIds.map((courseId) =>
      db.purchase.create({
        data: {
          customerId,
          courseId,
        },
      })
    );

    try {
      await Promise.all(purchasePromises); // Execute all purchases concurrently
    } catch (err) {
      console.error("Failed to create purchase records", err);
      return new NextResponse("Failed to create purchase records", { status: 500 });
    }
  } else {
    return new NextResponse(`Unhandled event type: ${event.type}`, {
      status: 400,
    });
  }

  return new NextResponse("Success", { status: 200 });
};
