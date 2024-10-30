"use client";

import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import { Search, ShoppingBag, BookOpen, Users, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/CartContext"; // Import the cart context

const Topbar = () => {
  const { isSignedIn } = useAuth();
  const { count } = useCart(); // Get cart count from context

  const { user } = useUser();
  const isInstructor = user?.organizationMemberships[0]?.role === 'org:instructor';
  const isMember = user?.organizationMemberships[0]?.role === 'org:member';

  // Define the type for the routes
  type Route = {
    label: string;
    path: string;
    icon: JSX.Element;
  };

  // Create an array of routes based on user roles
  const topRoutes: Route[] = [
    { label: "Khóa học", path: "/courses", icon: <BookOpen className="h-4 w-4 mr-2" /> },
    ...(isInstructor ? [{ label: "Quản lý khóa học", path: "/instructor/courses", icon: <Users className="h-4 w-4 mr-2" /> }] : []),
    ...(isMember ? [{ label: "Học viên", path: "/learning", icon: <PlayCircle className="h-4 w-4 mr-2" /> }] : []),
  ];

  return (
    <div className="bg-white shadow-md sticky p-4 w-full"> {/* Full-width background */}
      <div className="max-w-[1840px] mx-auto flex justify-between items-center">
        <Link href="/" className="flex-shrink-0">
          <Image src="/logo.png" height={100} width={200} alt="logo" />
        </Link>

        <div className="md:flex w-[400px] rounded-full flex">
          <input
            className="flex-grow bg-white border border-gray-300 outline-none text-sm pl-4 py-3"
            placeholder="Tìm kiếm khóa học yêu thích của bạn..."
          />
          <button className="bg-[#1F2937] text-white border-none outline-none cursor-pointer px-4 py-3 hover:bg-[#1F2937]/80">
            <Search className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-6 items-center">
          <div className="hidden md:flex gap-6">
            {topRoutes.map((route) => (
              <Link
                href={route.path}
                key={route.path}
                className="text-sm font-medium flex items-center hover:text-[#FDAB04]"
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </div>

          {/* Shopping Cart Icon with Count */}
          <Link href="/cart" className="relative flex items-center">
            <ShoppingBag className="h-5 w-5 text-gray-600 hover:text-[#FDAB04] transition" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {isSignedIn ? (
            <UserButton afterSignOutUrl="/sign-in" />
          ) : (
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
