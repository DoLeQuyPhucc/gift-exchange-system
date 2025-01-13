"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Package2,
  Tag,
  MapPin,
  FileText,
  Flag,
  RotateCw,
  Image,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axiosInstance from "@/app/api/axiosInstance";
import { Product, TimeRange } from "@/app/types/types";
import { formatDate } from "@/app/utils/format-date";
import { TransactionDetailsDialog } from "@/app/components/transaction/transaction-detail";
import { ReportDialog } from "@/app/components/report/report-detail";
import RejectDialog from "@/app/components/reject/reject-modal";

const ProductDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] =
    useState<string>("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [productToReject, setProductToReject] = useState<Product | null>(null);

  const [timeRange, setTimeRange] = useState("all");

  // Hàm lọc sản phẩm theo khoảng thời gian
  const filterByTimeRange = (products: Product[]): Product[] => {
    const now = new Date();

    return products.filter((product) => {
      const createdAt = new Date(product.createdAt);

      switch (timeRange) {
        case "last24hours":
          return now.getTime() - createdAt.getTime() <= 24 * 60 * 60 * 1000;
        case "last7days":
          return now.getTime() - createdAt.getTime() <= 7 * 24 * 60 * 60 * 1000;
        case "last30days":
          return (
            now.getTime() - createdAt.getTime() <= 30 * 24 * 60 * 60 * 1000
          );
        default:
          return true; // Tất cả thời gian
      }
    });
  };

  // Sử dụng hàm lọc trong việc hiển thị sản phẩm
  const filteredProducts = filterByTimeRange(products)
    .filter(
      (product) =>
        product.name.includes(searchTerm) ||
        product.category.name.includes(searchTerm)
    )
    .filter((product) =>
      filterStatus === "all" ? true : product.status === filterStatus
    );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const sortOrder = [
    "Pending",
    "Approved",
    "In_Transaction",
    "Exchanged",
    "Rejected",
    "Out_of_date",
  ];

  const handleReload = async () => {
    setIsLoading(true);
    try {
      await fetchProducts();
      toast.success("Products reloaded successfully");
    } catch (error) {
      toast.error("Failed to reload products");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("items/admin/view-all");
      if (response.data.isSuccess) {
        const sortedProducts = response.data.data.sort(
          (a: Product, b: Product) => {
            const statusA = a.status;
            const statusB = b.status;
            const statusComparison =
              sortOrder.indexOf(statusA) - sortOrder.indexOf(statusB);

            if (statusComparison !== 0) {
              return statusComparison;
            }

            // If statuses are the same, sort by createdAt
            const createdAtComparison =
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (createdAtComparison !== 0) {
              return createdAtComparison;
            }

            // If createdAt dates are the same, sort by expiresAt
            return (
              new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
            );
          }
        );
        setProducts(sortedProducts);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleApprove = async (product: Product) => {
    try {
      const response = await axiosInstance.post(`items/approve/${product.id}`);
      if (response.data.isSuccess) {
        await fetchProducts();
        toast.success("Product approved successfully");
        await axiosInstance.post(
          `notification/send?userId=${product.owner_id}`,
          {
            type: "Approved Item",
            message: "Sản phẩm của bạn đã được duyệt.",
            title: "Thông báo",
            entity: "Item",
            entityId: product.id,
          }
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to approve product");
    }
  };

  const handleReject = async (rejectMessage: string) => {
    if (!productToReject) return;

    try {
      const response = await axiosInstance.post(
        `items/reject/${productToReject.id}`,
        {
          reject_message: rejectMessage,
        }
      );

      if (response.data.isSuccess) {
        await fetchProducts();
        toast.success("Product rejected successfully");
        await axiosInstance.post(
          `notification/send?userId=${productToReject.owner_id}`,
          {
            type: "Rejected Item",
            message: "Sản phẩm của bạn đã bị từ chối",
            title: "Thông báo",
            entity: "Item",
            entityId: productToReject.id,
          }
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to reject product");
      console.log(error);
    }
  };

  const statusCounts = products.reduce((acc, product) => {
    const status = product.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const formatAvailableTime = (timeString: string) => {
    if (!timeString) return "Không xác định";
    return formatTimeRangeDisplay(timeString);
  };

  const parseTimeRange = (
    timeString: string
  ): {
    type: string;
    timeRanges: TimeRange[];
  } => {
    if (!timeString) return { type: "", timeRanges: [] };

    const [type, ...rest] = timeString.split(" ");

    // Xử lý customPerDay với format mới
    if (type === "customPerDay") {
      const ranges = rest
        .join(" ")
        .split("|")
        .map((segment) => {
          const [timeRange, day] = segment.trim().split(" ");
          const [start, end] = timeRange.split("_");
          const [startHour, startMinute] = start.split(":").map(Number);
          const [endHour, endMinute] = end.split(":").map(Number);

          return {
            day: day,
            startHour,
            startMinute,
            endHour,
            endMinute,
          };
        });

      return { type, timeRanges: ranges };
    } else {
      const [hours, days] = rest;
      const [start, end] = hours.split("_");
      const [startHour, startMinute] = start.split(":").map(Number);
      const [endHour, endMinute] = end.split(":").map(Number);

      const daysArray = days.split("_");
      const ranges = daysArray.map((day) => ({
        day,
        startHour,
        startMinute,
        endHour,
        endMinute,
      }));

      return { type, timeRanges: ranges };
    }

    return { type, timeRanges: [] };
  };

  const formatTimeRangeDisplay = (timeString: string): JSX.Element => {
    const { type, timeRanges } = parseTimeRange(timeString);

    const dayTranslations: Record<string, string> = {
      "2": "Thứ Hai",
      "3": "Thứ Ba",
      "4": "Thứ Tư",
      "5": "Thứ Năm",
      "6": "Thứ Sáu",
      "7": "Thứ Bảy",
      "8": "Chủ Nhật",
      mon: "Thứ Hai",
      tue: "Thứ Ba",
      wed: "Thứ Tư",
      thu: "Thứ Năm",
      fri: "Thứ Sáu",
      sat: "Thứ Bảy",
      sun: "Chủ Nhật",
    };

    // Group timeRanges by same time
    const groupedRanges = timeRanges.reduce((acc, curr) => {
      const key = `${String(curr.startHour).padStart(2, "0")}:${String(
        curr.startMinute
      ).padStart(2, "0")}-${String(curr.endHour).padStart(2, "0")}:${String(
        curr.endMinute
      ).padStart(2, "0")}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr.day);
      return acc;
    }, {} as Record<string, string[]>);

    return (
      <div className="space-y-3">
        {Object.entries(groupedRanges).map(([timeRange, days], index) => (
          <div key={index} className="bg-orange-50 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-orange-100 text-orange-800">
                {timeRange}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {days.map((day, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-white text-gray-700 border border-gray-200"
                >
                  {dayTranslations[day] || day}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-orange-500 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-white text-xl sm:text-2xl font-bold">
              Quản lí các sản phẩm
            </h1>
            <div className="flex items-center gap-4">
              <select
                className="border border-gray-300 rounded-lg py-2 px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="all">Tất cả thời gian</option>
                <option value="last24hours">24 giờ qua</option>
                <option value="last7days">7 ngày qua</option>
                <option value="last30days">30 ngày qua</option>
              </select>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  width="20"
                  height="20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16l4-4-4-4m8 0l-4 4 4 4"
                  />
                </svg>
              </div>

              <button
                onClick={handleReload}
                className={`p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all ${
                  isLoading ? "animate-spin" : ""
                }`}
                title="Reload products"
              >
                <RotateCw size={20} />
              </button>
            </div>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { status: "Pending", label: "Đang chờ", color: "yellow" },
              { status: "Approved", label: "Đã duyệt", color: "green" },
              {
                status: "In_Transaction",
                label: "Đang trao đổi",
                color: "blue",
              },
              { status: "Exchanged", label: "Đã trao đổi", color: "purple" },
              { status: "Out_of_date", label: "Hết hạn", color: "gray" },
              { status: "Rejected", label: "Đã từ chối", color: "red" },
            ].map(({ status, label, color }) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === status
                    ? `bg-${color}-500 text-white`
                    : `bg-${color}-100 text-${color}-700 hover:bg-${color}-200`
                }`}
              >
                {label}: {statusCounts[status] || 0}
              </button>
            ))}

            {filterStatus !== "all" && (
              <button
                onClick={() => setFilterStatus("all")}
                className="col-span-full px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-center transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white shadow-sm overflow-hidden p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-orange-50">
                  <tr className="bg-orange-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-orange-700">
                      Sản phẩm
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-orange-700">
                      Ngày tạo
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-orange-700">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-orange-700">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {product.category.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500">
                          {formatDate(product.createdAt)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1
    ${
      product.status === "Pending"
        ? "bg-yellow-100 text-yellow-700"
        : product.status === "Approved"
        ? "bg-green-100 text-green-700"
        : product.status === "In_Transaction"
        ? "bg-blue-100 text-blue-700"
        : product.status === "Exchanged"
        ? "bg-purple-100 text-purple-700"
        : product.status === "Out_of_date"
        ? "bg-gray-100 text-gray-700"
        : product.status === "Rejected"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-700"
    }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full
      ${
        product.status === "Pending"
          ? "bg-yellow-500"
          : product.status === "Approved"
          ? "bg-green-500"
          : product.status === "In_Transaction"
          ? "bg-blue-500"
          : product.status === "Exchanged"
          ? "bg-purple-500"
          : product.status === "Out_of_date"
          ? "bg-gray-500"
          : product.status === "Rejected"
          ? "bg-red-500"
          : "bg-gray-500"
      }`}
                          />
                          {product.status === "Pending"
                            ? "Đang chờ duyệt"
                            : product.status === "Approved"
                            ? "Được duyệt"
                            : product.status === "In_Transaction"
                            ? "Đang trao đổi"
                            : product.status === "Exchanged"
                            ? "Đã trao đổi"
                            : product.status === "Out_of_date"
                            ? "Hết hạn"
                            : product.status === "Rejected"
                            ? "Đã từ chối"
                            : product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {product.status === "Pending" ? (
                            <>
                              <button
                                onClick={() => handleApprove(product)}
                                className="p-2 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => {
                                  setProductToReject(product);
                                  setIsRejectDialogOpen(true);
                                }}
                                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          ) : product.status === "Approved" ||
                            product.status === "In_Transaction" ||
                            product.status === "Exchanged" ? (
                            <button
                              onClick={() => {
                                setProductToReject(product);
                                setIsRejectDialogOpen(true);
                              }}
                              className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-xl">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed
                       border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed
                       border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    Tiếp theo
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {(currentPage - 1) * productsPerPage + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          currentPage * productsPerPage,
                          filteredProducts.length
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {filteredProducts.length}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 
                           hover:bg-gray-50 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        const isCurrentPage = pageNumber === currentPage;

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold
                                ${
                                  isCurrentPage
                                    ? "z-10 bg-orange-500 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                                    : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                                }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 
                           hover:bg-gray-50 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Dialog */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Thông tin sản phẩm
                </DialogTitle>
                <p className="text-sm text-gray-500">
                  Xem thông tin chi tiết về sản phẩm này
                </p>
              </DialogHeader>

              {selectedProduct && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 pb-6">
                  {/* Image Section */}
                  <div className="space-y-4">
                    <div className="aspect-square overflow-hidden rounded-2xl border-2 border-gray-100">
                      <img
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.images.slice(1).map((image, index) => (
                        <div
                          key={index}
                          className="aspect-square overflow-hidden rounded-lg border border-gray-100"
                        >
                          <img
                            src={image}
                            alt={`${selectedProduct.name} ${index + 2}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="space-y-6">
                    {/* Header */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Tên sản phẩm: {selectedProduct.name}
                      </h3>
                      <p className="mt-2 text-gray-600">
                        Mô tả: {selectedProduct.description}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1
    ${
      selectedProduct.status === "Pending"
        ? "bg-yellow-100 text-yellow-700"
        : selectedProduct.status === "Approved"
        ? "bg-green-100 text-green-700"
        : selectedProduct.status === "In_Transaction"
        ? "bg-blue-100 text-blue-700"
        : selectedProduct.status === "Exchanged"
        ? "bg-purple-100 text-purple-700"
        : selectedProduct.status === "Out_of_date"
        ? "bg-gray-100 text-gray-700"
        : selectedProduct.status === "Rejected"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-700"
    }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full
      ${
        selectedProduct.status === "Pending"
          ? "bg-yellow-500"
          : selectedProduct.status === "Approved"
          ? "bg-green-500"
          : selectedProduct.status === "In_Transaction"
          ? "bg-blue-500"
          : selectedProduct.status === "Exchanged"
          ? "bg-purple-500"
          : selectedProduct.status === "Out_of_date"
          ? "bg-gray-500"
          : selectedProduct.status === "Rejected"
          ? "bg-red-500"
          : "bg-gray-500"
      }`}
                        />
                        {selectedProduct.status === "Pending"
                          ? "Đang chờ duyệt"
                          : selectedProduct.status === "Approved"
                          ? "Được duyệt"
                          : selectedProduct.status === "In_Transaction"
                          ? "Đang trao đổi"
                          : selectedProduct.status === "Exchanged"
                          ? "Đã trao đổi"
                          : selectedProduct.status === "Out_of_date"
                          ? "Hết hạn"
                          : selectedProduct.status === "Rejected"
                          ? "Đã từ chối"
                          : selectedProduct.status}
                      </span>
                    </div>

                    {/* Transaction Participants */}
                    <div className="space-y-4 mb-6">
                      {selectedProduct.charitarian && (
                        <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-4">
                          <img
                            src={selectedProduct.charitarian.image}
                            alt={selectedProduct.charitarian.name}
                            className="w-12 h-12 rounded-full border-2 border-blue-200"
                          />
                          <div>
                            <p className="text-sm text-blue-600 font-medium">
                              Người cho
                            </p>
                            <p className="font-semibold">
                              {selectedProduct.charitarian.name}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedProduct.requester && (
                        <div className="p-4 bg-green-50 rounded-lg flex items-center gap-4">
                          <img
                            src={selectedProduct.requester.image}
                            alt={selectedProduct.requester.name}
                            className="w-12 h-12 rounded-full border-2 border-green-200"
                          />
                          <div>
                            <p className="text-sm text-green-600 font-medium">
                              Người nhận
                            </p>
                            <p className="font-semibold">
                              {selectedProduct.requester.name}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Reject Message */}
                    {selectedProduct.status === "Rejected" &&
                      selectedProduct.rejectMessage && (
                        <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                            <div>
                              <p className="font-medium text-red-800 mb-1">
                                Lý do từ chối:
                              </p>
                              <p className="text-sm text-red-700">
                                {selectedProduct.rejectMessage}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Checking Information */}
                    {selectedProduct.checking && (
                      <div className="space-y-4 mb-6">
                        <div className="font-medium text-gray-700">
                          Thông tin kiểm duyệt
                        </div>

                        {/* Bad Words Section */}
                        {selectedProduct.checking.badWordsInName.length > 0 ||
                        selectedProduct.checking.badWordsInDescription.length >
                          0 ? (
                          <div className="bg-red-50 rounded-lg p-4">
                            {selectedProduct.checking.badWordsInName.length >
                              0 && (
                              <div className="mb-2">
                                <span className="font-medium text-red-800">
                                  Từ ngữ không phù hợp trong tên sản phẩm:
                                </span>
                                <div className="mt-1 text-red-600">
                                  {selectedProduct.checking.badWordsInName.join(
                                    ", "
                                  )}
                                </div>
                              </div>
                            )}

                            {selectedProduct.checking.badWordsInDescription
                              .length > 0 && (
                              <div>
                                <span className="font-medium text-red-800">
                                  Từ ngữ không phù hợp trong mô tả:
                                </span>
                                <div className="mt-1 text-red-600">
                                  {selectedProduct.checking.badWordsInDescription.join(
                                    ", "
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="bg-green-50 rounded-lg p-4">
                            <span className="font-medium text-green-800">
                              Không tìm thấy từ ngữ hoặc hình ảnh không phù hợp
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Image Tags */}
                    <div className="mt-6 space-y-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                          <Image className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-semibold text-gray-700">
                            NHẬN DIỆN HÌNH ẢNH
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(
                            selectedProduct.checking.imageTags
                          ).map(([imageKey, tags], idx) => (
                            <div
                              key={idx}
                              className="bg-white p-3 rounded-lg shadow-sm"
                            >
                              <p className="text-sm text-gray-600 mb-2">
                                Hình ảnh {idx + 1}:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {tags.map((tag, tagIdx) => (
                                  <div
                                    key={tagIdx}
                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-sm
                          bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                                  >
                                    <span className="text-blue-700">
                                      {tag.tag.en}
                                    </span>
                                    <span className="ml-1.5 text-blue-500 text-xs">
                                      {tag.confidence.toFixed(0)}%
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-orange-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Tag className="w-5 h-5 text-orange-500" />
                          <span className="text-sm font-semibold text-gray-700">
                            DANH MỤC
                          </span>
                        </div>
                        <p className="mt-1 text-orange-600 font-medium">
                          {selectedProduct.category.parentName}
                        </p>
                        <p className="mt-1 text-orange-600 font-medium">
                          {selectedProduct.category.name}
                        </p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2">
                          <Package2 className="w-5 h-5 text-orange-500" />
                          <span className="text-sm font-semibold text-gray-700">
                            TÌNH TRẠNG
                          </span>
                        </div>
                        <p className="mt-1 text-orange-600 font-medium">
                          {selectedProduct.condition === "New"
                            ? "Mới"
                            : selectedProduct.condition === "Used"
                            ? "Đã sử dụng"
                            : selectedProduct.condition}
                        </p>
                      </div>
                      <div
                        className={`bg-orange-50 p-4 rounded-xl ${
                          !selectedProduct.isGift ? "col-span-1" : "col-span-2"
                        }`}
                      >
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          THỜI GIAN
                        </p>
                        {formatAvailableTime(selectedProduct.availableTime)}
                      </div>

                      {selectedProduct.isGift === false && (
                        <div className="bg-orange-50 p-4 rounded-xl">
                          <p className="text-sm font-semibold text-gray-700">
                            DANH MỤC MUỐN ĐỔI
                          </p>
                          <p className="mt-1 text-orange-600 font-medium">
                            {selectedProduct.desiredCategory !== null
                              ? selectedProduct.desiredCategory?.name
                              : "Không có danh mục muốn đổi"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Points & Quantity */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-orange-50 p-4 rounded-xl">
                        <p className="text-sm font-semibold text-gray-700">
                          SỐ LƯỢNG
                        </p>
                        <p className="mt-1 text-3xl font-bold text-orange-500">
                          {selectedProduct.quantity}
                        </p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-xl">
                        <p className="text-sm font-semibold text-gray-700">
                          QUÀ TẶNG
                        </p>
                        <p className="mt-1 text-orange-600 font-medium">
                          {selectedProduct.isGift ? "Có" : "Không"}
                        </p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <div>
                            <p className="text-xs text-gray-500">Tạo lúc</p>
                            <p className="text-sm font-medium">
                              {formatDate(selectedProduct.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedProduct.status !== "Pending" && (
                            <>
                              <Calendar className="w-4 h-4 text-orange-500" />
                              <div>
                                <p className="text-xs text-gray-500">Hết hạn</p>
                                <p className="text-sm font-medium">
                                  {formatDate(selectedProduct.expiresAt)}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Add Address - New Section */}
                    <div className="bg-orange-50 p-4 rounded-xl col-span-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        <span className="text-sm font-semibold text-gray-700">
                          ĐỊA CHỈ
                        </span>
                      </div>
                      <p className="mt-1 text-orange-600 font-medium">
                        {selectedProduct.address?.address || "Không có địa chỉ"}
                      </p>
                    </div>

                    {/* Owner Info */}
                    <div className="flex items-center gap-3 bg-orange-50 p-4 rounded-xl">
                      <img
                        src={selectedProduct.profilePicture}
                        alt={selectedProduct.owner_Name}
                        className="w-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm text-gray-500">Chủ sở hữu</p>
                        <p className="font-medium text-gray-900">
                          {selectedProduct.owner_Name}
                        </p>
                      </div>
                    </div>

                    {/* Sticky Action Buttons */}
                    <div className="sticky bottom-0 bg-white pt-4 border-t">
                      {selectedProduct.status === "Pending" ? (
                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              handleApprove(selectedProduct);
                              setIsModalOpen(false);
                            }}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg
            transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Duyệt
                          </button>
                          <button
                            onClick={() => {
                              setProductToReject(selectedProduct);
                              setIsRejectDialogOpen(true);
                              setIsModalOpen(false);
                            }}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg
            transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-5 h-5" />
                            Từ chối
                          </button>
                        </div>
                      ) : selectedProduct.status === "Exchanged" ? (
                        <div className="flex gap-4">
                          <button
                            onClick={() => {
                              setSelectedTransactionId(
                                selectedProduct.transactionRequestIdOfItem || ""
                              );
                              setIsTransactionModalOpen(true);
                            }}
                            className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
            transition-colors flex items-center justify-center gap-2"
                          >
                            <FileText className="w-5 h-5" />
                            Chi tiết giao dịch
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTransactionId(
                                selectedProduct.transactionRequestIdOfItem || ""
                              );
                              setIsReportModalOpen(true);
                            }}
                            className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 
            transition-colors flex items-center justify-center gap-2"
                          >
                            <Flag className="w-5 h-5" />
                            Chi tiết báo cáo
                          </button>
                        </div>
                      ) : selectedProduct.status === "Approved" ||
                        selectedProduct.status === "In_Transaction" ? (
                        <div className="flex">
                          <button
                            onClick={() => {
                              setProductToReject(selectedProduct);
                              setIsRejectDialogOpen(true);
                              setIsModalOpen(false);
                            }}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg
                        transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-5 h-5" />
                            Từ chối
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <TransactionDetailsDialog
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        transactionId={selectedTransactionId}
      />

      <ReportDialog
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        transactionId={selectedTransactionId}
      />

      <RejectDialog
        isOpen={isRejectDialogOpen}
        onClose={() => {
          setIsRejectDialogOpen(false);
          setProductToReject(null);
        }}
        onConfirm={handleReject}
      />
    </div>
  );
};

export default ProductDashboard;
