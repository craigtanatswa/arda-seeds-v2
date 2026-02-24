import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, Wheat } from "lucide-react"
import "./agronomy-styles.css"

export const metadata: Metadata = {
  title: "Planting Guides | ARDA Seeds Agronomy",
  description: "Access comprehensive planting guides for maize, wheat, soybeans, groundnuts, sunflower and more from ARDA Seeds.",
}

const plantingGuides = [
  {
    id: "maizeguide",
    title: "Maize Planting Guide",
    description: "Comprehensive guide for planting and managing maize crops across various ecological zones",
    icon: Leaf,
    color: "from-green-400 to-green-600",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    crops: "5 varieties",
    season: "Nov-Dec planting",
    yield: "4-12t/ha",
  },
  {
    id: "wheatguide",
    title: "Wheat Planting Guide",
    description: "Best practices for wheat cultivation in Highveld, Middleveld, and Lowveld regions",
    icon: Wheat,
    color: "from-amber-400 to-amber-600",
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
    crops: "1 premium variety",
    season: "Apr-May planting",
    yield: "6-10t/ha",
  },
  {
    id: "soybeans",
    title: "Soybean Planting Guide",
    description: "Guidelines for successful soybean cultivation with high protein content and disease resistance",
    icon: Leaf,
    color: "from-emerald-400 to-emerald-600",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
    crops: "2 varieties",
    season: "Nov-Dec planting",
    yield: "3-4t/ha",
  },
  {
    id: "groundnutsguide",
    title: "Groundnut Planting Guide",
    description: "Complete guide to growing drought-tolerant groundnuts with high pod yield potential",
    icon: Leaf,
    color: "from-orange-400 to-orange-600",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    crops: "1 short-season variety",
    season: "Nov-Dec planting",
    yield: "4t/ha pods",
  },
  {
    id: "sunflower",
    title: "Sunflower Planting Guide",
    description: "Growing sunflowers with high oil content (39-45%) for various ecological conditions",
    icon: Leaf,
    color: "from-yellow-400 to-yellow-600",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    crops: "2 oil-rich varieties",
    season: "Nov-Dec planting",
    yield: "Up to 2.5t/ha",
  },
]

export default function PlantingGuidesPage() {
  return (
    <div className="min-h-screen agronomy-page">
      {/* Hero Section with Image */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/Legume seeds.jpg"
            alt="Maize field"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Gradient Overlay */}
          {/*<div className="absolute inset-0 bg-gradient-to-r from-green-900/95 via-green-600/90 to-green-700/80"></div>*/}
        </div>
        
        <div className="absolute inset-0 hero-pattern"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10 h-full flex items-center px-4">
          <div className="text-white max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 hero-title">
              Agronomy
            </h1>
            <p className="text-xl md:text-2xl mb-10 font-light leading-relaxed hero-subtitle">
              Expert agronomic advice and comprehensive step-by-step guides for all our crop varieties
            </p>
            <div className="flex flex-wrap gap-4 hero-badges">
              <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-xl border border-white/30 hover:bg-white/30 transition-all">
                <span className="font-semibold text-lg">5 Crop Guides</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-xl border border-white/30 hover:bg-white/30 transition-all">
                <span className="font-semibold text-lg">Complete Growing Info</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-xl border border-white/30 hover:bg-white/30 transition-all">
                <span className="font-semibold text-lg">Disease Management</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 section-header">Choose Your Crop</h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Select a planting guide below to access detailed information on varieties, planting techniques, 
            fertilization, pest management, and harvest practices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plantingGuides.map((guide, index) => {
            const Icon = guide.icon
            
            return (
              <Card 
                key={guide.id} 
                className="guide-card overflow-hidden border-0 shadow-lg"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Header */}
                <div className={`h-36 bg-gradient-to-br ${guide.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 card-shimmer"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                      <Icon className={`h-9 w-9 ${guide.textColor}`} />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-gray-700 shadow-md">
                      {guide.crops}
                    </span>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl mb-3">{guide.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{guide.description}</CardDescription>
                </CardHeader>

                <CardContent className="pb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className={`${guide.bgColor} p-2 rounded-lg`}>
                        <Leaf className={`h-5 w-5 ${guide.textColor}`} />
                      </div>
                      <span className="text-gray-700"><strong>Season:</strong> {guide.season}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className={`${guide.bgColor} p-2 rounded-lg`}>
                        <Wheat className={`h-5 w-5 ${guide.textColor}`} />
                      </div>
                      <span className="text-gray-700"><strong>Yield:</strong> {guide.yield}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button 
                    asChild 
                    className={`w-full bg-gradient-to-r ${guide.color} hover:opacity-90 transition-all hover:shadow-xl text-base py-6 rounded-xl`}
                  >
                    <Link href={`/agronomy/guides/${guide.id}`} className="flex items-center justify-center gap-2">
                      View Guide <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-20">
          <Card className="max-w-3xl mx-auto border-0 shadow-xl bg-gradient-to-br from-gray-50 to-gray-100 coming-soon-card">
            <CardContent className="p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">More Guides Coming Soon</h3>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                We're continuously developing new planting guides for additional crops including 
                cowpeas, sugar beans, sorghum, and more.
              </p>
              <Button asChild variant="outline" className="px-8 py-6 text-base rounded-xl border-2 hover:bg-green-50 hover:border-green-600 hover:text-green-700">
                <Link href="/contact">Request a Specific Guide</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-600 to-emerald-700"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Personalized Agronomic Advice?</h2>
          <p className="text-xl md:text-2xl mb-10 opacity-95 font-light leading-relaxed">
            Our team of experienced agronomists is available to provide customized recommendations 
            for your specific farming conditions and challenges
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Button asChild size="lg" className="cta-button bg-white text-green-800 hover:bg-gray-100 px-8 py-7 text-lg font-semibold shadow-xl rounded-xl">
              <Link href="/contact" className="flex items-center gap-2">
                Contact Our Agronomists
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" className="cta-button border-2 border-white text-white hover:bg-white hover:text-green-800 px-8 py-7 text-lg font-semibold rounded-xl">
              <Link href="/products" className="flex items-center gap-2">
                Browse Our Products
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
