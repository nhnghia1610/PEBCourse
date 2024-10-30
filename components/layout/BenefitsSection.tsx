const BenefitsSection = () => {
  return (
    <section className="p-8 bg-gray-50">
      <h2 className="text-4xl font-semibold text-center mb-8 text-[#1F2937]">Tiêu chí của chúng tôi</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-200">
          <h3 className="text-5xl font-bold text-[#1F2937]">P</h3>
          <h3 className="text-xl font-semibold">rofessional</h3>
          <p className="text-gray-600 mt-2">Đội ngũ giảng viên năng động, có chuyên môn cao và phong cách dạy học chuyên nghiệp nhất.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-200">
          <h3 className="text-5xl font-bold text-[#1F2937]">E</h3>
          <h3 className="text-xl font-semibold">fficient</h3>
          <p className="text-gray-600 mt-2">Các khóa học đều có hiệu quả thực tế cao.</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-200">
          <h3 className="text-5xl font-bold text-[#1F2937]">B</h3>
          <h3 className="text-xl font-semibold">eneficial</h3>
          <p className="text-gray-600 mt-2">Mang lại lợi ích thiết thực cho học viên.</p>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
