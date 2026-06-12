import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Investment from '../models/Investment.js';
import Plan from '../models/Plan.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// Get user's active investments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user.id })
      .populate('planId')
      .sort({ createdAt: -1 });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Purchase a plan
router.post('/purchase', authenticateToken, async (req, res) => {
  try {
    const { planId } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet || wallet.availableBalance < plan.amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct from wallet
    wallet.availableBalance -= plan.amount;
    wallet.investedAmount += plan.amount;
    wallet.updatedAt = Date.now();
    await wallet.save();

    // Create investment
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (plan.duration || 30));

    const investment = new Investment({
      userId: req.user.id,
      planId: plan._id,
      amount: plan.amount,
      endDate,
      dailyReturn: (plan.amount * plan.dailyReturn) / 100,
      totalProjectedReturn: plan.totalReturn
    });

    await investment.save();

    // Create transaction record
    const transaction = new Transaction({
      userId: req.user.id,
      type: 'investment',
      amount: plan.amount,
      description: `Investment in ${plan.name}`,
      status: 'completed',
      reference: investment._id
    });

    await transaction.save();

    res.status(201).json({
      message: 'Investment created successfully',
      investment,
      wallet
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get investment details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id)
      .populate('planId')
      .populate('userId');

    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    res.json(investment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
