// components/HeroSection.tsx
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-between bg-gray-100 py-16 px-6 md:px-16">
      {/* Text Content */}
      <div className="flex flex-col gap-6 md:w-2/3">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
          HỌC MỌI LÚC <span className="text-blue-600">MỌI NƠI</span> VỚI ĐỘI NGŨ GIÁO VIÊN KINH NGHIỆM
        </h1>
        <p className="text-lg text-gray-600 max-w-lg">
        PEB Course cung cấp nhiều khóa học đa dạng với đội ngũ giáo viên hùng hậu, chuyên nghiệp.
        </p>
        <p className="text-lg text-gray-600 max-w-lg">
          Trờ thành học viên ngay hôm nay để nhận được nhiều ưu đãi hấp dẫn.
        </p>
        <div className="flex gap-4 mt-4">
          <button className="px-8 py-3 bg-[#1F2937] text-white rounded-lg shadow-lg hover:bg-[#1F2937]/80 transition-all duration-300">
            Trở thành học viên
          </button>
          <button className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg shadow-lg hover:bg-gray-300 transition-all duration-300">
            Xem các khóa học của chúng tôi
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div>
        <Image
          src="/hero-image.png" // Đảm bảo bạn đã có hình ảnh đúng trong thư mục public
          alt="Learning illustration"
          width={500}
          height={100}
          priority
        />
      </div>
    </section>
  );
};

export default HeroSection;
