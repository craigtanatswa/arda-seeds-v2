import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ArrowLeft } from "lucide-react"
import { maizeProducts } from "@/lib/product-data"

interface ProductPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = maizeProducts.find((p) => p.id === params.id)

  if (!product) {
    return {
      title: "Product Not Found | ARDA Seeds",
    }
  }

  return {
    title: `${product.name} | ARDA Seeds`,
    description: product.shortDescription,
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = maizeProducts.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products/maize" className="flex items-center text-green-700 mb-6 hover:underline">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Maize Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.featured && <Badge className="bg-green-700">Featured</Badge>}
          </div>

          <p className="text-gray-700 mb-6">{product.fullDescription}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Maturity Period</h3>
              <p>{product.maturity}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Yield Potential</h3>
              <p>{product.yieldPotential}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Key Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-700 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold mb-2">Recommended Regions</h3>
            <div className="flex flex-wrap gap-2">
              {product.regions.map((region, index) => (
                <Badge key={index} variant="outline" className="border-green-700 text-green-700">
                  {region}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-green-700 hover:bg-green-800">
              <Link href={`/order?product=${product.id}`}>Order Seed</Link>
            </Button>
            <Button asChild variant="outline" className="border-green-700 text-green-700 hover:bg-green-50">
              <Link href="/contact">Contact Sales Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
