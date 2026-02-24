import type { Metadata } from "next"
import ProductList from "@/components/product-list"
import { soybeanProducts } from "@/lib/product-data"
import ProductHero from "@/components/product-hero"

export const metadata: Metadata = {
  title: "Soybean Seeds | ARDA Seeds",
  description: "High-yielding soybean varieties with excellent disease resistance for optimal production.",
}

export default function SoybeanPage() {
  return (
    <div>
      <ProductHero
        title="Soybean Seeds"
        description="Premium soybean varieties with high protein content and disease resistance"
        image="/images/soybeans-hero.jpg"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About Our Soybean Seeds</h2>
          <p className="text-gray-700">
            ARDA Seeds offers superior soybean varieties developed for Zimbabwe's diverse growing conditions. 
            Our soybean seeds combine high yield potential with excellent disease resistance and protein content, 
            providing reliable performance across different environments.
          </p>
        </div>

        <div className="mb-8 bg-green-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-3">Key Advantages of ARDA Soybean Varieties</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>High protein content for superior nutritional value</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Excellent disease resistance packages</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Adapted to various ecological zones</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Consistent high yields under proper management</span>
            </li>
          </ul>
        </div>

        <ProductList products={soybeanProducts} />
      </div>
    </div>
  )
}