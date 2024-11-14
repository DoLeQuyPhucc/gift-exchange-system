"use client";
import React, { useState, useEffect } from "react";
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

const ProductDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  const fetchProducts = async () => {
    const response = await axiosInstance.get("items/admin/view-all");
    if (response.data.isSuccess) {

      //sort pending products then approved products
      const sortedProducts = response.data.data.sort((a: Product, b: Product) => {
        if (a.status === "Pending" && b.status === "Approved") {
          return -1;
        } else if (a.status === "Approved" && b.status === "Pending") {
          return 1;
        } else {
          return 0;
        }
      });
      setProducts(sortedProducts);
    } else {
      toast.error(response.data.message);
    }
  };

  const handleApprove = async (product: Product) => {
    console.log(`Approving product: ${product.name}`);
    const response = await axiosInstance.post(`items/approve/${product.id}`);
    if (response.data.isSuccess === true) {
      setPendingProducts(pendingProducts.filter((p) => p.id !== product.id));
      toast.success("Product approved successfully");
    } else {
      toast.error(response.data.message);
    }
  };

  const handleReject = async (product: Product) => {
    console.log(`Rejecting product: ${product.name}`);
    const response = await axiosInstance.post(`items/reject/${product.id}`);
    if (response.data.isSuccess === true) {
      setPendingProducts(pendingProducts.filter((p) => p.id !== product.id));
      toast.success("Product reject successfully");
    } else {
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    setPendingProducts(products.filter((p) => p.status === "Pending"));
  }, [products]);

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="w-full mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 my-12">
        <h2 className="text-2xl text-orange-500 font-bold mb-4 py-6">Product Dashboard</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-4 text-left text-xl whitespace-nowrap">Name</th>
                <th className="px-4 py-4 text-left text-xl whitespace-nowrap">Image</th>
                <th className="px-4 py-4 text-left text-xl whitespace-nowrap">Category</th>
                <th className="px-4 py-4 text-left text-xl whitespace-nowrap">Condition</th>
                <th className="px-4 py-4 text-left text-xl whitespace-nowrap">Description</th>
                <th className="px-4 py-4 text-left text-xl whitespace-nowrap">Points</th>
                <th className="px-4 py-4 text-left text-xl whitespace-nowrap">Quantity</th>
                <th className="px-4 py-4 text-left text-xl whitespace-nowrap">Owner</th>
                <th className="px-4 py-4 text-left text-xl whitespace-nowrap">Available</th>
                <th className="px-4 py-4 text-left text-xl whitespace-nowrap">Date Remaining</th>
                <th className="px-4 py-4 text-left text-xl whitespace-nowrap">Create At</th>
                <th className="px-4 py-4 text-left text-xl whitespace-nowrap">Update At</th>
                <th className="px-4 py-4 text-left text-xl whitespace-nowrap">Expires At</th>
                <th className="px-4 py-4 text-left text-xl whitespace-nowrap">Status</th>
                <th className="px-4 py-4 text-left text-xl whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg"
                      style={{ objectFit: "cover" }}
                    />
                  </td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">{product.condition}</td>
                  <td className="px-4 py-2 truncate max-w-xs">{product.description}</td>
                  <td className="px-4 py-2">{product.point}</td>
                  <td className="px-4 py-2">{product.quantity}</td>
                  <td className="px-4 py-2 flex items-center">
                    <img
                      src={product.profilePicture}
                      alt={product.owner_Name}
                      className="w-8 h-8 rounded-full mr-2"
                      style={{ objectFit: "cover" }}
                    />
                    {product.owner_Name}
                  </td>
                  <td className="px-4 py-2">
                    {product.available ? (
                      <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full">Yes</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full">No</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{product.dateRemaining} days</td>
                  <td className="px-4 py-2">{new Date(product.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{new Date(product.updatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{new Date(product.expiresAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full font-medium ${
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
                  <td className="px-4 py-2 space-x-2">
                    {product.status === "Pending" && (
                      <>
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded"
                          onClick={() => handleApprove(product)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded"
                          onClick={() => handleReject(product)}
                        >
                          Reject
                        </button>
                      </>
                    )}
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
                      onClick={() => paginate(number + 1)}
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
      </div>
    </div>
  );
};

export default ProductDashboard;