import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Referral from '../models/Referral.js';
import User from '../models/User.js';

const router = express.Router();

// Get referral info
router.get('/', authenticateToken, async (req, res) => {
  try {
    let referral = await Referral.findOne({ referrerId: req.user.id })
      .populate('referredUsers.userId', 'firstName lastName email');

    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }

    res.json(referral);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Join via referral code
router.post('/join', authenticateToken, async (req, res) => {
  try {
    const { referralCode } = req.body;

    if (!referralCode) {
      return res.status(400).json({ message: 'Referral code required' });
    }

    const referral = await Referral.findOne({ referralCode });
    if (!referral) {
      return res.status(404).json({ message: 'Invalid referral code' });
    }

    // Check if user already referred
    const alreadyReferred = referral.referredUsers.some(
      (ref) => ref.userId.toString() === req.user.id
    );

    if (alreadyReferred) {
      return res.status(400).json({ message: 'Already referred by this code' });
    }

    referral.referredUsers.push({ userId: req.user.id });
    referral.totalReferrals += 1;
    await referral.save();

    res.json({ message: 'Joined via referral', referral });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
