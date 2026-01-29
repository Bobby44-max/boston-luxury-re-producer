import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] font-sans">
      {/* Marketing Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
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
            <Link href="/#features" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
              Intelligence
            </Link>
            <Link href="/#pricing" className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
              Pricing
            </Link>
            <SignedIn>
              <Link href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors">
                Studio
              </Link>
            </SignedIn>
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

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-white/5 opacity-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="font-syne font-bold uppercase tracking-tighter">Apex Luxury</span>
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.2em]">Designed by Aura × Gemini Unified</p>
          <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-amber-500 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-amber-500 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
