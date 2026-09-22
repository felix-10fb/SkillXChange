"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { fetchApi } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { Star, MessageSquare, Repeat, CheckCircle2, Clock, GraduationCap, Award, User, ShieldCheck } from "lucide-react";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      fetchApi(`/users/${username}`)
        .then((data) => {
          setProfile(data);
          fetchApi(`/reviews/user/${data.user_id}`)
            .then((revs) => setReviews(revs))
            .catch(() => {});
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-gray-500 font-bold">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
          <h2 className="text-2xl font-bold text-[#161F30] mb-2">User Not Found</h2>
          <p className="text-xs text-gray-500 mb-4">The profile @{username} does not exist or has been removed.</p>
          <Link href="/explore" className="px-6 py-2.5 bg-[#2E1A5E] text-[#FFF8F0] font-bold rounded-xl text-xs">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile Header Card */}
        <div className="p-8 rounded-3xl bg-white border border-[#2E1A5E]/10 shadow-xl mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <img
                src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=2E1A5E&color=fff`}
                alt={profile.full_name}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#2E1A5E] shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161F30]">{profile.full_name}</h1>
                  {profile.role === "admin" && (
                    <span className="px-2 py-0.5 rounded-md bg-[#E36648] text-white text-[10px] font-extrabold">ADMIN</span>
                  )}
                </div>
                <p className="text-xs text-[#E36648] font-bold">@{profile.username}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <span>⭐ <strong className="text-[#161F30]">{profile.rating}</strong> ({profile.reviews_count} reviews)</span>
                  <span>🏆 <strong className="text-[#2E1A5E]">{profile.exchanges_completed}</strong> Exchanges Completed</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {currentUser && currentUser.username !== profile.username && (
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Link
                  href="/dashboard"
                  className="flex-1 md:flex-initial px-6 py-3 bg-[#E36648] text-[#FFF8F0] font-bold text-xs rounded-xl hover:opacity-90 shadow-md flex items-center justify-center gap-2"
                >
                  <Repeat className="w-4 h-4" />
                  Request Skill Exchange
                </Link>
                <Link
                  href="/messages"
                  className="px-4 py-3 bg-[#2E1A5E] text-[#FFF8F0] font-bold text-xs rounded-xl hover:bg-[#291A53] shadow-md flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Message
                </Link>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-700 mt-6 pt-6 border-t border-gray-100 leading-relaxed">
            {profile.bio || "No bio provided."}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Skills Taught */}
          <div className="p-6 rounded-3xl bg-white border border-[#2E1A5E]/10 shadow-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#2E1A5E] mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#E36648]" />
              Skills {profile.full_name.split(" ")[0]} Can Teach
            </h3>
            <div className="space-y-2">
              {profile.teach_skills?.map((s: any) => (
                <div key={s.id} className="p-3 rounded-xl bg-[#FFF8F0] border border-[#2E1A5E]/10 flex items-center justify-between">
                  <span className="font-bold text-xs text-[#161F30]">{s.name}</span>
                  <span className="text-[10px] font-bold bg-[#2E1A5E] text-white px-2 py-0.5 rounded-md">{s.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Wanted */}
          <div className="p-6 rounded-3xl bg-white border border-[#E36648]/20 shadow-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#E36648] mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#2E1A5E]" />
              Skills {profile.full_name.split(" ")[0]} Wants to Learn
            </h3>
            <div className="space-y-2">
              {profile.learn_skills?.map((s: any) => (
                <div key={s.id} className="p-3 rounded-xl bg-[#FFF8F0] border border-[#E36648]/20 flex items-center justify-between">
                  <span className="font-bold text-xs text-[#161F30]">{s.name}</span>
                  <span className="text-[10px] font-bold bg-[#E36648] text-white px-2 py-0.5 rounded-md">{s.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews & Testimonials Section */}
        <div className="p-6 rounded-3xl bg-white border border-[#2E1A5E]/10 shadow-md">
          <h3 className="text-lg font-extrabold text-[#161F30] mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            Reviews & Exchange Feedback ({reviews.length})
          </h3>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-[#FFF8F0] border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={r.reviewer_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.reviewer_name)}&background=2E1A5E&color=fff`}
                        alt={r.reviewer_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-bold text-xs text-[#161F30]">{r.reviewer_name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      {"★".repeat(r.rating)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 italic">&ldquo;{r.review}&rdquo;</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">No reviews submitted yet.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
