import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { RecommendationsCarousel } from "@/components/MarketplaceComponent/cart/recommendationsCarousel"
import {
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  getRecommendedProducts,
  checkout,
} from "@/services/cartService"
import { MarketplaceHeader } from "@/components/MarketplaceComponent/marketplaceHeader"
import type { Cart } from "@/types/cartTypes"
import { CartItems } from "@/components/MarketplaceComponent/cart/cartItems"
import { OrderSummary} from "@/components/MarketplaceComponent/cart/orderSummary"

export default function CartPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [cartCount, setCartCount] = useState(0)

  // Fetch cart data
  const { data: cart, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    refetchInterval: 30000,
  })

  // Fetch recommendations based on cart categories
  const cartCategories = cart?.items.map((item) => item.product.category) || []
  const { data: recommendations = [] } = useQuery({
    queryKey: ["recommendations", cartCategories],
    queryFn: () => getRecommendedProducts(cartCategories),
    refetchInterval: 30000,
  })

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) =>
      updateCartItemQuantity(cartItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
        toast("Quantity updated", {
      description: `Cart item quantity has been updated.`,
        })
    },
    onError: () => {
        toast("Error", {
            description: "Failed to update quantity. Please try again.",
        })
    },
  })

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
      toast("Item removed", {
        description: "Product has been removed from your cart.",
      })
    },
    onError: () => {
      toast("Error",{
        description: "Failed to remove item. Please try again.",
        
      })
    },
  })

  // Checkout mutation
//   const checkoutMutation = useMutation({
//     mutationFn: (cartData: Cart) => checkout(cartData),
//     onSuccess: (data) => {
//       toast({
//         title: "Checkout successful",
//         description: "Redirecting to payment page...",
//       })
//       // Navigate to payment page with order data
//       navigate(`/payment?orderId=${data.orderId}`)
//     },
//     onError: () => {
//       toast({
//         title: "Checkout failed",
//         description: "Failed to process checkout. Please try again.",
//         variant: "destructive",
//       })
//     },
//   })
    
    // Checkout mutation
    const checkoutMutation = useMutation<{ orderId: string }, unknown, Cart>({
      mutationFn: (cartData: Cart) => checkout(cartData),
      onSuccess: (data) => {
        toast("Checkout successful", {
          description: "Redirecting to payment page...",
        })
        // Navigate to payment page with order data
        navigate(`/payment?orderId=${data.orderId}`)
      },
      onError: () => {
        toast("Checkout failed", {
          description: "Failed to process checkout. Please try again.",
        })
      },
    })



  // Update cart count
  useEffect(() => {
    if (cart) {
      setCartCount(cart.items.length)
    }
  }, [cart])

  const handleQuantityChange = (cartItemId: string, quantity: number) => {
    if (quantity < 1) return
    updateQuantityMutation.mutate({ cartItemId, quantity })
  }

  const handleRemoveItem = (cartItemId: string) => {
    removeItemMutation.mutate(cartItemId)
  }

  const handleCheckout = () => {
    if (cart) {
      checkoutMutation.mutate(cart)
    }
  }

  const handleAddRecommendationToCart = (product: any) => {
    toast("Added to cart", {
      description: `${product.name} has been added to your cart.`,
    })
    queryClient.invalidateQueries({ queryKey: ["cart"] })
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MarketplaceHeader cartCount={cartCount} onSearch={() => {}} />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MarketplaceHeader cartCount={0} onSearch={() => {}} />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => navigate("/marketplace")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <MarketplaceHeader cartCount={cartCount} onSearch={() => {}} />

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Top Info */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Local Market</h2>
              <p className="text-green-600 text-sm">🟢 Shopping in 07114</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Calendar className="w-5 h-5" />
              Wed 123
            </Button>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">Free delivery + saving $3.00 on this order</p>
              <p className="text-xs text-gray-600">Go to</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <CartItems items={cart.items} onQuantityChange={handleQuantityChange} onRemove={handleRemoveItem} />
          </div>

          {/* Order Summary */}
          <div>
            <OrderSummary cart={cart} onCheckout={handleCheckout} isLoading={checkoutMutation.isPending} />
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-12">
          <RecommendationsCarousel products={recommendations} onAddToCart={handleAddRecommendationToCart} />
        </div>
      </div>
    </div>
  )
}
