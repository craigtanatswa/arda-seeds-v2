import type { Metadata } from "next"
import ProductList from "@/components/product-list"
import { maizeProducts } from "@/lib/product-data"
import ProductHero from "@/components/product-hero"
import "../products-styles.css"

export const metadata: Metadata = {
  title: "Maize Seeds | ARDA Seeds",
  description:
    "High-yielding maize seed varieties with excellent disease resistance and drought tolerance for all growing regions.",
}

export default function MaizePage() {
  return (
    <div className="product-page">
      <ProductHero
        title="Maize Seeds"
        description="Our maize varieties are bred for high yield potential, disease resistance, and adaptability to various growing conditions."
        image="/images/maize-hero.jpg"
      />

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Introduction Section */}
        <div className="mb-16 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 section-header">About Our Maize Seeds</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            ARDA Seeds offers a diverse range of maize varieties suited for different ecological zones in Zimbabwe. Our
            maize seeds are developed to provide farmers with high-yielding, disease-resistant options that perform well
            under various conditions, including drought-prone areas and low fertility soils.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="mb-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 border border-green-100">
          <h3 className="text-3xl font-bold mb-8 text-center">Why Choose Our Maize Varieties?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="benefit-card bg-white p-6 rounded-2xl shadow-md">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-bold text-xl mb-2">High Yield Potential</h4>
              <p className="text-gray-600">Consistently deliver superior yields across different growing conditions</p>
            </div>
            
            <div className="benefit-card bg-white p-6 rounded-2xl shadow-md">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-bold text-xl mb-2">Disease Resistant</h4>
              <p className="text-gray-600">Built-in resistance to common maize diseases for healthier crops</p>
            </div>
            
            <div className="benefit-card bg-white p-6 rounded-2xl shadow-md">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h4 className="font-bold text-xl mb-2">Drought Tolerant</h4>
              <p className="text-gray-600">Perform well even in challenging water-limited conditions</p>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="product-list">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 section-header">Our Maize Varieties</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Choose from our range of proven varieties, each specifically bred for different ecological zones and farming needs
            </p>
          </div>
          
          <ProductList products={maizeProducts} />
        </div>

        {/* CTA Section */}
        <div className="mt-20 relative py-16 px-8 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-600 to-emerald-700"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Help Choosing?</h2>
            <p className="text-xl md:text-2xl mb-10 opacity-95 font-light leading-relaxed">
              Our agronomists are here to help you select the perfect maize variety for your specific farming conditions
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href="/agronomy/guides/maizeguide"
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