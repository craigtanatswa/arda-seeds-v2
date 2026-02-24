'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface NewsSlide {
  id: number
  image: string
  badge: string
  date: string
  title: string
  description: string
  excerpt: string
  link: string
}

interface NewsSlideshowProps {
  slides: NewsSlide[]
}

export default function NewsSlideshow({ slides }: NewsSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 7000)

    return () => clearInterval(timer)
  }, [currentSlide])

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsAnimating(false), 600)
  }

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 600)
  }

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl group bg-white">
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(1.05);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes contentSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .slide-image {
          animation: slideIn 0.8s ease-out;
        }

        .slide-content {
          animation: contentSlideUp 0.6s ease-out;
        }

        .slide-content-delayed {
          animation: contentSlideUp 0.6s ease-out 0.15s both;
        }

        .slide-content-more-delayed {
          animation: contentSlideUp 0.6s ease-out 0.3s both;
        }

        .nav-button {
          transition: all 0.3s ease;
          opacity: 0;
        }

        .group:hover .nav-button {
          opacity: 1;
        }

        .nav-button:hover {
          transform: scale(1.1);
          background: rgba(255, 255, 255, 0.98);
        }

        .indicator {
          transition: all 0.3s ease;
        }

        .indicator.active {
          width: 3rem;
          background: white;
        }

        .indicator:not(.active) {
          background: rgba(255, 255, 255, 0.5);
        }

        .indicator:hover:not(.active) {
          background: rgba(255, 255, 255, 0.75);
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image Section */}
        <div className="relative h-[400px] lg:h-[600px] overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-600 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className={`object-cover ${index === currentSlide ? 'slide-image' : ''}`}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden"></div>
            </div>
          ))}

          {/* Navigation Buttons */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="nav-button absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-green-800 p-3 rounded-full shadow-xl"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="nav-button absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-green-800 p-3 rounded-full shadow-xl"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Content Section */}
        <div className="relative p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-gray-50 to-white">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`transition-opacity duration-600 ${
                index === currentSlide ? 'opacity-100 relative z-10' : 'opacity-0 absolute inset-0 z-0'
              }`}
            >
              {index === currentSlide && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 slide-content">
                    <Badge className="bg-green-700 text-base px-4 py-1.5">{slide.badge}</Badge>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{slide.date}</span>
                    </div>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-bold leading-tight slide-content-delayed">
                    {slide.title}
                  </h2>

                  <p className="text-xl text-gray-600 slide-content-delayed">
                    {slide.description}
                  </p>

                  <p className="text-gray-700 leading-relaxed slide-content-more-delayed">
                    {slide.excerpt}
                  </p>

                  <div className="pt-4 slide-content-more-delayed">
                    <Button 
                      asChild 
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90 transition-all hover:shadow-xl text-base px-8 py-6 rounded-xl"
                    >
                      <Link href={slide.link} className="flex items-center gap-2">
                        Read Full Article
                        <ChevronRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Indicators */}
          {slides.length > 1 && (
            <div className="flex gap-2 mt-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`indicator h-1.5 rounded-full cursor-pointer ${
                    index === currentSlide ? 'active' : 'w-1.5'
                  }`}
                  style={{ backgroundColor: index === currentSlide ? '#228b22' : '#d1d5db' }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
