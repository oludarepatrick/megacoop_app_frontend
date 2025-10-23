import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Star, X } from "lucide-react"
import type { Product } from "@/types/marketplaceTypes"

interface ProductDetailModalProps {
  product: Product
  onClose: () => void
  onAddToCart: () => void
}

export function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogClose asChild>
            <button className="absolute right-4 top-4">
              <X className="w-4 h-4" />
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            )}

            {/* Category */}
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-semibold text-gray-900">{product.category}</p>
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-200 py-4">
              <p className="text-sm text-gray-600 mb-2">Price</p>
              <p className="text-3xl font-bold text-gray-900">₦{product.price.toLocaleString()}</p>
            </div>

            {/* Add to Cart Button */}
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg" onClick={onAddToCart}>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
