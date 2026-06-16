const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');
const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'house_rent_secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a new user (Renter or Owner)
// @route   POST /api/user/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (!['Owner', 'Renter'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Must be Owner or Renter' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
      status: role === 'Owner' ? 'Pending' : 'Approved'
    });

    res.status(201).json({
      success: true,
      message: role === 'Owner' ? 'Registration successful! Waiting for admin approval.' : 'Registration successful!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/user/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password Reset
// @route   POST /api/user/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email, phone, newPassword } = req.body;

    if (!email || !phone || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please fill in all fields' });
    }

    const user = await User.findOne({ email, phone });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with matching email and phone' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully!' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Current User Profile
// @route   GET /api/user/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Current User Profile
// @route   PUT /api/user/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = email;
    }

    if (password && password.length >= 6) {
      user.password = password;
    }

    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Approved and Available Properties
// @route   GET /api/user/properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, propertyType, bedrooms, bathrooms, furnishingStatus, amenities, availabilityStatus, search } = req.query;
    const query = { availabilityStatus: availabilityStatus || 'Available' };

    if (location) query.location = { $regex: location, $options: 'i' };
    if (propertyType) query.propertyType = propertyType;
    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (bathrooms) query.bathrooms = Number(bathrooms);
    if (furnishingStatus) query.furnishingStatus = furnishingStatus;

    if (minPrice || maxPrice) {
      query.rentAmount = {};
      if (minPrice) query.rentAmount.$gte = Number(minPrice);
      if (maxPrice) query.rentAmount.$lte = Number(maxPrice);
    }

    if (amenities) {
      const amenitiesArr = Array.isArray(amenities) ? amenities : amenities.split(',');
      query.amenities = { $all: amenitiesArr };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Only get properties of approved owners
    const approvedOwners = await User.find({ role: 'Owner', status: 'Approved' }).select('_id');
    const approvedOwnerIds = approvedOwners.map(o => o._id);
    query.ownerId = { $in: approvedOwnerIds };

    const properties = await Property.find(query)
      .populate('ownerId', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Single Property Details
// @route   GET /api/user/properties/:id
// @access  Public
exports.getPropertyDetails = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('ownerId', 'name email phone profileImage status');
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    res.json({ success: true, data: property });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Booking Request
// @route   POST /api/user/bookings
// @access  Private (Renter only)
exports.createBooking = async (req, res) => {
  try {
    const { propertyId, bookingDate } = req.body;

    if (!propertyId) {
      return res.status(400).json({ success: false, message: 'Property ID is required' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.availabilityStatus !== 'Available') {
      return res.status(400).json({ success: false, message: 'Property is not available for booking' });
    }

    const owner = await User.findById(property.ownerId);
    if (!owner || owner.status !== 'Approved') {
      return res.status(400).json({ success: false, message: 'Listing owner is not approved by admin' });
    }

    const booking = await Booking.create({
      propertyId,
      ownerId: property.ownerId,
      userId: req.user._id,
      userName: req.user.name,
      phone: req.user.phone,
      bookingDate: bookingDate || new Date(),
      bookingStatus: 'Pending',
    });

    res.status(201).json({ success: true, message: 'Booking request sent successfully!', data: booking });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Booking History
// @route   GET /api/user/bookings
// @access  Private (Renter only)
exports.getBookingHistory = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate({
        path: 'propertyId',
        select: 'title location rentAmount propertyType images address availabilityStatus'
      })
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    console.error('Get booking history error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
