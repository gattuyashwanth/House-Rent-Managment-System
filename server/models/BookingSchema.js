const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: [true, 'Tenant name is required'],
    },
    phone: {
      type: String,
      required: [true, 'Tenant phone number is required'],
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required'],
      default: Date.now,
    },
    bookingStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
