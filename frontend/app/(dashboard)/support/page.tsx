"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FiSend, FiMessage, FiCheckCircle } from "react-icons/fi";

interface SupportTicket {
  _id: string;
  subject: string;
  message: string;
  status: string;
  replies: any[];
  createdAt: string;
}

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/support`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTickets(response.data);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/support`,
        { subject, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTickets([response.data.ticket, ...tickets]);
      setSubject("");
      setMessage("");
      alert("Support ticket submitted successfully!");
    } catch (error) {
      alert("Failed to submit ticket");
    } finally {
      setSubmitting(false);
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
      <h1 className="text-3xl font-bold mb-6">Support Center</h1>

      {/* Submit Ticket Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FiMessage className="text-gold-accent" /> Create Support Ticket
        </h2>

        <form onSubmit={handleSubmitTicket} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Withdrawal not approved"
              required
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 focus:border-gold-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue in detail..."
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 focus:border-gold-accent focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FiSend /> {submitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </motion.div>

      {/* Support Tickets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold mb-4">Your Tickets</h2>
        {tickets.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-400">No tickets yet. Submit one above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedTicket(selectedTicket === ticket._id ? null : ticket._id)}
                className="card cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{ticket.subject}</h3>
                    <p className="text-gray-400 text-sm mb-2">{ticket.message}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      ticket.status === "resolved"
                        ? "bg-green-900 bg-opacity-30 text-green-400"
                        : ticket.status === "in-progress"
                        ? "bg-blue-900 bg-opacity-30 text-blue-400"
                        : "bg-yellow-900 bg-opacity-30 text-yellow-400"
                    }`}
                  >
                    {ticket.status.toUpperCase()}
                  </p>
                </div>

                {selectedTicket === ticket._id && ticket.replies.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-4 border-t border-gray-700"
                  >
                    {ticket.replies.map((reply, idx) => (
                      <div key={idx} className="mb-2 p-2 bg-gray-800 rounded-lg">
                        <p className="text-xs text-gold-accent font-bold mb-1">
                          {reply.sender === "admin" ? "Admin" : "You"}
                        </p>
                        <p className="text-gray-300 text-sm">{reply.message}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
