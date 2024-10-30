import { db } from "@/lib/db";
import { Course, Section } from "@prisma/client";
import Link from "next/link";
import { Progress } from "../ui/progress";

interface CourseSideBarProps {
  course: Course & { sections: Section[] };
  studentId: string;
}

const CourseSideBar = async ({ course, studentId }: CourseSideBarProps) => {
  const publishedSections = await db.section.findMany({
    where: {
      courseId: course.id,
      isPublished: true,
    },
    orderBy: {
      position: "asc",
    },
  });

  const publishedSectionIds = publishedSections.map((section) => section.id);

  const purchase = await db.purchase.findUnique({
    where: {
      customerId_courseId: {
        customerId: studentId,
        courseId: course.id,
      },
    },
  });

  const completedSections = await db.progress.count({
    where: {
      studentId,
      sectionId: {
        in: publishedSectionIds,
      },
      isCompleted: true,
    },
  });

  const progressPercentage = (completedSections / publishedSectionIds.length) * 100;

  return (
    <div className="hidden md:flex flex-col w-64 border-r shadow-md bg-[#1F2937] rounded-lg p-4 my-4 text-white">
      <h1 className="text-lg font-bold text-center mb-4">{course.title}</h1>
      {purchase && (
        <div className="mb-4">
          <Progress value={progressPercentage} className="h-2 bg-[#FDAB04] rounded-lg" />
          <p className="text-xs text-gray-300 text-center">{Math.round(progressPercentage)}% completed</p>
        </div>
      )}
      <Link
        href={`/courses/${course.id}/overview`}
        className={`p-3 rounded-lg hover:bg-gray-300 transition-colors duration-200`}
      >
        Tổng quan
      </Link>
      {publishedSections.map((section) => (
        <Link
          key={section.id}
          href={`/courses/${course.id}/sections/${section.id}`}
          className="p-3 rounded-lg hover:bg-gray-300 transition-colors duration-200 mt-1"
        >
          {section.title}
        </Link>
      ))}
    </div>
  );
};

export default CourseSideBar;
