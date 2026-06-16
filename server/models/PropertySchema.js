const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location/City is required'],
      trim: true,
    },
    rentAmount: {
      type: Number,
      required: [true, 'Rent amount is required'],
      min: 0,
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      enum: ['Apartment', 'Independent House', 'Villa', 'PG', 'Commercial Shop', 'Office Space', 'Hostel'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: 0,
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: 0,
    },
    propertySize: {
      type: Number,
      required: [true, 'Property size in sqft is required'],
      min: 0,
    },
    furnishingStatus: {
      type: String,
      required: [true, 'Furnishing status is required'],
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
      default: 'Unfurnished',
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    ownerContact: {
      type: String,
      required: [true, 'Owner contact phone is required'],
    },
    availabilityStatus: {
      type: String,
      enum: ['Available', 'Booked'],
      default: 'Available',
    },
  },
  { timestamps: true }
);

propertySchema.index({ location: 1, rentAmount: 1, propertyType: 1, availabilityStatus: 1 });

module.exports = mongoose.model('Property', propertySchema);
