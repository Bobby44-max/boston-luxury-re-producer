import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/ConvexProvider";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Apex Luxury | AI Intelligence Suite",
  description:
    "AI-Powered Video Production Suite for Real Estate. Generate stunning property videos from any listing URL in minutes. Powered by Firecrawl + Remotion + Gemini.",
  openGraph: {
    title: "Real Easy Realty",
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
        <body className={`${plusJakarta.variable} font-sans antialiased bg-[#0A0A0A]`}>
          <ConvexClientProvider>
            {/* Global Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-3 bg-black/50 backdrop-blur-xl border-b border-white/5">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Sparkles className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold font-syne tracking-tighter uppercase">
                      <span className="gradient-gold">
                        Apex Luxury
                      </span>
                    </h1>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">AI Intelligence Suite</p>
                  </div>
                </Link>

                {/* Nav Links */}
                <nav className="hidden md:flex items-center gap-8">
                  <Link href="/tools" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                    Intelligence
                  </Link>
                  <Link href="/" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                    Creative
                  </Link>
                </nav>

                {/* Auth */}
                <div className="flex items-center gap-3">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="px-6 py-2 text-xs font-bold uppercase tracking-widest bg-white text-black rounded-full hover:bg-neutral-200 transition-colors">
                        Get Started
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-9 h-9 border border-white/10",
                          userButtonPopoverCard: "bg-black border border-white/10",
                          userButtonPopoverActionButton: "text-white/70 hover:text-white hover:bg-white/5",
                          userButtonPopoverActionButtonText: "text-white/70",
                          userButtonPopoverFooter: "hidden",
                        },
                      }}
                    />
                  </SignedIn>
                </div>
              </div>
            </header>

            {/* Ambient Auras */}
            <div className="aura-glow-gold top-0 -left-24 opacity-20" />
            <div className="aura-glow-cyan bottom-0 -right-24 opacity-10" />

            {/* Main Content with header padding */}
            <div className="pt-16">
              {children}
            </div>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
          </ConvexClientProvider >
        </body >
      </html >
    </ClerkProvider >
  );
}
// Trigger redeploy: Thu, Jan 29, 2026 12:29:49 AM
