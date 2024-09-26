import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:5000/api/ppe/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message); // Set the response message
      console.log('Detected Labels:', response.data.detectedLabels);
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFile) {
      handleImageUpload(selectedFile); // Call the upload function with the selected file
    } else {
      setMessage('Please select an image file');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" required />
        <button type="submit">Upload Image</button>
      </form>
      {message && <p>{message}</p>} {/* Display the message */}
    </div>
  );
};

export default ImageUpload;
