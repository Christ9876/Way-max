"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiDollarSign, FiArrowDown, FiCheckCircle } from "react-icons/fi";

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/transactions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions(response.data.filter((t: Transaction) => t.type === "deposit"));
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };

    fetchTransactions();
  }, []);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/deposit`,
        { amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Deposit request submitted! Admin will review and approve.");
      setAmount("");

      // Refresh transactions
      const updatedResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTransactions(updatedResponse.data.filter((t: Transaction) => t.type === "deposit"));
    } catch (error: any) {
      alert(error.response?.data?.message || "Deposit request failed");
    } finally {
      setLoading(false);
    }
  };

  const predefinedAmounts = [1000, 5000, 10000, 50000, 100000];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-black to-gray-900 px-4 py-6 pb-24"
    >
      <h1 className="text-3xl font-bold mb-6">Deposit Funds</h1>

      {/* Deposit Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
      >
        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Deposit Amount (₦)</label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-3 text-gold-accent" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg bg-gray-900 focus:border-gold-accent focus:outline-none text-lg"
              />
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-xs mb-2">Quick Amounts</p>
            <div className="grid grid-cols-3 gap-2">
              {predefinedAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt.toString())}
                  className="py-2 px-3 rounded-lg bg-gray-800 hover:bg-gold-accent hover:text-black transition text-sm font-semibold"
                >
                  ₦{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !amount}
            className="w-full btn btn-primary disabled:opacity-50"
          >
            {loading ? "Processing..." : "Request Deposit"}
          </button>
        </form>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-bold mb-4">Recent Deposits</h3>
        {transactions.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-400">No deposits yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx._id} className="card flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-900 bg-opacity-30 rounded-lg">
                    <FiArrowDown className="text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Deposit Request</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">+₦{tx.amount.toLocaleString()}</p>
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
