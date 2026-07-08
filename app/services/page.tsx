import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import ProductHero from "@/components/product-hero"
import { services } from "@/lib/service-data"

export const metadata: Metadata = {
  title: "Our Services | ARDA Seeds",
  description:
    "Agronomic support, outgrowing, farm mechanisation, toll processing, and transportation services for farmers across Zimbabwe.",
}

export default function ServicesPage() {
  return (
    <div>
      <ProductHero
        title="Our Services"
        description="End-to-end agricultural support — from seed production and expert advice to mechanisation, processing, and logistics."
        image="/images/Maize field.jpg"
      />

      <div className="container mx-auto px-4 py-12">
        <p className="text-lg text-gray-700 max-w-3xl mb-12">
          ARDA Seeds delivers more than quality seed. We provide the technical, mechanical, and logistical
          services farmers need to plant, grow, harvest, and market successfully — whether you are a
          commercial grower or joining our outgrower programme.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold mb-3 group-hover:text-green-700 transition-colors">
                  {service.name}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{service.shortDescription}</p>
                <span className="text-green-700 font-semibold flex items-center group-hover:text-green-800">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
