// components/Wrapper.tsx
import React from 'react';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="max-w-[1900px] mx-auto h-[1000px] px-4"> {/* Adjust width and height as needed */}
      {children}
    </div>
  );
};

export default Wrapper;
