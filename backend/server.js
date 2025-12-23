// backend/server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Medicine = require('./models/Medicine');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/', (req, res) => res.send('AsliDawa API is running...'));
app.use('/api/medicines', require('./routes/medicineRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes')); // <-- ADD THIS LINE

// Start function to load cache before listening
const startServer = async () => {
  try {
    // 1. Connect to DB
    await connectDB(); // Wait for DB to connect

    // 2. Load Cache for fuzzy search
    console.log('Loading medicine name cache...');
    const names = await Medicine.find({}, 'name');
    
    app.locals.medicineNameCache = names.map(med => ({ name: med.name }));
    
    console.log(`Cache loaded with ${app.locals.medicineNameCache.length} medicine names.`);

    // 3. Start Server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();