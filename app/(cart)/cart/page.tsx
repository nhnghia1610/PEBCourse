// page.tsx (Server Component)

import { db } from "@/lib/db";
import Cart from "@/components/cart/Cart";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function CartPage() {
    // Use auth from Clerk to get userId
    const { userId } = auth();

    if (!userId) {
        return redirect("/sign-in");
    }

    const cartItems = await db.cartItem.findMany({
        where: {
            userId: userId,
        },
        include: {
            course: true,
        },
    });

    


    const transformedCartItems = cartItems.map((item) => ({
        id: item.id,
        courseId: item.courseId,
        quantity: item.quantity,
        course: {
            title: item.course.title || "Unknown Course",
            imageUrl: item.course.imageUrl || "/default-image.png", // Fallback image
            price: item.course.price || 0, // Default to 0 if no price is set
        },
    }));

    console.log("transformedCartItems", JSON.stringify(transformedCartItems, null, 2));


    return (
        <div className="md:mt-5 md:px-10 xl:px-16 pb-16">
            <Cart cartItems={transformedCartItems} />
        </div>
    );
}
