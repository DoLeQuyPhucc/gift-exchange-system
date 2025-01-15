import { Dialog, DialogContent } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { FileText, MapPin, Phone } from 'lucide-react';
import { Transaction, TransactionResponse } from '@/types/types';

interface TransactionDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string | null;
}

export function TransactionDetailsDialog({
  isOpen,
  onClose,
  transactionId,
}: TransactionDetailsDialogProps) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await axiosInstance.get<TransactionResponse>(
          `/transaction/${transactionId}`,
        );
        if (response.data.isSuccess) {
          setTransaction(response.data.data[0]);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Không thể tải thông tin giao dịch');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && transactionId) {
      fetchTransaction();
    }
  }, [transactionId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          transaction && (
            <div className="space-y-6 p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Chi tiết giao dịch</h2>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    transaction.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {transaction.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Charitarian Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Người trao tặng</h3>
                  <div className="flex items-center gap-3">
                    <img
                      src={transaction.charitarian.image}
                      alt={transaction.charitarian.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">
                        {transaction.charitarian.name}
                      </p>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">
                          {transaction.charitarianPhone}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">
                      {transaction.charitarianItem.itemName}
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      {transaction.charitarianItem.itemImages.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Item ${i + 1}`}
                          width={80}
                          height={80}
                          className="rounded-md object-cover w-full h-20"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Requester Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Người nhận</h3>
                  <div className="flex items-center gap-3">
                    <img
                      src={transaction.requester.image}
                      alt={transaction.requester.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">
                        {transaction.requester.name}
                      </p>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">
                          {transaction.requesterPhone}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">
                      {transaction.requesterItem.itemName}
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      {transaction.requesterItem.itemImages.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Item ${i + 1}`}
                          width={80}
                          height={80}
                          className="rounded-md object-cover w-full h-20"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">
                  Thông tin giao dịch
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Ngày tạo:</span>
                      <span>
                        {format(
                          new Date(transaction.createdAt),
                          'dd/MM/yyyy HH:mm',
                        )}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Ngày hẹn:</span>
                      <span>
                        {format(
                          new Date(transaction.appointmentDate),
                          'dd/MM/yyyy HH:mm',
                        )}
                      </span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Địa chỉ người trao:</span>
                      <span>{transaction.charitarianAddress.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Địa chỉ người nhận:</span>
                      <span>{transaction.requesterAddress.address}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Images */}
              {transaction.transactionImages.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-lg mb-3">
                    Hình ảnh giao dịch
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {transaction.transactionImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Transaction ${i + 1}`}
                        width={160}
                        height={160}
                        className="rounded-lg object-cover w-full h-40"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
