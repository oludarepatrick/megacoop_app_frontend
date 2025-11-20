"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface TabNavigationProps {
  onTabChange: (tab: "marketplace" | "buy-on-credit") => void
}

export function TabNavigation({ onTabChange }: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState<"marketplace" | "buy-on-credit">("marketplace")

  const handleTabChange = (tab: "marketplace" | "buy-on-credit") => {
    setActiveTab(tab)
    onTabChange(tab)
  }

  return (
    <div className="flex gap-8 border-b border-gray-200 px-4 py-4">
      <Button
        variant="ghost"
        className={`text-lg font-semibold pb-2 border-b-2 rounded-none ${
          activeTab === "marketplace"
            ? "text-green-600 border-green-600"
            : "text-gray-500 border-transparent hover:text-gray-700"
        }`}
        onClick={() => handleTabChange("marketplace")}
      >
        Marketplace
      </Button>
      <Button
        variant="ghost"
        className={`text-lg font-semibold pb-2 border-b-2 rounded-none ${
          activeTab === "buy-on-credit"
            ? "text-green-600 border-green-600"
            : " border-transparent hover:text-gray-700"
        }`}
        onClick={() => handleTabChange("buy-on-credit")}
      >
        Buy On Credit
      </Button>
    </div>
  )
}
