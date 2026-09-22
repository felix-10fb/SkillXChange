"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { useAuth } from "@/lib/auth-context";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const pStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register({ full_name: fullName, username, email, password });
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "Signup failed. Username or email may already be taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#2E1A5E]/10 shadow-xl">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center mb-4" />
          <h2 className="text-2xl font-extrabold text-[#161F30]">Join Skill X Change</h2>
          <p className="text-xs text-gray-500 mt-1">Start exchanging your skills with students worldwide.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#161F30] mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Johnson"
                className="w-full pl-10 pr-4 py-3 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-xl text-sm focus:outline-none focus:border-[#2E1A5E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#161F30] mb-1">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                placeholder="alexj"
                className="w-full pl-10 pr-4 py-3 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-xl text-sm focus:outline-none focus:border-[#2E1A5E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#161F30] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@university.edu"
                className="w-full pl-10 pr-4 py-3 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-xl text-sm focus:outline-none focus:border-[#2E1A5E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#161F30] mb-1">Password</label>
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

            {/* Password Strength Meter */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1 h-1.5 w-full">
                  <div className={`h-full flex-1 rounded-full ${pStrength >= 1 ? "bg-red-400" : "bg-gray-200"}`} />
                  <div className={`h-full flex-1 rounded-full ${pStrength >= 2 ? "bg-amber-400" : "bg-gray-200"}`} />
                  <div className={`h-full flex-1 rounded-full ${pStrength >= 3 ? "bg-blue-400" : "bg-gray-200"}`} />
                  <div className={`h-full flex-1 rounded-full ${pStrength >= 4 ? "bg-emerald-500" : "bg-gray-200"}`} />
                </div>
                <span className="text-[10px] text-gray-500 font-medium">
                  {pStrength <= 1 && "Weak password"}
                  {pStrength === 2 && "Fair password"}
                  {pStrength === 3 && "Good password"}
                  {pStrength === 4 && "Strong password!"}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#161F30] mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-xl text-sm focus:outline-none focus:border-[#2E1A5E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#2E1A5E] text-[#FFF8F0] font-bold text-sm rounded-xl hover:bg-[#291A53] shadow-md transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? "Creating Account..." : "Create Account"}
            <ArrowRight className="w-4 h-4 text-[#E36648]" />
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#E36648] hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
