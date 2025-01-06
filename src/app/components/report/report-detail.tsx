import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/api/axiosInstance";
import { AlertTriangle, FileText } from "lucide-react";
import {
  ReportResponse,
  Transaction,
  TransactionResponse,
} from "@/app/types/types";
import { ReportDetail } from "@/app/types/types";

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string | null;
}

export function ReportDialog({
  isOpen,
  onClose,
  transactionId,
}: ReportDialogProps) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!transactionId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch transaction details
        const transactionRes = await axiosInstance.get<TransactionResponse>(
          `/transaction/${transactionId}`
        );

        if (transactionRes.data.isSuccess) {
          setTransaction(transactionRes.data.data[0]);

          // Fetch report details using transaction ID
          const reportRes = await axiosInstance.get<ReportResponse>(
            `/admin/reports/transaction/${transactionRes.data.data[0].id}`
          );

          if (reportRes.data.isSuccess) {
            setReport(reportRes.data.data);
          } else {
            setError(reportRes.data.message);
          }
        } else {
          setError(transactionRes.data.message);
        }
      } catch (err) {
        setError("Không thể tải thông tin báo cáo");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && transactionId) {
      fetchData();
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
          report &&
          transaction && (
            <div className="space-y-6 p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Chi tiết báo cáo</h2>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    report.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : report.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {report.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Reporter Section */}
                <div className="p-4 bg-red-50 rounded-lg space-y-4">
                  <h3 className="font-semibold text-lg text-red-800">
                    Người báo cáo
                  </h3>
                  <div className="flex items-center gap-3">
                    <Image
                      src={report.reporter.image}
                      alt={report.reporter.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">{report.reporter.name}</p>
                    </div>
                  </div>
                </div>

                {/* Reported Section */}
                <div className="p-4 bg-orange-50 rounded-lg space-y-4">
                  <h3 className="font-semibold text-lg text-orange-800">
                    Người bị báo cáo
                  </h3>
                  <div className="flex items-center gap-3">
                    <Image
                      src={report.reported.image}
                      alt={report.reported.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium">{report.reported.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Reasons */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">Lý do báo cáo</h3>
                <div className="space-y-2">
                  {report.reportReasons.map((reason) => (
                    <div
                      key={reason.id}
                      className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"
                    >
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <span>{reason.reason}</span>
                      <span className="ml-auto text-sm text-gray-500">
                        Điểm: {reason.point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction Info */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">
                  Thông tin giao dịch
                </h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">ID Giao dịch:</span>
                    <span>{transaction.id}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Ngày báo cáo:</span>
                    <span>
                      {format(new Date(report.createdAt), "dd/MM/yyyy HH:mm")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
