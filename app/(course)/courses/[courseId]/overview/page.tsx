import { clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import ReadText from "@/components/custom/ReadText";
import SectionMenu from "@/components/layout/SectionMenu";

const CourseOverview = async ({ params }: { params: { courseId: string } }) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      isPublished: true,
    },
    include: {
      sections: {
        where: {
          isPublished: true,
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const instructor = await clerkClient.users.getUser(course.instructorId);

  let level;

  if (course.levelId) {
    level = await db.level.findUnique({
      where: {
        id: course.levelId,
      },
    });
  }

  return (
    <div className="px-6 py-4 flex flex-col gap-6 text-sm bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#1F2937]">{course.title}</h1>
        <SectionMenu course={course} />
      </div>

      <p className="font-medium text-gray-700">{course.subtitle}</p>

      <div className="flex items-center gap-3 mt-2">
        <Image
          src={
            instructor.imageUrl
              ? instructor.imageUrl
              : "/avatar_placeholder.jpg"
          }
          alt={instructor.fullName ? instructor.fullName : "Instructor photo"}
          width={50}
          height={50}
          className="rounded-full border-2 border-[#FDAB04] shadow-md"
        />
        <div>
          <p className="font-bold">Giáo viên:</p>
          <p className="text-gray-800">{instructor.fullName}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <p className="font-bold">Giá:</p>
        <p className="text-green-600 font-semibold">${course.price}</p>
      </div>

      <div className="flex gap-2">
        <p className="font-bold">Trình độ yêu cầu:</p>
        <p className="text-gray-800">{level?.name || "N/A"}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-bold">Mô tả:</p>
        <ReadText value={course.description!} />
      </div>
    </div>
  );
};

export default CourseOverview;
