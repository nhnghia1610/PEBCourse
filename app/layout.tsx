// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import ToasterProvider from "@/components/providers/ToasterProvider";
import Wrapper from "@/components/layout/Wrapper"; // Import the Wrapper component
import Topbar from "@/components/layout/Topbar"; // Import the Topbar component
import { CartProvider } from "@/components/cart/CartContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PEB Course",
  description: "Profitable, Effectiveness, Beneficial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <CartProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ToasterProvider />
            <Topbar /> {/* Topbar spans full width */}
            <Wrapper> {/* Wrap other content */}
              {children}
            </Wrapper>
          </body>
        </html>
      </CartProvider>
    </ClerkProvider>
  );
}
