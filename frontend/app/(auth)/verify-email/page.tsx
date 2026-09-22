"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { MailCheck, ArrowRight } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#2E1A5E]/10 shadow-xl text-center space-y-4">
        <Logo size="lg" className="justify-center mb-4" />
        <div className="w-16 h-16 mx-auto rounded-full bg-[#E36648]/10 text-[#E36648] flex items-center justify-center">
          <MailCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#161F30]">Verify Your Email</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          We sent a verification link to your email. Click the link to complete account setup.
        </p>
        <Link
          href="/dashboard"
          className="w-full py-3.5 bg-[#2E1A5E] text-[#FFF8F0] font-bold text-sm rounded-xl hover:bg-[#291A53] shadow-md transition-all flex items-center justify-center gap-2"
        >
          Continue to Dashboard
          <ArrowRight className="w-4 h-4 text-[#E36648]" />
        </Link>
      </div>
    </div>
  );
}
