"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiDollarSign, FiArrowUp, FiCheckCircle } from "react-icons/fi";

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface WalletData {
  availableBalance: number;
}

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const walletResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/wallets`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWallet(walletResponse.data);

        const txResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/transactions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions(txResponse.data.filter((t: Transaction) => t.type === "withdrawal"));
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/withdrawal`,
        { amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Withdrawal request submitted! Admin will review and process.");
      setAmount("");

      // Refresh transactions
      const updatedResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions(updatedResponse.data.filter((t: Transaction) => t.type === "withdrawal"));
    } catch (error: any) {
      alert(error.response?.data?.message || "Withdrawal request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-black to-gray-900 px-4 py-6 pb-24"
    >
      <h1 className="text-3xl font-bold mb-6">Withdraw Funds</h1>

      {/* Available Balance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
      >
        <p className="text-gray-400 text-sm mb-2">Available Balance</p>
        <p className="text-4xl font-bold gold-text">₦{wallet?.availableBalance.toLocaleString()}</p>
        <p className="text-gray-400 text-xs mt-2">Maximum withdrawal amount</p>
      </motion.div>

      {/* Withdrawal Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
      >
        <form onSubmit={handleWithdraw} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Withdrawal Amount (₦)</label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-3 text-gold-accent" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                max={wallet?.availableBalance}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg bg-gray-900 focus:border-gold-accent focus:outline-none text-lg"
              />
            </div>
            {amount && (
              <p className="text-gray-400 text-xs mt-2">
                {wallet && parseFloat(amount) <= wallet.availableBalance
                  ? "✓ Amount is valid"
                  : "✗ Exceeds available balance"}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !amount || (wallet && parseFloat(amount) > wallet.availableBalance)}
            className="w-full btn btn-primary disabled:opacity-50"
          >
            {loading ? "Processing..." : "Request Withdrawal"}
          </button>
        </form>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-bold mb-4">Recent Withdrawals</h3>
        {transactions.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-400">No withdrawals yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx._id} className="card flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-900 bg-opacity-30 rounded-lg">
                    <FiArrowUp className="text-red-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Withdrawal Request</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-400">-₦{tx.amount.toLocaleString()}</p>
                  <p
                    className={`text-xs font-semibold ${
                      tx.status === "completed"
                        ? "text-green-400"
                        : tx.status === "pending"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {tx.status.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
