import Link from "next/link"
import Image from "next/image"
import type { FilterState } from "@/app/products/page"
import {
  maizeProducts,
  wheatProducts,
  soybeanProducts,
  groundnutProducts,
  sunflowerProducts,
  cowpeaProducts,
  sugarBeanProducts,
  sorghumProducts,
} from "@/lib/product-data"

const categories = [
  {
    id: "maize",
    name: "Maize",
    description: "High-yielding maize varieties with excellent disease resistance",
    image: "/images/maize.jpg",
    products: maizeProducts,
  },
  {
    id: "wheat",
    name: "Wheat",
    description: "Quality wheat seeds adapted to various ecological zones",
    image: "/images/wheat.jpg",
    products: wheatProducts,
  },
  {
    id: "soybeans",
    name: "Soybeans",
    description: "Soybean varieties with high protein content and disease resistance",
    image: "/images/soybeans.jpg",
    products: soybeanProducts,
  },
  {
    id: "groundnuts",
    name: "Groundnuts",
    description: "Drought-tolerant groundnut varieties with high pod yield",
    image: "/images/groundnuts.jpg",
    products: groundnutProducts,
  },
  {
    id: "sunflower",
    name: "Sunflower",
    description: "Sunflower seeds with high oil content for various conditions",
    image: "/images/sunflower.jpg",
    products: sunflowerProducts,
  },
  {
    id: "cowpeas",
    name: "Cowpeas",
    description: "Early maturing cowpea varieties with resistance to pests and diseases",
    image: "/images/cowpeas.jpg",
    products: cowpeaProducts,
  },
  {
    id: "sugarbeans",
    name: "Sugarbeans",
    description: "Drought-tolerant sugarbeans with high yield potential",
    image: "/images/sugarbeans.jpg",
    products: sugarBeanProducts,
  },
  {
    id: "sorghum",
    name: "Sorghum",
    description: "Sorghum varieties adapted to different regions with good disease tolerance",
    image: "/images/sorghum.jpg",
    products: sorghumProducts,
  },
]

type ProductCategoryListProps = {
  filters: FilterState
}

// Helper function to parse maturity days from various formats
function getMaturityDays(maturity: string): number {
  // Extract numbers from strings like "120-125 days", "130 days", "80-90 days", etc.
  const numbers = maturity.match(/\d+/g)
  if (!numbers) return 0

  // Use the first number (or average if range)
  if (numbers.length > 1) {
    return (parseInt(numbers[0]) + parseInt(numbers[1])) / 2
  }
  return parseInt(numbers[0])
}

// Helper function to check if product matches filters
function matchesFilters(product: any, filters: FilterState): boolean {
  // If no filters are active, show all products
  if (filters.maturity.length === 0 && filters.regions.length === 0 && filters.traits.length === 0) {
    return true
  }

  let matches = true

  // Check maturity filter
  if (filters.maturity.length > 0) {
    const days = getMaturityDays(product.maturity)
    const maturityMatch = filters.maturity.some((filter) => {
      if (filter === "early" && days >= 60 && days < 90) return true
      if (filter === "medium" && days >= 90 && days <= 120) return true
      if (filter === "late" && days > 120) return true
      return false
    })
    if (!maturityMatch) matches = false
  }

  // Check regions filter
  if (filters.regions.length > 0) {
    const regionsMatch = filters.regions.some((filter) => {
      return product.regions.some((region: string) => region.includes(filter))
    })
    if (!regionsMatch) matches = false
  }

  // Check traits filter
  if (filters.traits.length > 0) {
    const traitsMatch = filters.traits.every((filter) => {
      const productText = `${product.features.join(" ")} ${product.fullDescription}`.toLowerCase()

      switch (filter) {
        case "drought":
          return productText.includes("drought")
        case "disease":
          return productText.includes("disease") || productText.includes("resistant") || productText.includes("resistance")
        case "high-yield":
          return productText.includes("high yield") || productText.includes("high-yield")
        case "low-nitrogen":
          return productText.includes("low nitrogen") || productText.includes("low-nitrogen") || productText.includes("low fertility")
        default:
          return false
      }
    })
    if (!traitsMatch) matches = false
  }

  return matches
}

export default function ProductCategoryList({ filters }: ProductCategoryListProps) {
  // Filter categories based on whether they have any matching products
  const filteredCategories = categories
    .map((category) => {
      const matchingProducts = category.products.filter((product) => matchesFilters(product, filters))
      return {
        ...category,
        varieties: matchingProducts.length,
      }
    })
    .filter((category) => category.varieties > 0)

  if (filteredCategories.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-600 text-lg mb-2">No products match your filters</p>
        <p className="text-gray-500">Try adjusting your filter criteria</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredCategories.map((category) => (
        <Link
          key={category.id}
          href={`/products/${category.id}`}
          className="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative w-1/3">
            <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
          </div>
          <div className="w-2/3 p-4">
            <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{category.description}</p>
            <p className="text-green-700 font-medium">
              {category.varieties} {category.varieties === 1 ? "variety" : "varieties"} available
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
