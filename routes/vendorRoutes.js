const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Vendor = require('../models/vendorModel'); // Import the Vendor model
const authMiddleware = require('../middleware/authMiddleware'); // Protect routes
const router = express.Router();

// Vendor Signup
router.post('/signup', async (req, res) => {
  const { businessName, email, password } = req.body;

  try {
    // Check if the vendor already exists by email
    let vendor = await Vendor.findOne({ email });
    if (vendor) {
      return res.status(400).json({ message: 'Vendor already exists' });
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new vendor instance
    vendor = new Vendor({
      businessName,
      email,
      password: hashedPassword,
      contactNumber: '',
      businessHours: '',
      holidayMode: false,
    });

    // Save the new vendor to the database
    await vendor.save();

    // Send a success response
    res.status(201).json({ message: 'Vendor registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error signing up. Please try again.', error: error.message });
  }
});

// Vendor Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the vendor exists
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify if the password matches
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token for the vendor
    const token = jwt.sign({ vendorId: vendor._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send back the token and vendor details
    res.json({ token, vendor: { id: vendor._id, businessName: vendor.businessName, email: vendor.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get Vendor Profile (Protected Route)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // Fetch vendor profile details without the password
    const vendor = await Vendor.findById(req.vendorId).select('-password');
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update Vendor Profile (Protected Route)
router.put('/profile', authMiddleware, async (req, res) => {
  const { businessName, contactNumber, businessHours, holidayMode } = req.body;

  try {
    // Update the vendor's profile information
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.vendorId,
      { businessName, contactNumber, businessHours, holidayMode },
      { new: true, select: '-password' } // Don't return the password in the response
    );

    // If no vendor was found and updated
    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json(updatedVendor);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

module.exports = router;
