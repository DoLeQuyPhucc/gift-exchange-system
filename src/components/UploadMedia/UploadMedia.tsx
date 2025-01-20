import React, { useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
import axios from 'axios';

const UploadBannerForm: React.FC = () => {
  const [formData, setFormData] = useState({
    bannerPicture: '',
    images: [] as string[],
  });
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploading(true);
    try {
      const response = await axios.post('file/cloudinary/image', uploadData);
      if (response.data.isSuccess) {
        const uploadedUrl = response.data.data[0]; // Get the uploaded image URL
        setFormData((prev) => ({
          ...prev,
          bannerPicture: uploadedUrl,
        }));
        console.log('Image uploaded successfully:', uploadedUrl);
      } else {
        console.error('Image upload failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h3>Upload Banner</h3>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {formData.bannerPicture && (
        <div>
          <p>Uploaded Banner:</p>
          <img
            src={formData.bannerPicture}
            alt="Banner"
            style={{ maxWidth: '100%' }}
          />
        </div>
      )}
    </div>
  );
};

export default UploadBannerForm;
