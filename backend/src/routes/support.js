import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import SupportTicket from '../models/SupportTicket.js';

const router = express.Router();

// Create support ticket
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { subject, message, category } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message required' });
    }

    const ticket = new SupportTicket({
      userId: req.user.id,
      subject,
      message,
      category: category || 'general'
    });

    await ticket.save();
    res.status(201).json({ message: 'Support ticket created', ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's tickets
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get ticket details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add reply to ticket
router.post('/:id/reply', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message required' });
    }

    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          replies: {
            sender: 'user',
            message
          }
        },
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ message: 'Reply added', ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
