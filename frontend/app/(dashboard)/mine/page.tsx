"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiLogOut, FiUser, FiEdit2, FiDollarSign, FiMessageSquare } from "react-icons/fi";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface WalletData {
  balance: number;
  availableBalance: number;
  investedAmount: number;
  totalEarnings: number;
}

export default function MinePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserData>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setFormData(userData);
        }

        const walletResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/wallets`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWallet(walletResponse.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile");
    }
  };

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
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      {/* Wallet Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <div className="card">
          <p className="text-gray-400 text-xs mb-1">Total Balance</p>
          <p className="text-2xl font-bold gold-text">₦{wallet?.balance.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-xs mb-1">Available</p>
          <p className="text-2xl font-bold text-green-400">₦{wallet?.availableBalance.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-xs mb-1">Invested</p>
          <p className="text-2xl font-bold">₦{wallet?.investedAmount.toLocaleString()}</p>
        </div>
        <div className="card">
          <p className="text-gray-400 text-xs mb-1">Earnings</p>
          <p className="text-2xl font-bold text-purple-400">₦{wallet?.totalEarnings.toLocaleString()}</p>
        </div>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FiUser className="text-gold-accent" /> Profile Information
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-gold-accent flex items-center gap-1 text-sm"
          >
            <FiEdit2 /> {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.firstName || ""}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gold-accent rounded-lg bg-gray-900"
                />
              ) : (
                <p className="font-semibold">{user?.firstName}</p>
              )}
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.lastName || ""}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-gold-accent rounded-lg bg-gray-900"
                />
              ) : (
                <p className="font-semibold">{user?.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Email</label>
            <p className="font-semibold text-gray-300">{user?.email}</p>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1 block">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter phone number"
                className="w-full px-3 py-2 border border-gold-accent rounded-lg bg-gray-900"
              />
            ) : (
              <p className="font-semibold text-gray-300">{user?.phone || "Not provided"}</p>
            )}
          </div>

          {isEditing && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">City</label>
                <input
                  type="text"
                  value={formData.city || ""}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                  className="w-full px-3 py-2 border border-gold-accent rounded-lg bg-gray-900"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">State</label>
                <input
                  type="text"
                  value={formData.state || ""}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                  className="w-full px-3 py-2 border border-gold-accent rounded-lg bg-gray-900"
                />
              </div>
            </div>
          )}

          {isEditing && (
            <button
              onClick={handleUpdateProfile}
              className="w-full btn btn-primary mt-4"
            >
              Save Changes
            </button>
          )}
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3 mb-6"
      >
        <a href="/deposit" className="card flex items-center gap-3 hover:border-gold-accent">
          <FiDollarSign className="text-gold-accent text-xl" />
          <span>Deposit Funds</span>
        </a>
        <a href="/withdraw" className="card flex items-center gap-3 hover:border-gold-accent">
          <FiDollarSign className="text-green-400 text-xl" />
          <span>Withdraw Funds</span>
        </a>
        <a href="/support" className="card flex items-center gap-3 hover:border-gold-accent">
          <FiMessageSquare className="text-blue-400 text-xl" />
          <span>Contact Support</span>
        </a>
      </motion.div>

      {/* Logout Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={handleLogout}
        className="w-full btn btn-secondary flex items-center justify-center gap-2"
      >
        <FiLogOut /> Logout
      </motion.button>
    </motion.div>
  );
}
