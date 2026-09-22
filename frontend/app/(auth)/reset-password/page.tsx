"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [completed, setCompleted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCompleted(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#2E1A5E]/10 shadow-xl">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <h2 className="text-2xl font-extrabold text-[#161F30]">Set New Password</h2>
          <p className="text-xs text-gray-500 mt-1">Choose a strong new password for your account.</p>
        </div>

        {completed ? (
          <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-800 text-center font-bold text-xs space-y-3">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
            <p>Your password has been updated!</p>
            <Link href="/login" className="inline-block px-4 py-2 bg-[#2E1A5E] text-white rounded-xl text-xs">
              Log In Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#161F30] mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-xl text-sm focus:outline-none focus:border-[#2E1A5E]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#2E1A5E] text-[#FFF8F0] font-bold text-sm rounded-xl hover:bg-[#291A53] shadow-md transition-all flex items-center justify-center gap-2"
            >
              Update Password
              <ArrowRight className="w-4 h-4 text-[#E36648]" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
