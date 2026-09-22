"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { fetchApi } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { Bell, CheckCircle2, Sparkles, MessageSquare, Star, Repeat } from "lucide-react";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = () => {
    fetchApi("/notifications")
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleMarkAllRead = async () => {
    await fetchApi("/notifications/read-all", { method: "PUT" });
    fetchNotifications();
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#161F30]">Notifications</h1>
            <p className="text-xs text-gray-500 mt-1">Updates on matches, exchange requests, and messages.</p>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 bg-[#2E1A5E]/10 text-[#2E1A5E] font-bold text-xs rounded-xl hover:bg-[#2E1A5E]/20 transition-colors"
          >
            Mark All as Read
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-2xl bg-white border animate-pulse h-16" />
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  !n.read
                    ? "bg-white border-[#E36648]/40 shadow-sm"
                    : "bg-[#FFF8F0] border-gray-100 opacity-80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2E1A5E] text-[#FFF8F0] flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#161F30]">{n.message}</p>
                    <span className="text-[10px] text-gray-400">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!n.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E36648] shrink-0" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-white border text-center text-gray-400 text-xs">
            No notifications yet.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
