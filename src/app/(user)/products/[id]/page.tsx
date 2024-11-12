"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Package, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/app/utils/format-date";
import axiosInstance from "@/app/api/axiosInstance";
import { ApiResponse, Product, ProductAttribute } from "@/app/types/types";

export default function ProductDetailPage() {
  // Lấy itemId từ dynamic route parameter
  const params = useParams();
  const itemId = Array.isArray(params?.id) ? params.id[0] : params?.id;  
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!itemId) {
        setError("Invalid product ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get<ApiResponse>(`/items/${itemId}`);
        
        if (response.data.isSuccess && response.data.data) {
          setProduct(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch product");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Không thể tải thông tin sản phẩm");
        toast.error("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [itemId]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">{error}</h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-[400px] bg-gray-200 rounded-xl mb-8" />
          <div className="h-8 bg-gray-200 w-1/2 mb-4" />
          <div className="h-4 bg-gray-200 w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 w-2/3" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Không tìm thấy sản phẩm
          </h1>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    toast.success("Đã thêm vào giỏ hàng");
  };

  const handleRequest = async () => {
    if (!product) {
      toast.error("Không thể tạo yêu cầu!");
    }
    const data = {
      itemId: product.id,
      quantity: 1,
    }

    const response = await axiosInstance.post("/request/create", data);

    if (!response.data.isSuccess) {
      toast.error("Không thể tạo yêu cầu!");
      return;
    } else {
      toast.success("Tạo yêu cầu trao đổi thành công!");
    }
  };

  // Thêm phần hiển thị thuộc tính sản phẩm
  const renderAttributes = () => {
    return product.itemAttributeValues.map((attr) => (
      <div key={attr.id} className="flex items-center gap-2 text-gray-600">
        <span>- {attr.value}</span>
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative h-[400px] rounded-xl overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>

          <div className="flex gap-2 mb-6">
            <Badge className="bg-orange-500">{product.category}</Badge>
            <Badge variant="outline">{product.condition}</Badge>
            {product.available ? (
              <Badge variant="default">Còn hàng</Badge>
            ) : (
              <Badge variant="destructive">Hết hàng</Badge>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={20} />
              <span>Ngày đăng: {formatDate(product.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Package size={20} />
              <span>Số lượng: {product.quantity}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <RefreshCcw size={20} />
              <span>Tình trạng: {product.condition}</span>
            </div>
            
            {/* Product Attributes */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-800">Thông số kỹ thuật:</h3>
              {renderAttributes()}
            </div>
          </div>

          {product.available ? (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <Button className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white">
                  Liên hệ
                </Button>
                <Button 
                  className="w-1/2 bg-amber-500 hover:bg-amber-600 text-white" 
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>
              <Button
                size="lg"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                onClick={handleRequest}
              >
                Yêu cầu trao đổi
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled
            >
              Hết hàng
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}