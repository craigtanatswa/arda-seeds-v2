import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCategoryCard from "@/components/product-category-card";
import TestimonialCard from "@/components/testimonial-card";
import { ArrowRight, Leaf, Sprout, FlaskRoundIcon as Flask, Package, Check, TrendingUp, Shield } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import HeroSlideshow from "@/components/hero-slideshow";
import "./home-styles.css";

export default async function Home() {
  // Fetch slideshow images from Supabase, with fallback to local images
  const { data: slides } = supabase
    ? await supabase.from("hero_slides").select("*").order("sort_order", { ascending: true })
    : { data: null };

  // Fallback to local images if no slides from database
  const defaultSlides = [
    {
      id: 1,
      image_url: "/images/Maize field.jpg",
      title: "Premium Quality Seeds",
      subtitle: "Growing Zimbabwe's Agricultural Future",
      sort_order: 1
    },
    {
      id: 2,
      image_url: "/images/Wheat field.jpg",
      title: "Locally Adapted Varieties",
      subtitle: "Bred for Your Success",
      sort_order: 2
    },
    {
      id: 3,
      image_url: "/images/Legume seeds.jpg",
      title: "Trusted by Thousands",
      subtitle: "Your Partner in Sustainable Farming",
      sort_order: 3
    }
  ];

  const heroSlides = slides && slides.length > 0 ? slides : defaultSlides;

  return (
    <div className="flex flex-col overflow-hidden home-page">
      {/* Styles moved to home-styles.css */}

      {/* HERO SECTION – SLIDESHOW */}
      <HeroSlideshow slides={heroSlides} />

      {/* Why Choose ARDA - New Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
        <div className="decorative-blob w-96 h-96 bg-green-300 -top-48 -right-48"></div>
        <div className="decorative-blob w-80 h-80 bg-emerald-300 -bottom-40 -left-40"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 section-header inline-block">
              Why Choose ARDA Seeds?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-8">
              Trusted by thousands of farmers across Zimbabwe for quality, reliability, and results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg card-hover-lift border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Quality Assured</h3>
              <p className="text-gray-600 leading-relaxed">
                Every seed batch undergoes rigorous testing for purity, germination, and disease resistance to ensure you get the best.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg card-hover-lift border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Proven Results</h3>
              <p className="text-gray-600 leading-relaxed">
                Our varieties are specifically bred for local conditions, delivering superior yields and consistent performance.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg card-hover-lift border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Expert Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Access our team of agronomists for technical advice, planting guides, and ongoing crop management support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 section-header inline-block">
              Our Seed Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-8">
              Discover our comprehensive range of premium seed varieties, each developed for optimal performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="service-card bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center text-center border-2 border-transparent">
              <ProductCategoryCard
                title="Maize"
                description="High-yielding maize varieties with excellent disease resistance"
                image="/images/maize.jpg"
                href="/products/maize"
              />
            </div>
            <div className="service-card bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center text-center border-2 border-transparent">
              <ProductCategoryCard
                title="Wheat"
                description="Quality wheat seeds adapted to various ecological zones"
                image="/images/wheat.jpg"
                href="/products/wheat"
              />
            </div>
            <div className="service-card bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center text-center border-2 border-transparent">
              <ProductCategoryCard
                title="Soybeans"
                description="Soybean varieties with high protein content and disease resistance"
                image="/images/soybeans.jpg"
                href="/products/soybeans"
              />
            </div>
            <div className="service-card bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center text-center border-2 border-transparent">
              <ProductCategoryCard
                title="Groundnuts"
                description="Drought-tolerant groundnut varieties with high pod yield"
                image="/images/groundnuts.jpg"
                href="/products/groundnuts"
              />
            </div>
            <div className="service-card bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center text-center border-2 border-transparent">
              <ProductCategoryCard
                title="Sunflower"
                description="Sunflower seeds with high oil content for various conditions"
                image="/images/sunflower.jpg"
                href="/products/sunflower"
              />
            </div>
            <div className="service-card bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center text-center border-2 border-transparent">
              <ProductCategoryCard
                title="Other Crops"
                description="Explore our cowpeas, sugarbeans, sorghum and other varieties"
                image="/images/other-crops.jpg"
                href="/products/other"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Enhanced */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="decorative-blob w-96 h-96 bg-blue-200 top-0 right-0"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 section-header inline-block">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-8">
              Comprehensive support for your agricultural success
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
            {/* Service 1 */}
            <div className="service-card bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center text-center md:w-1/2 border-2 border-transparent">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-5 rounded-2xl mb-6 shadow-md">
                <Sprout className="h-12 w-12 text-green-700" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Outgrowing</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Partner with us for seed multiplication and production through our outgrower programs. Join a network of successful seed producers.
              </p>
              <Link 
                href="/services/outgrowing" 
                className="mt-4 text-green-700 font-semibold flex items-center justify-center hover:text-green-800 transition-colors group"
              >
                Learn more 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Service 2 */}
            <div className="service-card bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center text-center md:w-1/2 border-2 border-transparent">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-5 rounded-2xl mb-6 shadow-md">
                <Leaf className="h-12 w-12 text-green-700" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Agronomic Support</h3>
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                Access expert advice on planting guides, pest control, and crop management from our experienced agronomists.
              </p>
              <Link 
                href="/agronomy" 
                className="mt-4 text-green-700 font-semibold flex items-center justify-center hover:text-green-800 transition-colors group"
              >
                Learn more 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 section-header inline-block">
              What Our Growers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-8">
              Real stories from farmers who trust ARDA Seeds
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="testimonial-card">
              <TestimonialCard
                quote="ARDA Seeds' maize varieties have consistently given me excellent yields, even during drought seasons. The quality is unmatched."
                author="John Moyo"
                role="Commercial Farmer, Mashonaland"
              />
            </div>
            <div className="testimonial-card">
              <TestimonialCard
                quote="The technical support from ARDA's agronomists has been invaluable for improving my farming practices and increasing productivity."
                author="Sarah Mutasa"
                role="Smallholder Farmer, Manicaland"
              />
            </div>
            <div className="testimonial-card">
              <TestimonialCard
                quote="I've been using ARDA's soybean seeds for five years now and the quality is always outstanding. Highly recommended!"
                author="David Ncube"
                role="Farm Manager, Midlands"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-24 px-4 bg-gradient-to-br from-green-700 via-green-600 to-emerald-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
            Ready to Grow with ARDA Seeds?
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Join thousands of satisfied farmers across Zimbabwe who trust our seeds for their crops.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              asChild 
              size="lg" 
              className="cta-button bg-white text-green-800 hover:bg-gray-100 px-8 py-7 text-lg font-semibold shadow-2xl rounded-xl min-w-[200px] relative z-10"
            >
              <Link href="/register" className="flex items-center gap-2">
                Register as a Grower
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              className="cta-button border-2 border-white text-white hover:bg-white hover:text-green-800 px-8 py-7 text-lg font-semibold rounded-xl min-w-[200px] transition-all relative z-10"
            >
              <Link href="/quote" className="flex items-center gap-2">
                Request a Quote
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              {/* Changed to text-white */}
              <div className="text-4xl md:text-5xl font-bold mb-2 text-white">16+</div>
              <p className="text-green-50 font-medium">Seed Varieties</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-white">1000+</div>
              <p className="text-green-50 font-medium">Happy Farmers</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-white">20+</div>
              <p className="text-green-50 font-medium">Years Experience</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-white">5+</div>
              <p className="text-green-50 font-medium">Partnerships</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
