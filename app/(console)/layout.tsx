"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Video,
  FileVideo,
  Settings,
  Sparkles,
  LogOut,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/studio", label: "Video Studio", icon: Video },
  { href: "/videos", label: "My Videos", icon: FileVideo },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while checking auth
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#FAFAFA] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/[0.06] flex flex-col bg-[#050505]/80 backdrop-blur-xl fixed h-full z-40">
        {/* Logo */}
        <div className="p-8 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-base font-bold font-syne tracking-tighter uppercase">
                <span className="gradient-gold">
                  Apex Luxury
                </span>
              </h1>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold">Intelligence OS</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all ${isActive
                    ? "bg-amber-500/10 text-white border border-amber-500/20"
                    : "text-white/30 hover:text-white hover:bg-white/[0.03]"
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-500" : ""}`} />
                <span className="font-bold text-[11px] uppercase tracking-widest leading-none">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-3 rounded-full bg-amber-500 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Action */}
        <div className="p-4 border-t border-white/[0.06] bg-amber-500/[0.02]">
          <Link
            href="/studio"
            className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-bold text-[10px] uppercase tracking-widest rounded-2xl hover:bg-neutral-200 transition-all shadow-xl"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            Initiate Asset
          </Link>
        </div>

        {/* User Section */}
        <div className="p-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-4">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border border-white/10",
                  userButtonPopoverCard: "bg-black border border-white/10",
                  userButtonPopoverActionButton: "text-white/70 hover:text-white hover:bg-white/5",
                  userButtonPopoverActionButtonText: "text-white/70",
                  userButtonPopoverFooter: "hidden",
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest truncate">Operator</p>
              <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold">Standard Access</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Topbar */}
        <header className="h-20 border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-10">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
              {NAV_ITEMS.find(item => item.href === pathname)?.label || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Aura Unified v2.60</span>
              <span className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em]">Operational Status: Normal</span>
            </div>
            <div className="w-px h-8 bg-white/5" />
            <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
              Tier: Apex
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-10 relative">
          {/* Ambient Auras */}
          <div className="aura-glow-gold top-0 -left-20 opacity-10 pointer-events-none" />
          {children}
        </main>
      </div>
    </div>
  );
}
