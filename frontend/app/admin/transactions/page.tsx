"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";

interface Transaction {
  _id: string;
  userId: any;
  type: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "deposits" | "withdrawals">("pending");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/transactions/pending`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
        alert("You must be an admin to access this page");
        window.location.href = "/dashboard";
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleApprove = async (transactionId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/transactions/${transactionId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTransactions(transactions.filter((t) => t._id !== transactionId));
      alert("Transaction approved!");
    } catch (error) {
      alert("Failed to approve transaction");
    }
  };

  const handleReject = async (transactionId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/transactions/${transactionId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTransactions(transactions.filter((t) => t._id !== transactionId));
      alert("Transaction rejected!");
    } catch (error) {
      alert("Failed to reject transaction");
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
      className="min-h-screen bg-gradient-to-b from-black to-gray-900 px-4 py-6 pb-24"
    >
      <h1 className="text-3xl font-bold mb-6 gold-text">Transaction Management</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { value: "pending", label: `Pending (${transactions.filter(t => t.status === "pending").length})` },
          { value: "deposits", label: "Deposits" },
          { value: "withdrawals", label: "Withdrawals" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as any)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition ${
              filter === tab.value
                ? "bg-gold-accent text-black"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        {transactions.filter(t => 
          filter === "pending" ? t.status === "pending" :
          filter === "deposits" ? t.type === "deposit" :
          filter === "withdrawals" ? t.type === "withdrawal" : true
        ).length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-400">No transactions to display</p>
          </div>
        ) : (
          transactions
            .filter(t => 
              filter === "pending" ? t.status === "pending" :
              filter === "deposits" ? t.type === "deposit" :
              filter === "withdrawals" ? t.type === "withdrawal" : true
            )
            .map((transaction) => (
              <motion.div
                key={transaction._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">
                      {transaction.type === "deposit" ? "Deposit Request" : "Withdrawal Request"}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {transaction.userId?.firstName} {transaction.userId?.lastName}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">{transaction.userId?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold gold-text">₦{transaction.amount.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-4">{transaction.description}</p>

                {transaction.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(transaction._id)}
                      className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                    >
                      <FiCheckCircle /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(transaction._id)}
                      className="flex-1 btn btn-secondary flex items-center justify-center gap-2"
                    >
                      <FiXCircle /> Reject
                    </button>
                  </div>
                )}
              </motion.div>
            ))
        )}
      </motion.div>
    </motion.div>
  );
}
