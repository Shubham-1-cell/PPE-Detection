const AWS = require('aws-sdk');

// Configure AWS
const rekognition = new AWS.Rekognition({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const detectPPE = async (imageBuffer) => {
  const params = {
    Image: {
      Bytes: imageBuffer,
    },
  };

  try {
    const response = await rekognition.detectProtectiveEquipment(params).promise();
    return response;
  } catch (error) {
    console.error('Error detecting PPE:', error);
    throw new Error('Could not process image');
  }
};

module.exports = { detectPPE };
