import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Cart } from "@/types/cartTypes"

// import { useNavigate } from "react-router-dom"

interface OrderSummaryProps {
  cart: Cart
  onCheckout: () => void
  isLoading?: boolean
}

export function OrderSummary({ cart, onCheckout, isLoading }: OrderSummaryProps) {
//   const navigate = useNavigate()

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24 h-fit">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Items total</span>
          <span>₦{cart.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery fee</span>
          <span>₦{cart.deliveryFee.toLocaleString()}</span>
        </div>
        <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold text-gray-900">
          <span>Subtotal</span>
          <span>₦{cart.total.toLocaleString()}</span>
        </div>
      </div>

      <Button
        className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold"
        onClick={onCheckout}
        disabled={isLoading || cart.items.length === 0}
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        Checkout
        <span className="ml-2">₦{cart.total.toLocaleString()}</span>
      </Button>
    </div>
  )
}
