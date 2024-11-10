'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'


const ProductsList = dynamic(() => import('@/app/components/product/ProductList'), { ssr: false })

const Banner = dynamic(() => import('@/app/components/banner/Banner'), { ssr: false })


export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="container mx-auto px-4 py-8">
      <Banner searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <ProductsList searchText={searchTerm} />
    </div>
  )
}