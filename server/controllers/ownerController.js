const User = require('../models/UserSchema');
const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');

// Helper to check if owner is approved
const checkOwnerApproved = async (ownerId) => {
  const user = await User.findById(ownerId);
  return user && user.status === 'Approved';
};

// @desc    Add a new property listing
// @route   POST /api/owner/properties
// @access  Private (Owner only)
exports.addProperty = async (req, res) => {
  try {
    const isApproved = await checkOwnerApproved(req.user._id);
    if (!isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval. You cannot list properties yet.',
      });
    }

    const {
      title,
      description,
      address,
      location,
      rentAmount,
      propertyType,
      bedrooms,
      bathrooms,
      propertySize,
      furnishingStatus,
      amenities,
      ownerContact,
    } = req.body;

    if (
      !title ||
      !description ||
      !address ||
      !location ||
      !rentAmount ||
      !propertyType ||
      !bedrooms ||
      !bathrooms ||
      !propertySize ||
      !ownerContact
    ) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Process uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    } else {
      // Default placeholder if no image uploaded
      images = ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'];
    }

    let parsedAmenities = [];
    if (amenities) {
      parsedAmenities = Array.isArray(amenities)
        ? amenities
        : amenities.split(',').map((a) => a.trim());
    }

    const property = await Property.create({
      ownerId: req.user._id,
      title,
      description,
      address,
      location,
      rentAmount: Number(rentAmount),
      propertyType,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      propertySize: Number(propertySize),
      furnishingStatus: furnishingStatus || 'Unfurnished',
      amenities: parsedAmenities,
      images,
      ownerContact,
      availabilityStatus: 'Available',
    });

    res.status(201).json({ success: true, message: 'Property added successfully!', data: property });
  } catch (error) {
    console.error('Add property error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Edit a property listing
// @route   PUT /api/owner/properties/:id
// @access  Private (Owner only)
exports.editProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Check ownership
    if (property.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this property' });
    }

    const {
      title,
      description,
      address,
      location,
      rentAmount,
      propertyType,
      bedrooms,
      bathrooms,
      propertySize,
      furnishingStatus,
      amenities,
      ownerContact,
      availabilityStatus,
    } = req.body;

    if (title) property.title = title;
    if (description) property.description = description;
    if (address) property.address = address;
    if (location) property.location = location;
    if (rentAmount) property.rentAmount = Number(rentAmount);
    if (propertyType) property.propertyType = propertyType;
    if (bedrooms) property.bedrooms = Number(bedrooms);
    if (bathrooms) property.bathrooms = Number(bathrooms);
    if (propertySize) property.propertySize = Number(propertySize);
    if (furnishingStatus) property.furnishingStatus = furnishingStatus;
    if (ownerContact) property.ownerContact = ownerContact;
    if (availabilityStatus) property.availabilityStatus = availabilityStatus;

    if (amenities) {
      property.amenities = Array.isArray(amenities)
        ? amenities
        : amenities.split(',').map((a) => a.trim());
    }

    if (req.files && req.files.length > 0) {
      property.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    await property.save();

    res.json({ success: true, message: 'Property updated successfully!', data: property });
  } catch (error) {
    console.error('Edit property error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a property listing
// @route   DELETE /api/owner/properties/:id
// @access  Private (Owner only)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    // Also delete associated bookings
    await Booking.deleteMany({ propertyId: property._id });
    await property.deleteOne();

    res.json({ success: true, message: 'Property and associated bookings deleted successfully!' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Owner's property listings
// @route   GET /api/owner/properties
// @access  Private (Owner only)
exports.getOwnProperties = async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    console.error('Get own properties error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Owner's received booking requests
// @route   GET /api/owner/bookings
// @access  Private (Owner only)
exports.getOwnBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ ownerId: req.user._id })
      .populate('propertyId', 'title location rentAmount images availabilityStatus')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    console.error('Get own bookings error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve/Reject Booking Request
// @route   PUT /api/owner/bookings/:id
// @access  Private (Owner only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be Approved or Rejected' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage this booking' });
    }

    booking.bookingStatus = status;
    await booking.save();

    if (status === 'Approved') {
      await Property.findByIdAndUpdate(booking.propertyId, { availabilityStatus: 'Booked' });
      await Booking.updateMany(
        {
          _id: { $ne: booking._id },
          propertyId: booking.propertyId,
          bookingStatus: 'Pending',
        },
        { bookingStatus: 'Rejected' }
      );
    }

    res.json({ success: true, message: `Booking request ${status.toLowerCase()} successfully!`, data: booking });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
