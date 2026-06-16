const express = require('express');
const {
  getStats,
  getAllUsers,
  getAllOwners,
  approveOwner,
  rejectOwner,
  getAllProperties,
  deleteProperty,
  getAllBookings,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect, authorize('Admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/owners', getAllOwners);
router.put('/owners/:id/approve', approveOwner);
router.put('/owners/:id/reject', rejectOwner);

router.get('/properties', getAllProperties);
router.delete('/properties/:id', deleteProperty);
router.get('/bookings', getAllBookings);

module.exports = router;
