import type { Metadata } from "next"
import ProductList from "@/components/product-list"
import { cowpeaProducts } from "@/lib/product-data"
import ProductHero from "@/components/product-hero"

export const metadata: Metadata = {
  title: "Cowpea Seeds | ARDA Seeds",
  description:
    "High-yielding cowpea seed varieties with excellent disease resistance and adaptability for various growing regions in Zimbabwe.",
}

export default function CowpeasPage() {
  return (
    <div>
      <ProductHero
        title="Traditional African Pea Seeds"
        description="Our premium cowpea varieties deliver early maturity, excellent disease resistance, and strong performance in regions III, IV & V. Perfect for both grain and forage production."
        image="/images/Traditional African Pea-hero.jpg"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About Our Traditional African Pea Seeds</h2>
          <p className="text-gray-700 mb-4">
            ARDA Seeds offers superior Traditional African Pea varieties developed specifically for Zimbabwe's challenging growing conditions. 
            Our Traditional African Pea seeds combine early maturity with excellent disease resistance, particularly to Traditional African Pea aphids borne mosaic virus (CABMV), 
            providing farmers with reliable performance in regions III, IV & V.
          </p>
          <p className="text-gray-700">
            Traditional African Pea is an important legume crop in Zimbabwe, valued for its high protein content, drought tolerance, 
            and ability to improve soil fertility through nitrogen fixation. Our varieties are selected for their dual-purpose 
            capabilities, serving both as a nutritious grain crop and valuable forage.
          </p>
        </div>

        {/* Growing Benefits Section */}
        <div className="bg-green-50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">Benefits of Growing Traditional African Pea</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Early maturing (75-85 days) for quick returns</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>High resistance to Traditional African Pea aphids borne mosaic virus (CABMV)</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Dual-purpose: grain for food and leaves for forage</span>
              </li>
            </ul>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Improves soil fertility through nitrogen fixation</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Drought tolerant and suitable for dry regions</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>High protein content for improved nutrition</span>
              </li>
            </ul>
          </div>
        </div>

        <ProductList products={cowpeaProducts} />
      </div>
    </div>
  )
}