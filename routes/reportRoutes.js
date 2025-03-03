const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get Sales Reports (Daily, Weekly, Monthly)
router.get('/sales', authMiddleware, async (req, res) => {
  try {
    const { period } = req.query; // "daily", "weekly", "monthly"
    let startDate;

    if (period === 'daily') {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'weekly') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'monthly') {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      return res.status(400).json({ message: 'Invalid period' });
    }

    const orders = await Order.find({ createdAt: { $gte: startDate } });
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    res.json({ period, totalSales, totalOrders: orders.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales reports', error });
  }
});

// Get Most Ordered Items
router.get('/top-items', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find();
    const itemCounts = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        if (!itemCounts[item.name]) {
          itemCounts[item.name] = item.quantity;
        } else {
          itemCounts[item.name] += item.quantity;
        }
      });
    });

    const sortedItems = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.json(sortedItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top items', error });
  }
});

module.exports = router;
