import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { InteractiveHeroElement } from "@/components/interactive-hero-element";
import { HowItWorks } from "@/components/how-it-works";
import { SkillCategories } from "@/components/skill-categories";
import { TechStackSection } from "@/components/tech-stack-section";
import { Footer } from "@/components/footer";
import { ArrowRight, Sparkles, Users, Repeat, Star, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 overflow-hidden">
        {/* Decorative Background Accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#2E1A5E]/10 via-[#E36648]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#2E1A5E]/15 text-[#2E1A5E] text-xs font-bold shadow-xs mb-8">
            <Sparkles className="w-4 h-4 text-[#E36648]" />
            <span>The #1 Peer-to-Peer Skill Exchange Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#161F30] tracking-tight leading-[1.1] mb-6">
            Your Skills Have Value. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#2E1A5E] via-[#291A53] to-[#E36648] bg-clip-text text-transparent">
              Exchange Them.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-gray-600 leading-relaxed mb-10">
            “Learn something new by sharing what you already know. Connect with people, exchange skills, and grow together.”
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-[#2E1A5E] text-[#FFF8F0] font-bold text-base rounded-2xl hover:bg-[#291A53] shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <span>Start Exchanging</span>
              <ArrowRight className="w-5 h-5 text-[#E36648] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/explore"
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#2E1A5E] border border-[#2E1A5E]/20 font-bold text-base rounded-2xl hover:bg-[#2E1A5E]/5 shadow-sm transition-all"
            >
              Explore Skills
            </Link>
          </div>

          {/* INTERACTIVE HERO visual */}
          <InteractiveHeroElement />

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16 p-6 rounded-3xl bg-white/80 backdrop-blur-md border border-[#2E1A5E]/10 shadow-lg">
            <div className="text-center">
              <div className="text-3xl font-black text-[#2E1A5E]">2,400+</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#E36648]">1,850+</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Exchanges Done</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#2E1A5E]">18</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-[#E36648]">4.9 / 5</div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* SKILL CATEGORIES */}
      <SkillCategories />

      {/* TECHNOLOGY STACK */}
      <TechStackSection />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
