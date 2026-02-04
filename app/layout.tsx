import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/ConvexProvider";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
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
        <body className={`${plusJakarta.variable} ${syne.variable} font-sans antialiased bg-transparent text-white selection:bg-accent-indigo/30`}>
          <div className="boston-bg-overlay" />

          <ConvexClientProvider>
            {/* Global Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-8 py-4 bg-black/20 backdrop-blur-md border-b border-white/5">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:border-white/30 group-hover:bg-white/10">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold font-syne tracking-tighter uppercase leading-none">
                      Apex <span className="text-white/40 group-hover:text-white transition-colors">Luxury</span>
                    </h1>
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold mt-1">Intelligence Suite</p>
                  </div>
                </Link>

                {/* Nav Links */}
                <nav className="hidden md:flex items-center gap-10">
                  {['Intelligence', 'Creative', 'Vault', 'Systems'].map((link) => (
                    <Link
                      key={link}
                      href={link === 'Intelligence' ? '/studio' : '/'}
                      className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-white transition-all"
                    >
                      {link}
                    </Link>
                  ))}
                </nav>

                {/* Auth */}
                <div className="flex items-center gap-6">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] bg-white text-black rounded-full hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95">
                        Get Started
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10 border border-white/10 hover:border-white/30 transition-all",
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

            {/* Ambient Background Orbs */}
            <div className="orb orb-indigo" />
            <div className="orb orb-rose" />

            {/* Main Content */}
            <main className="relative z-10">
              {children}
            </main>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
