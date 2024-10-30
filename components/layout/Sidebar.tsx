"use client";
import { Book, BarChart2, UserRoundPen } from "lucide-react"; // Updated icons
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const sidebarRoutes = [
    { icon: <Book />, label: "Khóa học của tôi", path: "/instructor/courses" }, // Book icon for Courses
    { icon: <UserRoundPen  />, label: "Hồ sơ cá nhân", path: "/instructor/info" }, // Book icon for Courses
    { icon: <BarChart2 />, label: "Thống kê", path: "/instructor/performance" }, // BarChart icon for Performance
  ];

  return (
    <div className="max-sm:hidden flex flex-col w-64 border-r shadow-md px-3 my-4 gap-4 text-sm font-medium bg-[#1F2937] text-white">
      <div className="mt-4"> {/* Added margin-top to create space */}
        {sidebarRoutes.map((route) => (
          <Link
            href={route.path}
            key={route.path}
            className={`flex items-center gap-4 p-3 rounded-lg hover:bg-white hover:text-[#1F2937] // White highlight on hover
              ${pathname.startsWith(route.path) ? "bg-white text-[#1F2937]" : ""} // White highlight for active route
            `}
          >
            {route.icon} {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
