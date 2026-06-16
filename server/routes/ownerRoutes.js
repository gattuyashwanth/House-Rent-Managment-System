const express = require('express');
const {
  addProperty,
  editProperty,
  deleteProperty,
  getOwnProperties,
  getOwnBookings,
  updateBookingStatus,
} = require('../controllers/ownerController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

const router = express.Router();

router.use(protect, authorize('Owner'));

router.post('/properties', upload.array('images', 5), addProperty);
router.put('/properties/:id', upload.array('images', 5), editProperty);
router.delete('/properties/:id', deleteProperty);
router.get('/properties', getOwnProperties);

router.get('/bookings', getOwnBookings);
router.put('/bookings/:id', updateBookingStatus);

module.exports = router;
