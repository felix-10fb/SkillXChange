import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TechStackSection } from "@/components/tech-stack-section";
import { CheckCircle2, ShieldCheck, Rocket } from "lucide-react";

export default function TechStackPage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-black tracking-widest text-[#E36648] uppercase bg-[#E36648]/10 px-4 py-1.5 rounded-full">
            System Architecture Reference
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#161F30] mt-4 mb-4">
            Skill X Change Tech Stack
          </h1>
          <p className="text-gray-600 text-base">
            Detailed breakdown of our production architecture, frontend framework, FastAPI matching engine, real-time WebSocket communication, and Vercel deployment.
          </p>
        </div>

        <TechStackSection />

        <div className="mt-12 p-8 rounded-3xl bg-white border border-[#2E1A5E]/10 shadow-lg max-w-4xl mx-auto">
          <h3 className="text-xl font-extrabold text-[#161F30] mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#E36648]" />
            Vercel Deployment Architecture
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed mb-4">
            The frontend application is optimized and compiled for seamless static generation and edge delivery on <strong>Vercel</strong>. The FastAPI backend exposes REST endpoints and persistent WebSockets for real-time peer communication.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-[#161F30]">
            <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#2E1A5E]/10 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Frontend → Deployed on Vercel Edge Network</span>
            </div>
            <div className="p-3 bg-[#FFF8F0] rounded-xl border border-[#2E1A5E]/10 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Backend → FastAPI & PostgreSQL Engine</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
