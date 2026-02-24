import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Share2, Facebook, Twitter, Linkedin } from "lucide-react"
import "../news-styles.css"

export const metadata: Metadata = {
  title: "ARDA Seeds Launches New Drought-Resistant Maize Variety | ARDA Seeds News",
  description: "Our latest maize variety, ZS270, offers exceptional performance in drought conditions with early maturity and outstanding yield potential.",
}

export default function DroughtResistantMaizePage() {
  return (
    <div className="min-h-screen news-page">
      {/* Hero Image */}
      <div className="relative h-[400px] md:h-[600px] overflow-hidden">
        <Image
          src="/images/news-1.jpg"
          alt="New Drought-Resistant Maize Variety"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container mx-auto max-w-4xl">
            <Link 
              href="/news" 
              className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to News
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-green-600 text-base px-4 py-1.5">New Product</Badge>
              <div className="flex items-center text-white/90">
                <Calendar className="h-4 w-4 mr-2" />
                <span>June 1, 2023</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              ARDA Seeds Launches New Drought-Resistant Maize Variety
            </h1>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <article className="prose prose-lg max-w-none">
          {/* Social Share */}
          <div className="flex items-center justify-between mb-12 pb-8 border-b">
            <div className="flex items-center gap-3">
              <span className="text-gray-600 font-medium">Share this article:</span>
              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  <Facebook className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Lead Paragraph */}
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            <strong>Harare, Zimbabwe</strong> – ARDA Seeds is proud to announce the launch of our newest maize variety, <strong>ZS270</strong>, specifically bred for exceptional performance under drought conditions. This groundbreaking variety represents years of dedicated research and development, combining early maturity with outstanding yield potential.
          </p>

          {/* Main Content */}
          <h2 className="text-3xl font-bold mt-12 mb-6">A Game-Changer for Zimbabwean Farmers</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            ZS270 is designed to address one of the most pressing challenges facing farmers in Zimbabwe and across Southern Africa: unpredictable rainfall patterns and prolonged dry spells. Through advanced breeding techniques and rigorous field testing across multiple ecological zones, our research team has developed a variety that maintains excellent yield potential even under water-stressed conditions.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            "This variety represents a significant advancement in our breeding program," says Dr. John Mapfumo, ARDA Seeds' Chief Agronomist. "ZS270 combines drought tolerance with early maturity, allowing farmers to achieve good yields with less water and reduced risk of crop failure due to early season termination."
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6">Key Features and Benefits</h2>
          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-xl mb-8">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <span><strong>Drought Tolerance:</strong> Maintains yield stability under water stress conditions</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <span><strong>Early Maturity:</strong> 120-130 days to maturity, reducing exposure to end-of-season drought</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <span><strong>High Yield Potential:</strong> Up to 10-12 tonnes per hectare under optimal conditions</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <span><strong>Disease Resistance:</strong> Good resistance to common leaf diseases and stalk rots</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <span><strong>Adaptability:</strong> Suitable for regions 2-5, covering most maize-growing areas in Zimbabwe</span>
              </li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold mt-12 mb-6">Field Trial Results</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Extensive field trials conducted over three consecutive seasons across Zimbabwe's diverse agro-ecological zones have demonstrated ZS270's superior performance. In trials conducted in Natural Regions 2 and 3 during the 2022/23 season, ZS270 out-yielded the local check varieties by an average of 18% under rainfed conditions.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Under drought-stressed conditions (receiving only 60% of normal seasonal rainfall), ZS270 maintained a yield advantage of 25% over conventional varieties, demonstrating its exceptional drought tolerance and stability.
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6">Availability and Recommendations</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            ZS270 is now available through our network of authorized dealers across Zimbabwe, including Farmer City and Electrosales outlets. We recommend planting at a population of 37,000-40,000 plants per hectare for optimal results.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8">
            <h3 className="text-xl font-bold mb-3 text-blue-900">Planting Recommendations</h3>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Planting Window:</strong> November - December</li>
              <li><strong>Plant Population:</strong> 37,000-40,000 plants/ha</li>
              <li><strong>Fertilizer:</strong> Basal: Compound D (7:14:7) at 300kg/ha; Top dress: Ammonium Nitrate at 200kg/ha</li>
              <li><strong>Seed Rate:</strong> 25kg/ha</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold mt-12 mb-6">Expert Support Available</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Our team of agronomists is available to provide technical advice and support to farmers interested in growing ZS270. We encourage all farmers to contact our offices or visit our website for detailed planting guides and crop management recommendations.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            For more information about ZS270 or any of our other maize varieties, please contact our customer service team or visit your nearest authorized ARDA Seeds dealer.
          </p>

          {/* Call to Action */}
          <div className="mt-12 p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
            <h3 className="text-2xl font-bold mb-4">Interested in ZS270?</h3>
            <p className="text-gray-700 mb-6">
              Contact us to learn more about this exciting new variety and how it can benefit your farming operation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 rounded-xl">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-green-600 text-green-700 hover:bg-green-50 rounded-xl">
                <Link href="/products/maize">View All Maize Varieties</Link>
              </Button>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-16 pt-12 border-t">
          <h2 className="text-3xl font-bold mb-8">Related News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/news/field-day" className="group">
              <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                <Image 
                  src="/images/news-2.jpg" 
                  alt="Farmer Field Day" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <h3 className="text-xl font-bold group-hover:text-green-600 transition-colors">
                Successful Farmer Field Day in Mashonaland East
              </h3>
              <p className="text-gray-600 mt-2">May 15, 2023</p>
            </Link>

            <Link href="/news/research-partnership" className="group">
              <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                <Image 
                  src="/images/news-3.jpg" 
                  alt="Research Partnership" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              <h3 className="text-xl font-bold group-hover:text-green-600 transition-colors">
                ARDA Seeds Partners with Agricultural Research Institute
              </h3>
              <p className="text-gray-600 mt-2">April 28, 2023</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
