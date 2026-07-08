import Image from "next/image"
import Link from "next/link"
import ProductHero from "@/components/product-hero"
import type { Service } from "@/lib/service-data"

export default function ServicePageContent({ service }: { service: Service }) {
  return (
    <div>
      <ProductHero
        title={service.name}
        description={service.shortDescription}
        image={service.heroImage}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="relative h-80 lg:h-96 rounded-xl overflow-hidden">
            <Image
              src={service.image || "/placeholder.svg"}
              alt={service.name}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">About This Service</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">{service.description}</p>

            <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
            <ul className="space-y-3 mb-8">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="inline-block bg-green-700 hover:bg-green-800 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Enquire About This Service
            </Link>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Key Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.benefits.map((benefit, i) => (
              <div key={i} className="bg-green-50 p-6 rounded-lg">
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.processSteps.map((step, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-green-700 font-bold text-lg mb-2">Step {i + 1}</div>
                <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {service.id === "agronomic-support" && (
          <div className="bg-white border border-green-200 rounded-xl p-8 mb-16">
            <h2 className="text-2xl font-bold mb-4">Planting Guides & Resources</h2>
            <p className="text-gray-700 mb-6">
              Access our detailed crop-specific planting guides for maize, wheat, soybeans, groundnuts, sunflower, and more.
            </p>
            <Link
              href="/agronomy"
              className="inline-block text-green-700 font-semibold hover:text-green-800"
            >
              View planting guides →
            </Link>
          </div>
        )}

        <div className="bg-green-100 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Contact our team to discuss how {service.name.toLowerCase()} can support your farming operation.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
