import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Star } from "lucide-react"
import type { Product } from "@/types/marketplaceTypes"
import placeholderImage from "@/assets/marketplace/wireless-headphones.png"
import { useState } from "react"

interface ProductCardProps {
  product: Product
  onClick: () => void
  onAddToCart: () => void
}

export function ProductCard({ product, onClick, onAddToCart }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)

  const imageUrl = !imageError
    ? `${product.images?.[0] || ""}`
    : placeholderImage
  return (
    <Card className="overflow-hidden p-0 hover:shadow-lg transition-shadow cursor-pointer min-w-[220px]" onClick={onClick}>
      {/* Product Image */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        <img
          // src={product.images[0] || placeholderImage}
          src={imageUrl}
          onError={() => setImageError(true)}
          alt={product.product_name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h4 className="font-semibold mb-1 text-green-600 line-clamp-2">{product.product_name}</h4>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.brief_description}</p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs">({product.reviews})</span>
          </div>
        )}

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">₦{product?.price?.toLocaleString() ?? "0.00"}</span>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart()
            }}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
