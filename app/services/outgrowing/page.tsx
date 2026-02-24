import type { Metadata } from "next"
import ServiceList from "@/components/service-list"
import { outgrowingServices } from "@/lib/service-data"
import ProductHero from "@/components/product-hero"

export const metadata: Metadata = {
  title: "Outgrowing Services | ARDA Seeds",
  description:
    "Professional cultivation services to maximize your seed potential with expert crop management and field establishment.",
}

export default function OutgrowingPage() {
  return (
    <div>
      <ProductHero
        title="Outgrowing Services"
        description="Our professional cultivation services help maximize your seed potential with expert field management and crop production solutions."
        image="/images/outgrowing-hero.jpg"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Service Approach</h2>
          <p className="text-gray-700">
            ARDA Seeds provides comprehensive outgrowing services to help farmers achieve optimal results from our seed varieties.
            Our team of agricultural experts delivers tailored solutions for seedling production, field establishment, and
            complete crop management throughout the growing season.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Key Service Benefits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Expert Guidance</h3>
              <p className="text-gray-700">
                Access to our team of agricultural specialists with decades of combined experience.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Yield Optimization</h3>
              <p className="text-gray-700">
                Proven techniques to maximize your harvest potential from our premium seeds.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Risk Reduction</h3>
              <p className="text-gray-700">
                Comprehensive management reduces crop failure risks and improves consistency.
              </p>
            </div>
          </div>
        </div>

        <ServiceList services={outgrowingServices} />

        <div className="mt-12 bg-green-100 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Ready to Grow With Us?</h2>
          <p className="text-gray-700 mb-6 max-w-2xl">
            Contact our agricultural services team to discuss customized outgrowing solutions for your operation.
          </p>
          <button className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded">
            Request Service Consultation
          </button>
        </div>
      </div>
    </div>
  )
}