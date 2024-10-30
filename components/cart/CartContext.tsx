"use client";

// context/CartContext.tsx
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext<{ count: number; setCount: React.Dispatch<React.SetStateAction<number>> } | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [count, setCount] = useState(0); // Initialize the cart count
  const clearCount = () => {
    setCount(0); // Reset cart count to 0
  };

  return (
    <CartContext.Provider value={{ count, setCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
