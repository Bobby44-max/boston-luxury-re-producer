import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA]">
      {/* Marketing Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-3 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-violet-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-lg">RE</span>
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
            <Link href="/#features" className="text-sm text-white/60 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="text-sm text-white/60 hover:text-white transition-colors">
              Pricing
            </Link>
            <SignedIn>
              <Link href="/dashboard" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                Dashboard
              </Link>
            </SignedIn>
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
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Open Dashboard
              </Link>
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

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                <span className="text-[#0A0A0A] font-bold text-[10px]">RE</span>
              </div>
              <span className="text-sm text-white/40">Real Easy Realty</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-white/30 hover:text-white/50 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-white/30 hover:text-white/50 transition-colors">
                Terms
              </Link>
            </div>
            <div className="text-sm text-white/30">
              © 2026 Real Easy Realty. Powered by Apex AI.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
