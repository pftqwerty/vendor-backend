const express = require('express');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get all notifications for the logged-in vendor
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ vendorId: req.vendorId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
});

// Mark notifications as read
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error });
  }
});

module.exports = router;
