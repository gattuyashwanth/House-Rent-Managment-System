const User = require('../models/UserSchema');
const Property = require('../models/PropertySchema');
const Booking = require('../models/BookingSchema');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'Renter' });
    const totalOwners = await User.countDocuments({ role: 'Owner' });
    const totalProperties = await Property.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const pendingOwners = await User.countDocuments({ role: 'Owner', status: 'Pending' });
    const approvedOwners = await User.countDocuments({ role: 'Owner', status: 'Approved' });

    const availableProperties = await Property.countDocuments({ availabilityStatus: 'Available' });
    const bookedProperties = await Property.countDocuments({ availabilityStatus: 'Booked' });

    // Average Rent
    const avgRentResult = await Property.aggregate([
      { $group: { _id: null, avgRent: { $avg: '$rentAmount' } } }
    ]);
    const averageRent = avgRentResult.length > 0 ? Math.round(avgRentResult[0].avgRent) : 0;

    // Occupancy Rate
    const occupancyRate = totalProperties > 0 ? Math.round((bookedProperties / totalProperties) * 100) : 0;

    // Total Revenue (Sum of rent of all Booked properties)
    const revenueResult = await Property.aggregate([
      { $match: { availabilityStatus: 'Booked' } },
      { $group: { _id: null, totalRevenue: { $sum: '$rentAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Monthly Bookings (created in the current calendar month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthlyBookings = await Booking.countDocuments({ createdAt: { $gte: startOfMonth } });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalOwners,
        totalProperties,
        totalBookings,
        pendingOwners,
        approvedOwners,
        availableProperties,
        bookedProperties,
        averageRent,
        occupancyRate,
        totalRevenue,
        monthlyBookings,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Users (Renters)
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const renters = await User.find({ role: 'Renter' }).sort({ createdAt: -1 });
    res.json({ success: true, count: renters.length, data: renters });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Owners
// @route   GET /api/admin/owners
// @access  Private (Admin only)
exports.getAllOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: 'Owner' }).sort({ createdAt: -1 });
    res.json({ success: true, count: owners.length, data: owners });
  } catch (error) {
    console.error('Get all owners error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve Owner Account
// @route   PUT /api/admin/owners/:id/approve
// @access  Private (Admin only)
exports.approveOwner = async (req, res) => {
  try {
    const owner = await User.findById(req.params.id);
    if (!owner || owner.role !== 'Owner') {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }

    owner.status = 'Approved';
    await owner.save();

    res.json({ success: true, message: 'Owner account approved successfully!', data: owner });
  } catch (error) {
    console.error('Approve owner error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject Owner Account
// @route   PUT /api/admin/owners/:id/reject
// @access  Private (Admin only)
exports.rejectOwner = async (req, res) => {
  try {
    const owner = await User.findById(req.params.id);
    if (!owner || owner.role !== 'Owner') {
      return res.status(404).json({ success: false, message: 'Owner not found' });
    }

    owner.status = 'Pending';
    await owner.save();

    res.json({ success: true, message: 'Owner account status set to Pending/Rejected.', data: owner });
  } catch (error) {
    console.error('Reject owner error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Properties on the Platform
// @route   GET /api/admin/properties
// @access  Private (Admin only)
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('ownerId', 'name email phone status')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: properties.length, data: properties });
  } catch (error) {
    console.error('Get all properties error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete any property listing
// @route   DELETE /api/admin/properties/:id
// @access  Private (Admin only)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    await Booking.deleteMany({ propertyId: property._id });
    await property.deleteOne();

    res.json({ success: true, message: 'Property and associated bookings deleted successfully!' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Bookings on the Platform
// @route   GET /api/admin/bookings
// @access  Private (Admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('propertyId', 'title location rentAmount images availabilityStatus')
      .populate('userId', 'name email phone')
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
