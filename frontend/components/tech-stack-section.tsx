import React from "react";
import { Code2, Server, Database, KeyRound, Zap, Rocket } from "lucide-react";

export const TechStackSection: React.FC = () => {
  const stackItems = [
    {
      layer: "Frontend",
      tech: "React / Next.js",
      desc: "App Router, TypeScript & Tailwind CSS",
      icon: Code2,
      color: "from-blue-600 to-cyan-500",
    },
    {
      layer: "API",
      tech: "Python / FastAPI",
      desc: "High-performance async REST API",
      icon: Server,
      color: "from-emerald-600 to-teal-500",
    },
    {
      layer: "Database",
      tech: "PostgreSQL",
      desc: "Relational tables with UUIDs & indexes",
      icon: Database,
      color: "from-indigo-600 to-purple-600",
    },
    {
      layer: "Authentication",
      tech: "JWT Authentication",
      desc: "Secure bcrypt hashing & bearer tokens",
      icon: KeyRound,
      color: "from-amber-500 to-[#E36648]",
    },
    {
      layer: "Real-Time",
      tech: "WebSocket / Socket.IO",
      desc: "Instant live chat & typing events",
      icon: Zap,
      color: "from-purple-600 to-[#2E1A5E]",
    },
    {
      layer: "Deployment",
      tech: "Vercel",
      desc: "Automated production cloud deployment",
      icon: Rocket,
      color: "from-[#2E1A5E] to-[#E36648]",
    },
  ];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-black tracking-widest text-[#E36648] uppercase bg-[#E36648]/10 px-4 py-1.5 rounded-full">
          Production Architecture
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#161F30] mt-4 mb-4">
          Powered by a Modern Technology Stack
        </h2>
        <p className="text-gray-600 text-base md:text-lg">
          Engineered for extreme performance, security, real-time messaging, and scale.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stackItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-[#2E1A5E]/10 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#E36648]">
                    {item.layer}
                  </span>
                  <h4 className="text-lg font-bold text-[#161F30]">{item.tech}</h4>
                </div>
              </div>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
