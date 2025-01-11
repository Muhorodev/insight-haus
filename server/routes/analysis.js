const express = require('express');
const { spawn } = require('child_process');
const router = express.Router();
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

router.post('/analyze', ClerkExpressWithAuth(), async (req, res) => {
  try {
    const { datasetId, analysisType } = req.body;
    
    // Spawn Python process
    const pythonProcess = spawn('python', ['analysis.py', JSON.stringify(req.body)]);
    
    let result = '';
    
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: 'Analysis failed' });
      }
      
      try {
        const analysisResult = JSON.parse(result);
        res.json(analysisResult);
      } catch (error) {
        res.status(500).json({ error: 'Failed to parse analysis results' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;