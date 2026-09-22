"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { fetchApi } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { Repeat, CheckCircle2, MessageSquare, Star, Clock, AlertCircle } from "lucide-react";

export default function ExchangesPage() {
  const { user } = useAuth();
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "COMPLETED">("ACTIVE");
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [targetExchange, setTargetExchange] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    fetchExchanges();
  }, [user]);

  const fetchExchanges = () => {
    setLoading(true);
    fetchApi("/exchanges")
      .then((data) => {
        setExchanges(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleCompleteExchange = async (exchangeId: string) => {
    try {
      await fetchApi(`/exchanges/${exchangeId}/complete`, { method: "POST" });
      fetchExchanges();
    } catch (err: any) {
      alert(err.message || "Failed to complete exchange");
    }
  };

  const handleOpenReviewModal = (ex: any) => {
    setTargetExchange(ex);
    setRating(5);
    setReviewText("Great skill exchange session! Very helpful and clear explanations.");
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!targetExchange) return;
    setReviewSubmitting(true);

    try {
      await fetchApi("/reviews", {
        method: "POST",
        body: JSON.stringify({
          exchange_id: targetExchange.id,
          reviewed_user_id: targetExchange.partner_id,
          rating,
          review: reviewText,
        }),
      });
      alert("Review submitted successfully! ⭐");
      setReviewModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Could not submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const filtered = exchanges.filter((e) => e.status === activeTab);

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#161F30]">Skill Exchanges</h1>
            <p className="text-xs text-gray-500 mt-1">Manage your active learning pairs & completed exchanges.</p>
          </div>

          {/* Tabs Toggle */}
          <div className="flex bg-white p-1 rounded-2xl border border-[#2E1A5E]/10 shadow-xs">
            <button
              onClick={() => setActiveTab("ACTIVE")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "ACTIVE"
                  ? "bg-[#2E1A5E] text-[#FFF8F0] shadow-sm"
                  : "text-gray-500 hover:text-[#161F30]"
              }`}
            >
              Active ({exchanges.filter((e) => e.status === "ACTIVE").length})
            </button>
            <button
              onClick={() => setActiveTab("COMPLETED")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "COMPLETED"
                  ? "bg-[#E36648] text-[#FFF8F0] shadow-sm"
                  : "text-gray-500 hover:text-[#161F30]"
              }`}
            >
              Completed ({exchanges.filter((e) => e.status === "COMPLETED").length})
            </button>
          </div>
        </div>

        {/* Exchange List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="p-6 rounded-3xl bg-white border animate-pulse h-32" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((ex) => (
              <div
                key={ex.id}
                className="p-6 rounded-3xl bg-white border border-[#2E1A5E]/10 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={ex.partner_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(ex.partner_name)}&background=2E1A5E&color=fff`}
                    alt={ex.partner_name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#2E1A5E]"
                  />
                  <div>
                    <h3 className="font-extrabold text-[#161F30] text-base">{ex.partner_name}</h3>
                    <p className="text-xs text-[#E36648] font-bold">@{ex.partner_username}</p>

                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                      <span className="px-2.5 py-0.5 bg-[#2E1A5E] text-white font-semibold rounded-md">
                        Teaching: {ex.skill_teaching?.name || "Skill"}
                      </span>
                      <span className="text-gray-400">↔</span>
                      <span className="px-2.5 py-0.5 bg-[#E36648] text-white font-semibold rounded-md">
                        Learning: {ex.skill_learning?.name || "Skill"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Link
                    href="/messages"
                    className="px-4 py-2.5 bg-[#2E1A5E]/10 text-[#2E1A5E] font-bold text-xs rounded-xl hover:bg-[#2E1A5E]/20 transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </Link>

                  {ex.status === "ACTIVE" ? (
                    <button
                      onClick={() => handleCompleteExchange(ex.id)}
                      className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark Completed
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenReviewModal(ex)}
                      className="px-5 py-2.5 bg-[#E36648] text-white font-bold text-xs rounded-xl hover:opacity-90 shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Star className="w-4 h-4 fill-white" />
                      Leave Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-white border text-center text-gray-500">
            No {activeTab.toLowerCase()} exchanges found. Start connecting on the Explore page!
          </div>
        )}
      </main>

      {/* Review Rating Modal */}
      {reviewModalOpen && targetExchange && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-[#2E1A5E]/20 shadow-2xl space-y-4">
            <h3 className="text-xl font-extrabold text-[#161F30]">
              Leave a Review for {targetExchange.partner_name}
            </h3>
            <p className="text-xs text-gray-500">
              Share your feedback on the skill exchange session.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#161F30] mb-2">Rating (1 to 5 Stars)</label>
              <div className="flex gap-2 text-2xl">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className={s <= rating ? "text-amber-500" : "text-gray-300"}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#161F30] mb-1">Your Review</label>
              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-3 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setReviewModalOpen(false)}
                className="flex-1 py-3 text-xs font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                disabled={reviewSubmitting}
                onClick={handleSubmitReview}
                className="flex-1 py-3 text-xs font-bold text-white bg-[#E36648] rounded-xl hover:opacity-90"
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
