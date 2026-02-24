import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface ProductCategoryCardProps {
  title: string
  description: string
  image: string
  href: string
}

export default function ProductCategoryCard({ title, description, image, href }: ProductCategoryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link href={href} className="inline-flex items-center text-green-700 font-medium hover:text-green-800">
          View Products <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
