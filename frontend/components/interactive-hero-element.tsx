"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeftRight, CheckCircle2, Sparkles, RefreshCw } from "lucide-react";

export const InteractiveHeroElement: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const exchangePairs = [
    {
      userA: { name: "Alex J.", role: "Developer", teach: ["Python", "FastAPI", "Machine Learning"], avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" },
      userB: { name: "Sarah M.", role: "Designer", teach: ["UI/UX Design", "Figma", "Graphic Design"], avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80" },
      matchScore: "96% Reciprocal Match"
    },
    {
      userA: { name: "Rahul S.", role: "Security Eng.", teach: ["Cybersecurity", "Linux", "Python"], avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
      userB: { name: "Emma W.", role: "Growth Lead", teach: ["Video Editing", "Digital Marketing", "SEO"], avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80" },
      matchScore: "92% Reciprocal Match"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % exchangePairs.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = exchangePairs[activeStep];

  return (
    <div className="relative w-full max-w-4xl mx-auto my-8 p-6 md:p-8 rounded-3xl bg-white border border-[#2E1A5E]/15 shadow-2xl overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#2E1A5E]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#E36648]/15 rounded-full blur-3xl" />

      {/* Top Match Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E36648]/10 text-[#E36648] text-xs font-extrabold tracking-wide">
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>{current.matchScore}</span>
        </div>
        <button
          onClick={() => setActiveStep((prev) => (prev + 1) % exchangePairs.length)}
          className="text-xs font-bold text-[#2E1A5E] hover:text-[#E36648] flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Next Demo Exchange
        </button>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-6">
        {/* User A Card */}
        <div className="md:col-span-5 p-5 rounded-2xl bg-[#FFF8F0] border border-[#2E1A5E]/10 shadow-sm transition-all duration-500 hover:border-[#2E1A5E]/30">
          <div className="flex items-center gap-3 mb-4">
            <img src={current.userA.avatar} alt={current.userA.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#2E1A5E]" />
            <div>
              <h4 className="font-bold text-[#161F30] text-base">{current.userA.name}</h4>
              <p className="text-xs text-[#2E1A5E]/70 font-medium">{current.userA.role}</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-extrabold text-[#2E1A5E] tracking-wider uppercase">Can Teach:</span>
            <div className="flex flex-wrap gap-2">
              {current.userA.teach.map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 text-xs font-semibold bg-[#2E1A5E] text-[#FFF8F0] rounded-lg shadow-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#E36648]" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Central Animated Exchange Node */}
        <div className="md:col-span-1 flex flex-col items-center justify-center my-2 md:my-0">
          <div className="relative group p-4 rounded-2xl bg-[#2E1A5E] text-[#FFF8F0] shadow-xl border border-[#E36648]/40 animate-pulse-coral">
            <ArrowLeftRight className="w-6 h-6 text-[#E36648] animate-swap" />
          </div>
          <span className="mt-2 text-[10px] font-black uppercase text-[#E36648] tracking-widest text-center">
            Skill Exchange
          </span>
        </div>

        {/* User B Card */}
        <div className="md:col-span-5 p-5 rounded-2xl bg-[#FFF8F0] border border-[#E36648]/20 shadow-sm transition-all duration-500 hover:border-[#E36648]/40">
          <div className="flex items-center gap-3 mb-4">
            <img src={current.userB.avatar} alt={current.userB.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#E36648]" />
            <div>
              <h4 className="font-bold text-[#161F30] text-base">{current.userB.name}</h4>
              <p className="text-xs text-[#E36648] font-medium">{current.userB.role}</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-extrabold text-[#E36648] tracking-wider uppercase">Can Teach:</span>
            <div className="flex flex-wrap gap-2">
              {current.userB.teach.map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 text-xs font-semibold bg-[#E36648] text-[#FFF8F0] rounded-lg shadow-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#FFF8F0]" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
