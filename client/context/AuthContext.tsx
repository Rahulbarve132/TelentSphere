"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  _id: string;
  id?: string;
  email: string;
  role: "developer" | "client" | "recruiter" | "admin";
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      
      if (response.data.success) {
        setUser(response.data.data.user);
      } else {
        localStorage.removeItem("accessToken");
        setUser(null);
      }
    } catch (error: any) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem("accessToken", token);
    setUser(userData);
    toast.success("Logged in successfully");
    
    // Redirect based on role or to dashboard
    if (userData.role === 'developer') {
        router.push('/dashboard/applications');
    } else if (userData.role === 'client' || userData.role === 'recruiter') {
        router.push('/dashboard/jobs');
    } else {
        router.push('/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
