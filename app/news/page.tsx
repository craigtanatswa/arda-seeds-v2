import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar } from "lucide-react"
import NewsSlideshow from "@/components/news-slideshow"
import "./news-styles.css"

export const metadata: Metadata = {
  title: "News & Updates | ARDA Seeds",
  description:
    "Stay up-to-date with the latest news, product launches, seasonal campaigns, and agricultural insights from ARDA Seeds.",
}

// Featured news slides
const featuredSlides = [
  {
    id: 1,
    image: "/images/news-1.jpg",
    badge: "New Product",
    date: "June 1, 2023",
    title: "ARDA Seeds Launches New Drought-Resistant Maize Variety",
    description: "Our latest maize variety offers exceptional performance in drought conditions",
    excerpt: "ARDA Seeds is proud to announce the launch of our newest maize variety, ZS270, specifically bred for exceptional performance under drought conditions. This new variety combines early maturity with outstanding yield potential, making it an ideal choice for farmers in regions with unpredictable rainfall patterns.",
    link: "/news/drought-resistant-maize"
  },
  {
    id: 2,
    image: "/images/news-2.jpg",
    badge: "Event",
    date: "May 15, 2023",
    title: "Successful Farmer Field Day in Mashonaland East",
    description: "Over 200 farmers attended our recent field day showcasing latest varieties",
    excerpt: "Over 200 farmers attended our recent field day in Mashonaland East, where we showcased our latest seed varieties and agronomic practices. The event featured live demonstrations, expert presentations, and opportunities for farmers to connect with our agronomists.",
    link: "/news/field-day"
  },
  {
    id: 3,
    image: "/images/news-3.jpg",
    badge: "Partnership",
    date: "April 28, 2023",
    title: "ARDA Seeds Partners with Agricultural Research Institute",
    description: "New research partnership for climate-smart seed development",
    excerpt: "We are excited to announce our new research partnership aimed at developing climate-smart seed varieties for Zimbabwean farmers. This collaboration will accelerate our innovation in breeding programs and bring cutting-edge agricultural solutions to market.",
    link: "/news/research-partnership"
  }
]

export default function NewsPage() {
  return (
    <div className="min-h-screen news-page">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-700 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 hero-title">
              News & Updates
            </h1>
            <p className="text-xl md:text-2xl font-light leading-relaxed hero-subtitle max-w-3xl mx-auto">
              Stay up-to-date with the latest news, product launches, seasonal campaigns, and agricultural insights from ARDA Seeds
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Featured News Slideshow */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 section-header">Featured News</h2>
            <p className="text-gray-600 text-lg">Our latest announcements and updates</p>
          </div>
          <NewsSlideshow slides={featuredSlides} />
        </div>

        {/* More News Grid */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 section-header">More Updates</h2>
            <p className="text-gray-600 text-lg">Explore our recent news and announcements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="news-card overflow-hidden border-0 shadow-lg">
              <div className="relative h-[250px] overflow-hidden">
                <Image 
                  src="/images/news-4.jpg" 
                  alt="Seasonal Update" 
                  fill 
                  className="object-cover news-card-image" 
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-green-700">Current Season</Badge>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1" /> May 10, 2023
                  </div>
                </div>
                <CardTitle className="text-xl">2023 Winter Wheat Planting Season Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-3">
                  As the winter wheat planting season approaches, ARDA Seeds recommends our NCEMA variety for its excellent performance across different ecological zones.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90 transition-all hover:shadow-xl rounded-xl"
                >
                  <Link href="/news/winter-wheat-season" className="flex items-center justify-center gap-2">
                    Read More <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="news-card overflow-hidden border-0 shadow-lg">
              <div className="relative h-[250px] overflow-hidden">
                <Image 
                  src="/images/news-5.jpg" 
                  alt="Training Program" 
                  fill 
                  className="object-cover news-card-image" 
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="border-green-700 text-green-700">Training</Badge>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1" /> April 15, 2023
                  </div>
                </div>
                <CardTitle className="text-xl">Outgrower Training Program Success</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-3">
                  Our comprehensive outgrower training program has successfully equipped over 150 farmers with advanced seed production techniques and quality control methods.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-green-700 text-green-700 hover:bg-green-50 rounded-xl"
                >
                  <Link href="/news/outgrower-training">Read More</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="news-card overflow-hidden border-0 shadow-lg">
              <div className="relative h-[250px] overflow-hidden">
                <Image 
                  src="/images/news-6.jpg" 
                  alt="Sustainability Initiative" 
                  fill 
                  className="object-cover news-card-image" 
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="border-green-700 text-green-700">Sustainability</Badge>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1" /> March 22, 2023
                  </div>
                </div>
                <CardTitle className="text-xl">ARDA Seeds Commits to Sustainable Agriculture</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-3">
                  We're proud to announce our new sustainability initiatives focused on environmentally-friendly seed production and supporting regenerative farming practices.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-green-700 text-green-700 hover:bg-green-50 rounded-xl"
                >
                  <Link href="/news/sustainability-initiative">Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative py-16 px-8 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-600 to-emerald-700"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Connected</h2>
            <p className="text-xl md:text-2xl mb-10 opacity-95 font-light leading-relaxed">
              Follow us on social media and visit our website regularly for the latest updates, farming tips, and seasonal advice
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button asChild size="lg" className="cta-button bg-white text-green-800 hover:bg-gray-100 px-8 py-7 text-lg font-semibold shadow-xl rounded-xl">
                <Link href="/agronomy" className="flex items-center gap-2">
                  View Planting Guides
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" className="cta-button border-2 border-white text-white hover:bg-white hover:text-green-800 px-8 py-7 text-lg font-semibold rounded-xl">
                <Link href="/contact" className="flex items-center gap-2">
                  Contact Us
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
