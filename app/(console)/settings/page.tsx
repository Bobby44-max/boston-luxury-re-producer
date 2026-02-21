"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  User,
  Palette,
  Building2,
  Phone,
  Mail,
  Globe,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();
  const userId = user?.id;

  const profile = useQuery(
    api.agentProfiles.getByUser,
    userId ? { userId } : "skip"
  );
  const upsertProfile = useMutation(api.agentProfiles.upsert);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [brokerageName, setBrokerageName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#D4AF37");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setTitle(profile.title || "");
      setBrokerageName(profile.brokerageName || "");
      setPhone(profile.phone || "");
      setEmail(profile.email || "");
      setWebsite(profile.website || "");
      setPrimaryColor(profile.primaryColor || "#D4AF37");
      setInstagram(profile.socialHandles?.instagram || "");
      setTiktok(profile.socialHandles?.tiktok || "");
      setYoutube(profile.socialHandles?.youtube || "");
      setLinkedin(profile.socialHandles?.linkedin || "");
    } else if (user) {
      setName(user.fullName || "");
      setEmail(user.primaryEmailAddress?.emailAddress || "");
    }
  }, [profile, user]);

  const handleSave = async () => {
    if (!userId || !name || !email) return;

    setSaving(true);
    setSaved(false);

    try {
      await upsertProfile({
        userId,
        name,
        title: title || "Real Estate Agent",
        brokerageName: brokerageName || "",
        phone: phone || "",
        email,
        website: website || undefined,
        primaryColor,
        socialHandles: {
          instagram: instagram || undefined,
          tiktok: tiktok || undefined,
          youtube: youtube || undefined,
          linkedin: linkedin || undefined,
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Settings</h1>
          <p className="text-white/50 text-sm">
            Manage your profile and video branding
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !name || !email}
          className="btn-premium-solid disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      {/* Agent Profile */}
      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <User className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="font-semibold">Agent Profile</h2>
              <p className="text-sm text-white/40">
                This info appears in your generated videos
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="glass-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Luxury Real Estate Agent"
                className="glass-input"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                <Phone className="w-3 h-3 inline mr-1" />
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(617) 555-0100"
                className="glass-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                <Mail className="w-3 h-3 inline mr-1" />
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@example.com"
                className="glass-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Brokerage */}
      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white/60" />
            </div>
            <div>
              <h2 className="font-semibold">Brokerage & Branding</h2>
              <p className="text-sm text-white/40">
                Company info and video brand colors
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Brokerage Name
              </label>
              <input
                type="text"
                value={brokerageName}
                onChange={(e) => setBrokerageName(e.target.value)}
                placeholder="Compass / Sotheby's / etc."
                className="glass-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                <Globe className="w-3 h-3 inline mr-1" />
                Website
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yoursite.com"
                className="glass-input"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
              <Palette className="w-3 h-3 inline mr-1" />
              Brand Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="glass-input w-32 font-mono text-sm"
              />
              <div
                className="h-10 flex-1 rounded-lg"
                style={{ backgroundColor: primaryColor }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Handles */}
      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
              <Globe className="w-5 h-5 text-white/60" />
            </div>
            <div>
              <h2 className="font-semibold">Social Media</h2>
              <p className="text-sm text-white/40">
                Linked in your video CTAs
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Instagram
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@yourusername"
                className="glass-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                TikTok
              </label>
              <input
                type="text"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                placeholder="@yourusername"
                className="glass-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                YouTube
              </label>
              <input
                type="text"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="@yourchannel"
                className="glass-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                LinkedIn
              </label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="linkedin.com/in/yourname"
                className="glass-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save (bottom) */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving || !name || !email}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? "Saved" : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
