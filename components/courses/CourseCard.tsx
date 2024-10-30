import { db } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Course } from "@prisma/client";
import { Star, User, Tag } from "lucide-react"; 
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const CourseCard = async ({ course }: { course: Course }) => {
  const clerk = clerkClient();
  const { userId } = auth();;
  const instructor = await clerk.users.getUser(course.instructorId);

  if (!userId) {
    return redirect('/sign-in')
  }


  let level;
  if (course.levelId) {
    level = await db.level.findUnique({
      where: {
        id: course.levelId,
      },
    });
  }

  // Fetching category for the course
  const category = await db.category.findUnique({
    where: { id: course.categoryId },
  });

  // Check if the user has purchased the course
  const purchases = await db.purchase.findMany({
    where: {
      customerId: userId,
      courseId: course.id, // Check for the specific course
    },
  });

  const hasPurchased = purchases.length > 0; // Determine if the course has been purchased

  return (
    <Link
      href={`/courses/${course.id}/overview`}
      className="border rounded-lg cursor-pointer w-full md:w-[400px] lg:w-[480px] xl:w-[500px] shadow-lg hover:shadow-xl transition-shadow duration-200"
    >
      <Image
        src={course.imageUrl ? course.imageUrl : "/image_placeholder.webp"}
        alt={course.title}
        width={500}
        height={300}
        className="rounded-t-xl w-full h-[200px] object-cover"
      />
      <div className="px-4 py-3 flex flex-col gap-2">
        <h2 className="text-lg font-bold hover:text-[#FDAB04]">{course.title}</h2>
        {category && (
          <p className="text-sm text-gray-500">{category.name}</p> // Display category name
        )}
        <div className="flex justify-between text-sm font-medium">
          {instructor && (
            <div className="flex gap-2 items-center">
              <User size={20} /> {/* Instructor icon */}
              <p>{instructor.fullName}</p>
            </div>
          )}
          {level && (
            <div className="flex gap-2 items-center">
              <Star size={20} /> {/* Level icon */}
              <p>{level.name}</p>
            </div>
          )}
        </div>

        <p className="text-sm font-bold flex items-center">
          <Tag size={20} className="mr-1" /> {/* Price icon */}
          Giá tiền: {course.price !== null ? course.price.toLocaleString('vi-VN') : "Liên hệ"} đ
        </p>

        <div className="flex gap-2 mt-3">
          <Link
            href={`/courses/${course.id}/purchase`}
            className={`flex-1 text-center py-2 rounded-md transition-colors ${hasPurchased ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1F2937] text-white hover:bg-[#1F2937]/90'}`}
            aria-disabled={hasPurchased}
          >
            <User size={16} className="mr-1 inline" /> Mua ngay
          </Link>
          <Link
            href={`/cart/add/${course.id}`} 
            className={`flex-1 text-center py-2 rounded-md transition-colors ${hasPurchased ? 'bg-gray-400 cursor-not-allowed' : 'border border-[#1F2937] text-[#1F2937] hover:bg-gray-200'}`}
            aria-disabled={hasPurchased}
          >
            <Tag size={16} className="mr-1 inline" /> Thêm vào giỏ hàng
          </Link>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
