'use client'

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Filter, Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight, Calendar, Package2, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axiosInstance from "@/app/api/axiosInstance";
import { Product } from "@/app/types/types";
import { formatDate } from "@/app/utils/format-date";

const ProductDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("items/admin/view-all");
      if (response.data.isSuccess) {
        const sortedProducts = response.data.data.sort((a: Product, b: Product) => {
          if (a.status === "Pending" && b.status !== "Pending") return -1;
          if (a.status !== "Pending" && b.status === "Pending") return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
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
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to approve product");
    }
  };

  const handleReject = async (product: Product) => {
    try {
      const response = await axiosInstance.post(`items/reject/${product.id}`);
      if (response.data.isSuccess) {
        await fetchProducts();
        toast.success("Product rejected successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to reject product");
    }
  };

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.subCategory.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => 
      filterStatus === "all" ? true : product.status.toLowerCase() === filterStatus
    );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-md overflow-hidden ">
          <div className="bg-orange-500 px-6 py-4 flex items-center justify-between">
            <h1 className="text-white text-2xl font-bold">Quản lí các sản phẩm</h1>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-40 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
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
                    <th className="px-4 py-3 text-left text-sm font-semibold text-orange-700">Product</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-orange-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-orange-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.subCategory.category.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1
                            ${product.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : product.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full
                            ${product.status === "Pending"
                              ? "bg-yellow-500"
                              : product.status === "Approved"
                              ? "bg-green-500"
                              : "bg-red-500"
                            }`}
                          />
                          {product.status}
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
                          {product.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(product)}
                                className="p-2 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleReject(product)}
                                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-xl">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed
                       border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed
                       border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{((currentPage - 1) * productsPerPage) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * productsPerPage, filteredProducts.length)}
                </span> of{' '}
                <span className="font-medium">{filteredProducts.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                                ${isCurrentPage 
                                  ? 'z-10 bg-orange-500 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500'
                                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                                }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
          <DialogContent className="max-w-4xl">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-2xl font-bold text-gray-900">Product Details</DialogTitle>
              <p className="text-sm text-gray-500">View complete information about this product</p>
            </DialogHeader>
            
            {selectedProduct && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
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
                      <div key={index} className="aspect-square overflow-hidden rounded-lg border border-gray-100">
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
                    <h3 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h3>
                    <p className="mt-2 text-gray-600">{selectedProduct.description}</p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                      ${selectedProduct.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : selectedProduct.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full
                        ${selectedProduct.status === "Pending"
                          ? "bg-yellow-500"
                          : selectedProduct.status === "Approved"
                          ? "bg-green-500"
                          : "bg-red-500"
                        }`}
                      />
                      {selectedProduct.status}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-orange-500" />
                        <span className="text-sm font-semibold text-gray-700">Category</span>
                      </div>
                      <p className="mt-1 text-orange-600 font-medium">{selectedProduct.subCategory.category.name}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Package2 className="w-5 h-5 text-orange-500" />
                        <span className="text-sm font-semibold text-gray-700">Condition</span>
                      </div>
                      <p className="mt-1 text-orange-600 font-medium">{selectedProduct.condition}</p>
                    </div>
                  </div>

                  {/* Points & Quantity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-4 rounded-xl">
                      <p className="text-sm font-semibold text-gray-700">Quantity</p>
                      <p className="mt-1 text-3xl font-bold text-orange-500">{selectedProduct.quantity}</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        <div>
                          <p className="text-xs text-gray-500">Created</p>
                          <p className="text-sm font-medium">{formatDate(selectedProduct.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        <div>
                          <p className="text-xs text-gray-500">Expires</p>
                          <p className="text-sm font-medium">{formatDate(selectedProduct.expiresAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Owner Info */}
                  <div className="flex items-center gap-3 bg-orange-50 p-4 rounded-xl">
                    <img
                      src={selectedProduct.profilePicture}
                      alt={selectedProduct.owner_Name}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Owner</p>
                      <p className="font-medium text-gray-900">{selectedProduct.owner_Name}</p>
                    </div>
                  </div>  

                  {/* Action Buttons */}
                  {selectedProduct.status === "Pending" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          handleApprove(selectedProduct);
                          setIsModalOpen(false);
                        }}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg
                                 transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          handleReject(selectedProduct);
                          setIsModalOpen(false);
                        }}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg
                                 transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </div>
  );
};

export default ProductDashboard;