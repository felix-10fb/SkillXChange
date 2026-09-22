"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth-context";
import { fetchApi } from "@/lib/api-client";
import { Sparkles, ArrowLeftRight, CheckCircle2, BookOpen, Clock, UserCheck, MessageSquare, Plus, ExternalLink, Repeat } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [selectedTeachId, setSelectedTeachId] = useState("");
  const [selectedLearnId, setSelectedLearnId] = useState("");
  const [requestSending, setRequestSending] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchApi("/matches").catch(() => []),
        fetchApi("/exchanges").catch(() => []),
      ]).then(([matchesData, exchangesData]) => {
        setMatches(matchesData);
        setExchanges(exchangesData);
        setLoading(false);
      });
    }
  }, [user]);

  const handleOpenRequestModal = (match: any) => {
    setSelectedMatch(match);
    if (user?.teach_skills?.length) setSelectedTeachId(user.teach_skills[0].id);
    if (match.teach_skills?.length) setSelectedLearnId(match.teach_skills[0].id);
    setRequestMessage(`Hi ${match.full_name}! I noticed your skills on Skill X Change and would love to exchange knowledge with you!`);
    setRequestSuccess(false);
    setRequestModalOpen(true);
  };

  const handleSendExchangeRequest = async () => {
    if (!selectedMatch || !selectedTeachId || !selectedLearnId) return;
    setRequestSending(true);

    try {
      await fetchApi("/exchange-requests", {
        method: "POST",
        body: JSON.stringify({
          receiver_id: selectedMatch.user_id,
          teach_skill_id: selectedTeachId,
          learn_skill_id: selectedLearnId,
          message: requestMessage,
        }),
      });
      setRequestSuccess(true);
      setTimeout(() => {
        setRequestModalOpen(false);
      }, 2000);
    } catch (err: any) {
      alert(err.message || "Could not send exchange request");
    } finally {
      setRequestSending(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col justify-center items-center p-4">
        <p className="text-gray-600 mb-4 font-semibold">Please log in to access your dashboard.</p>
        <Link href="/login" className="px-6 py-3 bg-[#2E1A5E] text-[#FFF8F0] font-bold rounded-xl">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#2E1A5E] to-[#291A53] text-[#FFF8F0] shadow-xl border border-[#E36648]/20 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#E36648]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=E36648&color=fff`}
                alt={user.full_name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#E36648]"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome back, {user.full_name}! 👋
                </h1>
                <p className="text-xs text-gray-300 mt-1">
                  Experience: <span className="font-bold text-[#E36648]">{user.experience_level}</span> • Availability: <span className="font-bold text-[#FFF8F0]">{user.availability}</span>
                </p>
              </div>
            </div>

            <Link
              href="/explore"
              className="px-6 py-3 bg-[#E36648] text-[#FFF8F0] font-bold text-xs rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-md shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              Explore New Skills
            </Link>
          </div>
        </div>

        {/* Dashboard Grid Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Skills I Teach */}
          <div className="p-6 rounded-3xl bg-white border border-[#2E1A5E]/10 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#2E1A5E]">Skills I Teach</h3>
              <BookOpen className="w-4 h-4 text-[#2E1A5E]" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {user.teach_skills?.length > 0 ? (
                user.teach_skills.map((s) => (
                  <span key={s.id} className="px-2.5 py-1 text-xs font-semibold bg-[#2E1A5E] text-[#FFF8F0] rounded-lg">
                    {s.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400 italic">No skills listed yet</span>
              )}
            </div>
          </div>

          {/* Skills I Want */}
          <div className="p-6 rounded-3xl bg-white border border-[#E36648]/20 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#E36648]">Skills I Want</h3>
              <Sparkles className="w-4 h-4 text-[#E36648]" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {user.learn_skills?.length > 0 ? (
                user.learn_skills.map((s) => (
                  <span key={s.id} className="px-2.5 py-1 text-xs font-semibold bg-[#E36648] text-[#FFF8F0] rounded-lg">
                    {s.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400 italic">No skills listed yet</span>
              )}
            </div>
          </div>

          {/* Active Exchanges */}
          <div className="p-6 rounded-3xl bg-white border border-[#2E1A5E]/10 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">Active Exchanges</h3>
              <Repeat className="w-4 h-4 text-[#2E1A5E]" />
            </div>
            <div className="text-3xl font-black text-[#2E1A5E]">
              {exchanges.filter((e) => e.status === "ACTIVE").length}
            </div>
            <Link href="/exchanges" className="text-[11px] font-bold text-[#E36648] hover:underline mt-2 block">
              Manage Exchanges →
            </Link>
          </div>

          {/* Completed Exchanges */}
          <div className="p-6 rounded-3xl bg-white border border-[#2E1A5E]/10 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-700">Exchanges Done</h3>
              <UserCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-600">
              {user.exchanges_completed || 0}
            </div>
            <span className="text-[11px] text-gray-400 mt-2 block">Rating: ⭐ {user.rating} / 5</span>
          </div>
        </div>

        {/* Recommended Reciprocal Matches Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-[#161F30]">Recommended Reciprocal Matches</h2>
              <p className="text-xs text-gray-500 mt-1">Calculated in real-time by FastAPI algorithm based on your reciprocal skills.</p>
            </div>
            <span className="text-xs font-bold bg-[#E36648]/10 text-[#E36648] px-3 py-1 rounded-full">
              {matches.length} Candidates Found
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="p-6 rounded-3xl bg-white border border-gray-100 animate-pulse h-48" />
              ))}
            </div>
          ) : matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matches.map((match) => (
                <div
                  key={match.user_id}
                  className="p-6 rounded-3xl bg-white border border-[#2E1A5E]/10 shadow-lg hover:shadow-xl transition-all duration-300 relative group flex flex-col justify-between"
                >
                  <div>
                    {/* Header with Match % Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={match.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.full_name)}&background=2E1A5E&color=fff`}
                          alt={match.full_name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#2E1A5E]"
                        />
                        <div>
                          <h4 className="font-bold text-[#161F30] text-base">{match.full_name}</h4>
                          <p className="text-xs text-gray-500">@{match.username}</p>
                        </div>
                      </div>

                      {/* Compatibility Percentage Badge */}
                      <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#2E1A5E] to-[#E36648] text-white text-xs font-extrabold shadow-sm">
                        {match.compatibility_score}% MATCH
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 mb-4 line-clamp-2">{match.bio}</p>

                    {/* Skill Tags */}
                    <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#FFF8F0] mb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#2E1A5E] block mb-1">Teaches:</span>
                        <div className="flex flex-wrap gap-1">
                          {match.teach_skills?.map((s: any) => (
                            <span key={s.id} className="px-2 py-0.5 text-[10px] font-bold bg-[#2E1A5E] text-[#FFF8F0] rounded-md">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#E36648] block mb-1">Wants:</span>
                        <div className="flex flex-wrap gap-1">
                          {match.learn_skills?.map((s: any) => (
                            <span key={s.id} className="px-2 py-0.5 text-[10px] font-bold bg-[#E36648] text-[#FFF8F0] rounded-md">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-500 italic mb-4">💡 {match.reason}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <Link
                      href={`/profile/${match.username}`}
                      className="flex-1 py-2.5 text-center text-xs font-bold text-[#2E1A5E] border border-[#2E1A5E]/20 rounded-xl hover:bg-[#2E1A5E]/5 transition-colors"
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => handleOpenRequestModal(match)}
                      className="flex-1 py-2.5 text-center text-xs font-bold text-[#FFF8F0] bg-[#E36648] rounded-xl hover:opacity-90 shadow-sm transition-all"
                    >
                      Request Exchange
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border text-center text-gray-500">
              No matching profiles found yet. Add more skills in your profile settings!
            </div>
          )}
        </section>
      </main>

      {/* Exchange Request Modal */}
      {requestModalOpen && selectedMatch && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-[#2E1A5E]/20 shadow-2xl space-y-4">
            <h3 className="text-xl font-extrabold text-[#161F30]">
              SKILL EXCHANGE REQUEST
            </h3>
            <p className="text-xs text-gray-500">
              Propose a skill exchange with <span className="font-bold text-[#2E1A5E]">{selectedMatch.full_name}</span>.
            </p>

            {requestSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-800 text-center font-bold text-sm">
                ✅ Exchange request sent successfully!
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#161F30] mb-1">Skill You Will Teach</label>
                    <select
                      value={selectedTeachId}
                      onChange={(e) => setSelectedTeachId(e.target.value)}
                      className="w-full p-3 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-xl text-xs font-bold text-[#161F30]"
                    >
                      {user.teach_skills?.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#161F30] mb-1">Skill You Want to Learn from {selectedMatch.full_name}</label>
                    <select
                      value={selectedLearnId}
                      onChange={(e) => setSelectedLearnId(e.target.value)}
                      className="w-full p-3 bg-[#FFF8F0] border border-[#E36648]/20 rounded-xl text-xs font-bold text-[#161F30]"
                    >
                      {selectedMatch.teach_skills?.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#161F30] mb-1">Personal Message</label>
                    <textarea
                      rows={3}
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      className="w-full p-3 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    onClick={() => setRequestModalOpen(false)}
                    className="flex-1 py-3 text-xs font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={requestSending}
                    onClick={handleSendExchangeRequest}
                    className="flex-1 py-3 text-xs font-bold text-white bg-[#E36648] rounded-xl hover:opacity-90"
                  >
                    {requestSending ? "Sending..." : "Send Exchange Request"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
