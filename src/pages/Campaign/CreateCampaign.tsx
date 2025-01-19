import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axiosInstance from '@/api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Types
interface Category {
  id: string;
  name: string;
  status: string;
  parentId: string | null;
  parentName: string | null;
  subCategories: SubCategory[] | null;
}

interface SubCategory {
  id: string;
  parentId: string;
  parentName: string;
  name: string;
}

interface ApiResponse<T> {
  isSuccess: boolean;
  code: number;
  data: T;
  message: string;
}

const CreateCampaign = () => {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bannerPicture: '',
    startDate: '',
    endDate: '',
    images: [] as string[],
    categoryId: '',
    subCategoryId: '',
  });

  // API States
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigation
  const navigate = useNavigate();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setError(null);
      try {
        const response = await axiosInstance.get<ApiResponse<Category[]>>(
          'category',
        );
        if (response.data.isSuccess) {
          setCategories(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Không thể tải danh mục. Vui lòng thử lại sau.');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when category is selected
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!formData.categoryId) {
        setSubCategories([]);
        return;
      }

      setIsLoadingSubCategories(true);
      setError(null);
      try {
        const response = await axiosInstance.get<ApiResponse<Category>>(
          `category/${formData.categoryId}`,
        );
        if (response.data.isSuccess && response.data.data.subCategories) {
          setSubCategories(response.data.data.subCategories);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Không thể tải danh mục con. Vui lòng thử lại sau.');
      } finally {
        setIsLoadingSubCategories(false);
      }
    };

    fetchSubCategories();
  }, [formData.categoryId]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'banner' | 'gallery',
  ) => {
    const files = e.target.files;
    if (files) {
      if (type === 'banner') {
        setFormData((prev) => ({
          ...prev,
          bannerPicture: URL.createObjectURL(files[0]),
        }));
      } else {
        const imageUrls = Array.from(files).map((file) =>
          URL.createObjectURL(file),
        );
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...imageUrls],
        }));
      }
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: value,
      subCategoryId: '',
    }));
  };

  const handleSubCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      subCategoryId: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.bannerPicture) return 'Banner image is required';
    if (!formData.startDate) return 'Start date is required';
    if (!formData.endDate) return 'End date is required';
    if (!formData.categoryId) return 'Category is required';
    return null;
  };

  const formatDateWithoutZ = (date: string) => {
    return new Date(date).toISOString().substring(0, 19);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Format request body according to API spec
      const requestBody = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        bannerPicture: formData.bannerPicture,
        startDate: formatDateWithoutZ(formData.startDate),
        endDate: formatDateWithoutZ(formData.endDate),
        images: formData.images,
        categories: [formData.categoryId],
      };

      const response = await axiosInstance.post('campaign/create', requestBody);

      if (response.data.isSuccess) {
        toast.success('Campaign created successfully');
        navigate('/campaigns');
      } else {
        throw new Error(response.data.message || 'Failed to create campaign');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to create campaign';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
                  <img
                    src={formData.bannerPicture}
                    alt="Banner preview"
                    className="h-20 w-20 object-cover rounded"
                  />
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
                Danh mục chính <span className="text-meta-1">*</span>
              </label>
              <Select
                value={formData.categoryId}
                onValueChange={handleCategoryChange}
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
            </div>

            {/* SubCategory Selection */}
            {formData.categoryId && (
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Danh mục phụ
                </label>
                <Select
                  value={formData.subCategoryId}
                  onValueChange={handleSubCategoryChange}
                  disabled={!formData.categoryId || isLoadingSubCategories}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn danh mục phụ" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingSubCategories ? (
                      <SelectItem value="loading">Đang tải...</SelectItem>
                    ) : (
                      subCategories.map((subCategory) => (
                        <SelectItem key={subCategory.id} value={subCategory.id}>
                          {subCategory.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

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
                    <img
                      key={index}
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      className="h-20 w-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                !formData.categoryId ||
                !formData.startDate ||
                !formData.endDate ||
                isLoadingCategories ||
                isLoadingSubCategories ||
                isSubmitting
              }
            >
              {isSubmitting
                ? 'Đang tạo...'
                : isLoadingCategories || isLoadingSubCategories
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
