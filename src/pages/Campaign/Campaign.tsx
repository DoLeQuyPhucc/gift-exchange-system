import { useEffect } from 'react';
import CampaignTable from '@/components/Campaign/CampaignTable';
import { fetchCampaigns } from '@/services/CampaignService';
import { useCampaignContext } from '@/context/CampaignContext';

function Campaign() {
  const { campaignData, setCampaignData } = useCampaignContext();

  useEffect(() => {
    fetchCampaigns(setCampaignData);
  }, []);

  return (
    <>
      <CampaignTable
        campaigns={campaignData || []}
        onRefresh={() => fetchCampaigns(setCampaignData)}
      />
    </>
  );
}

export default Campaign;
