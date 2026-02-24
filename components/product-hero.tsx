import Image from "next/image"

interface ProductHeroProps {
  title: string
  description: string
  image: string
}

export default function ProductHero({ title, description, image }: ProductHeroProps) {
  return (
    <div className="relative h-[300px] md:h-[400px]">
      <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
      <div className="absolute inset-0 bg-black/50 flex items-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{title}</h1>
          <p className="text-white text-lg md:text-xl max-w-2xl">{description}</p>
        </div>
      </div>
    </div>
  )
}
