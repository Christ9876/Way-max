"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiCopy, FiShare2, FiUsers } from "react-icons/fi";

interface ReferralData {
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  referredUsers: any[];
}

export default function TeamPage() {
  const [referral, setReferral] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchReferral = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/referrals`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReferral(response.data);
      } catch (error) {
        console.error("Failed to fetch referral", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferral();
  }, []);

  const handleCopyLink = () => {
    if (referral) {
      const link = `${window.location.origin}/register?ref=${referral.referralCode}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (referral) {
      const link = `${window.location.origin}/register?ref=${referral.referralCode}`;
      if (navigator.share) {
        navigator.share({
          title: "Join Index3dex",
          text: "Start your investment journey with Index3dex",
          url: link,
        });
      }
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
      <h1 className="text-3xl font-bold mb-6">My Team & Referrals</h1>

      {/* Referral Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Referrals</p>
              <p className="text-3xl font-bold gold-text">{referral?.totalReferrals || 0}</p>
            </div>
            <FiUsers className="text-4xl text-gold-accent opacity-20" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Referral Earnings</p>
              <p className="text-3xl font-bold text-green-400">₦{(referral?.totalEarnings || 0).toLocaleString()}</p>
            </div>
            <div className="text-4xl text-green-400 opacity-20">💰</div>
          </div>
        </div>
      </motion.div>

      {/* Referral Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
      >
        <h3 className="text-lg font-bold mb-4 gold-text">Your Referral Link</h3>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={`${window.location.origin}/register?ref=${referral?.referralCode}`}
            className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300"
          />
          <button
            onClick={handleCopyLink}
            className="btn btn-secondary flex items-center gap-2 whitespace-nowrap"
          >
            <FiCopy /> {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <button
          onClick={handleShare}
          className="w-full btn btn-primary mt-3 flex items-center justify-center gap-2"
        >
          <FiShare2 /> Share Referral Link
        </button>
      </motion.div>

      {/* Referral Code */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6 text-center"
      >
        <p className="text-gray-400 text-sm mb-2">Your Referral Code</p>
        <p className="text-3xl font-bold gold-text tracking-widest">{referral?.referralCode}</p>
      </motion.div>

      {/* Referred Users */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-bold mb-4">Referred Users</h3>
        {referral?.referredUsers.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-400">No referrals yet. Start sharing your link!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {referral?.referredUsers.map((user, idx) => (
              <motion.div
                key={user.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{user.firstName} {user.lastName}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
                <p className="text-gold-accent font-semibold">
                  {new Date(user.joinDate).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
