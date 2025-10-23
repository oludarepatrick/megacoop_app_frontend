import { useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  getProducts,
  getCarouselItems,
  getRecentlyViewed,
  searchProducts,
  filterProducts,
} from "@/services/marketplaceService"
import { MarketplaceHeader } from "@/components/MarketplaceComponent/marketplaceHeader"
import { Carousel } from "@/components/MarketplaceComponent/carousel"
import { TabNavigation } from "@/components/MarketplaceComponent/tabNavigation"
import { RecentlyViewedSection } from "@/components/MarketplaceComponent/recentlyViewed"
import { ProductGrid } from "@/components/MarketplaceComponent/productGrid"

import type { FilterType, Product } from "@/types/marketplaceTypes"
import { CategoryFilter } from "@/components/MarketplaceComponent/categoryfilter"
import { toast } from "sonner"
import { useThemeStore } from "@/store/themeStore"

export default function MarketplacePage() {
  const { theme } = useThemeStore()
  console.log("theme in marketplace page:", theme)
  
  const [cartCount, setCartCount] = useState(0)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"marketplace" | "buy-on-credit">("marketplace")
  const [filterType, setFilterType] = useState<FilterType>("all")

  // Fetch carousel items
  const { data: carouselItems = [] } = useQuery({
    queryKey: ["carousel"],
    queryFn: getCarouselItems,
    refetchInterval: 30000,
  })

  // Fetch recently viewed
  const { data: recentlyViewed = [] } = useQuery({
    queryKey: ["recently-viewed"],
    queryFn: getRecentlyViewed,
    refetchInterval: 30000,
  })

  // Fetch products based on search and categories
  const { data: allProducts = [] } = useQuery({
    queryKey: ["products", selectedCategories],
    queryFn: async () => {
      if (selectedCategories.length === 0) {
        return getProducts()
      }
      const results = await Promise.all(selectedCategories.map((cat) => getProducts(cat)))
      return results.flat()
    },
    refetchInterval: 30000,
  })

  // Filter and search products
  const filteredProducts = useCallback(async () => {
    let results = allProducts

    // Apply search filter
    if (searchQuery) {
      results = await searchProducts(searchQuery)
    }

    // Apply sort filter
    if (filterType !== "all") {
      results = await filterProducts(results, filterType)
    }

    return results
  }, [allProducts, searchQuery, filterType])

  const { data: displayProducts = [] } = useQuery({
    queryKey: ["filtered-products", allProducts, searchQuery, filterType],
    queryFn: filteredProducts,
    refetchInterval: 30000,
  })

  const handleAddToCart = (product: Product) => {
    setCartCount((prev) => prev + 1)
    toast("Added to cart", {
      description: `${product.name} has been added to your cart.`,
      action: {label: "View Cart", onClick: () => {
          // Navigate to cart page or open cart modal
        }},
    })
  }

  return (
    <div className={`min-h-screen bg-${theme === "dark" ? "black-900" : "white"}`}>
      {/* Header */}
      <MarketplaceHeader cartCount={cartCount} onSearch={setSearchQuery} />

      {/* Category Filter */}
      <CategoryFilter selectedCategories={selectedCategories} onCategoryChange={setSelectedCategories} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Carousel */}
        <div className="px-4 py-6">
          <Carousel items={carouselItems} />
        </div>

        {/* Tab Navigation */}
        <TabNavigation onTabChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === "marketplace" && (
          <>
            {/* Recently Viewed */}
            <RecentlyViewedSection items={recentlyViewed} />

            {/* Product Grid */}
            <ProductGrid products={displayProducts} onFilterChange={setFilterType} onAddToCart={handleAddToCart} />
          </>
        )}

        {activeTab === "buy-on-credit" && (
          <div className="px-4 py-12 text-center">
            <p className="text-gray-600 text-lg">Buy on Credit feature coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}
