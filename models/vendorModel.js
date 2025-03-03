const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String },
  businessHours: { type: String },
  holidayMode: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Vendor', VendorSchema);
