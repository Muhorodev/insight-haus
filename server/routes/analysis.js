const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const router = express.Router();
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

router.post('/analyze', ClerkExpressWithAuth(), async (req, res) => {
  try {
    const { datasetId, analysisType } = req.body;
    
    // Spawn Python process with proper path
    const pythonProcess = spawn('python', [
      path.join(__dirname, '..', 'analysis.py'),
      JSON.stringify(req.body)
    ]);
    
    let result = '';
    let errorOutput = '';
    
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
      console.log('Python output:', data.toString());
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error('Python error:', data.toString());
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python process exited with code:', code);
        console.error('Error output:', errorOutput);
        return res.status(500).json({ 
          error: 'Analysis failed',
          details: errorOutput
        });
      }
      
      try {
        const analysisResult = JSON.parse(result);
        res.json(analysisResult);
      } catch (error) {
        console.error('Failed to parse analysis results:', error);
        res.status(500).json({ 
          error: 'Failed to parse analysis results',
          details: error.message
        });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;