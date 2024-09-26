const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

AWS.config.update({ region: 'us-west-2' }); // Replace with your region
const rekognition = new AWS.Rekognition();

// API Endpoint to handle image upload
router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const params = {
    Image: {
      Bytes: req.file.buffer,
    },
    // Optional: You can specify specific label detection parameters
    MaxLabels: 10,
    MinConfidence: 75,
  };

  try {
    const data = await rekognition.detectLabels(params).promise();
    const detectedLabels = data.Labels.map(label => label.Name);
    
    // Check if PPE-related labels are present
    const ppeDetected = detectedLabels.some(label => label.toLowerCase().includes('ppe'));
    
    res.json({
      message: ppeDetected ? 'PPE detected' : 'No PPE detected',
      detectedLabels: detectedLabels,
    });
  } catch (error) {
    console.error('Error detecting labels:', error);
    res.status(500).json({ message: 'Error processing image' });
  }
});

module.exports = router;
