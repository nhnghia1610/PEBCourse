// pages/api/coupons/apply.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Adjust the import based on your file structure

export const POST = async (req: NextRequest) => {
    const { code, totalPrice } = await req.json();

    try {
        const coupon = await db.coupon.findUnique({
            where: { code },
        });

        if (!coupon) {
            return NextResponse.json({ error: "Invalid coupon code." }, { status: 404 });
        }

        const now = new Date();
        if (now < coupon.validFrom || now > coupon.validUntil) {
            return NextResponse.json({ error: "This coupon is expired." }, { status: 400 });
        }

        if (!coupon.isActive) {
            return NextResponse.json({ error: "This coupon is no longer active." }, { status: 400 });
        }

        // Calculate discount based on type
        const discount =
            coupon.type === "PERCENTAGE" ? totalPrice * (coupon.amount / 100) : coupon.amount;

        return NextResponse.json({ discount });
    } catch (error) {
        console.error("Coupon validation error:", error);
        return NextResponse.json({ error: "Failed to apply coupon." }, { status: 500 });
    }
};
