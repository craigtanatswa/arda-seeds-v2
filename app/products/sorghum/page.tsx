import type { Metadata } from "next"
import ProductList from "@/components/product-list"
import { sorghumProducts } from "@/lib/product-data"
import ProductHero from "@/components/product-hero"
import "../products-styles.css"

export const metadata: Metadata = {
  title: "Sorghum Seeds | ARDA Seeds",
  description:
    "High-yielding sorghum seed varieties with excellent drought tolerance and disease resistance for optimal production in Zimbabwe's challenging environments.",
}

export default function SorghumPage() {
  return (
    <div className="product-page">
      <ProductHero
        title="Sorghum Seeds"
        description="Our premium sorghum varieties deliver excellent drought tolerance, disease resistance, and reliable yields in regions I through V. Ideal for both grain and forage production."
        image="/images/sorghum-hero.jpg"
      />

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Introduction Section */}
        <div className="mb-16 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 section-header">About Our Sorghum Seeds</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            ARDA Seeds offers superior sorghum varieties developed specifically for Zimbabwe's challenging growing conditions, 
            particularly in drought-prone regions IV & V. Our sorghum seeds combine excellent drought tolerance with good disease 
            resistance, providing farmers with reliable performance even in low-rainfall areas.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="mb-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 border border-green-100">
          <h3 className="text-3xl font-bold mb-8 text-center">Why Choose Our Sorghum Varieties?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="benefit-card bg-white p-6 rounded-2xl shadow-md">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-xl mb-2">Drought Tolerant</h4>
              <p className="text-gray-600">Excellent performance in dry regions IV & V</p>
            </div>
            
            <div className="benefit-card bg-white p-6 rounded-2xl shadow-md">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-bold text-xl mb-2">Disease Resistant</h4>
              <p className="text-gray-600">Good disease tolerance for reliable production</p>
            </div>
            
            <div className="benefit-card bg-white p-6 rounded-2xl shadow-md">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="font-bold text-xl mb-2">Dual-Purpose</h4>
              <p className="text-gray-600">Grain for food/feed and stalks for forage</p>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="product-list">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 section-header">Our Sorghum Varieties</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Premium varieties adapted to all ecological zones from region I to V
            </p>
          </div>
          
          <ProductList products={sorghumProducts} />
        </div>

        {/* CTA Section */}
        <div className="mt-20 relative py-16 px-8 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-600 to-emerald-700"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Expert Guidance?</h2>
            <p className="text-xl md:text-2xl mb-10 opacity-95 font-light leading-relaxed">
              Our agronomists can help you select the perfect sorghum variety and provide complete growing recommendations
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href="/agronomy/guides/sorghum-guide"
                className="cta-button inline-flex items-center gap-2 bg-white text-green-800 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl rounded-xl transition-all"
              >
                View Planting Guide
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a 
                href="/contact"
                className="cta-button inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-green-800 px-8 py-4 text-lg font-semibold rounded-xl transition-all"
              >
                Contact Our Team
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}