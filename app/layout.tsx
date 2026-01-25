import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
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

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Real Easy Realty | AI Video Production Suite",
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
        <body className={`${plusJakarta.variable} font-sans antialiased`}>
          <ConvexClientProvider>
            {/* Global Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-3 bg-black/50 backdrop-blur-xl border-b border-white/5">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-violet-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <span className="text-white font-bold text-lg">R</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold">
                      <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                        Real Easy Realty
                      </span>
                    </h1>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">AI Video Suite</p>
                  </div>
                </Link>

                {/* Nav Links */}
                <nav className="hidden md:flex items-center gap-6">
                  <Link href="/tools" className="text-sm text-white/60 hover:text-white transition-colors">
                    Tools
                  </Link>
                  <Link href="/" className="text-sm text-white/60 hover:text-white transition-colors">
                    Avatar
                  </Link>
                </nav>

                {/* Auth */}
                <div className="flex items-center gap-3">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="px-4 py-2 text-sm font-semibold text-white/70 hover:text-white transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition-opacity">
                        Get Started
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-9 h-9",
                          userButtonPopoverCard: "bg-zinc-900 border border-white/10",
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

            {/* Ambient Gradient Orbs */}
            <div className="ambient-gradient gradient-cyan" />
            <div className="ambient-gradient gradient-violet" />
            <div className="ambient-gradient gradient-orange" />

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
