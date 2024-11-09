'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Product } from '../types/product'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<'name' | 'condition'>('name')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://672f062d229a881691f19ad9.mockapi.io/api/items')
        setProducts(response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const categories = [...new Set(products.map(product => product.category))]

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => 
      selectedCategory ? product.category === selectedCategory : true
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      }
      return a.condition.localeCompare(b.condition)
    })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner with Parallax Effect */}
      <div 
        className="relative h-[400px] rounded-xl overflow-hidden mb-8 group"
        style={{ perspective: '1000px' }}
      >
        <Image
          src="/banner.jpg"
          alt="Banner"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center justify-center">
          <div className="text-center text-white max-w-2xl px-4">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">Khám phá sản phẩm</h1>
            <p className="text-xl mb-8">Chất lượng tạo nên thương hiệu</p>
            <div className="relative">
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-12 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/70"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-3 text-white/70" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mb-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} />
            <h2 className="text-2xl font-bold">Bộ lọc</h2>
          </div>
          <div className="flex gap-4">
            <select 
              className="px-4 py-2 rounded-md border"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'condition')}
            >
              <option value="name">Sắp xếp theo tên</option>
              <option value="condition">Sắp xếp theo tình trạng</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === '' ? "default" : "outline"}
            onClick={() => setSelectedCategory('')}
            className="rounded-full"
          >
            Tất cả
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <Card key={n} className="animate-pulse">
              <div className="h-[250px] bg-gray-200" />
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="text-gray-600 mb-4">
            Hiển thị {filteredProducts.length} sản phẩm
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-[250px] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    {!product.available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                        <Badge variant="destructive" className="text-lg px-4 py-2">
                          Hết hàng
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-500 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {product.description}
                    </p>
                  </CardContent>
                  <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
                    <Badge variant="secondary" className="capitalize">
                      {product.condition}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {product.category}
                    </Badge>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}