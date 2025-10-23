import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CartItem } from "@/types/cartTypes"


interface CartItemsProps {
  items: CartItem[]
  onQuantityChange: (cartItemId: string, quantity: number) => void
  onRemove: (cartItemId: string) => void
}

export function CartItems({ items, onQuantityChange, onRemove }: CartItemsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Items Name</h3>

      {items.map((item) => (
        <div key={item.id} className="flex flex-col lg:flex-row  gap-4 p-4 bg-white rounded-lg border border-gray-200">
          {/* Product Image */}
          <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={item.product.image || "/placeholder.svg"}
              alt={item.product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{item.product.name}</h4>
            <div className="flex gap-2 mb-2">
              <span className="text-sm text-green-600 font-semibold">₦{item.product.price.toLocaleString()}</span>
              <span className="text-sm text-gray-400 line-through">₦399.99</span>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Remove Button */}
          <div className="flex flex-col xl:flex-row items-center gap-4 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="text-green-600 hover:text-green-700 font-semibold"
          >
            Remove
          </Button>

          {/* Total Price */}
          <div className="flex-shrink-0 text-right">
            <p className="font-semibold text-gray-900">₦{item.totalPrice.toLocaleString()}</p>
          </div>
          </div>
        </div>
      ))}
    </div>
  )
}
