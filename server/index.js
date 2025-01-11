const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const analysisRoutes = require('./routes/analysis');

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

// Routes
app.use('/api/analysis', analysisRoutes);

// User Activity Schema
const UserActivitySchema = new mongoose.Schema({
  userId: String,
  action: String,
  timestamp: { type: Date, default: Date.now },
});

const UserActivity = mongoose.model('UserActivity', UserActivitySchema);

// Dataset Schema
const DatasetSchema = new mongoose.Schema({
  userId: String,
  name: String,
  description: String,
  type: String, // 'csv', 'excel', 'manual'
  data: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Dataset = mongoose.model('Dataset', DatasetSchema);

// Analysis Schema
const AnalysisSchema = new mongoose.Schema({
  userId: String,
  datasetId: String,
  name: String,
  type: String,
  results: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
});

const Analysis = mongoose.model('Analysis', AnalysisSchema);

// Report Schema
const ReportSchema = new mongoose.Schema({
  userId: String,
  name: String,
  description: String,
  analyses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Analysis' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Report = mongoose.model('Report', ReportSchema);

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

// Dataset routes
app.post('/api/datasets', ClerkExpressWithAuth(), async (req, res) => {
  try {
    const { userId } = req.auth;
    const { name, description, type, data } = req.body;
    
    const dataset = new Dataset({
      userId,
      name,
      description,
      type,
      data,
    });
    
    await dataset.save();
    res.json(dataset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/datasets', ClerkExpressWithAuth(), async (req, res) => {
  try {
    const { userId } = req.auth;
    const datasets = await Dataset.find({ userId });
    res.json(datasets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
