'use client'

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useRef, useState } from "react"

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("company")
  const [isVisible, setIsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const [counters, setCounters] = useState({ varieties: 0, farmers: 0, years: 0, partnerships: 0 })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters()
          }
        })
      },
      { threshold: 0.3 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const animateCounters = () => {
    const duration = 2000
    const targets = { varieties: 16, farmers: 1000, years: 20, partnerships: 5 }
    const steps = 60
    const stepDuration = duration / steps

    let step = 0
    const interval = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setCounters({
        varieties: Math.floor(targets.varieties * easeOut),
        farmers: Math.floor(targets.farmers * easeOut),
        years: Math.floor(targets.years * easeOut),
        partnerships: Math.floor(targets.partnerships * easeOut),
      })

      if (step >= steps) {
        clearInterval(interval)
        setCounters(targets)
      }
    }, stepDuration)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;600&display=swap');

        * {
          font-family: 'Lato', sans-serif;
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'Playfair Display', serif;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }

        .animate-slide-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slide-right {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .stat-card {
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s;
        }

        .stat-card:hover::before {
          left: 100%;
        }

        .stat-card:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 24px rgba(34, 139, 34, 0.2);
        }

        .hero-overlay {
          background: linear-gradient(135deg, rgba(34, 139, 34, 0.85) 0%, rgba(0, 0, 0, 0.7) 100%);
          animation: fadeIn 1.2s ease-out;
        }

        .team-image {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          filter: grayscale(20%);
        }

        .team-image:hover {
          filter: grayscale(0%);
          transform: scale(1.05);
        }

        .decorative-line {
          position: relative;
          display: inline-block;
          padding-bottom: 12px;
        }

        .decorative-line::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, transparent, #228b22, transparent);
        }

        .tab-content-animate {
          animation: fadeInUp 0.6s ease-out;
        }

        .parallax-bg {
          transition: transform 0.3s ease-out;
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/aboutus/aboutus-maize.jpg"
            alt="ARDA Seeds field"
            fill
            className="object-cover parallax-bg"
            priority
          />
        </div>
        <div className="hero-overlay absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                About ARDA Seeds
              </h1>
              <p className="text-white text-xl md:text-2xl max-w-3xl font-light leading-relaxed">
                Committed to agricultural excellence and sustainable farming practices
              </p>
              <div className="mt-8 h-1 w-24 bg-gradient-to-r from-green-400 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12 h-auto p-1 bg-stone-100 rounded-xl">
            <TabsTrigger 
              value="company" 
              className="text-base md:text-lg py-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
            >
              Our Company
            </TabsTrigger>
            <TabsTrigger 
              value="team"
              className="text-base md:text-lg py-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
            >
              Our Team
            </TabsTrigger>
            <TabsTrigger 
              value="partners"
              className="text-base md:text-lg py-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300"
            >
              Partners & Certifications
            </TabsTrigger>
          </TabsList>

          {/* Company Tab */}
          <TabsContent value="company" className="tab-content-animate">
            {/* Our Story */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="space-y-6" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 decorative-line">Our Story</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  ARDA Seeds (PVT) Ltd was established with a vision to provide Zimbabwean farmers with high-quality,
                  locally adapted seed varieties that would help them increase productivity and profitability.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Over the years, we have grown to become one of the leading seed suppliers in Zimbabwe, known for our
                  commitment to quality, innovation, and customer service. Our extensive research and development
                  efforts have resulted in seed varieties that are specifically bred for local conditions, offering
                  superior performance in terms of yield, disease resistance, and adaptability.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Today, ARDA Seeds continues to expand its product range and geographical reach, while maintaining its
                  core values of integrity, excellence, and sustainability.
                </p>
              </div>
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl group" style={{ animationDelay: '0.2s' }}>
                <Image 
                  src="/images/about-company.jpg" 
                  alt="ARDA Seeds facility" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>

            {/* Mission & Values */}
            <div className="mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center decorative-line">
                Our Mission & Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-white to-stone-50" style={{ animationDelay: '0.1s' }}>
                  <CardContent className="pt-8 pb-8 px-6">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-center">Mission</h3>
                    <p className="text-gray-700 text-center leading-relaxed">
                      To enhance agricultural productivity and food security by providing farmers with high-quality,
                      innovative seed solutions and agronomic support.
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-white to-stone-50" style={{ animationDelay: '0.2s' }}>
                  <CardContent className="pt-8 pb-8 px-6">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-center">Vision</h3>
                    <p className="text-gray-700 text-center leading-relaxed">
                      To be the leading seed company in Zimbabwe and beyond, recognized for excellence in product
                      quality, innovation, and customer service.
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-white to-stone-50" style={{ animationDelay: '0.3s' }}>
                  <CardContent className="pt-8 pb-8 px-6">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-center">Values</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Integrity in all our dealings</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Commitment to quality and excellence</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Innovation in product development</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Sustainability in farming practices</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Customer-centric approach</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Achievements */}
            <div ref={statsRef}>
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center decorative-line">
                Our Achievements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div className="stat-card bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg border border-green-100">
                  <div className="text-5xl md:text-6xl font-bold text-green-700 mb-3">{counters.varieties}+</div>
                  <p className="text-gray-700 text-lg font-medium">Seed Varieties</p>
                </div>
                <div className="stat-card bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg border border-green-100">
                  <div className="text-5xl md:text-6xl font-bold text-green-700 mb-3">{counters.farmers}+</div>
                  <p className="text-gray-700 text-lg font-medium">Farmers Served</p>
                </div>
                <div className="stat-card bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg border border-green-100">
                  <div className="text-5xl md:text-6xl font-bold text-green-700 mb-3">{counters.years}+</div>
                  <p className="text-gray-700 text-lg font-medium">Years of Experience</p>
                </div>
                <div className="stat-card bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg border border-green-100">
                  <div className="text-5xl md:text-6xl font-bold text-green-700 mb-3">{counters.partnerships}+</div>
                  <p className="text-gray-700 text-lg font-medium">Research Partnerships</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="tab-content-animate">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center decorative-line">
              Our Leadership Team
            </h2>
            
            {/* Managing Director */}
            <div className="max-w-4xl mx-auto mb-16 bg-gradient-to-br from-white to-stone-50 rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-center">
                <div className="relative h-80 w-80 mx-auto mb-8 rounded-full overflow-hidden shadow-2xl ring-4 ring-green-100">
                  <Image 
                    src="/images/aboutus/leadership/managing-director.png" 
                    alt="Managing Director" 
                    fill 
                    className="object-cover team-image" 
                  />
                </div>
                <h3 className="text-3xl font-semibold mb-2">Wiseman Teta</h3>
                <p className="text-green-700 text-xl mb-6 font-medium">Managing Director</p>
                <div className="space-y-4 text-gray-700 text-base leading-relaxed max-w-3xl mx-auto">
                  <p>
                    With over two decades of dedicated service to the agricultural sector, our Managing Director Mr Wiseman Teta, brings a wealth of strategic and operational expertise to the helm of ARDA Seeds. His leadership is deeply rooted in his foundational five-year tenure as the General Manager of ARDA, where he played a pivotal role in revitalizing large-scale agricultural projects and streamlining national supply chains. This period was instrumental in shaping his holistic understanding of the industry; by navigating the complexities of high-level agricultural management, he developed a sharp reputation as a pragmatic problem-solver with an unwavering focus on food security and rural development.
                  </p>
                  <p>
                    Beyond his technical credentials, he is defined by a "field-first" philosophy. He is a leader who firmly believes that the most valuable insights are found in the soil and through direct conversation with growers, rather than just on a balance sheet. This approach has fostered a corporate culture at ARDA Seeds that prioritizes integrity and seed purity above all else. Having guided organizations through various economic and climatic cycles, he possesses a visionary resilience and a calm, long-term perspective on agricultural investment that stabilizes the company's trajectory in a changing world.
                  </p>
                </div>
              </div>
            </div>

            {/* Other Leadership */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-gradient-to-br from-white to-stone-50 rounded-2xl shadow-lg p-8 card-hover">
                <div className="text-center">
                  <div className="relative h-64 w-64 mx-auto mb-6 rounded-full overflow-hidden shadow-xl ring-4 ring-green-100">
                    <Image
                      src="/images/aboutus/leadership/general-manager.png"
                      alt="General Manager"
                      fill
                      className="object-cover team-image"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Jane Smith</h3>
                  <p className="text-green-700 text-lg mb-4 font-medium">General Manager</p>
                  <p className="text-gray-700 leading-relaxed">
                    Jane oversees our day-to-day operations, ensuring that we maintain the highest standards of quality
                    and service excellence.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-stone-50 rounded-2xl shadow-lg p-8 card-hover">
                <div className="text-center">
                  <div className="relative h-64 w-64 mx-auto mb-6 rounded-full overflow-hidden shadow-xl ring-4 ring-green-100">
                    <Image
                      src="/images//aboutus/leadership/corporate-services-manager.png"
                      alt="Commercial Services Manager"
                      fill
                      className="object-cover team-image"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Robert Johnson</h3>
                  <p className="text-green-700 text-lg mb-4 font-medium">Commercial Services Manager</p>
                  <p className="text-gray-700 leading-relaxed">
                    Robert leads our commercial team, developing strategic partnerships and ensuring that our products
                    reach farmers across the country.
                  </p>
                </div>
              </div>
            </div>

            {/* Team Expertise CTA */}
            <div className="text-center bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-6">Our Team's Expertise</h2>
              <p className="text-lg max-w-3xl mx-auto mb-8 leading-relaxed opacity-95">
                At ARDA Seeds, our team comprises experienced professionals with diverse expertise in plant breeding,
                agronomy, seed production, quality control, and customer service. This multidisciplinary approach allows
                us to deliver comprehensive solutions to our farmers.
              </p>
              <Button asChild className="bg-white text-green-700 hover:bg-stone-100 px-8 py-6 text-lg font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105">
                <Link href="/contact">Contact Our Team</Link>
              </Button>
            </div>
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners" className="tab-content-animate">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center decorative-line">Our Partners</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-white to-stone-50">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="relative h-24 mb-6 flex items-center justify-center">
                    <Image
                      src="/images/partner-1.jpg"
                      alt="Zimbabwe Seed Producers Association"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Zimbabwe Seed Producers Association</h3>
                  <p className="text-gray-700 leading-relaxed">
                    As a member of the Zimbabwe Seed Producers Association, we collaborate with other seed producers to
                    promote industry standards and best practices.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-white to-stone-50">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="relative h-24 mb-6 flex items-center justify-center">
                    <Image
                      src="/images/partner-2.jpg"
                      alt="Agricultural Research Council"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Agricultural Research Council</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our partnership with the Agricultural Research Council enables us to stay at the forefront of
                    agricultural research and innovation.
                  </p>
                </CardContent>
              </Card>

              <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-white to-stone-50">
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="relative h-24 mb-6 flex items-center justify-center">
                    <Image 
                      src="/images/partner-3.jpg" 
                      alt="Farmer City" 
                      fill 
                      className="object-contain" 
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Farmer City</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Farmer City is one of our key retail partners, helping us distribute our seeds to farmers across the
                    country.
                  </p>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center decorative-line">
              Certifications & Standards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-white to-stone-50">
                <CardContent className="pt-8 pb-8 px-8">
                  <div className="w-16 h-16 mb-6 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Quality Assurance</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    All our seed varieties undergo rigorous testing to ensure they meet the highest standards of
                    quality, purity, and germination. Our quality control processes include:
                  </p>
                  <ul className="text-gray-700 space-y-3">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">✓</span>
                      <span>Field inspections during seed production</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">✓</span>
                      <span>Laboratory testing for germination and purity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">✓</span>
                      <span>Post-harvest quality checks</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">✓</span>
                      <span>Proper storage and handling procedures</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-white to-stone-50">
                <CardContent className="pt-8 pb-8 px-8">
                  <div className="w-16 h-16 mb-6 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">Certifications</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Our commitment to quality and excellence is reflected in our certifications:
                  </p>
                  <ul className="text-gray-700 space-y-3">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">✓</span>
                      <span>ISO 9001:2015 Quality Management System</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">✓</span>
                      <span>Seed Certification from the Seed Services Institute</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">✓</span>
                      <span>Member of the Zimbabwe Seed Producers Association</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2 mt-1">✓</span>
                      <span>Environmental Management Certification</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Partnership CTA */}
            <div className="text-center bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-6">Become a Partner</h2>
              <p className="text-lg max-w-3xl mx-auto mb-8 leading-relaxed opacity-95">
                We are always looking for new partnerships that can help us better serve our farmers and expand our
                reach. If you are interested in partnering with ARDA Seeds, please contact us.
              </p>
              <Button asChild className="bg-white text-green-700 hover:bg-stone-100 px-8 py-6 text-lg font-semibold shadow-lg transition-all hover:shadow-xl hover:scale-105">
                <Link href="/contact">Contact Us for Partnership</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}