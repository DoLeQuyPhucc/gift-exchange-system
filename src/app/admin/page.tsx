'use client'

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  condition: string;
  isGift: boolean;
  point: number;
  owner_id: string;
  owner_Name: string;
  profilePicture: string;
  available: boolean;
  createdAt: string;
  expiresAt: string;
  updatedAt: string;
  images: string[];
  quantity: number;
  dateRemaining: number;
  status: string;
}

const ProductDetailsModal = ({ product }: { product: Product }) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="col-span-2">
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg"
      />
    </div>
    <div className="space-y-4 col-span-2">
      <h3 className="text-xl font-bold">{product.name}</h3>
      <p className="text-gray-600">{product.description}</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Category</p>
          <p>{product.category}</p>
        </div>
        <div>
          <p className="font-semibold">Condition</p>
          <p>{product.condition}</p>
        </div>
        <div>
          <p className="font-semibold">Points</p>
          <p>{product.point}</p>
        </div>
        <div>
          <p className="font-semibold">Quantity</p>
          <p>{product.quantity}</p>
        </div>
        <div>
          <p className="font-semibold">Created At</p>
          <p>{new Date(product.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="font-semibold">Expires At</p>
          <p>{new Date(product.expiresAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="font-semibold">Updated At</p>
          <p>{new Date(product.updatedAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="font-semibold">Date Remaining</p>
          <p>{product.dateRemaining} days</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <img
          src={product.profilePicture}
          alt={product.owner_Name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold">Owner</p>
          <p>{product.owner_Name}</p>
        </div>
      </div>
    </div>
  </div>
);

const ProductDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  const fetchProducts = async () => {
    const response = await axiosInstance.get("items/admin/view-all");
    if (response.data.isSuccess) {
      const sortedProducts = response.data.data.sort((a: Product, b: Product) => {
        if (a.status === "Pending" && b.status === "Approved") return -1;
        if (a.status === "Approved" && b.status === "Pending") return 1;
        return 0;
      });
      setProducts(sortedProducts);
    } else {
      toast.error(response.data.message);
    }
  };

  const handleApprove = async (product: Product) => {
    const response = await axiosInstance.post(`items/approve/${product.id}`);
    if (response.data.isSuccess) {
      await fetchProducts();
      toast.success("Product approved successfully");
    } else {
      toast.error(response.data.message);
    }
  };

  const handleReject = async (product: Product) => {
    const response = await axiosInstance.post(`items/reject/${product.id}`);
    if (response.data.isSuccess) {
      await fetchProducts();
      toast.success("Product rejected successfully");
    } else {
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <Card className="w-full mx-auto p-4">
      <CardHeader>
        <CardTitle className="text-2xl text-orange-500">Product Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Points</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">{product.point}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        product.status === "Pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : product.status === "Approved"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        title="View Details"
                      >
                        <Eye size={20} />
                      </button>
                      {product.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(product)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                            title="Approve"
                          >
                            <CheckCircle size={20} />
                          </button>
                          <button
                            onClick={() => handleReject(product)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                            title="Reject"
                          >
                            <XCircle size={20} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4">
            <nav>
              <ul className="inline-flex items-center -space-x-px">
                {[...Array(Math.ceil(products.length / productsPerPage)).keys()].map((number) => (
                  <li key={number}>
                    <button
                      onClick={() => setCurrentPage(number + 1)}
                      className={`px-3 py-2 leading-tight ${
                        currentPage === number + 1
                          ? "bg-blue-500 text-white"
                          : "bg-white border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      }`}
                    >
                      {number + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Product Details</DialogTitle>
            </DialogHeader>
            {selectedProduct && <ProductDetailsModal product={selectedProduct} />}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ProductDashboard;