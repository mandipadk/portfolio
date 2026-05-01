import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"

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
  description: "Full-stack developer working on AI/ML systems, search evaluation, and the data infrastructure that keeps them honest in production.",
};
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`relative ${spaceGrotesk.variable}`}>
      <body className="relative font-sans antialiased bg-neutral-950">
        {children}
        <Analytics />
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
