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
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAFA] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/[0.06] flex flex-col bg-[#0A0A0A]/80 backdrop-blur-xl fixed h-full z-40">
        {/* Logo */}
        <div className="p-6 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-violet-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-lg">RE</span>
            </div>
            <div>
              <h1 className="text-base font-bold">
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  Real Easy
                </span>
              </h1>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Video OS</p>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-white border border-emerald-500/20"
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : ""}`} />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto text-emerald-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Action */}
        <div className="p-4 border-t border-white/[0.06]">
          <Link
            href="/studio"
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4" />
            New Video
          </Link>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
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
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Account</p>
              <p className="text-xs text-white/40">Manage profile</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Topbar */}
        <header className="h-16 border-b border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-6">
          <div>
            <h2 className="text-lg font-semibold">
              {NAV_ITEMS.find(item => item.href === pathname)?.label || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/40 px-3 py-1 bg-white/[0.04] rounded-full border border-white/[0.06]">
              Pro Plan
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
