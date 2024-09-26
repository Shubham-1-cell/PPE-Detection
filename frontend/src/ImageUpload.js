import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [responseData, setResponseData] = useState(null);

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/api/ppe/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("Response from server:", response.data);
      setResponseData(response.data);

      // Check for detected labels
      if (response.data.labels) {
        console.log("Detected Labels:", response.data.labels);
      } else {
        console.error("No labels detected");
      }

      // Handle PPE detection result
      const ppeDetected = response.data.ppeDetected;
      console.log("PPE Detected:", ppeDetected);

    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div>
      <h2>PPE Detection Upload</h2>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleImageUpload}>Upload Image</button>

      {responseData && (
        <div>
          <h3>Results:</h3>
          <p>PPE Detected: {responseData.ppeDetected ? 'Yes' : 'No'}</p>
          <h4>Detected Labels:</h4>
          <ul>
            {responseData.labels && responseData.labels.map((label, index) => (
              <li key={index}>{label.Name} - Confidence: {label.Confidence.toFixed(2)}%</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
