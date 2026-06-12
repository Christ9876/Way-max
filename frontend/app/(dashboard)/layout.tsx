"use client";

import React, { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import axios from "axios";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-accent"></div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
