"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiUsers, FiDollarSign, FiTrendingUp, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

interface AdminStats {
  totalUsers: number;
  totalTransactions: number;
  pendingTransactions: number;
  completedTransactions: number;
  totalDeposits: number;
  totalWithdrawals: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        window.location.href = "/login";
        return;
      }

      const userData = JSON.parse(storedUser);
      if (userData.role !== "admin") {
        window.location.href = "/dashboard";
        return;
      }

      setUser(userData);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/analytics`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-accent"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-black to-gray-900 px-4 py-6"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Welcome, {user?.firstName}!</p>
      </div>

      {/* Key Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold gold-text">{stats?.totalUsers}</p>
            </div>
            <FiUsers className="text-4xl text-gold-accent opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Pending Requests</p>
              <p className="text-3xl font-bold text-yellow-400">{stats?.pendingTransactions}</p>
            </div>
            <FiTrendingUp className="text-4xl text-yellow-400 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Deposits</p>
              <p className="text-3xl font-bold text-green-400">₦{(stats?.totalDeposits || 0).toLocaleString()}</p>
            </div>
            <FiDollarSign className="text-4xl text-green-400 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Withdrawals</p>
              <p className="text-3xl font-bold text-red-400">₦{(stats?.totalWithdrawals || 0).toLocaleString()}</p>
            </div>
            <FiDollarSign className="text-4xl text-red-400 opacity-20" />
          </div>
        </div>
      </motion.div>

      {/* Admin Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <h2 className="text-xl font-bold mb-4">Admin Functions</h2>

        <Link
          href="/admin/transactions"
          className="card flex items-center justify-between hover:border-gold-accent transition"
        >
          <div>
            <p className="font-bold">Manage Transactions</p>
            <p className="text-gray-400 text-sm">Approve/Reject deposits & withdrawals</p>
          </div>
          <FiArrowRight className="text-gold-accent" />
        </Link>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          className="w-full btn btn-secondary"
        >
          Logout
        </button>
      </motion.div>
    </motion.div>
  );
}
