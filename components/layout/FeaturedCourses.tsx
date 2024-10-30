import { db } from "@/lib/db"; // Import your database instance
import getCoursesByCategory from "@/app/actions/getCourses"; // Assuming this function fetches courses from the DB
import CourseCard from "@/components/courses/CourseCard"; // Import the CourseCard component

const FeaturedCourses = async () => {
  const courses = await getCoursesByCategory(null); // Fetch courses from the database

  return (
    <section className="p-8 bg-white">
      <h2 className="text-3xl font-semibold text-center">Các khóa học nổi bật</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} /> // Use CourseCard for each course
        ))}
      </div>
    </section>
  );
};

export default FeaturedCourses;
