import type { Product } from "@/types/marketplaceTypes"

// Types
// export interface CartItem {
//   id: string
//   product: Product
//   quantity: number
//   totalPrice: number
// }

// export interface CartItem {
//   id: string
//   images: string[]
//   category: string
//   name: string
//   price: number
//   description: string
//   quantity: number
//   totalPrice: number
//   rating?: number
//   reviews?: number
// }

export interface CartItem extends Product {
  // id: string
  quantity: number
  totalPrice: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  vat: number
}

export interface RecommendationProduct extends Product {
  stock: number
}