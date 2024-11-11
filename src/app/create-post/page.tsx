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
    isDialogOpen,
    setShowGuideTitle,
    setIsLoading,
    setFormData,
    setShowGuideContent,
    setIsDialogOpen,
    handleFormChange,
    handleSaveLocation,
    handleSubmit
  } = useCreatePost();

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleImageUpload = async (files: File[]) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });
  
      const response = await axiosInstance.post('file/cloudinary/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response && response.data && response.data.isSuccess) {
        setImageUrls(response.data.data);
        setFormData((prev) => ({ ...prev, image: response.data.data }));
        toast.success('Tải ảnh lên thành công');
      } else {
        toast.error('Tải ảnh lên thất bại');
      }
    } catch (error: any) {
      if (error.response) {
        console.error(`Error uploading images: ${error.response.status}`, error.response.data);
      } else {
        console.error('Error uploading images:', error);
      }
      toast.error('Tải ảnh lên thất bại');
    } finally {
      setIsLoading(false);
    }
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
                imageUrls={imageUrls}
                onImageUpload={handleImageUpload}
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

              <LocationDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                formData={formData}
                provinces={provinces}
                districts={districts}
                wards={wards}
                onFormChange={handleFormChange}
                onSave={handleSaveLocation}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}