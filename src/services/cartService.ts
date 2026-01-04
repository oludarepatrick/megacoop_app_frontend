import type { Cart, CartItem, RecommendationProduct } from "@/types/cartTypes"
import axios from '@/lib/axiosInstance';
import {
  getProducts,
  getAllProducts
} from "@/services/marketplaceService";
import { jsonConfig } from "@/common/utils";



// Service Functions
export const getCart = async (): Promise<Cart> => {
  try {
    // Get cart from localStorage
    const cartItems: CartItem[] = JSON.parse(localStorage.getItem("cartItems") || "[]")

    const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0)
    
    // Calculate total delivery fee from all products
    const deliveryFee = cartItems.reduce((sum, item) => {
      const itemDeliveryFee = Number(item.delivery_fee) || 0
      return sum + itemDeliveryFee
    }, 0)
    
    const vat = subtotal * 0.075
    const total = subtotal + deliveryFee + vat

    return {
      items: cartItems,
      subtotal,
      deliveryFee,
      total,
      vat,
    }
  } catch (error) {
    console.error("Error fetching cart:", error)
    throw error
  }
}

export const addToCart = async (productId: string, quantity: number = 1): Promise<CartItem> => {
  try {
    // Add to backend API
    const response = await axios.post(`/markets/cart/add`, {
      product_id: productId,
      quantity
    }, jsonConfig)
    console.log("Add to cart response:", response);
    return response.data
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw error
  }
}

export const updateCartItemQuantity = async (cartItemId: string, quantity: number): Promise<CartItem> => {
  try {
    const localStorageCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const itemIndex = localStorageCart.findIndex((i: CartItem) => i.product_id === cartItemId);
    
    if (itemIndex === -1) {
      throw new Error("Cart item not found")
    }

    localStorageCart[itemIndex].quantity = quantity;
    localStorageCart[itemIndex].totalPrice = localStorageCart[itemIndex].price * quantity;
    localStorage.setItem("cartItems", JSON.stringify(localStorageCart));

    return localStorageCart[itemIndex];
  } catch (error) {
    console.error("Error updating cart item:", error)
    throw error
  }
}

export const removeCartItem = async (cartItemId: string): Promise<void> => {
  try {
    const localStorageCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const updatedCart = localStorageCart.filter((i: CartItem) => i.product_id !== cartItemId);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  } catch (error) {
    console.error("Error removing cart item:", error)
    throw error
  }
}

export const getRecommendedProducts = async (categories?: string[]): Promise<RecommendationProduct[]> => {
  try {
    if (!categories || categories.length === 0) {
      // If no categories, fetch all products and return first page
      const response = await getAllProducts(1)
      const products = response?.data?.data || []
      return products.slice(0, 10).map(p => ({ ...p, stock: p.available_stock || 0 })) as RecommendationProduct[]
    }

    // Fetch products for all categories in parallel
    const allResponses = await Promise.all(
      categories.map(async (category) => {
        try {
          const res = await getProducts(category)
          return Array.isArray(res) ? res : []
        } catch (error) {
          console.error(`Error fetching products for category ${category}:`, error)
          return []
        }
      })
    )

    // Flatten arrays from all categories
    const allProducts = allResponses.flat()

    // Remove duplicates (based on product id)
    const uniqueProducts = Array.from(
      new Map(allProducts.map((p) => [p.product_id, p])).values()
    )

    // Limit to 10 recommendations and add stock field
    return uniqueProducts.slice(0, 10).map(p => ({ ...p, stock: p.available_stock || 0 })) as RecommendationProduct[]
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    // Return empty array on error instead of throwing
    return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkout = async (cartData: any): Promise<{ orderId: string; paymentUrl?: string }> => {
  console.log("Checkout called with cart data:", cartData);
  try {
    const response = await axios.post(`/products/checkout`, cartData, jsonConfig)
    console.log("Checkout response:", response);

    // Return the response data or construct a response
    if (response.data) {
      return {
        orderId: response.data.orderId || response.data.order_id || `ORD-${Date.now()}`,
        paymentUrl: response.data.paymentUrl || response.data.payment_url || "/payment",
      }
    }

    return {
      orderId: `ORD-${Date.now()}`,
      paymentUrl: "/payment",
    }
  } catch (error) {
    console.error("Error during checkout:", error)
    throw error
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkoutOnCredit = async (cartData: any) : Promise<{ orderId: string; paymentUrl?: string }> => {
  console.log("Checkout called with cart data:", cartData);
  try {
    const response = await axios.post(`/buy-on-credit/buy`, cartData, jsonConfig)
    console.log("Checkout response:", response);

    // Return the response data or construct a response
    if (response.data) {
      return {
        orderId: response.data.orderId || response.data.order_id || `ORD-${Date.now()}`,
        paymentUrl: response.data.paymentUrl || response.data.payment_url || "/payment",
      }
    }

    return {
      orderId: `ORD-${Date.now()}`,
      paymentUrl: "/payment",
    }
  } catch (error) {
    console.error("Error during checkout:", error)
    throw error
  }
}

