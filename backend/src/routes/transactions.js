import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';

const router = express.Router();

// Get user's transactions
router.get('/', authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Request deposit
router.post('/deposit', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const transaction = new Transaction({
      userId: req.user.id,
      type: 'deposit',
      amount,
      description: 'Deposit request',
      status: 'pending'
    });

    await transaction.save();
    res.status(201).json({ message: 'Deposit request submitted', transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Request withdrawal
router.post('/withdrawal', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;

    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet || wallet.availableBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const transaction = new Transaction({
      userId: req.user.id,
      type: 'withdrawal',
      amount,
      description: 'Withdrawal request',
      status: 'pending'
    });

    await transaction.save();
    res.status(201).json({ message: 'Withdrawal request submitted', transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all transactions (admin only)
router.get('/all', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
