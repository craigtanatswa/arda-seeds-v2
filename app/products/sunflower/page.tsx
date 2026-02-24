import type { Metadata } from "next"
import ProductList from "@/components/product-list"
import { sunflowerProducts } from "@/lib/product-data"
import ProductHero from "@/components/product-hero"

export const metadata: Metadata = {
  title: "Sunflower Seeds | ARDA Seeds",
  description:
    "High-quality sunflower seed varieties with excellent oil content and adaptability for various growing conditions in Zimbabwe.",
}

export default function SunflowerPage() {
  return (
    <div>
      <ProductHero
        title="Sunflower Seeds"
        description="Our premium sunflower varieties deliver high oil content, excellent adaptability, and strong performance in both favorable and marginal production areas across Zimbabwe."
        image="/images/sunflower-hero.jpg"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About Our Sunflower Seeds</h2>
          <p className="text-gray-700 mb-4">
            ARDA Seeds offers superior sunflower varieties developed for Zimbabwe's diverse ecological zones. 
            Our sunflower seeds combine high oil content with excellent adaptability to different growing conditions, 
            providing farmers with reliable performance in both favorable and marginal production areas.
          </p>
          <p className="text-gray-700">
            Sunflower is an important oilseed crop in Zimbabwe, valued for its high-quality oil used in cooking 
            and industrial applications. Our varieties are selected for their drought tolerance, disease resistance, 
            and suitability for small-scale oil processing.
          </p>
        </div>

        {/* Growing Benefits Section */}
        <div className="bg-green-50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">Benefits of Growing Sunflower</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>High oil content (up to 45%) for excellent oil yield</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Drought tolerant and suitable for marginal areas</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Short to medium growing seasons</span>
              </li>
            </ul>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Suitable for small-scale oil processing (ram presses)</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Good cash crop with stable market demand</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>By-products useful as livestock feed</span>
              </li>
            </ul>
          </div>
        </div>

        <ProductList products={sunflowerProducts} />
      </div>
    </div>
  )
}