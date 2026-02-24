"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Calendar,
  Droplets,
  Sprout,
  Sun,
  Thermometer,
  Leaf,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Wheat,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

const wheatVarieties = [
  {
    name: "NCEMA",
    maturity: "109-136 days (region dependent)",
    yield: "6-10t/ha",
    features: [
      "High yielding large grain",
      "Semi dwarf (81cm)",
      "46g per thousand grains",
      "11.4% protein content",
      "Disease resistant"
    ],
    regions: ["Highveld", "Middleveld", "Lowveld"],
    color: "from-amber-400 to-amber-600",
  },
]

const plantingSteps = [
  {
    title: "Land Preparation",
    icon: Sprout,
    description: "Prepare fields for optimal wheat establishment",
    details: [
      "Deep plough to 20-25cm to improve soil structure",
      "Harrow to create a fine, firm seedbed",
      "Remove previous crop residues and weeds",
      "Ensure good field drainage to prevent waterlogging",
    ],
    timing: "3-4 weeks before planting",
  },
  {
    title: "Planting Time",
    icon: Calendar,
    description: "Optimal timing for winter wheat production",
    details: [
      "Plant between April and May for winter wheat",
      "Earlier planting generally produces higher yields",
      "Soil temperature should be moderate for germination",
      "Avoid very late planting to ensure adequate growth before cold",
    ],
    timing: "April - May",
  },
  {
    title: "Seed Rate & Spacing",
    icon: Wheat,
    description: "Achieve optimal plant population",
    details: [
      "Seeding rate: 100-120 kg/ha depending on variety",
      "Planting depth: 2-4 cm",
      "Row spacing: 15-20 cm between rows",
      "Target plant density: 250-350 plants per square meter",
    ],
    timing: "At planting",
  },
  {
    title: "Fertilization",
    icon: TrendingUp,
    description: "Proper nutrition for high yields",
    details: [
      "Basal fertilizer: Compound D at 200-300 kg/ha at planting",
      "Top dressing: Ammonium nitrate at 150-200 kg/ha",
      "Apply top dress at tillering stage for best results",
      "Additional potassium may be needed in sandy soils",
    ],
    timing: "At planting & tillering",
  },
  {
    title: "Irrigation & Water",
    icon: Droplets,
    description: "Water management for consistent growth",
    details: [
      "Critical stages: germination, tillering, flowering, and grain filling",
      "Ensure adequate moisture throughout growing season",
      "Avoid water stress during flowering and grain filling",
      "Proper drainage prevents root diseases",
    ],
    timing: "Throughout season",
  },
  {
    title: "Weed Control",
    icon: Leaf,
    description: "Keep fields clean for maximum productivity",
    details: [
      "Apply pre-emergence herbicides within 48 hours after planting",
      "Early weeding critical for establishment",
      "Use selective herbicides for broadleaf weeds",
      "Keep field weed-free especially during early growth",
    ],
    timing: "0-4 weeks after planting",
  },
]

const commonDiseases = [
  {
    name: "Leaf Rust",
    symptoms: "Orange-brown pustules on leaves",
    control: "Use resistant varieties like NCEMA, apply fungicides if needed",
    severity: "High",
  },
  {
    name: "Stem Rust",
    symptoms: "Red-brown pustules on stems and leaf sheaths",
    control: "Plant resistant varieties, apply fungicides preventatively",
    severity: "High",
  },
  {
    name: "Powdery Mildew",
    symptoms: "White powdery coating on leaves and stems",
    control: "Good air circulation, resistant varieties, fungicide application",
    severity: "Medium",
  },
]

