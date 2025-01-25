import React from 'react';
import { CampaignDetail } from '@/types/types';

interface CampaignDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignDetail | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Planned':
      return 'bg-warning/10 text-warning';
    case 'Ongoing':
      return 'bg-success/10 text-success';
    case 'Completed':
      return 'bg-primary/10 text-primary';
    case 'Cancelled':
      return 'bg-danger/10 text-danger';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const CampaignDetailModal: React.FC<CampaignDetailModalProps> = ({
  isOpen,
  onClose,
  campaign,
}) => {
  if (!isOpen || !campaign) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-black/50">
      <div className="relative mx-auto h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white p-4 shadow-xl dark:bg-boxdark md:p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-gray-500 backdrop-blur-sm transition-colors hover:bg-gray-100 hover:text-gray-700"
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

        {/* Scrollable Content */}
        <div className="h-full overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="relative h-48 w-full overflow-hidden rounded-xl md:h-64">
              <img
                src={campaign.bannerPicture}
                alt={campaign.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h1 className="text-2xl font-bold text-white md:text-3xl">
                  {campaign.name}
                </h1>
              </div>
            </div>

            {/* Description */}
            <div className="px-2">
              <h3 className="text-base font-bold text-black dark:text-gray-400">
                Mô tả chi tiết
              </h3>
              <p className="mt-2 text-sm text-gray-900 dark:text-white">
                {campaign.description}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 gap-6 px-2 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-black dark:text-gray-400">
                    Trạng thái
                  </h3>
                  <span
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                      campaign.status,
                    )}`}
                  >
                    {campaign.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-black dark:text-gray-400">
                    Thời gian
                  </h3>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Start: {new Date(campaign.startDate).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      End: {new Date(campaign.endDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-black dark:text-gray-400">
                    Danh mục
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {campaign.categories.map((category) => (
                      <span
                        key={category.id}
                        className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-black dark:text-gray-400">
                    Ngày tạo
                  </h3>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(campaign.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            {campaign.images.length > 0 && (
              <div className="px-2">
                <h3 className="mb-3 text-base font-bold text-black dark:text-gray-400">
                  Các hình ảnh
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {campaign.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square overflow-hidden rounded-lg"
                    >
                      <img
                        src={image}
                        alt={`Campaign image ${index + 1}`}
                        className="h-full w-full object-cover transition-transform hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Campaign Statistics */}
            <div className="px-2">
              <h3 className="text-base font-bold text-black dark:text-gray-400 mb-4">
                Thống kê chi tiết
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-primary/10 rounded-lg p-4">
                  <h4 className="text-sm text-gray-600 mb-1">
                    Tổng số người tham gia
                  </h4>
                  <p className="text-2xl font-bold text-primary">
                    {campaign.totalParticipants}
                  </p>
                </div>
                <div className="bg-primary/10 rounded-lg p-4">
                  <h4 className="text-sm text-gray-600 mb-1">Tổng sản phẩm</h4>
                  <p className="text-2xl font-bold text-primary">
                    {campaign.totalItems}
                  </p>
                </div>
              </div>
            </div>

            {/* Top Participants */}
            {campaign.topParticipants &&
              campaign.topParticipants.length > 0 && (
                <div className="px-2 mt-6">
                  <h3 className="text-base font-bold text-black dark:text-gray-400 mb-4">
                    Top người tham gia
                  </h3>
                  <div className="space-y-4">
                    {campaign.topParticipants.map((participant) => (
                      <div
                        key={participant.userId}
                        className="flex items-center gap-4 bg-gray-50 rounded-lg p-4"
                      >
                        <img
                          src={participant.profilePicture}
                          alt={participant.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {participant.username}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Points: {participant.point}
                          </p>
                          <p className="text-sm text-gray-500">
                            Joined:{' '}
                            {new Date(
                              participant.dateJoined,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailModal;
