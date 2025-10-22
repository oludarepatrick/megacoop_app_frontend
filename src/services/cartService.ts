import type { Cart, CartItem, RecommendationProduct } from "@/types/cartTypes"
import axios from '@/lib/axiosInstance';
import imageTomatoes from "@/assets/marketplace/organic-apples.png";
import imageRecommendation from "@/assets/marketplace/smartwatch-lifestyle.png";


// Dummy cart data
const dummyCartItems: CartItem[] = [
  {
    id: "cart-1",
    product: {
      id: "1",
      name: "Sweet Green Seedless Grapes 1.5-2 lb",
      description: "Fresh and juicy grapes",
      price: 1500,
      image: imageTomatoes,
      category: "Premium Fruits",
      rating: 4.5,
      reviews: 128,
    },
    quantity: 1,
    totalPrice: 1500,
  },
  {
    id: "cart-2",
    product: {
      id: "2",
      name: "Sweet Green Seedless Grapes 1.5-2 lb",
      description: "Fresh and juicy grapes",
      price: 1500,
      image: imageTomatoes,
      category: "Premium Fruits",
      rating: 4.5,
      reviews: 128,
    },
    quantity: 123,
    totalPrice: 184500,
  },
  {
    id: "cart-3",
    product: {
      id: "3",
      name: "Sweet Green Seedless Grapes 1.5-2 lb",
      description: "Fresh and juicy grapes",
      price: 1500,
      image: imageTomatoes,
      category: "Premium Fruits",
      rating: 4.5,
      reviews: 128,
    },
    quantity: 123,
    totalPrice: 184500,
  },
  {
    id: "cart-4",
    product: {
      id: "4",
      name: "Sweet Green Seedless Grapes 1.5-2 lb",
      description: "Fresh and juicy grapes",
      price: 1500,
      image: imageTomatoes,
      category: "Premium Fruits",
      rating: 4.5,
      reviews: 128,
    },
    quantity: 123,
    totalPrice: 184500,
  },
]

const dummyRecommendations: RecommendationProduct[] = [
  {
    id: "rec-1",
    name: "Comfortable Armchair",
    description: "This is product a",
    price: 9999,
    image: imageRecommendation,
    category: "Home & Kitchen",
    rating: 4.5,
    reviews: 128,
    stock: 12,
  },
  {
    id: "rec-2",
    name: "Fresh Flowers Bouquet",
    description: "This is product a",
    price: 9999,
    image: imageRecommendation,
    category: "Premium Fruits",
    rating: 4.5,
    reviews: 128,
    stock: 12,
  },
  {
    id: "rec-3",
    name: "Gold Necklace",
    description: "This is product a",
    price: 9999,
    image: imageRecommendation,
    category: "Fashion",
    rating: 4.5,
    reviews: 128,
    stock: 12,
  },
  {
    id: "rec-4",
    name: "Premium Watch",
    description: "This is product a",
    price: 9999,
    image: imageRecommendation,
    category: "Electronics",
    rating: 4.5,
    reviews: 128,
    stock: 12,
  },
]



// Service Functions
export const getCart = async (): Promise<Cart> => {
  try {
    // TODO: Replace with actual API call when ready
    // const response = await axios.get(`${API_BASE_URL}/cart`)
    // return response.data

    await new Promise((resolve) => setTimeout(resolve, 300))

    const subtotal = dummyCartItems.reduce((sum, item) => sum + item.totalPrice, 0)
    const deliveryFee = 578
    const total = subtotal + deliveryFee

    return {
      items: dummyCartItems,
      subtotal,
      deliveryFee,
      total,
    }
  } catch (error) {
    console.error("Error fetching cart:", error)
    throw error
  }
}

export const updateCartItemQuantity = async (cartItemId: string, quantity: number): Promise<CartItem> => {
  try {
    // TODO: Replace with actual API call when ready
    // const response = await axios.put(`${API_BASE_URL}/cart/${cartItemId}`, { quantity })
    // return response.data

    await new Promise((resolve) => setTimeout(resolve, 200))

    const item = dummyCartItems.find((i) => i.id === cartItemId)
    if (!item) throw new Error("Cart item not found")

    const newQuantity = Math.max(1, quantity)
    item.quantity = newQuantity
    item.totalPrice = item.product.price * newQuantity

    return item
  } catch (error) {
    console.error("Error updating cart item:", error)
    throw error
  }
}

export const removeCartItem = async (cartItemId: string): Promise<void> => {
  try {
    // TODO: Replace with actual API call when ready
    // const response = await axios.delete(`${API_BASE_URL}/cart/${cartItemId}`)
    // return response.data

    await new Promise((resolve) => setTimeout(resolve, 200))

    const index = dummyCartItems.findIndex((i) => i.id === cartItemId)
    if (index > -1) {
      dummyCartItems.splice(index, 1)
    }
  } catch (error) {
    console.error("Error removing cart item:", error)
    throw error
  }
}

export const getRecommendedProducts = async (categories?: string[]): Promise<RecommendationProduct[]> => {
  try {
    // TODO: Replace with actual API call when ready
    // const response = await axios.get(`${API_BASE_URL}/recommendations`, {
    //   params: { categories }
    // })
    // return response.data

    await new Promise((resolve) => setTimeout(resolve, 300))

    if (categories && categories.length > 0) {
      return dummyRecommendations.filter((p) => categories.includes(p.category))
    }

    return dummyRecommendations
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    throw error
  }
}

export const checkout = async (cartData: Cart): Promise<{ orderId: string; paymentUrl: string }> => {
  try {
    // TODO: Replace with actual API call when ready
    const response = await axios.post(`/checkout`, cartData)
    // return response.data
    console.log("Checkout response:", response.data);

    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      orderId: `ORD-${Date.now()}`,
      paymentUrl: "/payment",
    }
  } catch (error) {
    console.error("Error during checkout:", error)
    throw error
  }
}
