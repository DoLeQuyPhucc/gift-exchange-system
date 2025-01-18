import React, { useEffect } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { useCampaignContext } from '@/context/CampaignContext';
import { CampaignResponse } from '@/types/types';
import CampaignTable from '@/components/Campaign/CampaignTable';

function Campaign() {
  const { campaignData, setCampaignData } = useCampaignContext();

  const fetchCampaigns = async () => {
    try {
      const response = await axiosInstance.get(
        '/campaign/list?pageIndex=1&pageSize=10',
      );
      const campaignResponse = response.data as CampaignResponse;
      setCampaignData(campaignResponse.data.data);
    } catch {
      console.log('Failed to fetch campaign data');
      setCampaignData([]);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <>
      <CampaignTable campaigns={campaignData || []} />
    </>
  );
}

export default Campaign;
