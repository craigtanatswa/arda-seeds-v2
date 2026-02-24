import { outgrowingServices } from "@/lib/service-data";
import Image from "next/image";
import Link from "next/link";

export default function ServiceDetail({ service }: { service: typeof outgrowingServices[0] }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        <div className="relative h-96 rounded-xl overflow-hidden">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-4">{service.name}</h1>
          <p className="text-xl text-gray-700 mb-6">{service.description}</p>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Service Features</h2>
            <ul className="space-y-3">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Link
            href="/contact"
            className="inline-block bg-green-700 hover:bg-green-800 text-white font-medium py-3 px-8 rounded-lg transition-colors"
          >
            Enquire About This Service
          </Link>
        </div>
      </div>

      <div className="bg-green-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6">Service Process</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {processSteps.map((step, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-green-700 font-bold text-lg mb-2">Step {i + 1}</div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const processSteps = [
  {
    title: "Initial Consultation",
    description: "We assess your land, resources and goals to create a customized plan."
  },
  {
    title: "Implementation",
    description: "Our team handles all aspects of field preparation and planting."
  },
  {
    title: "Ongoing Management",
    description: "Regular monitoring and adjustments to ensure optimal growth."
  }
];