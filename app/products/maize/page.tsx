import type { Metadata } from "next"
import ProductList from "@/components/product-list"
import { maizeProducts } from "@/lib/product-data"
import ProductHero from "@/components/product-hero"

export const metadata: Metadata = {
  title: "Maize Seeds | ARDA Seeds",
  description:
    "High-yielding maize seed varieties with excellent disease resistance and drought tolerance for all growing regions.",
}

export default function MaizePage() {
  return (
    <div>
      <ProductHero
        title="Maize Seeds"
        description="Our maize varieties are bred for high yield potential, disease resistance, and adaptability to various growing conditions."
        image="/images/maize-hero.jpg"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About Our Maize Seeds</h2>
          <p className="text-gray-700">
            ARDA Seeds offers a diverse range of maize varieties suited for different ecological zones in Zimbabwe. Our
            maize seeds are developed to provide farmers with high-yielding, disease-resistant options that perform well
            under various conditions, including drought-prone areas and low fertility soils.
          </p>
        </div>

        <ProductList products={maizeProducts} />
      </div>
    </div>
  )
}
