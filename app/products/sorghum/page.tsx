import type { Metadata } from "next"
import ProductList from "@/components/product-list"
import { sorghumProducts } from "@/lib/product-data"
import ProductHero from "@/components/product-hero"

export const metadata: Metadata = {
  title: "Sorghum Seeds | ARDA Seeds",
  description:
    "High-yielding sorghum seed varieties with excellent drought tolerance and disease resistance for optimal production in Zimbabwe's challenging environments.",
}

export default function SorghumPage() {
  return (
    <div>
      <ProductHero
        title="Sorghum Seeds"
        description="Our premium sorghum varieties deliver excellent drought tolerance, disease resistance, and reliable yields in regions I through V. Ideal for both grain and forage production."
        image="/images/sorghum-hero.jpg"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About Our Sorghum Seeds</h2>
          <p className="text-gray-700 mb-4">
            ARDA Seeds offers superior sorghum varieties developed specifically for Zimbabwe's challenging growing conditions, 
            particularly in drought-prone regions IV & V. Our sorghum seeds combine excellent drought tolerance with good disease 
            resistance, providing farmers with reliable performance even in low-rainfall areas.
          </p>
          <p className="text-gray-700">
            Sorghum is a crucial crop in Zimbabwe, valued for its versatility as food, feed, and for traditional brewing. 
            Our varieties are selected for their adaptability to different ecological zones, from region I to region V, 
            offering solutions for various farming systems and production needs.
          </p>
        </div>

        {/* Growing Benefits Section */}
        <div className="bg-green-50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-4">Benefits of Growing Sorghum</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Excellent drought tolerance for dry regions</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Adapted to regions I, II, III, IV & V</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Good disease tolerance for reliable production</span>
              </li>
            </ul>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Dual-purpose: grain for food/feed and stalks for forage</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Low input requirements compared to other cereals</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Versatile uses: traditional food, brewing, and animal feed</span>
              </li>
            </ul>
          </div>
        </div>

        <ProductList products={sorghumProducts} />
      </div>
    </div>
  )
}