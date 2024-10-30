// PriceRangeSlider.tsx
"use client";

import * as Slider from "@radix-ui/react-slider";
import { useState } from "react";

interface PriceRangeSliderProps {
  onPriceChange: (priceRange: [number, number]) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ onPriceChange }) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  const handlePriceChange = (newPriceRange: [number, number]) => {
    setPriceRange(newPriceRange);
    onPriceChange(newPriceRange);
  };

  return (
    <div>
      <Slider.Root
        value={priceRange}
        onValueChange={handlePriceChange}
        max={100} // Set max price according to your needs
        step={1}
        className="relative flex items-center w-full h-5"
      >
        <Slider.Track className="bg-gray-300 relative flex-grow h-1 rounded">
          <Slider.Range className="absolute bg-[#FDAB04] h-full rounded" />
        </Slider.Track>
        <Slider.Thumb className="block w-4 h-4 bg-white border border-gray-400 rounded-full shadow" />
        <Slider.Thumb className="block w-4 h-4 bg-white border border-gray-400 rounded-full shadow" />
      </Slider.Root>
      <div className="flex justify-between text-sm mt-2">
        <span>${priceRange[0]}</span>
        <span>${priceRange[1]}</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
