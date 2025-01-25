import React, { useEffect, useState } from 'react';
import {
  Campaign,
  CampaignDetail,
  CampaignItem,
  ProductOfCampaign,
} from '@/types/types';
import CampaignDetailModal from '@/pages/Campaign/CampaignDetail';
import {
  startCampaign,
  viewCampaignDetail,
  getCampaignItems,
  cancelCampaign,
  getItemsByCategory,
  viewCampaignDetailMode,
} from '@/services/CampaignService';
import { useCampaignContext } from '@/context/CampaignContext';
import ItemDetailModal from './ItemDetailModal';
import { Package } from 'lucide-react';

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

  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [campaignItems, setCampaignItems] = useState<CampaignItem[]>([]);
  const [isItemDetailModalOpen, setIsItemDetailModalOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [campaignToCancel, setCampaignToCancel] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<
    'campaign-items' | 'suggested-items'
  >('campaign-items');
  const [suggestedItems, setSuggestedItems] = useState<ProductOfCampaign[]>([]);

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

  const handleCancelClick = (campaignId: string) => {
    setCampaignToCancel(campaignId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (campaignToCancel) {
      await cancelCampaign(campaignToCancel, setShowCancelModal, onRefresh);
      setCampaignToCancel(null);
    }
  };

  useEffect(() => {
    console.log('Selected Campaign Updated:', selectedCampaign);
  }, [selectedCampaign]);

  const handleViewItems = async (campaignId: string) => {
    try {
      // Fetch campaign details first and set it
      const campaignResponse = await viewCampaignDetailMode(campaignId);
      if (campaignResponse.isSuccess) {
        const campaignData = campaignResponse.data.data;
        console.log('Campaign Data:', campaignData); // Debug log
        setSelectedCampaign(campaignData); // Set campaign data first

        // Then fetch items
        const itemsResponse = await getCampaignItems(campaignId);
        if (itemsResponse.isSuccess) {
          setCampaignItems(itemsResponse.data.data);
        }
      }
      setIsItemsModalOpen(true);
    } catch (error) {
      console.error('Error fetching campaign data:', error);
    }
  };

  const fetchSuggestedItems = async (categoryId: string) => {
    try {
      setIsLoading(true);
      console.log('Fetching suggested items for category:', categoryId);
      const response = await getItemsByCategory(categoryId);
      console.log('Suggested items response:', response);
      if (response.isSuccess) {
        setSuggestedItems(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching suggested items:', error);
      setSuggestedItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewModeChange = async (
    mode: 'campaign-items' | 'suggested-items',
  ) => {
    setViewMode(mode);

    if (mode === 'suggested-items') {
      try {
        if (!selectedCampaign) {
          console.error('No campaign selected');
          return;
        }

        console.log('Selected Campaign:', selectedCampaign);
        console.log('Categories:', selectedCampaign.categories);

        if (
          !selectedCampaign.categories ||
          selectedCampaign.categories.length === 0
        ) {
          // Nếu không có categories, fetch lại campaign
          const campaignResponse = await viewCampaignDetailMode(
            selectedCampaign.id,
          );
          if (campaignResponse.isSuccess) {
            const updatedCampaign = campaignResponse.data.data;
            setSelectedCampaign(updatedCampaign);

            if (
              updatedCampaign.categories &&
              updatedCampaign.categories.length > 0
            ) {
              const categoryId = updatedCampaign.categories[0].id;
              console.log('Fetching items for category:', categoryId);
              await fetchSuggestedItems(categoryId);
            }
          }
        } else {
          // Nếu đã có categories
          const categoryId = selectedCampaign.categories[0].id;
          console.log('Fetching items for existing category:', categoryId);
          await fetchSuggestedItems(categoryId);
        }
      } catch (error) {
        console.error('Error in handleViewModeChange:', error);
      }
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Danh sách chiến dịch
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
          Làm mới
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
          Tất cả ({campaigns.length})
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
                Tên chiến dịch
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Ngày bắt đầu
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Ngày kết thúc
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Trạng thái
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Hành động
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
                      {
                        Planned: 'bg-warning/10 text-warning',
                        Ongoing: 'bg-success/10 text-success',
                        Canceled: 'bg-danger/10 text-danger',
                        Completed: 'bg-primary/10 text-primary',
                      }[campaign.status] || 'bg-gray-100 text-gray-500'
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

                    <button
                      className="hover:text-primary"
                      onClick={() => handleViewItems(campaign.id)}
                      title="View Items"
                    >
                      <Package className="h-5 w-5 text-blue-500" />
                    </button>

                    <button
                      className="hover:text-primary"
                      onClick={() => handleCancelClick(campaign.id)}
                    >
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

      {/* Campaign Items Modal */}
      {isItemsModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-black/50">
          <div className="relative mx-auto h-[90vh] w-full max-w-6xl overflow-hidden rounded-lg bg-white p-4 shadow-xl dark:bg-boxdark md:p-6">
            <button
              onClick={() => setIsItemsModalOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-gray-500 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="h-full overflow-y-auto">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">Vật phẩm chiến dịch</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewModeChange('campaign-items')}
                    disabled={isLoading}
                    className={`rounded-md px-4 py-2 ${
                      viewMode === 'campaign-items'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-boxdark'
                    }`}
                  >
                    Vật phẩm chiến dịch
                  </button>
                  <button
                    onClick={() => handleViewModeChange('suggested-items')}
                    disabled={isLoading}
                    className={`rounded-md px-4 py-2 ${
                      viewMode === 'suggested-items'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-boxdark'
                    }`}
                  >
                    {isLoading ? 'Đang tải...' : 'Vật phẩm đề xuất'}
                  </button>
                </div>
              </div>

              {isLoading && (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}

              {!isLoading &&
                viewMode === 'suggested-items' &&
                suggestedItems.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    Không tìm thấy vật phẩm đề xuất
                  </div>
                )}

              {viewMode === 'campaign-items' ? (
                <div className="mb-4 flex gap-3">
                  <button
                    onClick={() => setStatusFilter('All')}
                    className={`rounded-md px-4 py-2 text-sm ${
                      statusFilter === 'All'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-boxdark'
                    }`}
                  >
                    All ({campaignItems.length})
                  </button>
                  {['Pending', 'Approved'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`rounded-md px-4 py-2 text-sm ${
                        statusFilter === status
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-boxdark'
                      }`}
                    >
                      {status} (
                      {
                        campaignItems.filter(
                          (item) => item.itemCampaign.status === status,
                        ).length
                      }
                      )
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Item Image
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Name
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Owner
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Category
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Status
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(viewMode === 'campaign-items'
                      ? campaignItems.filter(
                          (item) =>
                            statusFilter === 'All' ||
                            item.itemCampaign.status === statusFilter,
                        )
                      : suggestedItems
                    ).map((item) => (
                      <tr key={item.id}>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <div className="h-12 w-12 overflow-hidden rounded-lg">
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {item.name}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {item.owner_Name}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white">
                            {item.category.name}
                          </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          {viewMode === 'campaign-items' && (
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                                item.itemCampaign.status === 'Approved'
                                  ? 'bg-success/10 text-success'
                                  : 'bg-warning/10 text-warning'
                              }`}
                            >
                              {item.itemCampaign.status}
                            </span>
                          )}
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <button
                            className="hover:text-primary"
                            onClick={() => {
                              setSelectedItem(item);
                              setIsItemDetailModalOpen(true);
                            }}
                          >
                            <svg
                              className="h-6 w-6 text-blue-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      <ItemDetailModal
        isOpen={isItemDetailModalOpen}
        onClose={() => setIsItemDetailModalOpen(false)}
        item={selectedItem}
        viewMode={viewMode}
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

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-boxdark p-6 rounded-lg">
            <h3 className="mb-4">Xác nhận hủy chiến dịch</h3>
            <p className="mb-6">Có chắc chắn muốn hủy chiến dịch này không?</p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray hover:bg-opacity-90 px-4 py-2 rounded"
                onClick={() => setShowCancelModal(false)}
              >
                Không
              </button>
              <button
                className="bg-danger text-white px-4 py-2 rounded"
                onClick={handleConfirmCancel}
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
