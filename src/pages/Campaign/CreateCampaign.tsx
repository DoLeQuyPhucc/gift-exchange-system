import React, { useEffect } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useCampaignContext } from '@/context/CampaignContext';
import {
  fetchCategories,
  submitCampaign,
  updateFormCategories,
  updateFormImages,
  uploadImage,
} from '@/services/CampaignService';

const CreateCampaign = () => {
  // Form State
  const {
    formData,
    setFormData,
    categories,
    setCategories,
    isLoadingCategories,
    setIsLoadingCategories,
    error,
    setError,
    isSubmitting,
    setIsSubmitting,
    selectedCategory,
    setSelectedCategory,
    setIsUploading,
  } = useCampaignContext();

  // Navigation
  const navigate = useNavigate();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories(setCategories, setError, setIsLoadingCategories);
  }, []);

  const handleAddCategory = () => {
    updateFormCategories.add(selectedCategory, formData, setFormData);
    setSelectedCategory('');
  };

  const handleRemoveCategory = (categoryId: string) => {
    updateFormCategories.remove(categoryId, setFormData);
  };

  const handleRemoveBanner = () => {
    updateFormImages.removeBanner(setFormData);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    updateFormImages.removeImage(indexToRemove, setFormData);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'gallery' | 'banner',
  ) => {
    const files = e.target.files;
    if (!files) return;
    await uploadImage.handleUpload(files, type, setFormData, setIsUploading);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitCampaign(formData, setIsSubmitting, navigate);
  };

  return (
    <>
      <Breadcrumb pageName="Tạo chiến dịch mới" />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Thông tin chiến dịch
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6.5">
            {/* Tên chiến dịch */}
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Tên chiến dịch <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập tên chiến dịch"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            {/* Mô tả */}
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Mô tả
              </label>
              <textarea
                rows={4}
                placeholder="Nhập mô tả chi tiết về chiến dịch"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            {/* Banner */}
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Ảnh banner
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'banner')}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {formData.bannerPicture && (
                  <div className="mt-2 relative">
                    <img
                      src={formData.bannerPicture}
                      alt="Banner preview"
                      className="max-h-40 rounded"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveBanner}
                      className="absolute top-1 right-1 bg-meta-1 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-90"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Thời gian */}
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Ngày bắt đầu
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  required
                  lang="en"
                />
              </div>

              <div className="w-full xl:w-1/2">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Ngày kết thúc
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  min={formData.startDate}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  required
                  lang="en"
                />
              </div>
            </div>

            {/* Thể loại */}
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Danh mục <span className="text-meta-1">*</span>
              </label>

              {/* Selected Categories List */}
              <div className="mb-3 flex flex-wrap gap-2">
                {formData.categories.map((categoryId) => (
                  <div
                    key={categoryId}
                    className="flex items-center gap-2 rounded bg-gray-100 px-3 py-1 dark:bg-gray-700"
                  >
                    <span>
                      {categories.find((c) => c.id === categoryId)?.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(categoryId)}
                      className="text-meta-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Category Selector and Add Button */}
              <div className="flex gap-2">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  disabled={isLoadingCategories}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingCategories ? (
                      <SelectItem value="loading">Đang tải...</SelectItem>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                <button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={!selectedCategory}
                  className="inline-flex items-center justify-center rounded bg-primary px-6 py-3 text-center font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
                >
                  Thêm
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4.5">
                <p className="text-meta-1">{error}</p>
              </div>
            )}

            {/* Thư viện ảnh */}
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Thư viện ảnh
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'gallery')}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {formData.images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-40 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-meta-1 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-90"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                !formData.startDate || !formData.endDate || isSubmitting
              }
            >
              {isSubmitting
                ? 'Đang tạo...'
                : isLoadingCategories
                ? 'Đang tải...'
                : 'Tạo chiến dịch'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateCampaign;
