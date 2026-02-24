"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export default function GrowerRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedCrops, setSelectedCrops] = useState<string[]>([])

  const handleCropToggle = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      setSelectedCrops(selectedCrops.filter((c) => c !== crop))
    } else {
      setSelectedCrops([...selectedCrops, crop])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Registration Successful!</h2>
        <p className="text-gray-700 mb-6">
          Thank you for registering as a grower with ARDA Seeds. Our team will review your application and contact you
          within 3-5 business days to discuss next steps.
        </p>
        <Button
          onClick={() => {
            setIsSuccess(false)
            setSelectedCrops([])
          }}
          className="bg-green-700 hover:bg-green-800"
        >
          Return to Home
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input id="fullName" required />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" type="email" required />
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input id="phone" required />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Farm Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="farmName">Farm Name *</Label>
            <Input id="farmName" required />
          </div>
          <div>
            <Label htmlFor="farmLocation">Farm Location *</Label>
            <Input id="farmLocation" required />
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="farmSize">Farm Size *</Label>
          <Select required>
            <SelectTrigger id="farmSize">
              <SelectValue placeholder="Select farm size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small (Less than 5 hectares)</SelectItem>
              <SelectItem value="medium">Medium (5-20 hectares)</SelectItem>
              <SelectItem value="large">Large (20-100 hectares)</SelectItem>
              <SelectItem value="commercial">Commercial (More than 100 hectares)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Crops Currently Grown *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="crop-maize"
                checked={selectedCrops.includes("maize")}
                onCheckedChange={() => handleCropToggle("maize")}
              />
              <Label htmlFor="crop-maize">Maize</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="crop-wheat"
                checked={selectedCrops.includes("wheat")}
                onCheckedChange={() => handleCropToggle("wheat")}
              />
              <Label htmlFor="crop-wheat">Wheat</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="crop-soybeans"
                checked={selectedCrops.includes("soybeans")}
                onCheckedChange={() => handleCropToggle("soybeans")}
              />
              <Label htmlFor="crop-soybeans">Soybeans</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="crop-groundnuts"
                checked={selectedCrops.includes("groundnuts")}
                onCheckedChange={() => handleCropToggle("groundnuts")}
              />
              <Label htmlFor="crop-groundnuts">Groundnuts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="crop-sunflower"
                checked={selectedCrops.includes("sunflower")}
                onCheckedChange={() => handleCropToggle("sunflower")}
              />
              <Label htmlFor="crop-sunflower">Sunflower</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="crop-sorghum"
                checked={selectedCrops.includes("sorghum")}
                onCheckedChange={() => handleCropToggle("sorghum")}
              />
              <Label htmlFor="crop-sorghum">Sorghum</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="crop-cowpeas"
                checked={selectedCrops.includes("cowpeas")}
                onCheckedChange={() => handleCropToggle("cowpeas")}
              />
              <Label htmlFor="crop-cowpeas">Cowpeas</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="crop-sugarbeans"
                checked={selectedCrops.includes("sugarbeans")}
                onCheckedChange={() => handleCropToggle("sugarbeans")}
              />
              <Label htmlFor="crop-sugarbeans">Sugarbeans</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="crop-other"
                checked={selectedCrops.includes("other")}
                onCheckedChange={() => handleCropToggle("other")}
              />
              <Label htmlFor="crop-other">Other</Label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Additional Information</h2>

        <div className="mb-4">
          <Label htmlFor="previousSupplier">Previous Seed Supplier (if any)</Label>
          <Input id="previousSupplier" />
        </div>

        <div>
          <Label htmlFor="message">Additional Comments</Label>
          <Textarea
            id="message"
            placeholder="Please share any specific requirements or questions you have."
            className="h-32"
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-green-700 hover:bg-green-800" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...
          </>
        ) : (
          "Submit Registration"
        )}
      </Button>
    </form>
  )
}
