import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

import { useState } from "react"
import { CATEGORIES } from "@/services/marketplaceService"

interface CategoryFilterProps {
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
}

export function CategoryFilter({ selectedCategories, onCategoryChange }: CategoryFilterProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({})

  const toggleDropdown = (category: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleCategorySelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category))
    } else {
      onCategoryChange([...selectedCategories, category])
    }
    toggleDropdown(category)
  }

  return (
    <div className=" border-b border-gray-200 px-0 py-3">
      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 md:flex-wrap">
        {CATEGORIES.map((category) => (
          <div key={category} className="relative">
            <Button
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className={`whitespace-nowrap rounded-full text-xs ${
                selectedCategories.includes(category)
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-green-50 text-gray-700 border-gray-300 hover:bg-green-100"
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
              <ChevronDown className={`w-4 h-4 ml-1 ${selectedCategories.includes(category) ? "text-white" : "text-green-400"} `} />
            </Button>
          </div>
        ))}
        {/* Add more categories as needed */}
        {openDropdowns["more"] && (<div className="absolute mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {/* Dropdown content for more categories */}
          {CATEGORIES.filter((category) => !selectedCategories.includes(category)).map((category) => (
            <Button
              key={category}
              variant="outline"
              className="whitespace-nowrap rounded-full text-xs bg-green-50 text-gray-700 border-gray-300 hover:bg-green-100"
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </Button>
          ))}
        </div>)}
      </div>
    </div>
  )
}
