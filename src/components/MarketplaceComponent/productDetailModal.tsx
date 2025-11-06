import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Star, X } from "lucide-react"
import type { Product } from "@/types/marketplaceTypes"
import { ImageCarouselModal } from "./imageCarouselModal"
import fallbackImage from "@/assets/marketplace/wireless-headphones.png"
interface ProductDetailModalProps {
  product: Product
  onClose: () => void
  onAddToCart: () => void
}

export function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
   const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isCarouselOpen, setIsCarouselOpen] = useState(false)

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-8xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{product.product_name}</DialogTitle>
            <DialogClose asChild>
              <button className="absolute right-4 top-4">
                <X className="w-4 h-4" />
              </button>
            </DialogClose>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Product Images Section */}
            <div className="space-y-3">
              {/* Main Image */}
              <div
                className="flex items-center justify-center bg-gray-100 rounded-lg p-0 cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => setIsCarouselOpen(true)}
              >
                <img
                  src={product.images[selectedImageIndex] || fallbackImage}
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage
                  }}
                  alt={product.product_name}
                  className="w-full h-auto max-h-196 object-contain"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index ? "border-green-600" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.product_name}</h3>
                <p className="text-gray-600">{product.brief_description}</p>
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
                <p className="font-semibold text-gray-900">{product.product_category}</p>
              </div>

              {/* Price */}
              <div className="border-t border-b border-gray-200 py-4">
                <p className="text-sm text-gray-600 mb-2">Price</p>
                <p className="text-3xl font-bold text-gray-900">₦{product?.price?.toLocaleString() ?? "0.00"}</p>
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

      {/* Image Carousel Modal */}
      <ImageCarouselModal
        images={product.images}
        initialIndex={selectedImageIndex}
        isOpen={isCarouselOpen}
        onClose={() => setIsCarouselOpen(false)}
      />
    </>
  )
}
