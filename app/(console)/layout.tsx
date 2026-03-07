"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Video,
  FileVideo,
  Settings,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Intelligence", icon: LayoutDashboard, desc: "Command Center" },
  { href: "/studio", label: "Studio", icon: Video, desc: "Asset Production" },
  { href: "/videos", label: "Vault", icon: FileVideo, desc: "Asset Library" },
  { href: "/settings", label: "/Systems", icon: Settings, desc: "Fleet Config" },
];

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-2 border-white/5 animate-[spin_3s_linear_infinite]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          </div>
        </div>
        <span className="text-[10px] font-space font-bold uppercase tracking-[0.4em] text-white/20 animate-pulse">
          Authenticating Session
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-[#FAFAFA] flex font-sans selection:bg-blue-500/30">
      {/* Sidebar - The Instrument Panel */}
      <aside className="w-72 border-r border-white/10 flex flex-col bg-[#020617]/80 backdrop-blur-3xl fixed h-full z-40 overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-[-10%] left-[-20%] w-full h-[40%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Brand Identity */}
        <div className="p-8 pb-10 relative">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl group-hover:border-white/30 transition-all duration-500 group-hover:scale-105">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-space font-bold tracking-tighter uppercase leading-none">
                Apex AI
              </h1>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold mt-1">Intelligence OS</p>
            </div>
          </Link>
        </div>

        {/* Tactical Navigation */}
        <nav className="flex-1 px-4 space-y-2 relative z-10">
          <div className="px-4 pb-2">
            <span className="text-[9px] font-space font-bold text-white/20 uppercase tracking-[0.3em]">Fleet Management</span>
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-300 relative ${isActive
                    ? "bg-white/[0.05] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                    : "text-white/30 hover:text-white hover:bg-white/[0.02] border border-transparent"
                  }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${isActive ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-white/[0.03] border-white/5 group-hover:border-white/20"}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className={`font-space font-bold text-xs uppercase tracking-widest leading-none ${isActive ? "text-white" : "group-hover:text-white/80"}`}>{item.label}</span>
                  <span className="text-[9px] text-white/20 uppercase tracking-tighter mt-1 font-medium">{item.desc}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="nav-indicator" className="w-1.5 h-6 rounded-full bg-blue-500 absolute right-4" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Security & Status */}
        <div className="p-6 space-y-6 relative z-10">
          <div className="premium-glass p-5 rounded-[2rem] border border-emerald-500/10 bg-emerald-500/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-space font-bold text-emerald-400 uppercase tracking-widest">Active Fleet Node</span>
            </div>
            <div className="flex justify-between items-end">
              <div className="text-[10px] text-white/40 font-mono">v2.60.0-PRO</div>
              <Activity className="w-3 h-3 text-emerald-500/40" />
            </div>
          </div>

          <div className="flex items-center gap-4 px-2">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-12 h-12 border border-white/10 rounded-2xl",
                  userButtonPopoverCard: "bg-[#020617] border border-white/10 backdrop-blur-3xl",
                  userButtonPopoverActionButton: "text-white/70 hover:text-white hover:bg-white/5",
                  userButtonPopoverActionButtonText: "text-[11px] font-space uppercase tracking-widest",
                  userButtonPopoverFooter: "hidden",
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-space font-bold uppercase tracking-widest truncate">{user?.firstName || "Operator"}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Apex Tier</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-72">
        {/* Strategic Topbar */}
        <header className="h-24 border-b border-white/10 bg-[#020617]/60 backdrop-blur-3xl sticky top-0 z-30 flex items-center justify-between px-12">
          <div className="flex items-center gap-4">
            <div className="w-1 h-1 rounded-full bg-blue-500"></div>
            <h2 className="text-[11px] font-space font-bold uppercase tracking-[0.4em] text-white/40">
              Session Path: {pathname.split("/").filter(Boolean).join(" / ")}
            </h2>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-blue-400 font-space font-bold uppercase tracking-[0.2em]">Operational</span>
                <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse"></div>
              </div>
              <span className="text-[9px] text-white/20 font-bold uppercase tracking-[0.3em] mt-1">Uptime: 99.99%</span>
            </div>
            
            <div className="w-px h-10 bg-white/10" />
            
            <button className="premium-glass px-6 py-2.5 rounded-full border border-white/10 text-[10px] font-space font-bold uppercase tracking-[0.3em] text-white/60 hover:text-white hover:border-white/30 transition-all flex items-center gap-3">
              <Zap className="w-3 h-3 text-gold-400" />
              Upgrade
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-12 min-h-[calc(100vh-6rem)] relative">
          {children}
        </main>
      </div>
    </div>
  );
}
