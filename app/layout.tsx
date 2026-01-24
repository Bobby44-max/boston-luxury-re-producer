import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/ConvexProvider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Apex Real Estate AI | 2026 Edition",
  description:
    "AI-Powered Video Production Suite for Real Estate. Generate stunning property videos from any listing URL in minutes. Powered by Firecrawl + Remotion + Gemini.",
  openGraph: {
    title: "Apex Real Estate AI",
    description: "Transform any listing URL into professional marketing videos with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${plusJakarta.variable} font-sans antialiased`}>
          <ConvexClientProvider>
            {/* Ambient Gradient Orbs */}
            <div className="ambient-gradient gradient-cyan" />
            <div className="ambient-gradient gradient-violet" />
            <div className="ambient-gradient gradient-orange" />
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
