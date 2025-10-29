import { useState, useCallback, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import  { useNavigate } from "react-router-dom"
import {
  getProducts,
  getAllProducts,
  getCarouselItems,
  getRecentlyViewed,
  searchProducts,
  filterProducts,
} from "@/services/marketplaceService"
import { addToCart } from "@/services/cartService"
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
  const navigate = useNavigate()
  
  const [cartCount, setCartCount] = useState(0)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"marketplace" | "buy-on-credit">("marketplace")
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [page, setPage] = useState(1)
  const [allFetchedProducts, setAllFetchedProducts] = useState<Product[]>([])
  const [totalPages, setTotalPages] = useState(1)
  
  // Fetch carousel items
  const { data: carouselItems = [] } = useQuery({
    queryKey: ["carousel"],
    queryFn: getCarouselItems,
    refetchInterval: 300000,
  })

  // Fetch recently viewed
  const { data: recentlyViewed = [] } = useQuery({
    queryKey: ["recently-viewed"],
    queryFn: getRecentlyViewed,
    refetchInterval: 300000,
  })

// Fetch products based on search and categories
const { data: pagedProducts = { products: [], totalPages: 1 }, isFetching } = useQuery<{ products: Product[]; totalPages: number }>({
  queryKey: ["products", selectedCategories, page],
  queryFn: async () => {
    let results: Product[] = []
    let totalPages = 1
    if (selectedCategories.length === 0) {
      const response = await getAllProducts(page)
      const apiData = response?.data
      results = apiData?.data || []
      totalPages = apiData?.last_page || 1
    } else {
      const categoryResults = await Promise.all(selectedCategories.map((cat) => getProducts(cat)))
      results = categoryResults.flat()
    }
    return { products: results, totalPages }
  },
  refetchInterval: 300000,
  placeholderData: () => ({ products: [], totalPages: 1 }),
})

  // ✅ Merge paginated results safely when new page loads
useEffect(() => {
    if (pagedProducts?.products && pagedProducts.products.length > 0) {
      setAllFetchedProducts((prev) => {
        const merged = [...prev, ...pagedProducts.products]
        const unique = [...new Map(merged.map((p) => [p.id, p])).values()]
        return unique
      })
      setTotalPages(pagedProducts.totalPages)
    }
  }, [pagedProducts])
  

  // Filter and search products
const filteredProducts = useCallback(async () => {
let results = allFetchedProducts

if (searchQuery) {
  results = await searchProducts(searchQuery)
}

if (filterType !== "all") {
  results = await filterProducts(results, filterType)
}

return results


}, [allFetchedProducts, searchQuery, filterType])



  const { data: displayProducts = [] } = useQuery({
queryKey: ["filtered-products", allFetchedProducts, searchQuery, filterType],
queryFn: filteredProducts,
refetchInterval: 300000,
})

  const handleAddToCart = async (product: Product) => {
    try {
      const result = await addToCart(product.id, 1)
      if (result) {
      setCartCount((prev) => prev + 1)
      toast("Added to cart", {
        description: `${product.name} has been added to your cart.`,
        action: {
          label: "View Cart",
          onClick: () => {
            // Navigate to cart page or open cart modal
            navigate("/user/cart")
          },
        },
      })
    }
  } catch (error) {
    console.error("Error adding to cart:", error)
    toast.error("Error", {
      description: `Failed to add ${product.name} to cart. Please try again.`,
      // variant: "destructive",
      })
    }
  }

// Pagination
  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1)
    }
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

            <div className="flex justify-center py-6">
          <button
            onClick={handleLoadMore}
            disabled={isFetching}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isFetching ? "Loading..." : page >= totalPages ? "No More Products" : "Load More"}
          </button>
        </div>
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
