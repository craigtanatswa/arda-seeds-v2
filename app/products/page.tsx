"use client"

import { useState } from "react"
import ProductCategoryList from "@/components/product-category-list"
import ProductFilter from "@/components/product-filter"

export type FilterState = {
  maturity: string[]
  regions: string[]
  traits: string[]
}

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({
    maturity: [],
    regions: [],
    traits: [],
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Our Products</h1>
      <p className="text-gray-600 mb-8">Browse our complete catalog of high-quality agricultural seeds</p>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <ProductFilter filters={filters} setFilters={setFilters} />
        </div>
        <div className="lg:w-3/4">
          <ProductCategoryList filters={filters} />
        </div>
      </div>
    </div>
  )
}
