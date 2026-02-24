import type { Metadata } from "next"
import ProductList from "@/components/product-list"
import { groundnutProducts } from "@/lib/product-data"
import ProductHero from "@/components/product-hero"

export const metadata: Metadata = {
  title: "Groundnut Seeds | ARDA Seeds",
  description: "High-yielding groundnut varieties with excellent drought tolerance for optimal production.",
}

export default function GroundnutPage() {
  return (
    <div>
      <ProductHero
        title="Groundnut Seeds"
        description="Premium groundnut varieties with high pod yield and excellent drought tolerance"
        image="/images/groundnuts-hero.jpg"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About Our Groundnut Seeds</h2>
          <p className="text-gray-700">
            ARDA Seeds offers superior groundnut varieties developed for Zimbabwe's diverse growing conditions. 
            Our groundnut seeds combine high yield potential with excellent drought tolerance and disease resistance, 
            providing reliable performance in various environments.
          </p>
        </div>

        <div className="mb-8 bg-green-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-3">Key Advantages of ARDA Groundnut Varieties</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Excellent drought tolerance for rain-fed farming</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>High pod yield potential</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Good resistance to common diseases</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Adapted to various ecological zones</span>
            </li>
          </ul>
        </div>

        <ProductList products={groundnutProducts} />
      </div>
    </div>
  )
}