import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { outgrowingServices } from "@/lib/service-data";
import ServiceDetail from "@/components/service-detail";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = outgrowingServices.find((s) => s.id === params.id);
  
  if (!service) return {
    title: "Service Not Found | ARDA Seeds",
  };

  return {
    title: `${service.name} | ARDA Outgrowing Services`,
    description: service.description,
  };
}

export async function generateStaticParams() {
  return outgrowingServices.map((service) => ({
    id: service.id,
  }));
}

export default function ServicePage({ params }: Props) {
  const service = outgrowingServices.find((s) => s.id === params.id);

  if (!service) {
    notFound();
  }

  return <ServiceDetail service={service} />;
}