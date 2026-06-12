import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Wallet from '../models/Wallet.js';

const router = express.Router();

// Get user wallet
router.get('/', authenticateToken, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user.id });
    
    if (!wallet) {
      wallet = new Wallet({ userId: req.user.id });
      await wallet.save();
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update wallet balance
router.put('/update-balance', authenticateToken, async (req, res) => {
  try {
    const { amount, type } = req.body; // type: 'add' or 'subtract'

    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      wallet = new Wallet({ userId: req.user.id });
    }

    if (type === 'add') {
      wallet.balance += amount;
      wallet.availableBalance += amount;
    } else if (type === 'subtract') {
      if (wallet.availableBalance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      wallet.balance -= amount;
      wallet.availableBalance -= amount;
    }

    wallet.updatedAt = Date.now();
    await wallet.save();

    res.json({ message: 'Wallet updated', wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add investment amount to wallet
router.put('/add-investment', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;

    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    wallet.investedAmount += amount;
    wallet.updatedAt = Date.now();
    await wallet.save();

    res.json({ message: 'Investment amount added', wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
