import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ServicePageContent from "@/components/service-page-content"
import { getServiceById, services } from "@/lib/service-data"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const service = getServiceById(id)

  if (!service) {
    return { title: "Service Not Found | ARDA Seeds" }
  }

  return {
    title: `${service.name} | ARDA Seeds`,
    description: service.shortDescription,
  }
}

export async function generateStaticParams() {
  return services.map((service) => ({ id: service.id }))
}

export default async function ServicePage({ params }: Props) {
  const { id } = await params
  const service = getServiceById(id)

  if (!service) {
    notFound()
  }

  return <ServicePageContent service={service} />
}
