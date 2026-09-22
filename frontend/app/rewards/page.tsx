"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { fetchApi } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, Flame, Coins, ShoppingBag, CheckCircle2, History, Zap, ShieldCheck, Award } from "lucide-react";

export default function RewardsPage() {
  const { user, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [claiming, setClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState("");
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchApi("/wallet/transactions")
        .then((txs) => setTransactions(txs))
        .catch(() => {});
    }
  }, [user]);

  const handleClaimDaily = async () => {
    setClaiming(true);
    setClaimSuccess("");
    try {
      const res = await fetchApi("/wallet/checkin", { method: "POST" });
      await refreshUser();
      setClaimSuccess(`🎉 Claimed +${res.claimed_amount} Skillcoins! 🔥 Daily Streak: ${res.streak_count} Days!`);
      const updatedTxs = await fetchApi("/wallet/transactions");
      setTransactions(updatedTxs);
    } catch (err: any) {
      alert(err.message || "Could not claim check-in");
    } finally {
      setClaiming(false);
    }
  };

  const handleRedeem = async (item: { id: string; cost: number; title: string }) => {
    if (!user || user.skillcoins < item.cost) {
      alert(`Insufficient Skillcoins! You need 🪙 ${item.cost} SKC to redeem ${item.title}.`);
      return;
    }

    setRedeeming(item.id);
    try {
      const res = await fetchApi("/wallet/redeem", {
        method: "POST",
        body: JSON.stringify({ item_id: item.id, cost: item.cost, title: item.title }),
      });
      await refreshUser();
      alert(`🎉 Successfully redeemed ${item.title}!`);
      const updatedTxs = await fetchApi("/wallet/transactions");
      setTransactions(updatedTxs);
    } catch (err: any) {
      alert(err.message || "Redemption failed");
    } finally {
      setRedeeming(null);
    }
  };

  const rewardItems = [
    {
      id: "boost",
      title: "Featured Profile Boost",
      cost: 200,
      desc: "Pins your profile to the top of Explore search results for 7 days to get 3x more exchange requests.",
      icon: Zap,
      color: "bg-amber-500",
    },
    {
      id: "tutor_badge",
      title: "Verified Master Tutor Badge",
      cost: 350,
      desc: "Unlocks the official ⭐ Verified Master Tutor badge on your public profile and user cards.",
      icon: Award,
      color: "bg-[#E36648]",
    },
    {
      id: "priority_pass",
      title: "Priority Match Pass",
      cost: 150,
      desc: "Receive instant high-priority notifications when reciprocal skill candidates register.",
      icon: Sparkles,
      color: "bg-[#2E1A5E]",
    },
    {
      id: "expert_badge",
      title: "Premier Exchanger Title",
      cost: 500,
      desc: "Unlocks the 🚀 Premier Exchanger title and VIP badge on your profile.",
      icon: ShieldCheck,
      color: "bg-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Wallet & Streak Header */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#2E1A5E] via-[#291A53] to-[#E36648] text-[#FFF8F0] shadow-xl mb-10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-3xl shadow-inner">
                🪙
              </div>
              <div>
                <span className="text-xs font-black uppercase text-amber-300 tracking-wider">Skillcoin Wallet</span>
                <h1 className="text-3xl sm:text-4xl font-black">
                  {user?.skillcoins || 500} <span className="text-xl font-bold text-amber-200">SKC</span>
                </h1>
                <p className="text-xs text-gray-200 mt-1 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-[#E36648] fill-[#E36648]" />
                  Daily Streak: <strong className="text-white">{user?.streak_count || 1} Days</strong>
                </p>
              </div>
            </div>

            {/* Daily Claim Bonus Button */}
            <div className="text-center md:text-right">
              <button
                disabled={claiming}
                onClick={handleClaimDaily}
                className="px-6 py-3.5 bg-amber-400 text-[#161F30] font-black text-xs rounded-2xl hover:bg-amber-300 shadow-lg transition-all flex items-center gap-2 mx-auto md:ml-auto"
              >
                <Flame className="w-4 h-4 text-orange-600 fill-orange-600 animate-bounce" />
                {claiming ? "Claiming..." : "Claim Daily Bonus (+25 SKC)"}
              </button>
              {claimSuccess && (
                <p className="text-xs font-bold text-amber-200 mt-2">{claimSuccess}</p>
              )}
            </div>
          </div>
        </div>

        {/* Marketplace Section */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="w-6 h-6 text-[#E36648]" />
            <h2 className="text-2xl font-extrabold text-[#161F30]">Skillcoin Rewards Marketplace</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewardItems.map((item) => {
              const Icon = item.icon;
              const canAfford = (user?.skillcoins || 0) >= item.cost;
              return (
                <div
                  key={item.id}
                  className="p-6 rounded-3xl bg-white border border-[#2E1A5E]/10 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl ${item.color} text-white flex items-center justify-center mb-4 shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="font-extrabold text-[#161F30] text-base mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 mb-4">{item.desc}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between py-3 border-t border-gray-100 mb-4">
                      <span className="text-xs font-bold text-gray-400">Cost</span>
                      <span className="text-base font-black text-amber-600 flex items-center gap-1">
                        🪙 {item.cost} SKC
                      </span>
                    </div>

                    <button
                      disabled={!canAfford || redeeming === item.id}
                      onClick={() => handleRedeem(item)}
                      className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${
                        canAfford
                          ? "bg-[#2E1A5E] text-[#FFF8F0] hover:bg-[#291A53] shadow-md"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {redeeming === item.id ? "Redeeming..." : canAfford ? "Redeem Reward" : "Need More Skillcoins"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Transaction History Log */}
        <section className="p-6 rounded-3xl bg-white border border-[#2E1A5E]/10 shadow-lg">
          <h3 className="text-lg font-extrabold text-[#161F30] mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-[#2E1A5E]" />
            Transaction History
          </h3>

          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div key={tx.id} className="p-3.5 rounded-2xl bg-[#FFF8F0] border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#161F30]">{tx.description}</p>
                    <span className="text-[10px] text-gray-400">{new Date(tx.created_at).toLocaleString()}</span>
                  </div>
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${
                    tx.amount > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}>
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount} SKC
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic">No transactions recorded yet.</p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
