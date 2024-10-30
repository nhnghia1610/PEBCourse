import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export const POST = async (req: NextRequest) => {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseIds, discount } = await req.json();

    console.log("courseIds", courseIds);

    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return new NextResponse("No course IDs provided", { status: 400 });
    }

    // Fetch courses and check if already purchased
    const courses = await db.course.findMany({
      where: { id: { in: courseIds }, isPublished: true },
    });

    if (courses.length !== courseIds.length) {
      return new NextResponse("One or more courses not found", { status: 404 });
    }

    console.log("courses", courses);

    const purchases = await db.purchase.findMany({
      where: {
        customerId: user.id,
        courseId: { in: courseIds },
      },
    });

    if (purchases.length > 0) {
      return new NextResponse("One or more courses already purchased", { status: 400 });
    }

    // Calculate total price before discount
    const totalPrice = courses.reduce((total, course) => total + course.price!, 0);
    const totalDiscount = discount ? Math.round(totalPrice * (discount / 100)) : 0;

    // Calculate line_items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = courses.map(course => {
      // Calculate the proportional discounted price for each course
      const discountedPrice = Math.round(course.price! - (course.price! * (totalDiscount / totalPrice)));

      return {
        quantity: 1,
        price_data: {
          currency: "vnd",
          product_data: {
            name: course.title, // Each course title as product name
          },
          unit_amount: discountedPrice > 0 ? discountedPrice : 0, // Ensure it's non-negative
        },
      };
    });

    console.log("line_items", line_items);

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: { customerId: user.id },
      select: { stripeCustomerId: true },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });

      stripeCustomer = await db.stripeCustomer.create({
        data: {
          customerId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?canceled=true`,
      metadata: {
        courseIds: JSON.stringify(courseIds),
        customerId: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.log("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
