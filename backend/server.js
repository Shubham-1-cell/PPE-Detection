// Import required packages
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const cors = require('cors');  // Import CORS
require('dotenv').config();

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());  // Add this line

// Configure AWS SDK
AWS.config.update({
  region: "us-west-2",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Initialize the Rekognition client
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload route
app.post('/api/ppe/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const params = {
    Image: {
      Bytes: req.file.buffer,  // Use buffer directly for memory storage
    },
    MaxLabels: 10,
    MinConfidence: 75,
  };

  // Call Rekognition to detect labels
  rekognition.detectLabels(params, (err, data) => {
    if (err) {
      console.error("Error calling Rekognition:", err);
      return res.status(500).json({ error: 'Error detecting PPE', details: err.message });
    }

    // Log the entire response data for debugging
    console.log("Rekognition response data:", JSON.stringify(data, null, 2));

    // Log the detected labels
    const labels = data.Labels.map(label => ({
      Name: label.Name,
      Confidence: label.Confidence,
    }));

    // Check if any of the detected labels are PPE
    const ppeDetected = labels.some(label => 
      ['face', 'mask', 'helmet', 'glove', 'goggles', 'safety gear', 'protective equipment'].some(ppe => 
        label.Name.toLowerCase().includes(ppe)
      )
    );

    return res.json({ ppeDetected, labels });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
