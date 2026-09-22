"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { useAuth } from "@/lib/auth-context";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, Shield, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, adminLogin } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isAdminMode) {
        await adminLogin({
          admin_key: adminKey,
          email_or_username: emailOrUsername,
          password,
        });
        router.push("/admin");
      } else {
        await login({ email_or_username: emailOrUsername, password });
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Accent Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-[#2E1A5E]/10 via-[#E36648]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#2E1A5E]/15 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Logo size="xl" className="justify-center mb-4" />
          <h2 className="text-2xl font-extrabold text-[#161F30]">
            {isAdminMode ? "Admin Login" : "Welcome Back!"}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {isAdminMode
              ? "Authenticate with your administrator key."
              : "Log in to your Skill X Change account."}
          </p>
        </div>

        {/* Admin Mode Toggle */}
        <div className="mb-6 flex justify-center">
          <button
            type="button"
            onClick={() => {
              setIsAdminMode(!isAdminMode);
              setError(null);
              setAdminKey("");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              isAdminMode
                ? "bg-[#E36648] text-white border-[#E36648] shadow-md"
                : "bg-[#FFF8F0] text-[#2E1A5E] border-[#2E1A5E]/15 hover:border-[#E36648]/40"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            {isAdminMode ? "Switch to User Login" : "Administrator Login"}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Admin Key Field (only in admin mode) */}
          {isAdminMode && (
            <div>
              <label className="block text-xs font-bold text-[#E36648] mb-1">
                Administrator Key
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#E36648] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter admin key"
                  className="w-full pl-10 pr-4 py-3 bg-[#E36648]/5 border border-[#E36648]/25 rounded-xl text-sm focus:outline-none focus:border-[#E36648] placeholder:text-[#E36648]/40"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#161F30] mb-1">Email or Username</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="Enter email or username"
                className="w-full pl-10 pr-4 py-3 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-xl text-sm focus:outline-none focus:border-[#2E1A5E]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#161F30]">Password</label>
              {!isAdminMode && (
                <Link href="/forgot-password" className="text-[11px] font-bold text-[#E36648] hover:underline">
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-xl text-sm focus:outline-none focus:border-[#2E1A5E]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4 ${
              isAdminMode
                ? "bg-[#E36648] text-white hover:bg-[#D05A3E]"
                : "bg-[#2E1A5E] text-[#FFF8F0] hover:bg-[#291A53]"
            }`}
          >
            {loading
              ? "Authenticating..."
              : isAdminMode
              ? "Authenticate as Admin"
              : "Log In"}
            {isAdminMode ? (
              <Shield className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4 text-[#E36648]" />
            )}
          </button>
        </form>

        {!isAdminMode && (
          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-bold text-[#E36648] hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
