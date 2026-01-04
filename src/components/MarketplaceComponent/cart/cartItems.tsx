import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CartItem } from "@/types/cartTypes"
import { formatCurrency } from "@/common/utils"


interface CartItemsProps {
  items: CartItem[]
  onQuantityChange: (cartItemId: string, quantity: number) => void
  onRemove: (cartItemId: string) => void
}

export function CartItems({ items, onQuantityChange, onRemove }: CartItemsProps) {
  console.log("Rendering CartItems with items:", items)
  return (
    <>
    <div className="space-y-4">
      {/* <h3 className="text-lg font-semibold text-gray-900">Items Name</h3> */}

      {items.map((item) => (
        <div key={item.product_id} className="flex flex-col lg:flex-row  gap-4 p-4 rounded-lg border border-gray-200">
          {/* Product Image */}
          <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
            <img
              // src={item.product.image || "/placeholder.svg"}
              src={item.images[0] || "/placeholder.svg"}
              alt={item.product_name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1">
            <h4 className="font-semibold mb-1">{item.product_name}</h4>
            <div className="flex gap-2 mb-2">
              <span className="text-sm text-green-600 font-semibold">{formatCurrency(item?.price) ?? "0.00"}</span>
              {/* <span className="text-sm text-gray-400 line-through">₦399.99</span> */}
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onQuantityChange(item.product_id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className=" hover:text-gray-900 border"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="w-8 text-center font-semibold">{item.quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onQuantityChange(item.product_id, item.quantity + 1)}
              disabled={item?.available_stock !== undefined && item.quantity >= item.available_stock}
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
            onClick={() => onRemove(item.product_id)}
            className="text-green-600 hover:text-green-700 font-semibold"
          >
            Remove
          </Button>

          {/* Total Price */}
          <div className="flex-shrink-0 text-right">
            <p className="font-semibold ">{formatCurrency(item?.totalPrice)?? "0.00"}</p>
          </div>
          </div>
        </div>
      ))}
      </div>
    </>
  )
}
