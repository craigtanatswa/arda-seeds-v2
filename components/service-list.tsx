import { outgrowingServices } from "@/lib/service-data"
import Link from "next/link"

export default function ServiceList({ services }: { services: typeof outgrowingServices }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.map((service) => (
        <div key={service.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <div className="h-48 bg-gray-100 overflow-hidden">
            <img 
              src={service.image} 
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">{service.name}</h3>
            <p className="text-gray-700 mb-4">{service.description}</p>
            <ul className="space-y-2 mb-6">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/services/${service.id}`}
              className="inline-block text-green-700 font-medium hover:text-green-900"
            >
              Learn more →
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}