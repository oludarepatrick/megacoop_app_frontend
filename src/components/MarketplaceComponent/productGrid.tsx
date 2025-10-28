import { useState } from "react"
import { ProductCard } from "./productCard"
import { ProductDetailModal } from "./productDetailModal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Filter } from "lucide-react"
// import { Button } from "@/components/ui/button"
import type { FilterType, Product } from "@/types/marketplaceTypes"

interface ProductGridProps {
  products: Product[]
  onFilterChange: (filterType: FilterType) => void
  onAddToCart: (product: Product) => void
}

export function ProductGrid({ products, onFilterChange, onAddToCart }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [filterType, setFilterType] = useState<FilterType>("all")

  const handleFilterChange = (value: FilterType) => {
    setFilterType(value)
    onFilterChange(value)
  }

  return (
    <>
      <div className="px-4 py-6">
        {/* Header with Filter */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 underline underline-offset-4 decoration-green-600 decoration-2">
            Grab the best deal on <span className="text-green-600">New Items</span>
          </h3>
          {/* <Button variant="ghost" className="text-green-600 hover:text-green-700">
            View All →
          </Button> */}
                  <div className="flex items-center gap-2">
            {/* <Filter className="w-5 h-5 text-gray-600" /> */}
            <Select value={filterType} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-30 border-none shadow-none text-green-600 hover:bg-green-50">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">View All</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="cheapest">Cheapest</SelectItem>
                <SelectItem value="most_expensive">Most Expensive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Dropdown */}
        {/* <div className="flex items-center justify-between mb-6 md:justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <Select value={filterType} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">View All</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="cheapest">Cheapest</SelectItem>
                <SelectItem value="most_expensive">Most Expensive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div> */}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
              onAddToCart={() => onAddToCart(product)}
            />
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={() => {
            onAddToCart(selectedProduct)
            setSelectedProduct(null)
          }}
        />
      )}

      {/* empty state or no products found */}
      {products.length === 0 && (
        <div className="col-span-1 text-center">
          <p className="text-gray-500">No products found.</p>
        </div>
      )}
    </>
  )
}
