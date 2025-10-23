import type { Product } from "@/types/marketplaceTypes"

// Types
export interface CartItem {
  id: string
  product: Product
  quantity: number
  totalPrice: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
}

export interface RecommendationProduct extends Product {
  stock: number
}