const express = require('express');
const MenuItem = require('../models/MenuItem');
const authMiddleware = require('../middleware/authMiddleware'); // Protect routes
const router = express.Router();

// Add a Menu Item (Protected Route)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, price, category, image } = req.body;
    const newItem = new MenuItem({ vendorId: req.vendorId, name, price, category, image });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding menu item', error });
  }
});

// Get All Menu Items for Vendor (Protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ vendorId: req.vendorId });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items', error });
  }
});

// Update Menu Item (Protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item', error });
  }
});

// Delete Menu Item (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error });
  }
});

module.exports = router;
