import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Boston Luxury RE Producer | 2026 Edition",
  description:
    "AI-Powered Production Suite for Boston Luxury Real Estate. Generate video scripts, VEO animations, content packages, and sales materials.",
  openGraph: {
    title: "Boston Luxury RE Producer",
    description: "AI-Powered Production Suite for Boston Luxury Real Estate",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        <SessionProvider>
          {/* Ambient Gradient Orbs */}
          <div className="ambient-gradient gradient-cyan" />
          <div className="ambient-gradient gradient-violet" />
          <div className="ambient-gradient gradient-orange" />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
