import React from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#291A53] text-[#FFF8F0] pt-16 pb-12 border-t border-[#E36648]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Logo size="lg" className="[&_span]:text-white" />
            <p className="text-xs text-gray-300 leading-relaxed">
              Skill X Change is a platform where students and young professionals exchange knowledge, learn new skills, and collaborate together.
            </p>
            <div className="text-xs font-bold text-[#E36648]">
              Tagline: “Learn. Share. Exchange.”
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-[#E36648] uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/explore" className="hover:text-white transition-colors">Explore Skills</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/#skills" className="hover:text-white transition-colors">Skill Categories</Link></li>
              <li><Link href="/tech-stack" className="hover:text-white transition-colors">Technology Stack</Link></li>
            </ul>
          </div>

          {/* Platform Features */}
          <div>
            <h4 className="font-bold text-sm text-[#E36648] uppercase tracking-wider mb-4">Features</h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Reciprocal Matching</Link></li>
              <li><Link href="/messages" className="hover:text-white transition-colors">Real-Time Messaging</Link></li>
              <li><Link href="/exchanges" className="hover:text-white transition-colors">Exchange Workflow</Link></li>
              <li><Link href="/settings" className="hover:text-white transition-colors">Profile Security</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Tech Stack Summary */}
          <div>
            <h4 className="font-bold text-sm text-[#E36648] uppercase tracking-wider mb-4">Built With</h4>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Next.js 15 App Router, React, TypeScript, Tailwind CSS, Python FastAPI, PostgreSQL, JWT & WebSockets deployed on Vercel.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} SKILL X CHANGE. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#E36648] fill-[#E36648]" />
            <span>for learners worldwide.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
