'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Package, RefreshCcw } from 'lucide-react'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  category: string
  condition: string
  image: string
  available: boolean
  created_at: string
  quantity: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://672f062d229a881691f19ad9.mockapi.io/api/items/${params.id}`)
        setProduct(response.data)
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Không thể tải thông tin sản phẩm')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

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
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Không tìm thấy sản phẩm</h1>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    toast.success('Đã thêm vào giỏ hàng')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative h-[400px] rounded-xl overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
          
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
              <span>Ngày đăng: {new Date(product.created_at).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Package size={20} />
              <span>Số lượng: {product.quantity}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <RefreshCcw size={20} />
              <span>Tình trạng: {product.condition}</span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={handleAddToCart}
            disabled={!product.available}
          >
            {product.available ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
          </Button>
        </div>
      </div>
    </div>
  )
}