import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { Inter } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Mandip Adhikari",
  description: "Exploring why dimensional spaces are stuck playing with real numbers when computational complex dimensions are right there, begging to be noticed.",
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased bg-neutral-950">
        {children}
        <Toaster 
          position="bottom-right"
          expand={false}
          richColors
          theme="dark"
        />
      </body>
    </html>
  );
}
