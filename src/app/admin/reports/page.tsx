"use client";
import axiosInstance from "@/app/api/axiosInstance";
import { Report } from "@/app/types/types";
import { formatDate } from "@/app/utils/format-date";
import { CheckCircle, Eye, XCircle } from "lucide-react";
import React, { useState, useEffect } from "react";

const AdminReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axiosInstance.get("admin/reports");
        if (response.data.isSuccess) {
          setReports(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-orange-500 px-6 py-4 flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">
            Quản lý báo cáo vi phạm
          </h1>
          <span className="bg-white px-3 py-1 rounded-full text-orange-500 text-sm font-medium">
            {reports.length} báo cáo
          </span>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full divide-y divide-gray-200">
                
              <thead className="bg-orange-50">
                  <tr className="bg-orange-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-orange-700">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-orange-700">
                      Người báo cáo
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-orange-700">
                      Người bị báo cáo
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-orange-700">
                      Lý do
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-orange-700">
                      Thời gian
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-orange-700">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {!!reports &&
                    reports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {report.id.slice(0, 8)}...
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {report.reporterName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {report.reportedName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {report.reportReasons}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatDate(report.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex justify-center gap-2">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {}}
                                  className="p-2 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => {}}
                                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>

                                <button
                                  onClick={() => {}}
                                  className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;