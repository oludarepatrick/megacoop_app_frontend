import { useState } from "react"
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { RecommendationProduct } from "@/types/cartTypes"


interface RecommendationsCarouselProps {
  products: RecommendationProduct[]
  onAddToCart: (product: RecommendationProduct) => void
}

export function RecommendationsCarousel({ products, onAddToCart }: RecommendationsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 4

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(products.length - itemsPerView, prev + 1))
  }

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerView)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Recommendations</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            disabled={currentIndex >= products.length - itemsPerView}
            className="text-gray-600 hover:text-gray-900"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden bg-green-50 border-0 p-0 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative w-full h-48 bg-green-100 overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-lg font-bold text-gray-900">₦{product.price.toLocaleString()}</span>
                <span className="text-sm text-gray-400 line-through">₦99.99</span>
              </div>

              <p className="text-sm text-green-600 font-semibold mb-3">{product.stock} Left</p>

              <Button
                size="sm"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onAddToCart(product)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
