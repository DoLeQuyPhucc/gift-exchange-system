import axiosInstance from '@/api/axiosInstance';
import {
  ApiCreateCampaignResponse,
  Campaign,
  CampaignResponse,
  Category,
  FormDataType,
} from '@/types/types';
import axios from 'axios';
import toast from 'react-hot-toast';
import { NavigateFunction } from 'react-router-dom';

const CLOUDINARY_CLOUD_NAME = 'dt4ianp80';
const CLOUDINARY_UPLOAD_PRESET = 'gift_system';
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const validateForm = (formData: FormDataType): string | null => {
  if (!formData.name.trim()) return 'Name is required';
  if (!formData.description.trim()) return 'Description is required';
  if (!formData.bannerPicture) return 'Banner image is required';
  if (!formData.startDate) return 'Start date is required';
  if (!formData.endDate) return 'End date is required';
  if (!formData.categories.length) return 'Categories are required';
  return null;
};

const formatDateWithoutZ = (date: string): string => {
  return new Date(date).toISOString().substring(0, 19);
};

export const fetchCampaigns = async (setCampaignData: (data: any) => void) => {
  try {
    const response = await axiosInstance.get(
      'campaign/list?pageIndex=1&pageSize=10',
    );
    const campaignResponse = response.data as CampaignResponse;
    setCampaignData(campaignResponse.data.data);
  } catch {
    console.log('Failed to fetch campaign data');
    setCampaignData([]);
  }
};

export const viewCampaignDetail = async (
  campaignId: string,
  setSelectedCampaign: (campaign: Campaign) => void,
  setIsModalOpen: (isOpen: boolean) => void,
) => {
  try {
    const response = await axiosInstance.get(`campaign/${campaignId}`);
    setSelectedCampaign(response.data.data);
    setIsModalOpen(true);
  } catch (error) {
    console.error('Failed to fetch campaign details');
  }
};

export const startCampaign = async (
  selectedCampaignId: string,
  setShowModal: (show: boolean) => void,
  onRefresh: () => void,
) => {
  try {
    await axiosInstance.put('/campaign/status', {
      id: selectedCampaignId,
      status: 'Ongoing',
    });
    setShowModal(false);
    onRefresh();
  } catch (error) {
    console.error('Error starting campaign:', error);
  }
};

export const cancelCampaign = async (
  selectedCampaignId: string,
  setShowCancelModal: (show: boolean) => void,
  onRefresh: () => void,
) => {
  try {
    await axiosInstance.put('/campaign/status', {
      id: selectedCampaignId,
      status: 'Canceled',
    });
    toast.success('Hủy chiến dịch thành công!');
    setShowCancelModal(false);
    onRefresh();
  } catch (error) {
    console.error('Error canceling campaign:', error);
    toast.error('Có lỗi xảy ra khi hủy chiến dịch!');
  }
};

export const fetchCategories = async (
  setCategories: (categories: Category[]) => void,
  setError: (error: string | null) => void,
  setIsLoadingCategories: (loading: boolean) => void,
) => {
  setIsLoadingCategories(true);
  setError(null);
  try {
    const response = await axiosInstance.get<
      ApiCreateCampaignResponse<Category[]>
    >('category');
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

export const updateFormCategories = {
  add: (
    selectedCategory: string,
    formData: FormDataType,
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>,
  ) => {
    if (selectedCategory && !formData.categories.includes(selectedCategory)) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, selectedCategory],
      }));
    }
  },

  remove: (
    categoryId: string,
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((id) => id !== categoryId),
    }));
  },
};

export const updateFormImages = {
  removeBanner: (
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>,
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      bannerPicture: null,
    }));
  },

  removeImage: (
    indexToRemove: number,
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  },
};

export const uploadImage = {
  handleUpload: async (
    files: FileList,
    type: 'gallery' | 'banner',
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>,
    setIsUploading: (value: boolean) => void,
  ) => {
    try {
      setIsUploading(true);
      toast.loading('Đang tải ảnh lên...', { id: 'uploadToast' });

      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const response = await axios.post(CLOUDINARY_API_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return response.data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      setFormData((prev) => ({
        ...prev,
        ...(type === 'banner'
          ? { bannerPicture: uploadedUrls[0] }
          : { images: [...prev.images, ...uploadedUrls] }),
      }));

      toast.success('Tải ảnh thành công!', { id: 'uploadToast' });
    } catch (error) {
      toast.error('Tải ảnh thất bại!', { id: 'uploadToast' });
      console.error('Error uploading images:', error);
    } finally {
      setIsUploading(false);
    }
  },
};

export const resetFormData = (
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>,
) => {
  setFormData({
    name: '',
    description: '',
    bannerPicture: '',
    startDate: '',
    endDate: '',
    images: [],
    categories: [],
  });
};

export const submitCampaign = async (
  formData: FormDataType,
  setIsSubmitting: (value: boolean) => void,
  navigate: NavigateFunction,
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>,
) => {
  try {
    setIsSubmitting(true);

    // Validate form
    const validationError = validateForm(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // Format dates
    const formattedData = {
      ...formData,
      startDate: formatDateWithoutZ(formData.startDate),
      endDate: formatDateWithoutZ(formData.endDate),
    };

    const response = await axiosInstance.post('campaign/create', formattedData);

    if (response.data.isSuccess) {
      toast.success('Tạo chiến dịch thành công!');
      resetFormData(setFormData);
      navigate('/campaigns');
    } else {
      toast.error(response.data.message || 'Tạo chiến dịch thất bại!');
    }
  } catch (error) {
    toast.error('Có lỗi xảy ra khi tạo chiến dịch!');
    console.error('Error submitting campaign:', error);
    resetFormData(setFormData);
  } finally {
    setIsSubmitting(false);
  }
};

export const getCampaignItems = async (
  campaignId: string,
  pageIndex: number = 1,
  pageSize: number = 10,
) => {
  try {
    const response = await axiosInstance.get(
      `campaign/item?campaignId=${campaignId}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching campaign items:', error);
    throw error;
  }
};

export const approveItem = async (data: {
  itemId: string;
  volunteerId: string;
  appointmentDate: string;
}) => {
  try {
    const response = await axiosInstance.post('campaign/item/approve', data);

    if (response.data.isSuccess) {
      toast.success('Duyệt thành công!');
    } else {
      toast.error(response.data.message || 'Duyệt thất bại!');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectItem = async (itemId: string) => {
  try {
    const response = await axiosInstance.post(
      `campaign/item/reject?itemId=${itemId}`,
    );

    if (response.data.isSuccess) {
      toast.success('Từ chối thành công!');
    } else {
      toast.error(response.data.message || 'Từ chối thất bại!');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVolunteers = async () => {
  try {
    const response = await axiosInstance.get('user/volunteer');
    return response.data;
  } catch (error) {
    throw error;
  }
};
