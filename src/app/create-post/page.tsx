'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '../components/create-post/image-upload'
import { ProductForm } from '../components/create-post/product-form'
import { LocationDialog } from '../components/create-post/location-dialog'
import { useCreatePost } from '../hooks/useCreatePost'

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
    setShowGuideContent,
    setIsDialogOpen,
    handleImageChange,
    handleSaveLocation,
    handleFormChange,
    handleSubmit
  } = useCreatePost()

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
                image={formData.image}
                onImageChange={handleImageChange}
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
  )
}