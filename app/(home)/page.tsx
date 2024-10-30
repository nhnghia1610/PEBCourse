import { db } from "@/lib/db";
import getCoursesByCategory from "../actions/getCourses";
import Categories from "@/components/custom/Categories";
import CourseCard from "@/components/courses/CourseCard";
import Image from "next/image";
import HeroSection from "@/components/layout/HeroSection";
import FeaturedCourses from "@/components/layout/FeaturedCourses";
import BenefitsSection from "@/components/layout/BenefitsSection";
import Footer from "@/components/layout/Footer";

export default async function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturedCourses />
      <BenefitsSection />
      <Footer />
    </main>
  );
}
