"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft, Calendar, Droplets, Sprout, Sun, Thermometer, Leaf, TrendingUp,
  AlertTriangle, CheckCircle2, Wheat, ChevronDown, ChevronUp,
} from "lucide-react"

const sunflowerVarieties = [
  {
    name: "PEREDOVIC",
    maturity: "100-115 days",
    yield: "0.8-2.5t/ha",
    features: ["Medium duration", "Marginal areas ideal", "Soft seeded", "39% oil content", "200cm height"],
    regions: ["Marginal production areas", "Various ecological zones"],
    color: "from-yellow-400 to-yellow-600",
  },
  {
    name: "MSASA",
    maturity: "80-90 days",
    yield: "Up to 2.5t/ha",
    features: ["Early maturing", "Soft seeded", "45% oil content", "150-170cm height", "Excellent adaptability"],
    regions: ["Various ecological zones", "All sunflower growing areas"],
    color: "from-amber-400 to-amber-600",
  },
]

const plantingSteps = [
  {
    title: "Land Preparation",
    icon: Sprout,
    description: "Prepare fields for sunflower cultivation",
    details: [
      "Deep plough to 20-25cm depth",
      "Create fine, firm seedbed through harrowing",
      "Ensure good drainage and level fields",
      "Remove weeds and previous crop residues",
    ],
    timing: "2-3 weeks before planting",
  },
  {
    title: "Planting Time",
    icon: Calendar,
    description: "Optimal timing for sunflower production",
    details: [
      "Plant between November and December",
      "Soil temperature should be above 15°C",
      "Plant with onset of reliable rains",
      "Avoid late planting for best yields",
    ],
    timing: "November - December",
  },
  {
    title: "Seed Rate & Spacing",
    icon: Wheat,
    description: "Achieve optimal plant population",
    details: [
      "Seeding rate: 5-7 kg/ha",
      "Planting depth: 2-5 cm",
      "Row spacing: 60-90 cm between rows",
      "Plant spacing: 20-30 cm within rows",
      "Target: 20,000-30,000 plants/ha",
    ],
    timing: "At planting",
  },
  {
    title: "Fertilization",
    icon: TrendingUp,
    description: "Proper nutrition for high oil content",
    details: [
      "Basal fertilizer: Compound D at 200-300 kg/ha at planting",
      "Top dressing: Ammonium nitrate at 100-150 kg/ha",
      "Apply top dress at 4-6 weeks after planting",
      "Sunflower responds well to potassium application",
    ],
    timing: "At planting & 4-6 weeks",
  },
  {
    title: "Irrigation & Moisture",
    icon: Droplets,
    description: "Water management for head development",
    details: [
      "Critical stages: flowering and seed filling",
      "Ensure adequate moisture during head development",
      "Avoid water stress during flowering",
      "Good drainage prevents diseases",
    ],
    timing: "Throughout season",
  },
  {
    title: "Weed Control",
    icon: Leaf,
    description: "Maintain clean fields",
    details: [
      "Pre-emergence herbicides within 48 hours",
      "First weeding: 2-3 weeks after planting",
      "Second weeding: 5-6 weeks after planting",
      "Critical weed-free period is first 6 weeks",
    ],
    timing: "0-6 weeks after planting",
  },
]

export default function SunflowerPlantingGuide() {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [expandedVariety, setExpandedVariety] = useState<number | null>(null)

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-yellow-600 via-yellow-500 to-amber-600 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <Button asChild variant="ghost" className="text-white hover:bg-white/20 mb-6">
            <Link href="/agronomy"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Agronomy</Link>
          </Button>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">Sunflower Planting Guide</h1>
              <p className="text-xl mb-6 animate-fade-in animation-delay-200">
                Complete guide to growing sunflowers with high oil content for various conditions
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in animation-delay-400">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" /><span>Planting: Nov-Dec</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                  <Sun className="h-5 w-5" /><span>Harvest: Feb-May</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" /><span>Oil: 39-45%</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="relative w-64 h-64 mx-auto">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-full animate-spin-slow" />
                <div className="absolute inset-8 bg-white/30 backdrop-blur-sm rounded-full animate-pulse" />
                <div className="absolute inset-16 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Sun className="h-20 w-20 text-white animate-bounce-slow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-yellow-50 to-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">ARDA Sunflower Varieties</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            High oil content varieties perfect for small-scale and commercial production
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {sunflowerVarieties.map((variety, index) => (
              <Card key={variety.name} className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                onClick={() => setExpandedVariety(expandedVariety === index ? null : index)}>
                <div className={`h-2 bg-gradient-to-r ${variety.color}`} />
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-2xl">{variety.name}</span>
                    {expandedVariety === index ? <ChevronUp className="h-5 w-5 text-yellow-700" /> : <ChevronDown className="h-5 w-5 text-yellow-700" />}
                  </CardTitle>
                  <CardDescription>
                    <div className="flex justify-between items-center mt-2">
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {variety.maturity}</span>
                      <span className="flex items-center gap-1 font-semibold text-yellow-700"><TrendingUp className="h-4 w-4" /> {variety.yield}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {variety.features.map((feature) => (
                          <span key={feature} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">{feature}</span>
                        ))}
                      </div>
                    </div>
                    {expandedVariety === index && (
                      <div className="animate-fade-in pt-3 border-t">
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Suitable Regions:</h4>
                        <ul className="space-y-1">
                          {variety.regions.map((region) => (
                            <li key={region} className="text-sm text-gray-600 flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" /><span>{region}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Step-by-Step Planting Guide</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Essential steps for successful sunflower cultivation</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plantingSteps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeStep === index
              return (
                <Card key={step.title} className={`cursor-pointer transition-all duration-300 ${isActive ? "ring-2 ring-yellow-600 shadow-xl" : "hover:shadow-lg"}`}
                  onClick={() => setActiveStep(isActive ? null : index)}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-lg ${isActive ? "animate-bounce-slow" : ""}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-1 rounded">Step {index + 1}</span>
                          {isActive ? <ChevronUp className="h-5 w-5 text-yellow-700" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                        </div>
                        <CardTitle className="text-xl mt-2">{step.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="mt-2">{step.description}</CardDescription>
                  </CardHeader>
                  {isActive && (
                    <CardContent className="animate-fade-in">
                      <div className="space-y-3">
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-yellow-800 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />Timing: {step.timing}
                          </p>
                        </div>
                        <ul className="space-y-2">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" /><span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Harvest & Storage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-lg"><Sun className="h-6 w-6 text-yellow-700" /></div>
                  Harvesting Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Harvest when back of heads turn yellow-brown</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Seeds should be firm and fully developed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Moisture content: 12-15% at harvest</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Avoid bird damage by timely harvest</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg"><Thermometer className="h-6 w-6 text-blue-700" /></div>
                  Storage Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Dry seeds to 9-10% moisture for storage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Store in clean, dry conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Prevent fungal growth with proper ventilation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Monitor for pest damage regularly</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Need Expert Advice?</h2>
          <p className="text-xl mb-8 opacity-90">Our agronomists can help you maximize sunflower oil yields</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="outline" className="bg-white text-yellow-800 hover:bg-white/10">
              <Link href="/contact">Contact Our Team</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white text-yellow-800 hover:bg-white/10">
              <Link href="/products/sunflower">View Sunflower Varieties</Link>
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  )
}
