import React from 'react';
import { Campaign, CampaignDetail } from '@/types/types';
import CampaignDetailModal from '@/pages/Campaign/CampaignDetail';
import { startCampaign, viewCampaignDetail } from '@/services/CampaignService';
import { useCampaignContext } from '@/context/CampaignContext';

interface CampaignTableProps {
  campaigns?: Campaign[];
  onRefresh: () => void;
}

const CampaignTable: React.FC<CampaignTableProps> = ({
  campaigns = [],
  onRefresh,
}) => {
  const {
    statusFilter,
    showModal,
    selectedCampaignId,
    selectedCampaign,
    isModalOpen,
    setStatusFilter,
    setShowModal,
    setSelectedCampaignId,
    setSelectedCampaign,
    setIsModalOpen,
  } = useCampaignContext();

  const statusCounts = campaigns.reduce<Record<string, number>>(
    (acc, campaign) => {
      acc[campaign.status] = (acc[campaign.status] || 0) + 1;
      return acc;
    },
    {},
  );

  const filteredCampaigns =
    statusFilter === 'All'
      ? campaigns
      : campaigns.filter((campaign) => campaign.status === statusFilter);

  const handleViewCampaign = (campaignId: string) => {
    viewCampaignDetail(campaignId, setSelectedCampaign, setIsModalOpen);
  };

  const handleStartCampaign = () => {
    startCampaign(selectedCampaignId!, setShowModal, onRefresh);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Campaigns List
        </h4>
        <button
          onClick={onRefresh}
          className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary px-6 py-2.5 text-center font-medium text-white hover:bg-opacity-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-refresh-cw"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9-9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <button
          onClick={() => setStatusFilter('All')}
          className={`rounded-md px-4 py-2 text-sm ${
            statusFilter === 'All'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-boxdark'
          }`}
        >
          All ({campaigns.length})
        </button>
        {['Planned', 'Ongoing', 'Completed', 'Canceled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-md px-4 py-2 text-sm ${
              statusFilter === status
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-boxdark'
            }`}
          >
            {status} ({statusCounts[status] || 0})
          </button>
        ))}
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Campaign Name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Start Date
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                End Date
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {campaign.name}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {new Date(campaign.startDate).toLocaleDateString()}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {new Date(campaign.endDate).toLocaleDateString()}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                      campaign.status === 'Planned'
                        ? 'bg-warning bg-opacity-10 text-warning'
                        : 'bg-success bg-opacity-10 text-success'
                    }`}
                  >
                    {campaign.status}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    {['Planned', 'Canceled', 'Completed'].includes(
                      campaign.status,
                    ) && (
                      <button
                        className="hover:text-primary"
                        onClick={() => {
                          setSelectedCampaignId(campaign.id);
                          setShowModal(true);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="green"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-power"
                        >
                          <path d="M12 2v10" />
                          <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
                        </svg>
                      </button>
                    )}

                    <button
                      className="hover:text-primary"
                      onClick={() => handleViewCampaign(campaign.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="blue"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-eye"
                      >
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>

                    <button className="hover:text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="red"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-trash-2"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CampaignDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campaign={selectedCampaign as CampaignDetail}
      />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-boxdark p-6 rounded-lg">
            <h3 className="mb-4">Xác nhận bắt đầu chiến dịch</h3>
            <p className="mb-6">Có chắc chắn bắt đầu chiến dịch này không?</p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray hover:bg-opacity-90 px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Không
              </button>
              <button
                className="bg-primary text-white px-4 py-2 rounded"
                onClick={handleStartCampaign}
              >
                Có
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignTable;
