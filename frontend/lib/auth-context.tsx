"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchApi } from "./api-client";

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  username: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  experience_level: string;
  availability: string;
  rating: number;
  reviews_count: number;
  exchanges_completed: number;
  role: string;
  skillcoins: number;
  streak_count: number;
  is_featured?: boolean;
  badge_title?: string;
  teach_skills: Array<{ id: string; name: string; category: string }>;
  learn_skills: Array<{ id: string; name: string; category: string }>;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (credentials: { email_or_username: string; password: string }) => Promise<void>;
  adminLogin: (credentials: { admin_key: string; email_or_username: string; password: string }) => Promise<void>;
  register: (data: { full_name: string; username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const data = await fetchApi("/users/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(data);
    } catch (err) {
      console.warn("Could not fetch user profile:", err);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { email_or_username: string; password: string }) => {
    const data = await fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
    await fetchUser(data.access_token);
  };

  const adminLogin = async (credentials: { admin_key: string; email_or_username: string; password: string }) => {
    const data = await fetchApi("/auth/admin-login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
    await fetchUser(data.access_token);
  };

  const register = async (userData: { full_name: string; username: string; email: string; password: string }) => {
    const data = await fetchApi("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    localStorage.setItem("token", data.access_token);
    setToken(data.access_token);
    await fetchUser(data.access_token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  const refreshUser = async () => {
    if (token) {
      await fetchUser(token);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, adminLogin, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