export default function WheatPlantingGuide() {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [expandedVariety, setExpandedVariety] = useState<number | null>(null)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <Button asChild variant="ghost" className="text-white hover:bg-white/20 mb-6">
            <Link href="/agronomy">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Agronomy
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
                Wheat Planting Guide
              </h1>
              <p className="text-xl mb-6 animate-fade-in animation-delay-200">
                Expert guidance for growing high-quality wheat across Highveld, Middleveld, and Lowveld regions
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in animation-delay-400">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Planting: Apr-May</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  <span>Harvest: Aug-Oct</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Yield: 6-10t/ha</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="relative w-64 h-64 mx-auto">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-full animate-spin-slow" />
                <div className="absolute inset-8 bg-white/30 backdrop-blur-sm rounded-full animate-pulse" />
                <div className="absolute inset-16 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Wheat className="h-20 w-20 text-white animate-bounce-slow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ARDA Wheat Varieties Section */}
      <div className="bg-gradient-to-b from-amber-50 to-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">ARDA Wheat Variety</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            NCEMA - Our premium wheat variety developed specifically for Zimbabwe's diverse ecological zones
          </p>

          <div className="max-w-2xl mx-auto">
            {wheatVarieties.map((variety, index) => (
              <Card
                key={variety.name}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                onClick={() => setExpandedVariety(expandedVariety === index ? null : index)}
              >
                <div className={`h-2 bg-gradient-to-r ${variety.color}`} />
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-2xl">{variety.name}</span>
                    {expandedVariety === index ? (
                      <ChevronUp className="h-5 w-5 text-amber-700" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-amber-700" />
                    )}
                  </CardTitle>
                  <CardDescription>
                    <div className="flex justify-between items-center mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> {variety.maturity}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-amber-700">
                        <TrendingUp className="h-4 w-4" /> {variety.yield}
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {variety.features.map((feature) => (
                          <span
                            key={feature}
                            className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {expandedVariety === index && (
                      <div className="animate-fade-in pt-3 border-t">
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Suitable Regions:</h4>
                        <ul className="space-y-1">
                          {variety.regions.map((region) => (
                            <li key={region} className="text-sm text-gray-600 flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <span>{region}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 bg-amber-50 p-3 rounded-lg">
                          <p className="text-sm text-amber-900">
                            <strong>Maturity varies by region:</strong> 136 days (Highveld), 120 days (Middleveld), 109 days (Lowveld)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Step-by-Step Planting Guide */}
      <div className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Step-by-Step Planting Guide</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Follow these essential steps for successful wheat cultivation from land preparation to harvest
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plantingSteps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeStep === index

              return (
                <Card
                  key={step.title}
                  className={`cursor-pointer transition-all duration-300 ${
                    isActive ? "ring-2 ring-amber-600 shadow-xl" : "hover:shadow-lg"
                  }`}
                  onClick={() => setActiveStep(isActive ? null : index)}
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`bg-gradient-to-br from-amber-400 to-amber-600 p-3 rounded-lg ${
                        isActive ? "animate-bounce-slow" : ""
                      }`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded">
                            Step {index + 1}
                          </span>
                          {isActive ? (
                            <ChevronUp className="h-5 w-5 text-amber-700" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <CardTitle className="text-xl mt-2">{step.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="mt-2">{step.description}</CardDescription>
                  </CardHeader>
                  
                  {isActive && (
                    <CardContent className="animate-fade-in">
                      <div className="space-y-3">
                        <div className="bg-amber-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Timing: {step.timing}
                          </p>
                        </div>
                        <ul className="space-y-2">
                          {step.details.map((detail, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <span>{detail}</span>
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

      {/* Disease Management Section */}
      <div className="bg-gradient-to-b from-orange-50 to-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-block bg-orange-100 p-4 rounded-full mb-4">
              <AlertTriangle className="h-12 w-12 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Common Wheat Diseases</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Recognize and manage these common diseases to protect your wheat crop
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commonDiseases.map((disease, index) => (
              <Card key={disease.name} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{disease.name}</CardTitle>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        disease.severity === "High"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {disease.severity} Risk
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Symptoms:</p>
                    <p className="text-sm text-gray-600">{disease.symptoms}</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <p className="text-sm font-semibold text-amber-800 mb-1">Control Measures:</p>
                    <p className="text-sm text-amber-700">{disease.control}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Card className="bg-gradient-to-r from-amber-600 to-amber-700 text-white inline-block">
              <CardContent className="p-6">
                <p className="text-lg mb-3">
                  <strong>NCEMA has excellent disease resistance!</strong>
                </p>
                <p className="text-sm opacity-90">
                  Good resistance to Leaf Rust, Stem Rust, and Powdery Mildew built into this variety
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Harvest & Storage Tips */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Harvest & Storage</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <Sun className="h-6 w-6 text-amber-700" />
                  </div>
                  Harvesting Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Harvest when grain moisture is 13-15%
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Use combine harvesters for efficient harvesting
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Grains should be hard and fully mature
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Avoid harvesting in wet conditions
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Thermometer className="h-6 w-6 text-blue-700" />
                  </div>
                  Storage Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Dry immediately to 12% moisture for storage
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Store in clean, dry, well-ventilated facilities
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Prevent fungal growth with proper storage conditions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Regular monitoring for pests and moisture
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-800 text-white py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Need Expert Advice?</h2>
          <p className="text-xl mb-8 opacity-90">
            Our agronomists are here to help you achieve optimal wheat yields
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-amber-800 hover:bg-gray-100">
              <Link href="/contact">Contact Our Team</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white text-amber-800 hover:bg-gray-100">
              <Link href="/products/wheat">View Wheat Varieties</Link>
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}
