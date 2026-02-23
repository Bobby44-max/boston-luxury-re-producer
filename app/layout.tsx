import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/ConvexProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], style: ["italic"], weight: ["700"], variable: "--font-playfair" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Real Easy Realty | AI Video Production Suite",
  description: "AI-Powered Video Production Suite for Real Estate.",
  openGraph: { title: "Real Easy Realty", description: "Transform any listing URL into professional marketing videos with AI", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} font-sans antialiased`}>
          <ConvexClientProvider>
            {/* Global Noise Overlay */}
            <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.05]">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <filter id="noise">
                  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise)" />
              </svg>
            </div>
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
