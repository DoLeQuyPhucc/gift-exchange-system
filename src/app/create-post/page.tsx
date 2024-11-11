'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '../components/create-post/image-upload';
import { ProductForm } from '../components/create-post/product-form';
import { LocationDialog } from '../components/create-post/location-dialog';
import { useCreatePost } from '../hooks/useCreatePost';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

export default function CreatePost() {
  const {
    formData,
    isLoading,
    showGuideTitle,
    showGuideContent,
    categories,
    currentCategoryAttributes,
    attributeValues,
    provinces,
    districts,
    wards,
    images,
    setImages,
    setShowGuideTitle,
    setIsLoading,
    setFormData,
    hasCategorySelected,
    setShowGuideContent,
    setIsDialogOpen,
    handleFormChange,
    handleSubmit
  } = useCreatePost();

  const handleImageUpload = async (files: File[]) => {
    try {

      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      const isValidSize = files.every(file => file.size <= MAX_FILE_SIZE);
      if (!isValidSize) {
        toast.error('Kích thước file không được vượt quá 10MB');
        return;
      }
  
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const isValidType = files.every(file => validTypes.includes(file.type));
      if (!isValidType) {
        toast.error('Chỉ chấp nhận file định dạng JPG, JPEG hoặc PNG');
        return;
      }
  
      setIsLoading(true);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });
  
      const response = await axiosInstance.post('file/cloudinary/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });
  
      if (response?.data?.isSuccess) {
        const uploadedUrls = response.data.data;
        setImages(prev => [...prev, ...uploadedUrls]);
        setFormData((prev) => ({ 
          ...prev, 
          images: [...prev.images, ...uploadedUrls]
        }));
        toast.success('Tải ảnh lên thành công');
      } else {
        throw new Error(response?.data?.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Error uploading images:', error);
      
      if (error.code === 'ECONNABORTED') {
        toast.error('Quá thời gian tải ảnh, vui lòng thử lại');
      } else if (error.response) {
        toast.error(error.response.data?.message || 'Lỗi khi tải ảnh lên');
      } else if (error.request) {
        toast.error('Không thể kết nối đến server');
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = (index: number) => {
    const newImageUrls = [...images];
    newImageUrls.splice(index, 1);
    setImages(newImageUrls);
    setFormData(prev => ({
      ...prev,
      images: newImageUrls
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Hình ảnh của sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
            <ImageUpload
              imageUrls={images}
              onImageUpload={handleImageUpload}
              onDeleteImage={handleDeleteImage}
              isLoading={isLoading}
              isDisabled={!hasCategorySelected}
            />
            </div>

            <div>
              <ProductForm
                formData={formData}
                categories={categories}
                isLoading={isLoading}
                currentCategoryAttributes={currentCategoryAttributes}
                attributeValues={attributeValues}
                showGuideTitle={showGuideTitle}
                showGuideContent={showGuideContent}
                provinces={provinces}
                districts={districts}
                wards={wards}
                onFormChange={handleFormChange}
                onSubmit={handleSubmit}
                onFocusTitle={() => setShowGuideTitle(true)}
                onBlurTitle={() => setShowGuideTitle(false)}
                onFocusContent={() => setShowGuideContent(true)}
                onBlurContent={() => setShowGuideContent(false)}
                onAddressClick={() => setIsDialogOpen(true)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}