import type { Metadata } from "next"
import ProductList from "@/components/product-list"
import { wheatProducts } from "@/lib/product-data" // You'll need to create this
import ProductHero from "@/components/product-hero"

export const metadata: Metadata = {
  title: "Wheat Seeds | ARDA Seeds",
  description:
    "High-yielding wheat seed varieties with excellent grain quality and disease resistance for optimal yields in various regions.",
}

export default function WheatPage() {
  return (
    <div>
      <ProductHero
        title="Wheat Seeds"
        description="Our premium wheat varieties deliver high yields, excellent milling quality, and strong disease resistance tailored for Zimbabwe's diverse growing conditions."
        image="/images/wheat-hero.jpg" // Add this image to your public folder
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About Our Wheat Seeds</h2>
          <p className="text-gray-700">
            ARDA Seeds offers superior wheat varieties specifically developed for Zimbabwe's ecological zones. 
            Our wheat seeds combine high yield potential with excellent disease resistance and grain quality, 
            providing farmers with reliable performance across different environments including Highveld, Middleveld, and Lowveld regions.
          </p>
        </div>

        <ProductList products={wheatProducts} />
      </div>
    </div>
  )
}