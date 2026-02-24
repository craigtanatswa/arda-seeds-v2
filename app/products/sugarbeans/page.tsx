import type { Metadata } from "next"
import ProductList from "@/components/product-list"
import { sugarBeanProducts } from "@/lib/product-data"
import ProductHero from "@/components/product-hero"

export const metadata: Metadata = {
  title: "Sugar Bean Seeds | ARDA Seeds",
  description:
    "High-quality sugar bean seed varieties with excellent disease resistance and drought tolerance for optimal yields across Zimbabwe.",
}

export default function SugarBeansPage() {
  return (
    <div>
      <ProductHero
        title="Sugar Bean Seeds"
        description="Our premium sugar bean varieties deliver excellent disease resistance, drought tolerance, and consistent yields across all regions of Zimbabwe."
        image="/images/sugarbean-hero.jpg"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About Our Sugar Bean Seeds</h2>
          <p className="text-gray-700 mb-4">
            ARDA Seeds offers superior sugar bean varieties developed for Zimbabwe's diverse growing conditions. 
            Our sugar bean seeds combine excellent disease resistance with drought tolerance, providing farmers 
            with reliable performance across all regions of the country.
          </p>
          <p className="text-gray-700">
            Sugar beans are an important protein source in Zimbabwe, valued for their nutritional content and 
            market demand. Our varieties are selected for their high tolerance to common bean rust and bacterial 
            blight, ensuring consistent yields even in challenging conditions.
          </p>
        </div>

        {/* Growing Benefits Section */}
        <div className="bg-green-50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">Benefits of Growing Sugar Beans</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Early to medium maturity (80-90 days)</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>High tolerance to common bean rust and bacterial blight</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Drought tolerant varieties available</span>
              </li>
            </ul>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>High protein content for improved nutrition</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Good market demand and price stability</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Suitable for intercropping with maize and other crops</span>
              </li>
            </ul>
          </div>
        </div>

        <ProductList products={sugarBeanProducts} />
      </div>
    </div>
  )
}