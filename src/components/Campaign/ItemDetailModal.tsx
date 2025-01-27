import React, { useEffect, useState } from 'react';
import { MapPin, Gift, Package, Tag, Clock, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  approveItem,
  rejectItem,
  getVolunteers,
  addItemToCampaign,
} from '@/services/CampaignService';
import toast from 'react-hot-toast';

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onRefresh?: () => void;
  viewMode?: 'campaign-items' | 'suggested-items';
  campaignId?: string;
}

const translateCondition = (condition: string): string => {
  const conditionMap: Record<string, string> = {
    Used: 'Đã sử dụng',
    New: 'Mới',
  };
  return conditionMap[condition] || condition;
};

const translateStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    Pending: 'Đang chờ',
    Approved: 'Đã phê duyệt',
  };
  return statusMap[status] || status;
};

const translateGift = (isGift: boolean): string => {
  return isGift ? 'Có' : 'Không';
};

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  isOpen,
  onClose,
  item,
  onRefresh,
  viewMode,
  campaignId,
}) => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] =
    useState<boolean>(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsApproveDialogOpen(false);
      setSelectedVolunteer('');
      setAppointmentDate('');
      setVolunteers([]);
    }
  }, [isOpen]);

  const fetchVolunteers = async () => {
    try {
      const response = await getVolunteers();
      if (response.isSuccess) {
        setVolunteers(response.data);
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    }
  };

  const handleApproveClick = () => {
    fetchVolunteers();
    setIsApproveDialogOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (!selectedVolunteer || !appointmentDate) return;

    setLoading(true);
    try {
      await approveItem({
        itemId: item.id,
        volunteerId: selectedVolunteer,
        appointmentDate: appointmentDate.replace('Z', ''),
        campaignId: campaignId,
      });
      setIsApproveDialogOpen(false);
      onClose();
      onRefresh?.();
    } catch (error) {
      console.error('Error approving item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setIsRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    setLoading(true);
    try {
      await rejectItem({
        itemId: item.id,
        campaignId: item.itemCampaign.campaignId,
      });
      setIsRejectDialogOpen(false);
      onClose();
      onRefresh?.();
    } catch (error) {
      console.error('Error rejecting item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAddItemCampaign = async () => {
    fetchVolunteers();
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmAdd = async () => {
    try {
      if (!campaignId) {
        toast.error('Campaign ID is required');
        return;
      }
      setIsSubmitting(true);
      await addItemToCampaign(item.id, campaignId);
      setIsConfirmDialogOpen(false);
      setIsApproveDialogOpen(true);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm sản phẩm!');
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen || !item) return null;

  return (
    <>
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
              {/* Image Gallery */}
              <div className="relative h-48 w-full overflow-hidden rounded-xl md:h-64">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h1 className="text-2xl font-bold text-white md:text-3xl">
                    {item.name}
                  </h1>
                </div>
              </div>

              {/* Status & Basic Info */}
              <div className="grid grid-cols-1 gap-6 px-2 md:grid-cols-2">
                <div className="space-y-4">
                  {/* Status */}
                  <div>
                    <span className="inline-flex rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
                      {translateStatus(item.status)}
                    </span>
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-gray-500" />
                      <span className="text-sm">
                        Tình trạng:{' '}
                        <span className="font-medium">
                          {translateCondition(item.condition)}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-gray-500" />
                      <span className="text-sm">
                        Quà tặng:{' '}
                        <span className="font-medium">
                          {translateGift(item.isGift)}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-5 w-5 text-gray-500" />
                      <span className="text-sm">
                        Danh mục:{' '}
                        <span className="font-medium">
                          {item.category.name}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Owner Info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={item.profilePicture}
                      alt={item.owner_Name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">{item.owner_Name}</p>
                      <p className="text-xs text-gray-500">Chủ sở hữu</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <span className="text-sm">
                      Địa chỉ: {item.address.address}
                    </span>
                  </div>

                  {/* Available Time */}
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="text-sm">
                      Thời gian rảnh: {item.availableTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="px-2">
                <h3 className="text-base font-bold text-black dark:text-gray-400">
                  Mô tả chi tiết
                </h3>
                <p className="mt-2 text-sm text-gray-900 dark:text-white">
                  {item.description}
                </p>
              </div>

              {/* Campaign Info if exists */}
              {item.itemCampaign && (
                <div className="px-2">
                  <h3 className="mb-3 text-base font-bold text-black dark:text-gray-400">
                    Chiến dịch liên quan
                  </h3>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.itemCampaign.bannerPicture}
                        alt={item.itemCampaign.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-medium">
                          {item.itemCampaign.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(
                            item.itemCampaign.startDate,
                          ).toLocaleDateString()}{' '}
                          -
                          {new Date(
                            item.itemCampaign.endDate,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 mt-6 flex justify-end gap-4 border-t bg-white p-4 dark:bg-boxdark">
              {viewMode === 'campaign-items' &&
              item.itemCampaign.status === 'Pending' ? (
                <>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={loading}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Từ chối
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleApproveClick}
                    disabled={loading}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Phê duyệt
                  </Button>
                </>
              ) : viewMode === 'suggested-items' && !item.itemCampaign ? (
                <Button
                  variant="default"
                  onClick={handleConfirmAddItemCampaign}
                  disabled={loading}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Thêm vào chiến dịch
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Approve Dialog */}
      {isApproveDialogOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center overflow-hidden bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-boxdark">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Chọn tình nguyện viên</h2>
              <button
                onClick={() => setIsApproveDialogOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Ngày hẹn
                </label>
                <input
                  type="datetime-local"
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Chọn tình nguyện viên
                </label>
                <select
                  className={`w-full rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark ${
                    !appointmentDate ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  value={selectedVolunteer}
                  onChange={(e) => setSelectedVolunteer(e.target.value)}
                  disabled={!appointmentDate}
                >
                  <option value="">Chọn tình nguyện viên</option>
                  {volunteers.map((volunteer) => (
                    <option key={volunteer.userId} value={volunteer.userId}>
                      {volunteer.username} - {volunteer.address[0]?.address}
                    </option>
                  ))}
                </select>
                {!appointmentDate && (
                  <p className="mt-1 text-xs text-red-500">
                    Vui lòng chọn ngày hẹn trước!
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsApproveDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  variant="default"
                  onClick={handleApproveConfirm}
                  disabled={loading || !selectedVolunteer || !appointmentDate}
                >
                  Chấp nhận
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {isRejectDialogOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center overflow-hidden bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-medium">
              Xác nhận từ chối sản phẩm này
            </h3>
            <p className="mb-6">Bạn có chắc chắn từ chối sản phẩm này?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsRejectDialogOpen(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={confirmReject}
                className="rounded-lg bg-danger px-4 py-2 text-white hover:bg-danger/90"
              >
                Từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Add Item to Campaign */}
      {isConfirmDialogOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center overflow-hidden bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-bold">Xác nhận thêm sản phẩm</h3>
            <p className="mb-6">
              Bạn có chắc chắn muốn thêm sản phẩm này vào chiến dịch?
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setIsConfirmDialogOpen(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                variant="default"
                onClick={handleConfirmAdd}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Có'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ItemDetailModal;
