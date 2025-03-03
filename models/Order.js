const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  customerName: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  pickupTime: { type: String, required: true },
  status: { type: String, enum: ['Received', 'Preparing', 'Ready for Pickup'], default: 'Received' },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
