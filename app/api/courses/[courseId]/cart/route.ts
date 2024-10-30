import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
    req: NextRequest,
    { params }: { params: { courseId: string } }
) => {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        console.log("param", params)

        const { courseId } = params;

        const course = await db.course.findUnique({
            where: {
                id: courseId,
            },
        });

        if (!course) {
            return new NextResponse("Course Not Found", { status: 404 });
        }

        const resource = await db.cartItem.create({
            data: {
                userId,
                courseId,
                quantity: 1,
            },
        });

        return NextResponse.json(resource, { status: 200 });
    } catch (err) {
        console.log("[cartItem_POST", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
