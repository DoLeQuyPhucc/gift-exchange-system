'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import {  Filter } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Product } from '@/app/types/product'

export default function ProductsList({ searchText }: { searchText: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchText)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<'name' | 'condition'>('name')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://67302fa666e42ceaf15f9caf.mockapi.io/items')
        const productsData = response.data.find((item: any) => item.resource === 'products')
        
        if (productsData) {
          setProducts(productsData.data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    setSearchTerm(searchText)
  }, [searchText])

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
    <div className="container mx-auto">

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
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === '' ? "default" : "outline"}
            onClick={() => setSelectedCategory('')}
            className={`rounded-full shrink-0 ${
              selectedCategory === '' ? 'bg-orange-500 hover:bg-orange-600' : ''
            }`}
          >
            Tất cả
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full shrink-0 ${
                selectedCategory === category ? 'bg-orange-500 hover:bg-orange-600' : ''
              }`}
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
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-500 transition-colors truncate">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 truncate">
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