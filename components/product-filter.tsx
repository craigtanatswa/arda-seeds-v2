"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { FilterState } from "@/app/products/page"

type ProductFilterProps = {
  filters: FilterState
  setFilters: (filters: FilterState) => void
}

export default function ProductFilter({ filters, setFilters }: ProductFilterProps) {
  const [showMaturity, setShowMaturity] = useState(true)
  const [showRegions, setShowRegions] = useState(true)
  const [showTraits, setShowTraits] = useState(true)

  // Local state for checkboxes before applying
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)

  const handleCheckboxChange = (category: keyof FilterState, value: string) => {
    setLocalFilters((prev) => {
      const currentValues = prev[category]
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]

      return {
        ...prev,
        [category]: newValues,
      }
    })
  }

  const applyFilters = () => {
    setFilters(localFilters)
  }

  const clearFilters = () => {
    const emptyFilters = { maturity: [], regions: [], traits: [] }
    setLocalFilters(emptyFilters)
    setFilters(emptyFilters)
  }

  const hasActiveFilters =
    localFilters.maturity.length > 0 || localFilters.regions.length > 0 || localFilters.traits.length > 0

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Filter Products</h2>

      {/* Maturity Period */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center mb-3 cursor-pointer"
          onClick={() => setShowMaturity(!showMaturity)}
        >
          <h3 className="font-medium">Maturity Period</h3>
          {showMaturity ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>

        {showMaturity && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="early"
                checked={localFilters.maturity.includes("early")}
                onCheckedChange={() => handleCheckboxChange("maturity", "early")}
              />
              <Label htmlFor="early">Early (60-90 days)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="medium"
                checked={localFilters.maturity.includes("medium")}
                onCheckedChange={() => handleCheckboxChange("maturity", "medium")}
              />
              <Label htmlFor="medium">Medium (90-120 days)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="late"
                checked={localFilters.maturity.includes("late")}
                onCheckedChange={() => handleCheckboxChange("maturity", "late")}
              />
              <Label htmlFor="late">Late (120+ days)</Label>
            </div>
          </div>
        )}
      </div>

      {/* Growing Regions */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center mb-3 cursor-pointer"
          onClick={() => setShowRegions(!showRegions)}
        >
          <h3 className="font-medium">Growing Regions</h3>
          {showRegions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>

        {showRegions && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="region1"
                checked={localFilters.regions.includes("Region I")}
                onCheckedChange={() => handleCheckboxChange("regions", "Region I")}
              />
              <Label htmlFor="region1">Region I</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="region2"
                checked={localFilters.regions.includes("Region II")}
                onCheckedChange={() => handleCheckboxChange("regions", "Region II")}
              />
              <Label htmlFor="region2">Region II</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="region3"
                checked={localFilters.regions.includes("Region III")}
                onCheckedChange={() => handleCheckboxChange("regions", "Region III")}
              />
              <Label htmlFor="region3">Region III</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="region4"
                checked={localFilters.regions.includes("Region IV")}
                onCheckedChange={() => handleCheckboxChange("regions", "Region IV")}
              />
              <Label htmlFor="region4">Region IV</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="region5"
                checked={localFilters.regions.includes("Region V")}
                onCheckedChange={() => handleCheckboxChange("regions", "Region V")}
              />
              <Label htmlFor="region5">Region V</Label>
            </div>
          </div>
        )}
      </div>

      {/* Special Traits */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center mb-3 cursor-pointer"
          onClick={() => setShowTraits(!showTraits)}
        >
          <h3 className="font-medium">Special Traits</h3>
          {showTraits ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>

        {showTraits && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="drought"
                checked={localFilters.traits.includes("drought")}
                onCheckedChange={() => handleCheckboxChange("traits", "drought")}
              />
              <Label htmlFor="drought">Drought Tolerant</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="disease"
                checked={localFilters.traits.includes("disease")}
                onCheckedChange={() => handleCheckboxChange("traits", "disease")}
              />
              <Label htmlFor="disease">Disease Resistant</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="high-yield"
                checked={localFilters.traits.includes("high-yield")}
                onCheckedChange={() => handleCheckboxChange("traits", "high-yield")}
              />
              <Label htmlFor="high-yield">High Yield</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="low-nitrogen"
                checked={localFilters.traits.includes("low-nitrogen")}
                onCheckedChange={() => handleCheckboxChange("traits", "low-nitrogen")}
              />
              <Label htmlFor="low-nitrogen">Low Nitrogen Tolerant</Label>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Button onClick={applyFilters} className="w-full bg-green-700 hover:bg-green-800">
          Apply Filters
        </Button>
        {hasActiveFilters && (
          <Button onClick={clearFilters} variant="outline" className="w-full">
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  )
}
