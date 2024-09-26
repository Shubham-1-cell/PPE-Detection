const express = require('express');
const { detectPPE } = require('../rekognition');
const multer = require('multer');

const router = express.Router();
const upload = multer(); // For handling multipart form data

router.post('/detect', upload.single('image'), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;
    const ppeDetectionResults = await detectPPE(imageBuffer);
    res.json(ppeDetectionResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
