"use client";

import { useUser } from "@clerk/nextjs";
import {
  User,
  Palette,
  Bell,
  CreditCard,
  Key,
  Building2,
} from "lucide-react";

const SETTINGS_SECTIONS = [
  {
    title: "Profile",
    description: "Manage your personal information",
    icon: User,
    items: [
      { label: "Display Name", value: "Edit in Clerk", action: "Edit" },
      { label: "Email", value: "Managed by Clerk", action: null },
    ],
  },
  {
    title: "Branding",
    description: "Customize your video branding",
    icon: Palette,
    items: [
      { label: "Logo", value: "Not uploaded", action: "Upload" },
      { label: "Brand Colors", value: "Default", action: "Customize" },
      { label: "Contact Info", value: "Not set", action: "Add" },
    ],
  },
  {
    title: "Notifications",
    description: "Configure how you receive updates",
    icon: Bell,
    items: [
      { label: "Email Notifications", value: "Enabled", action: "Toggle" },
      { label: "Render Complete Alerts", value: "Enabled", action: "Toggle" },
    ],
  },
  {
    title: "Billing",
    description: "Manage your subscription",
    icon: CreditCard,
    items: [
      { label: "Current Plan", value: "Professional", action: "Manage" },
      { label: "Videos Used", value: "24 / Unlimited", action: null },
    ],
  },
];

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-white/50">Manage your account and preferences</p>
      </div>

      {/* Settings Sections */}
      {SETTINGS_SECTIONS.map((section, i) => {
        const Icon = section.icon;
        return (
          <div
            key={i}
            className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden"
          >
            {/* Section Header */}
            <div className="p-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <h2 className="font-semibold">{section.title}</h2>
                  <p className="text-sm text-white/40">{section.description}</p>
                </div>
              </div>
            </div>

            {/* Section Items */}
            <div className="divide-y divide-white/[0.06]">
              {section.items.map((item, j) => (
                <div key={j} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-white/40">{item.value}</p>
                  </div>
                  {item.action && (
                    <button className="px-4 py-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                      {item.action}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Danger Zone */}
      <div className="rounded-2xl bg-red-500/5 border border-red-500/20 overflow-hidden">
        <div className="p-6 border-b border-red-500/20">
          <h2 className="font-semibold text-red-400">Danger Zone</h2>
          <p className="text-sm text-white/40">Irreversible actions</p>
        </div>
        <div className="p-4">
          <button className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
