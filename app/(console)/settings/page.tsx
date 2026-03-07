"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import {
  User,
  Palette,
  Bell,
  CreditCard,
  Key,
  Building2,
  Shield,
  Zap,
  Globe,
  Monitor,
  Cpu,
  Lock,
  ChevronRight,
  ExternalLink,
  Smartphone,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

const SETTINGS_SECTIONS = [
  {
    title: "Profile Identity",
    description: "Core operator authentication and persona data",
    icon: User,
    color: "text-blue-400",
    bg: "bg-blue-500/5 border-blue-500/10",
    items: [
      { label: "Display Name", value: "Operator Primary", action: "Modify", status: "Verified" },
      { label: "Email Authentication", value: "Primary Channel Secured", action: null, status: "Clerk-Sync" },
    ],
  },
  {
    title: "Fleet Branding",
    description: "Visual DNA for production assets",
    icon: Palette,
    color: "text-amber-400",
    bg: "bg-amber-500/5 border-amber-500/10",
    items: [
      { label: "Agency Logo", value: "High-Res SVG Active", action: "Replace" },
      { label: "Brand Palette", value: "Luxury Gold / Midnight", action: "Configure" },
      { label: "Contact Metadata", value: "Automated in scripts", action: "Update" },
    ],
  },
  {
    title: "Intelligence Feed",
    description: "Real-time notification and telemetry status",
    icon: Bell,
    color: "text-emerald-400",
    bg: "bg-emerald-500/5 border-emerald-500/10",
    items: [
      { label: "Production Alerts", value: "Push & Email Active", action: "Toggle" },
      { label: "Market Intelligence", value: "Critical Events Only", action: "Toggle" },
    ],
  },
  {
    title: "Fleet Infrastructure",
    description: "Subscription tier and resource allocation",
    icon: Cpu,
    color: "text-purple-400",
    bg: "bg-purple-500/5 border-purple-500/10",
    items: [
      { label: "Service Tier", value: "APEX UNIFIED v2.60", action: "Upgrade" },
      { label: "Resource Usage", value: "24 / Unlimited Render Units", action: "Detailed Analytics" },
    ],
  },
];

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <div className="relative min-h-screen">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="/assets/re-deck/re_settings_3d.png" 
          alt="Systems Context" 
          fill 
          className="object-cover opacity-30 blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-[#020617]/90 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-5xl space-y-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-space font-bold text-blue-400 uppercase tracking-[0.4em] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Fleet Systems
            </span>
            <div className="h-px w-8 bg-white/10" />
            <span className="text-[10px] font-space font-bold text-white/20 uppercase tracking-[0.2em]">Configuration Panel v2.60</span>
          </div>
          <h1 className="text-5xl font-space font-bold tracking-tighter text-white mb-2">
            Systems <span className="text-white/20">Control.</span>
          </h1>
          <p className="text-lg text-white/40 font-light max-w-xl leading-relaxed">
            Configure your global fleet parameters, branding DNA, and operational telemetry.
          </p>
        </motion.div>

        {/* Tactical Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="premium-glass p-6 rounded-3xl border border-white/5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-[9px] font-space font-bold text-white/20 uppercase tracking-widest mb-0.5">Security Status</div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">Encrypted-Session</div>
            </div>
          </div>
          <div className="premium-glass p-6 rounded-3xl border border-white/5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Globe className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-[9px] font-space font-bold text-white/20 uppercase tracking-widest mb-0.5">Regional Node</div>
              <div className="text-xs font-bold text-white/80 uppercase tracking-tighter">US-EAST-GCP</div>
            </div>
          </div>
          <div className="premium-glass p-6 rounded-3xl border border-white/5 flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Lock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-[9px] font-space font-bold text-white/20 uppercase tracking-widest mb-0.5">Access Tier</div>
              <div className="text-xs font-bold text-white/80 uppercase tracking-tighter">Apex-Unified</div>
            </div>
          </div>
        </div>

        {/* Settings Matrix */}
        <div className="grid grid-cols-1 gap-8">
          {SETTINGS_SECTIONS.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
                className="premium-glass rounded-[2.5rem] border border-white/5 overflow-hidden group"
              >
                {/* Section Header */}
                <div className={`p-8 border-b border-white/5 ${section.bg} relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                    <Icon className="w-32 h-32" />
                  </div>
                  <div className="flex items-center gap-6 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center border border-white/10`}>
                      <Icon className={`w-6 h-6 ${section.color}`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-space font-bold text-white tracking-tight">{section.title}</h2>
                      <p className="text-sm text-white/40 font-light">{section.description}</p>
                    </div>
                  </div>
                </div>

                {/* Section Items */}
                <div className="divide-y divide-white/[0.03]">
                  {section.items.map((item, j) => (
                    <div key={j} className="flex items-center justify-between p-8 hover:bg-white/[0.01] transition-all group/item">
                      <div className="space-y-1">
                        <p className="text-[10px] font-space font-bold text-white/20 uppercase tracking-[0.2em]">{item.label}</p>
                        <div className="flex items-center gap-3">
                          <p className="font-light text-white/80">{item.value}</p>
                          {item.status && (
                            <span className="text-[8px] bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{item.status}</span>
                          )}
                        </div>
                      </div>
                      {item.action && (
                        <button className="px-6 py-2.5 rounded-xl border border-white/10 text-[10px] font-space font-bold uppercase tracking-widest text-white/60 hover:bg-white hover:text-black hover:border-white transition-all transform active:scale-95">
                          {item.action}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Danger Matrix */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-[2.5rem] bg-rose-500/[0.02] border border-rose-500/10 overflow-hidden mt-12 group"
        >
          <div className="p-8 border-b border-rose-500/10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h2 className="text-xl font-space font-bold text-rose-500 tracking-tight">Danger Matrix</h2>
                <p className="text-sm text-white/30 font-light tracking-wide italic">Irreversible fleet de-synchronization protocols</p>
              </div>
            </div>
            <button className="px-8 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-space font-bold uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all active:scale-95 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
              Terminate Session
            </button>
          </div>
        </motion.div>

        {/* Footer Metadata */}
        <div className="flex justify-between items-center py-12 px-2 border-t border-white/5">
          <div className="text-[9px] font-space font-bold text-white/10 uppercase tracking-[0.4em]">
            Apex AI Systems Fleet Interface © 2026
          </div>
          <div className="flex gap-8 items-center text-[9px] font-space font-bold text-white/20 uppercase tracking-widest">
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><Monitor className="w-3 h-3" /> System Logs</span>
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><Smartphone className="w-3 h-3" /> API Keys</span>
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><ExternalLink className="w-3 h-3" /> Documentation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
