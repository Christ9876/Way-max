"use client";

import { useState, useEffect } from "react";
import { FiDollarSign, FiTrendingUp, FiWallet, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";

interface WalletData {
  balance: number;
  availableBalance: number;
  investedAmount: number;
  totalEarnings: number;
}

export default function DashboardPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        
        if (userData) {
          setUser(JSON.parse(userData));
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/wallets`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setWallet(response.data);
      } catch (error) {
        console.error("Failed to fetch wallet", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-accent"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-b from-black to-gray-900 px-4 py-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Welcome back,</h1>
        <p className="text-gold-accent text-lg font-semibold">
          {user?.firstName} {user?.lastName}
        </p>
      </motion.div>

      {/* Wallet Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Total Balance</p>
              <p className="text-2xl font-bold gold-text">₦{wallet?.balance.toLocaleString()}</p>
            </div>
            <FiWallet className="text-4xl text-gold-accent opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Available</p>
              <p className="text-2xl font-bold text-green-400">₦{wallet?.availableBalance.toLocaleString()}</p>
            </div>
            <FiDollarSign className="text-4xl text-green-400 opacity-20" />
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Invested</p>
              <p className="text-2xl font-bold">₦{wallet?.investedAmount.toLocaleString()}</p>
            </div>
            <FiTrendingUp className="text-4xl text-blue-400 opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Earnings</p>
              <p className="text-2xl font-bold text-purple-400">₦{wallet?.totalEarnings.toLocaleString()}</p>
            </div>
            <FiTrendingUp className="text-4xl text-purple-400 opacity-20" />
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <motion.a
            href="/deposit"
            whileHover={{ scale: 1.02 }}
            className="btn btn-primary flex items-center justify-center gap-2"
          >
            <FiDollarSign /> Deposit
          </motion.a>
          <motion.a
            href="/withdraw"
            whileHover={{ scale: 1.02 }}
            className="btn btn-secondary flex items-center justify-center gap-2"
          >
            <FiArrowRight /> Withdraw
          </motion.a>
          <motion.a
            href="/team"
            whileHover={{ scale: 1.02 }}
            className="btn btn-secondary flex items-center justify-center gap-2 col-span-2"
          >
            <FiArrowRight /> Invite & Earn
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
}
