import React, { useContext, createContext, useState } from 'react';
import { Campaign } from '@/types/types';

interface CampaignContextType {
  // Getters
  campaignData: Campaign[] | null;

  // Setters
  setCampaignData: (campaign: Campaign[] | null) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(
  undefined,
);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [campaignData, setCampaignData] = useState<Campaign[] | null>(null);

  return (
    <CampaignContext.Provider value={{ campaignData, setCampaignData }}>
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
