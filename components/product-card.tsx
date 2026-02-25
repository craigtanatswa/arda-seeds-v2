import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-72 bg-gray-50 p-4 overflow-hidden">
        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain transition-transform duration-300 ease-in-out group-hover:scale-110" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{product.name}</h3>
          {product.featured && <Badge className="bg-green-700">Featured</Badge>}
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{product.shortDescription}</p>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs text-gray-500">Maturity</p>
            <p className="text-sm font-medium">{product.maturity}</p>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <p className="text-xs text-gray-500">Yield Potential</p>
            <p className="text-sm font-medium">{product.yieldPotential}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button asChild variant="outline" className="flex-1 bg-green-700 text-white border-green-700 hover:bg-white hover:text-green-700 hover:border-green-700">
            <Link href={`/products/${product.category}/${product.id}`}>View Details</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 bg-green-700 text-white border-green-700 hover:bg-white hover:text-green-700 hover:border-green-700">
            <Link href={`/order?product=${product.id}`}>Order Seed</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
