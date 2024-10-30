"use client";

import { Star, User as UserIcon, Tag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Course, Level, Category } from "@prisma/client";

// Define a custom user interface
export interface CustomUser {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
}

interface CourseCardInnerProps {
  course: Course;
  instructor?: CustomUser; // Use the custom user type
  level?: Level | null; // Level can be null
  category?: Category | null; // Category can be null
}

const CourseCardInner = ({ course, instructor, level, category }: CourseCardInnerProps) => {
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addToCart = async () => {
    try {
      setIsAddingToCart(true);
      await axios.post(`/api/courses/${course.id}/cart`);
      toast.success("Course added to cart!");
    } catch (err) {
      console.error("Failed to add course to cart", err);
      toast.error("Failed to add course to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const buyCourse = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${course.id}/checkout`);
      window.location.assign(response.data.url);
    } catch (err) {
      console.error("Failed to checkout course", err);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg cursor-pointer w-full shadow-lg hover:shadow-xl transition-shadow duration-200">
      <Image
        src={course.imageUrl || "/image_placeholder.webp"}
        alt={course.title}
        width={500}
        height={300}
        className="rounded-t-xl w-full h-[200px] object-cover"
      />
      <div className="px-4 py-3 flex flex-col gap-2">
        <h2 className="text-lg font-bold">{course.title}</h2>
        {category && <p className="text-sm text-gray-500">{category.name}</p>}
        <div className="flex justify-between text-sm font-medium">
          {instructor && (
            <div className="flex gap-2 items-center">
              <UserIcon size={20} /> <p>{instructor.fullName || `${instructor.firstName} ${instructor.lastName}`}</p>
            </div>
          )}
          {level ? ( // Conditional rendering for level
            <div className="flex gap-2 items-center">
              <Star size={20} /> <p>{level.name}</p>
            </div>
          ) : null} {/* Handle null case for level */}
        </div>
        <p className="text-sm font-bold flex items-center">
          <Tag size={20} className="mr-1" />
          Giá tiền: {course.price ? course.price.toLocaleString('vi-VN') : "Liên hệ"} đ
        </p>
        <div className="flex gap-2 mt-3">
          <button onClick={buyCourse} disabled={isLoading} className="flex-1 bg-[#1F2937] text-white py-2 rounded-md hover:bg-[#1F2937]/90 transition-colors">
            {isLoading ? "Processing..." : "Mua ngay"}
          </button>
          <button onClick={addToCart} disabled={isAddingToCart} className="flex-1 border border-[#1F2937] text-[#1F2937] py-2 rounded-md hover:bg-gray-200 transition-colors">
            {isAddingToCart ? "Adding..." : "Thêm vào giỏ hàng"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCardInner;
