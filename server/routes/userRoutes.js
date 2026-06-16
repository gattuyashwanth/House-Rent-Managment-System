const express = require('express');
const {
  register,
  login,
  forgotPassword,
  getProfile,
  updateProfile,
  getProperties,
  getPropertyDetails,
  createBooking,
  getBookingHistory,
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);

router.get('/properties', getProperties);
router.get('/properties/:id', getPropertyDetails);

router.post('/bookings', protect, authorize('Renter'), createBooking);
router.get('/bookings', protect, authorize('Renter'), getBookingHistory);

module.exports = router;
