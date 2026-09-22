"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Code, Globe, Smartphone, Cpu, Database, ShieldAlert, Layout, Palette,
  Video, TrendingUp, Mic, Camera, Music, Lightbulb, DollarSign, Languages, GraduationCap, Grid
} from "lucide-react";

export const SkillCategories: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { name: "Programming", icon: Code, count: "420+ Skills" },
    { name: "Web Development", icon: Globe, count: "380+ Skills" },
    { name: "App Development", icon: Smartphone, count: "210+ Skills" },
    { name: "Artificial Intelligence", icon: Cpu, count: "310+ Skills" },
    { name: "Data Science", icon: Database, count: "190+ Skills" },
    { name: "Cybersecurity", icon: ShieldAlert, count: "140+ Skills" },
    { name: "UI/UX Design", icon: Layout, count: "290+ Skills" },
    { name: "Graphic Design", icon: Palette, count: "230+ Skills" },
    { name: "Video Editing", icon: Video, count: "170+ Skills" },
    { name: "Digital Marketing", icon: TrendingUp, count: "260+ Skills" },
    { name: "Public Speaking", icon: Mic, count: "110+ Skills" },
    { name: "Photography", icon: Camera, count: "130+ Skills" },
    { name: "Music", icon: Music, count: "95+ Skills" },
    { name: "Entrepreneurship", icon: Lightbulb, count: "220+ Skills" },
    { name: "Finance", icon: DollarSign, count: "150+ Skills" },
    { name: "Languages", icon: Languages, count: "340+ Skills" },
    { name: "Academics", icon: GraduationCap, count: "280+ Skills" },
    { name: "Other", icon: Grid, count: "180+ Skills" },
  ];

  return (
    <section id="skills" className="py-20 px-4 bg-[#2E1A5E]/5 border-y border-[#2E1A5E]/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black tracking-widest text-[#2E1A5E] uppercase bg-[#2E1A5E]/10 px-4 py-1.5 rounded-full">
            Explore Ecosystem
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#161F30] mt-4 mb-4">
            Discover Skills Across 18 Categories
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            From technical programming and AI to creative arts, languages, and entrepreneurship.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;

            return (
              <Link
                key={idx}
                href={`/explore?category=${encodeURIComponent(cat.name)}`}
                className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center group cursor-pointer ${
                  isSelected
                    ? "bg-[#2E1A5E] text-[#FFF8F0] border-[#E36648] shadow-lg"
                    : "bg-white text-[#161F30] border-[#2E1A5E]/10 hover:border-[#E36648]/40 hover:shadow-md hover:-translate-y-1"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                  isSelected ? "bg-[#E36648] text-white" : "bg-[#FFF8F0] text-[#2E1A5E] group-hover:bg-[#2E1A5E] group-hover:text-[#FFF8F0]"
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-xs sm:text-sm line-clamp-1 mb-1">{cat.name}</h4>
                <span className="text-[10px] text-gray-500 font-semibold group-hover:text-[#E36648] transition-colors">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
