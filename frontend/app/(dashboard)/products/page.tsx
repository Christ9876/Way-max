"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiTrendingUp, FiCalendar, FiCheckCircle } from "react-icons/fi";

interface Plan {
  _id: string;
  name: string;
  amount: number;
  duration: number;
  dailyReturn: number;
  totalReturn: number;
  description: string;
}

interface Investment {
  _id: string;
  planId: Plan;
  amount: number;
  startDate: string;
  endDate: string;
  status: string;
  earnedAmount: number;
}

export default function ProductsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [activeTab, setActiveTab] = useState<"available" | "active">("available");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch plans
        const plansResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/plans`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPlans(plansResponse.data);

        // Fetch investments
        const investmentsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/investments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInvestments(investmentsResponse.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePurchase = async (planId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/investments/purchase`,
        { planId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Investment purchased successfully!");
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data?.message || "Purchase failed");
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
      <h1 className="text-3xl font-bold mb-6">Investment Plans</h1>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("available")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "available"
              ? "bg-gold-accent text-black"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          Available Plans
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "active"
              ? "bg-gold-accent text-black"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          My Investments ({investments.filter(i => i.status === "active").length})
        </button>
      </div>

      {/* Available Plans */}
      {activeTab === "available" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {plans.map((plan, idx) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold gold-text">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">₦{plan.amount.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">Amount</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-900 p-3 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Daily Return</p>
                  <p className="font-bold text-green-400">{plan.dailyReturn}%</p>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Duration</p>
                  <p className="font-bold">{plan.duration} days</p>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Total Return</p>
                  <p className="font-bold text-purple-400">₦{plan.totalReturn.toLocaleString()}</p>
                </div>
              </div>

              <button
                onClick={() => handlePurchase(plan._id)}
                className="w-full btn btn-primary"
              >
                Buy / Activate Plan
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Active Investments */}
      {activeTab === "active" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {investments.filter(i => i.status === "active").length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-400 mb-4">No active investments yet</p>
              <button
                onClick={() => setActiveTab("available")}
                className="btn btn-primary inline-block"
              >
                Start Investing
              </button>
            </div>
          ) : (
            investments
              .filter(i => i.status === "active")
              .map((investment) => (
                <motion.div
                  key={investment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold gold-text">
                        {investment.planId.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <FiCalendar />
                        Start: {new Date(investment.startDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">₦{investment.amount.toLocaleString()}</p>
                      <p className="text-green-400 flex items-center justify-end gap-1 mt-1">
                        <FiCheckCircle className="text-sm" /> Active
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-900 p-3 rounded-lg mb-4">
                    <p className="text-gray-400 text-xs mb-2">Progress</p>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gold-accent h-2 rounded-full"
                        style={{
                          width: `${
                            ((new Date().getTime() - new Date(investment.startDate).getTime()) /
                              (new Date(investment.endDate).getTime() - new Date(investment.startDate).getTime())) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">Earned</p>
                      <p className="font-bold text-green-400">₦{investment.earnedAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">End Date</p>
                      <p className="font-bold">{new Date(investment.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </motion.div>
              ))
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
