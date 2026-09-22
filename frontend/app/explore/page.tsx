"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { fetchApi } from "@/lib/api-client";
import { Search, Filter, Sparkles, CheckCircle2, UserCheck, BookOpen } from "lucide-react";

export default function ExplorePage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedExp, setSelectedExp] = useState("");
  const [selectedAvail, setSelectedAvail] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/skills/categories")
      .then((cats) => setCategories(cats))
      .catch(() => {});

    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    let queryParams = new URLSearchParams();
    if (searchQuery) queryParams.append("query", searchQuery);
    if (selectedCategory) queryParams.append("category", selectedCategory);
    if (selectedExp) queryParams.append("experience", selectedExp);
    if (selectedAvail) queryParams.append("availability", selectedAvail);

    fetchApi(`/users/explore?${queryParams.toString()}`)
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#161F30] tracking-tight mb-4">
            Explore Skill Exchangers
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Discover passionate learners and creators who want to swap knowledge with you.
          </p>
        </div>

        {/* Search & Multi-Filter Controls */}
        <div className="p-6 rounded-3xl bg-white border border-[#2E1A5E]/10 shadow-lg mb-10 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by skill (Python, UI/UX, Figma), username, or keyword..."
                className="w-full pl-12 pr-4 py-3 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-2xl text-sm focus:outline-none focus:border-[#2E1A5E]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#2E1A5E] text-[#FFF8F0] font-bold text-sm rounded-2xl hover:bg-[#291A53] shadow-md transition-all"
            >
              Search
            </button>
          </form>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); fetchUsers(); }}
                className="w-full p-2.5 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-xl text-xs font-semibold text-[#161F30]"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Experience Level</label>
              <select
                value={selectedExp}
                onChange={(e) => { setSelectedExp(e.target.value); fetchUsers(); }}
                className="w-full p-2.5 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-xl text-xs font-semibold text-[#161F30]"
              >
                <option value="">Any Experience Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Availability</label>
              <select
                value={selectedAvail}
                onChange={(e) => { setSelectedAvail(e.target.value); fetchUsers(); }}
                className="w-full p-2.5 bg-[#FFF8F0] border border-[#2E1A5E]/15 rounded-xl text-xs font-semibold text-[#161F30]"
              >
                <option value="">Any Availability</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Weekends">Weekends</option>
                <option value="Evenings">Evenings</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>
        </div>

        {/* User Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-3xl bg-white animate-pulse h-64 border" />
            ))}
          </div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-6 rounded-3xl bg-white border border-[#2E1A5E]/10 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.full_name)}&background=2E1A5E&color=fff`}
                      alt={u.full_name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#2E1A5E]"
                    />
                    <div>
                      <h3 className="font-extrabold text-[#161F30] text-base">{u.full_name}</h3>
                      <p className="text-xs text-[#E36648] font-semibold">@{u.username}</p>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        ⭐ {u.rating} ({u.reviews_count} reviews)
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-4 line-clamp-2">{u.bio}</p>

                  <div className="space-y-2 text-xs mb-4">
                    <div>
                      <span className="font-extrabold text-[#2E1A5E] uppercase text-[10px] block mb-1">Teaches:</span>
                      <div className="flex flex-wrap gap-1">
                        {u.teach_skills?.map((s: any) => (
                          <span key={s.id} className="px-2 py-0.5 text-[10px] font-bold bg-[#2E1A5E] text-[#FFF8F0] rounded-md">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-extrabold text-[#E36648] uppercase text-[10px] block mb-1">Wants to Learn:</span>
                      <div className="flex flex-wrap gap-1">
                        {u.learn_skills?.map((s: any) => (
                          <span key={s.id} className="px-2 py-0.5 text-[10px] font-bold bg-[#E36648] text-[#FFF8F0] rounded-md">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <Link
                    href={`/profile/${u.username}`}
                    className="w-full py-2.5 bg-[#2E1A5E] text-[#FFF8F0] font-bold text-xs rounded-xl hover:bg-[#291A53] transition-colors block text-center shadow-sm"
                  >
                    View Full Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-white border text-center text-gray-500">
            No users matched your search criteria. Try adjusting filters or search query!
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
