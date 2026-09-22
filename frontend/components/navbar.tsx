"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { useAuth } from "@/lib/auth-context";
import { fetchApi } from "@/lib/api-client";
import { Bell, MessageSquare, Repeat, User, LogOut, Shield, Menu, X, Sparkles, Flame, Coins, ShoppingBag } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    if (user) {
      fetchApi("/notifications")
        .then((data) => {
          if (Array.isArray(data)) {
            setUnreadNotifs(data.filter((n: any) => !n.read).length);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "Rewards", href: "/rewards" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Tech Stack", href: "/tech-stack" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFF8F0]/90 backdrop-blur-md border-b border-[#2E1A5E]/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo size="md" />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  isActive ? "text-[#E36648]" : "text-[#161F30]/80 hover:text-[#2E1A5E]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              {/* Skillcoin Balance Pill */}
              <Link
                href="/rewards"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400/15 border border-amber-400/40 text-amber-700 text-xs font-black rounded-full hover:bg-amber-400/25 transition-all shadow-xs"
                title="Skillcoin Balance"
              >
                <span>🪙</span>
                <span>{user.skillcoins ?? 500} SKC</span>
              </Link>

              {/* Daily Streak Counter */}
              <div
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#E36648]/10 text-[#E36648] text-xs font-black rounded-full"
                title="Daily Streak Counter"
              >
                <Flame className="w-3.5 h-3.5 fill-[#E36648]" />
                <span>{user.streak_count ?? 1}d</span>
              </div>

              {/* Notifications Icon with Badge */}
              <Link
                href="/notifications"
                className="relative p-2 text-[#2E1A5E] hover:bg-[#2E1A5E]/5 rounded-xl transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#E36648] text-[#FFF8F0] text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifs}
                  </span>
                )}
              </Link>

              {/* Messages Link */}
              <Link
                href="/messages"
                className="p-2 text-[#2E1A5E] hover:bg-[#2E1A5E]/5 rounded-xl transition-colors"
                title="Messages"
              >
                <MessageSquare className="w-4 h-4" />
              </Link>

              {/* Exchanges Link */}
              <Link
                href="/exchanges"
                className="p-2 text-[#2E1A5E] hover:bg-[#2E1A5E]/5 rounded-xl transition-colors"
                title="My Exchanges"
              >
                <Repeat className="w-4 h-4" />
              </Link>

              {/* Admin Link */}
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="p-2 text-[#E36648] hover:bg-[#E36648]/10 rounded-xl font-bold text-xs flex items-center gap-1"
                  title="Admin Dashboard"
                >
                  <Shield className="w-4 h-4" />
                </Link>
              )}

              {/* User Dashboard Profile Button */}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-[#2E1A5E] text-[#FFF8F0] rounded-full hover:bg-[#291A53] transition-all shadow-sm"
              >
                <img
                  src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=E36648&color=fff`}
                  alt={user.full_name}
                  className="w-6 h-6 rounded-full object-cover border border-[#FFF8F0]/30"
                />
                <span className="text-xs font-semibold">{user.username}</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2.5 text-sm font-bold text-[#2E1A5E] hover:text-[#E36648] transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 text-sm font-bold text-[#FFF8F0] bg-gradient-to-r from-[#2E1A5E] to-[#E36648] rounded-xl hover:opacity-95 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                Get Started
                <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#2E1A5E] rounded-lg focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFF8F0] border-b border-[#2E1A5E]/10 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-semibold text-[#161F30] hover:text-[#E36648]"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-[#2E1A5E]/10 flex flex-col gap-3">
            {user ? (
              <>
                <div className="flex items-center justify-between px-3 py-2 bg-white rounded-xl">
                  <span className="text-xs font-bold text-[#161F30]">🪙 {user.skillcoins} SKC</span>
                  <span className="text-xs font-bold text-[#E36648]">🔥 {user.streak_count}d Streak</span>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-bold text-white bg-[#2E1A5E] rounded-xl"
                >
                  Dashboard ({user.username})
                </Link>
                <button
                  onClick={logout}
                  className="w-full py-2 text-center text-sm font-bold text-red-600 bg-red-50 rounded-xl"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-bold text-[#2E1A5E] border border-[#2E1A5E]/20 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-bold text-white bg-gradient-to-r from-[#2E1A5E] to-[#E36648] rounded-xl"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
