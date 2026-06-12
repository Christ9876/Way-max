import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';
import Plan from '../models/Plan.js';

const router = express.Router();

// Get all pending transactions (admin only)
router.get('/transactions/pending', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find({ status: 'pending' })
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve deposit
router.post('/transactions/:id/approve', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction || transaction.type !== 'deposit') {
      return res.status(404).json({ message: 'Deposit not found' });
    }

    // Update transaction
    transaction.status = 'completed';
    transaction.updatedAt = Date.now();
    await transaction.save();

    // Update wallet
    const wallet = await Wallet.findOne({ userId: transaction.userId });
    if (wallet) {
      wallet.balance += transaction.amount;
      wallet.availableBalance += transaction.amount;
      wallet.updatedAt = Date.now();
      await wallet.save();
    }

    res.json({ message: 'Deposit approved', transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject deposit
router.post('/transactions/:id/reject', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.status = 'rejected';
    transaction.updatedAt = Date.now();
    await transaction.save();

    res.json({ message: 'Transaction rejected', transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get system analytics
router.get('/analytics', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    const pendingTransactions = await Transaction.countDocuments({ status: 'pending' });
    const completedTransactions = await Transaction.countDocuments({ status: 'completed' });

    const totalDeposits = await Transaction.aggregate([
      { $match: { type: 'deposit', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalWithdrawals = await Transaction.aggregate([
      { $match: { type: 'withdrawal', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalUsers,
      totalTransactions,
      pendingTransactions,
      completedTransactions,
      totalDeposits: totalDeposits[0]?.total || 0,
      totalWithdrawals: totalWithdrawals[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
