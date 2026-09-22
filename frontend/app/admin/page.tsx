"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { fetchApi } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { Shield, Users, Repeat, CheckCircle, AlertTriangle, UserCheck, UserX } from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAdminData = () => {
    Promise.all([
      fetchApi("/admin/stats"),
      fetchApi("/admin/users"),
    ])
      .then(([statsData, usersData]) => {
        setStats(statsData);
        setUsersList(usersData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await fetchApi(`/admin/users/${userId}/toggle-status`, { method: "PUT" });
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Failed to toggle status");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
          <Shield className="w-16 h-16 text-[#E36648] mb-4" />
          <h2 className="text-2xl font-black text-[#161F30] mb-2">Access Denied</h2>
          <p className="text-xs text-gray-500 mb-6">Administrator privileges are required to view this console.</p>
          <Link href="/dashboard" className="px-6 py-3 bg-[#2E1A5E] text-white font-bold rounded-xl text-xs">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#E36648]" />
              <h1 className="text-3xl font-extrabold text-[#161F30]">Admin Console</h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">Platform metrics, user management, and moderation.</p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-10">
            <div className="p-4 rounded-2xl bg-white border border-[#2E1A5E]/10 shadow-sm text-center">
              <div className="text-2xl font-black text-[#2E1A5E]">{stats.total_users}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">Total Users</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#2E1A5E]/10 shadow-sm text-center">
              <div className="text-2xl font-black text-emerald-600">{stats.active_users}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">Active Users</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#2E1A5E]/10 shadow-sm text-center">
              <div className="text-2xl font-black text-[#E36648]">{stats.total_skills}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">Skills Listed</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#2E1A5E]/10 shadow-sm text-center">
              <div className="text-2xl font-black text-indigo-600">{stats.active_exchanges}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">Active Exchanges</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#2E1A5E]/10 shadow-sm text-center">
              <div className="text-2xl font-black text-emerald-600">{stats.completed_exchanges}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">Completed</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#2E1A5E]/10 shadow-sm text-center">
              <div className="text-2xl font-black text-amber-600">{stats.pending_requests}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">Pending Reqs</div>
            </div>
          </div>
        )}

        {/* User Management Table */}
        <div className="p-6 rounded-3xl bg-white border border-[#2E1A5E]/10 shadow-lg">
          <h3 className="text-lg font-extrabold text-[#161F30] mb-4">User Management</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-black uppercase text-gray-400">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-semibold">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FFF8F0]/50">
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-[#161F30]">{u.full_name}</div>
                        <div className="text-[11px] text-gray-400">@{u.username} • {u.email}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        u.role === "admin" ? "bg-[#E36648] text-white" : "bg-[#2E1A5E]/10 text-[#2E1A5E]"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        u.is_active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}>
                        {u.is_active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.id !== user.id && (
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                            u.is_active
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          }`}
                        >
                          {u.is_active ? "Disable Account" : "Enable Account"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
