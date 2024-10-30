// components/Testimonials.tsx
const Testimonials = () => {
    const testimonials = [
      { name: 'John Doe', feedback: 'This platform is amazing! Highly recommended.' },
      { name: 'Jane Smith', feedback: 'I learned so much from these courses.' },
      // Thêm các đánh giá khác
    ];
  
    return (
      <section className="p-8 bg-white text-center">
        <h2 className="text-3xl font-semibold mb-8">What Our Students Say</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-md max-w-xs">
              <p className="text-gray-700">{testimonial.feedback}</p>
              <p className="mt-4 text-blue-600 font-semibold">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default Testimonials;
  