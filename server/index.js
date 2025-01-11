const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(ClerkExpressWithAuth());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/analytics-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Activity Schema
const UserActivitySchema = new mongoose.Schema({
  userId: String,
  action: String,
  timestamp: { type: Date, default: Date.now },
});

const UserActivity = mongoose.model('UserActivity', UserActivitySchema);

// Protected route example
app.post('/api/log-activity', ClerkExpressWithAuth(), async (req, res) => {
  try {
    const { userId } = req.auth;
    const { action } = req.body;
    
    const activity = new UserActivity({
      userId,
      action,
    });
    
    await activity.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});