"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { fetchApi } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { User, Shield, Bell, Lock, Trash2, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { user, refreshUser, logout } = useAuth();
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setBio(user.bio || "");
      setAvatarUrl(user.avatar_url || "");
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");

    try {
      await fetchApi("/users/me", {
        method: "PUT",
        body: JSON.stringify({
          full_name: fullName,
          bio,
          avatar_url: avatarUrl,
        }),
      });
      await refreshUser();
      setSuccessMsg("Settings updated successfully!");
    } catch (err: any) {
      alert(err.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-extrabold text-[#161F30] mb-8">Account Settings</h1>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="space-y-8">
          {/* Section 1: Profile Settings */}
          <form onSubmit={handleSaveProfile} className="p-8 rounded-3xl bg-white border border-[#2E1A5E]/10 shadow-md space-y-6">
            <h2 className="text-lg font-extrabold text-[#161F30] flex items-center gap-2">
              <User className="w-5 h-5 text-[#2E1A5E]" />
              Public Profile
            </h2>

            <div>
              <label className="block text-xs font-bold text-[#161F30] mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-xl text-xs focus:outline-none focus:border-[#2E1A5E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#161F30] mb-1">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-xl text-xs focus:outline-none focus:border-[#2E1A5E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#161F30] mb-1">Avatar Image URL</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full p-3 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-xl text-xs focus:outline-none focus:border-[#2E1A5E]"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#2E1A5E] text-[#FFF8F0] font-bold text-xs rounded-xl hover:bg-[#291A53] shadow-sm transition-all"
            >
              {saving ? "Saving..." : "Save Profile Changes"}
            </button>
          </form>

          {/* Section 2: Preferences */}
          <div className="p-8 rounded-3xl bg-white border border-[#2E1A5E]/10 shadow-md space-y-4">
            <h2 className="text-lg font-extrabold text-[#161F30] flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#E36648]" />
              Notifications & Preferences
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#2E1A5E]" />
                <span className="text-xs font-bold text-[#161F30]">Email alerts for new exchange requests</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#2E1A5E]" />
                <span className="text-xs font-bold text-[#161F30]">In-app match recommendations</span>
              </label>
            </div>
          </div>

          {/* Section 3: Danger Zone */}
          <div className="p-8 rounded-3xl bg-red-50/50 border border-red-200 shadow-md space-y-4">
            <h2 className="text-lg font-extrabold text-red-700 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </h2>
            <p className="text-xs text-red-600">
              Permanently log out from all active devices.
            </p>
            <button
              onClick={logout}
              className="px-6 py-3 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 shadow-sm"
            >
              Log Out of All Devices
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
