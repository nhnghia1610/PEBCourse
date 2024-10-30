import CreateQuizForm from "@/components/quiz/CreateQuizForm";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CourseQuizPage = async ({ params }: { params: { courseId: string } }) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/sign-in");
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            instructorId: userId,
        },
        include: {
            sections: true,
        },
    });

    if (!course) {
        return redirect("/instructor/courses");
    }


    return (
        <CreateQuizForm course={course} />
    )
};

export default CourseQuizPage;
