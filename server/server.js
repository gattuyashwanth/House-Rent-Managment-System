require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/connect');
const User = require('./models/UserSchema');

const userRoutes = require('./routes/userRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request log
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'House Rent Management API is running' });
});

// Mount Routes
app.use('/api/user', userRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/admin', adminRoutes);

// Fallback Route
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

// Connect Database & Run Server
connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

async function seedAdmin() {
  try {
    const adminEmail = 'gattuyashwanth22@gmail.com';
    let admin = await User.findOne({ email: adminEmail }).select('+password');
    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'Gattu', // Schema pre-save hashes this password!
        role: 'Admin',
        phone: '1234567890',
        status: 'Approved',
      });
      console.log(`Default admin seeded successfully: ${adminEmail} / Gattu`);
    } else {
      // Ensure role, status and password are correct if changed
      let isModified = false;
      const isPasswordCorrect = await admin.comparePassword('Gattu');
      if (!isPasswordCorrect) {
        admin.password = 'Gattu';
        isModified = true;
      }
      if (admin.role !== 'Admin') {
        admin.role = 'Admin';
        isModified = true;
      }
      if (admin.status !== 'Approved') {
        admin.status = 'Approved';
        isModified = true;
      }
      if (isModified) {
        await admin.save();
        console.log('Admin account password/role/status refreshed.');
      }
    }
  } catch (error) {
    console.error('Seed admin error:', error);
  }
}
