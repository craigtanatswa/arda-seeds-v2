import type { Metadata } from "next"
import ProductList from "@/components/product-list"
import { wheatProducts } from "@/lib/product-data"
import ProductHero from "@/components/product-hero"


export const metadata: Metadata = {
  title: "Wheat Seeds | ARDA Seeds",
  description:
    "High-yielding wheat seed varieties with excellent grain quality and disease resistance for optimal yields in various regions.",
}

export default function WheatPage() {
  return (
    <div className="product-page">
      <ProductHero
        title="Wheat Seeds"
        description="Our premium wheat varieties deliver high yields, excellent milling quality, and strong disease resistance tailored for Zimbabwe's diverse growing conditions."
        image="/images/wheat-hero.jpg"
      />

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Introduction Section */}
        <div className="mb-16 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 section-header">About Our Wheat Seeds</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            ARDA Seeds offers superior wheat varieties specifically developed for Zimbabwe's ecological zones. 
            Our wheat seeds combine high yield potential with excellent disease resistance and grain quality, 
            providing farmers with reliable performance across different environments including Highveld, Middleveld, and Lowveld regions.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="mb-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 border border-green-100">
          <h3 className="text-3xl font-bold mb-8 text-center">Why Choose Our Wheat Varieties?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="benefit-card bg-white p-6 rounded-2xl shadow-md">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-bold text-xl mb-2">High Yield Potential</h4>
              <p className="text-gray-600">Up to 6-10 tonnes per hectare under optimal management</p>
            </div>
            
            <div className="benefit-card bg-white p-6 rounded-2xl shadow-md">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-bold text-xl mb-2">Disease Resistant</h4>
              <p className="text-gray-600">Strong resistance to rust and powdery mildew</p>
            </div>
            
            <div className="benefit-card bg-white p-6 rounded-2xl shadow-md">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h4 className="font-bold text-xl mb-2">Excellent Grain Quality</h4>
              <p className="text-gray-600">Superior milling quality for various end-uses</p>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="product-list">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 section-header">Our Wheat Varieties</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Premium varieties developed for different ecological zones
            </p>
          </div>
          
          <ProductList products={wheatProducts} />
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
              Our agronomists can help you select the perfect wheat variety and provide complete growing recommendations
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href="/agronomy/guides/wheatguide"
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
