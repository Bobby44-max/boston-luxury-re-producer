"use client";

import { useState } from "react";
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
  Menu,
  X,
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
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#FAFAFA] flex font-sans">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed h-full z-50 w-64 border-r border-white/[0.06] flex flex-col bg-[#0A0A0C]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-base font-bold font-syne tracking-tighter uppercase">
                <span className="gradient-gold">Apex Luxury</span>
              </h1>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.15em] font-semibold">
                Video Suite
              </p>
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
                    ? "bg-amber-500/10 text-white border border-amber-500/20"
                    : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-amber-500" : ""}`}
                />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <div className="w-1 h-3 rounded-full bg-amber-500 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Action */}
        <div className="p-4 border-t border-white/[0.06]">
          <Link
            href="/studio"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            New Video
          </Link>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 border border-white/10",
                  userButtonPopoverCard:
                    "bg-[#0A0A0C] border border-white/10",
                  userButtonPopoverActionButton:
                    "text-white/70 hover:text-white hover:bg-white/5",
                  userButtonPopoverActionButtonText: "text-white/70",
                  userButtonPopoverFooter: "hidden",
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.firstName || "User"}
              </p>
              <p className="text-xs text-white/30 truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Topbar */}
        <header className="h-16 border-b border-white/[0.06] bg-[#0A0A0C]/90 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <h2 className="text-sm font-semibold text-white/50">
            {NAV_ITEMS.find((item) => item.href === pathname)?.label ||
              "Dashboard"}
          </h2>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs text-white/30 px-3 py-1.5 bg-white/[0.03] rounded-full border border-white/[0.06]">
              Apex Suite
            </span>
            <div className="lg:hidden">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 border border-white/10",
                    userButtonPopoverCard:
                      "bg-[#0A0A0C] border border-white/10",
                    userButtonPopoverActionButton:
                      "text-white/70 hover:text-white hover:bg-white/5",
                    userButtonPopoverActionButtonText: "text-white/70",
                    userButtonPopoverFooter: "hidden",
                  },
                }}
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
