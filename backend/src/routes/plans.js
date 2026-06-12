import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';
import Plan from '../models/Plan.js';

const router = express.Router();

// Get all active plans
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ amount: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single plan
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create plan (admin only)
router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { name, amount, duration, dailyReturn, totalReturn, description } = req.body;

    const plan = new Plan({
      name,
      amount,
      duration,
      dailyReturn,
      totalReturn,
      description
    });

    await plan.save();
    res.status(201).json({ message: 'Plan created', plan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update plan (admin only)
router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json({ message: 'Plan updated', plan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
