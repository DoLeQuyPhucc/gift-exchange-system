import React, { useContext, createContext, useState } from 'react';
import { Campaign, Category, FormDataType } from '@/types/types';

interface CampaignContextType {
  // Getters
  campaignData: Campaign[] | null;
  statusFilter: string;
  showModal: boolean;
  selectedCampaignId: string | null;
  selectedCampaign: Campaign | null;
  isModalOpen: boolean;

  // Create Campaign states
  formData: FormDataType;
  categories: Category[];
  isLoadingCategories: boolean;
  error: string | null;
  isSubmitting: boolean;
  selectedCategory: string;
  isUploading: boolean;

  // Setters
  setCampaignData: (campaign: Campaign[] | null) => void;
  setStatusFilter: (status: string) => void;
  setShowModal: (show: boolean) => void;
  setSelectedCampaignId: (id: string | null) => void;
  setSelectedCampaign: (campaign: Campaign | null) => void;
  setIsModalOpen: (isOpen: boolean) => void;

  // Create Campaign setters
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setIsLoadingCategories: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsSubmitting: (submitting: boolean) => void;
  setSelectedCategory: (category: string) => void;
  setIsUploading: (uploading: boolean) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(
  undefined,
);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [campaignData, setCampaignData] = useState<Campaign[] | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null,
  );
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create Campaign states
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    description: '',
    bannerPicture: '',
    startDate: '',
    endDate: '',
    images: [],
    categories: [],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  return (
    <CampaignContext.Provider
      value={{
        campaignData,
        statusFilter,
        showModal,
        selectedCampaignId,
        selectedCampaign,
        isModalOpen,
        setCampaignData,
        setStatusFilter,
        setShowModal,
        setSelectedCampaignId,
        setSelectedCampaign,
        setIsModalOpen,
        formData,
        categories,
        isLoadingCategories,
        error,
        isSubmitting,
        selectedCategory,
        isUploading,
        setFormData,
        setCategories,
        setIsLoadingCategories,
        setError,
        setIsSubmitting,
        setSelectedCategory,
        setIsUploading,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaignContext = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error(
      'useCampaignContext must be used within a CampaignProvider',
    );
  }
  return context;
};
