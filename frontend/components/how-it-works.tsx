import React from "react";
import { UserPlus, Share2, Compass, Repeat } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "CREATE",
      desc: "Create your Skill X Change profile in under 2 minutes.",
      icon: UserPlus,
    },
    {
      num: "02",
      title: "SHARE",
      desc: "Tell the community what you know and love teaching.",
      icon: Share2,
    },
    {
      num: "03",
      title: "DISCOVER",
      desc: "Find reciprocal matches with calculated compatibility.",
      icon: Compass,
    },
    {
      num: "04",
      title: "EXCHANGE",
      desc: "Connect, chat, learn, teach, and grow together.",
      icon: Repeat,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-black tracking-widest text-[#E36648] uppercase bg-[#E36648]/10 px-4 py-1.5 rounded-full">
          Simple & Effective
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#161F30] mt-4 mb-4">
          How Skill X Change Works
        </h2>
        <p className="text-gray-600 text-base md:text-lg">
          No money involved. Just pure human-to-human skill sharing, mutual growth, and collaboration.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="relative p-8 rounded-3xl bg-white border border-[#2E1A5E]/10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-black text-[#2E1A5E]/20 group-hover:text-[#E36648] transition-colors">
                  {step.num}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-[#2E1A5E] text-[#FFF8F0] flex items-center justify-center group-hover:bg-[#E36648] transition-colors shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#161F30] mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>

              {/* Connecting Line between cards */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gradient-to-r from-[#2E1A5E]/20 to-[#E36648]/40 z-10" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
