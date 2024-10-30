"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import { Loader2, Trash2 } from "lucide-react";

interface CartItem {
  id: string;
  courseId: string;
  quantity: number;
  course: {
    title: string;
    imageUrl: string;
    price: number;
  };
}

interface CartProps {
  cartItems: CartItem[];
}

const Cart: React.FC<CartProps> = ({ cartItems }) => {
  const [items, setItems] = useState<CartItem[]>(cartItems);
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Calculate the total price of the items in the cart
  const totalPrice = items.reduce(
    (total, item) => total + item.course.price * item.quantity,
    0
  );

  // Calculate final total after discount
  const discountedPrice = Math.max(totalPrice - discount, 0);

  const buyCourses = async (courseIds: string[]) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/checkout`, {
        courseIds,
        discount: 10,
        totalPrice: discountedPrice,
      });
      window.location.assign(response.data.url);
    } catch (err) {
      console.error("Failed to checkout courses", err);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckoutClick = () => {
    const courseIds = items.map(item => item.courseId);
    buyCourses(courseIds);
  };

  const applyCoupon = async () => {
    try {
      const response = await axios.post(`/api/courses/coupon/apply`, {
        code: couponCode,
        totalPrice: totalPrice,
      });
      setDiscount(response.data.discount);
      toast.success("Áp mã giảm giá thành công!");
    } catch (error) {
      let errorMessage = "Failed to apply coupon.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      toast.error(errorMessage);
      setDiscount(0);
    }
  };

  const handleDelete = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
    toast.success("Xóa khóa học khỏi giỏ hàng thành công!");
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng</h2>
        <ul>
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between mb-4 p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center">
                <Image
                  src={item.course.imageUrl}
                  alt={item.course.title}
                  width={80}
                  height={80}
                  className="object-cover rounded-md shadow-md"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-medium">{item.course.title}</h3>
                  <p className="text-gray-500">Price: ${(item.course.price).toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-sm mr-4">Số lượng: {item.quantity}</p>
                <p className="text-lg font-semibold">
                  {(item.course.price * item.quantity)} đ
                </p>
                <Button 
                  className="ml-4 p-1 bg-red-500 text-white hover:bg-red-600 rounded-md"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-4 bg-gray-50 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Chi tiết</h2>
        <p className="text-lg">Tổng: {totalPrice} đ</p>

        {/* Coupon Section */}
        <div className="flex items-center my-4">
          <input
            type="text"
            placeholder="Coupon Code"
            className="border rounded-l-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-[#FDAB04] transition duration-200"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <Button 
            onClick={applyCoupon} 
            className="rounded-r-md bg-[#FDAB04] text-white hover:bg-[#FFA500] transition duration-200"
          >
            Áp dụng
          </Button>
        </div>
        {discount > 0 && (
          <p className="text-green-600">Giảm giá: -${discount.toFixed(2)}</p>
        )}
        <p className="text-lg font-bold">Tổng tiền: {discountedPrice} đ</p>

        <Button 
          onClick={handleCheckoutClick} 
          className="mt-4 w-full bg-[#1F2937] text-white hover:bg-[#1F2937]/80 transition duration-200"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <p>Thanh toán</p>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Cart;
