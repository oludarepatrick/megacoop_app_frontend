import type { Cart, CartItem, RecommendationProduct } from "@/types/cartTypes"
import axios from '@/lib/axiosInstance';
import imageTomatoes from "@/assets/marketplace/organic-apples.png";
import imageRecommendation from "@/assets/marketplace/smartwatch-lifestyle.png";
import {
  dummyProducts,
  // getProducts
} from "@/services/marketplaceService";
import { jsonConfig } from "@/common/utils";


// Dummy cart data
const dummyCartItems: CartItem[] = [
  {
    
      product_id: "1",
      product_name: "Sweet Green Seedless Grapes 1.5-2 lb",
      brief_description: "Fresh and juicy grapes",
      price: 1500,
      images:[imageTomatoes],
      product_category: "Premium Fruits",
      rating: 4.5,
      reviews: 128,
    quantity: 1,
    totalPrice: 1500,
  },
  {

      product_id: "2",
      product_name: "Sweet Green Seedless Grapes 1.5-2 lb",
      brief_description: "Fresh and juicy grapes",
      price: 1500,
      images: [imageTomatoes],
      product_category: "Premium Fruits",
      rating: 4.5,
      reviews: 128,
    
    quantity: 1,
    totalPrice: 1500,
  },
  {

      product_id: "3",
      product_name: "Sweet Green Seedless Grapes 1.5-2 lb",
      brief_description: "Fresh and juicy grapes",
      price: 1500,
      images: [imageTomatoes],
      product_category: "Premium Fruits",
      rating: 4.5,
      reviews: 128,
    
    quantity: 1,
    totalPrice: 1500,
  },
  {

      product_id: "4",
      product_name: "Sweet Green Seedless Grapes 1.5-2 lb",
      brief_description: "Fresh and juicy grapes",
      price: 1500,
      images: [imageTomatoes],
      product_category: "Premium Fruits",
      rating: 4.5,
      reviews: 128,
    quantity: 123,
    totalPrice: 184500,
  },
]

const dummyRecommendations: RecommendationProduct[] = [
  {
    product_id: "rec-1",
    product_name: "Comfortable Armchair",
    brief_description: "This is product a",
    price: 9999,
    images: [imageRecommendation],
    product_category: "Home & Kitchen",
    rating: 4.5,
    reviews: 128,
    stock: 12,
  },
  {
    product_id: "rec-2",
    product_name: "Fresh Flowers Bouquet",
    brief_description: "This is product a",
    price: 9999,
    images: [imageRecommendation],
    product_category: "Premium Fruits",
    rating: 4.5,
    reviews: 128,
    stock: 12,
  },
  {
    product_id: "rec-3",
    product_name: "Gold Necklace",
    brief_description: "This is product a",
    price: 9999,
    images: [imageRecommendation],
    product_category: "Fashion",
    rating: 4.5,
    reviews: 128,
    stock: 12,
  },
  {
    product_id: "rec-4",
    product_name: "Premium Watch",
    brief_description: "This is product a",
    price: 9999,
    images: [imageRecommendation],
    product_category: "Electronics",
    rating: 4.5,
    reviews: 128,
    stock: 12,
  },
]



// Service Functions
export const getCart = async (): Promise<Cart> => {
  try {
    // TODO: Replace with actual API call when ready
    // const response = await axios.get(`/markets/cart`)
    // return response.data

    await new Promise((resolve) => setTimeout(resolve, 300))

    const subtotal = dummyCartItems.reduce((sum, item) => sum + item.totalPrice, 0)
    const deliveryFee = subtotal > 50000 ? 0 : 1500 // Free delivery above ₦50,000
    const vat = subtotal * 0.075
    const total = subtotal + deliveryFee + vat

    return {
      items: dummyCartItems,
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
    // TODO: Replace with actual API call when ready
    const response = await axios.post(`/markets/cart/add`, {
      product_id: productId,
      quantity
    }, jsonConfig)
    console.log("Add to cart response:", response);
    // return response.data

    await new Promise((resolve) => setTimeout(resolve, 300))

    const product = dummyProducts.find((p) => p.product_id === productId)
    if (!product) throw new Error("Product not found")

    const newItem: CartItem = {
      // id: `cart-${Date.now()}`,
      ...product,
      quantity,
      totalPrice: product.price * quantity,
    }

    dummyCartItems.push(newItem)
    return newItem
  } catch (error) {
    console.error("Error adding to cart:", error)
    throw error
  }
}

export const updateCartItemQuantity = async (cartItemId: string, quantity: number): Promise<CartItem> => {
  try {
    // TODO: Replace with actual API call when ready
    // const response = await axios.put(`${API_BASE_URL}/cart/${cartItemId}`, { quantity })
    // return response.data

    await new Promise((resolve) => setTimeout(resolve, 200))

    const localStorageCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const itemIndex = localStorageCart.findIndex((i: CartItem) => i.product_id === cartItemId);
    if (itemIndex > -1) {
      localStorageCart[itemIndex].quantity = quantity;
      localStorageCart[itemIndex].totalPrice = localStorageCart[itemIndex].price * quantity;
      localStorage.setItem("cartItems", JSON.stringify(localStorageCart));
    }

    // const item = dummyCartItems.find((i) => i.id === cartItemId)
    // if (!item) throw new Error("Cart item not found")

    // const newQuantity = Math.max(1, quantity)
    // item.quantity = newQuantity
    // item.totalPrice = item.price * newQuantity

    // return item

    return localStorageCart[itemIndex];
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

    // const index = dummyCartItems.findIndex((i) => i.id === cartItemId)
    // if (index > -1) {
    //   dummyCartItems.splice(index, 1)
    // }

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
    // if (!categories.length) return []

    // // Fetch products for all categories in parallel
    // const allResponses = await Promise.all(
    //   categories.map(async (category) => {
    //     const res = await getProducts(category)
    //     // if getProducts returns the API response directly:
    //     return res?.data ?? []
    //   })
    // )

    // // Flatten arrays from all categories
    // const allProducts = allResponses.flat()

    // // Remove duplicates (based on product id)
    // const uniqueProducts = Array.from(
    //   new Map(allProducts.map((p) => [p.id, p])).values()
    // )

    // return uniqueProducts as RecommendationProduct[]
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (categories && categories.length > 0) {
      return dummyRecommendations.filter((p) => categories.includes(p.product_category))
      // const RecommendedProducts = await getProducts();
      // return RecommendedProducts.filter((p) => categories.includes(p.product_category)) as RecommendationProduct[];
    }

    return dummyRecommendations
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    throw error
  }
}

export const checkout = async (cartData: Cart): Promise<{ orderId: string; paymentUrl: string }> => {
  console.log("Checkout called with cart data:", cartData);
  try {
    // TODO: Replace with actual API call when ready
    const response = await axios.post(`/products/checkout`, cartData)
    // return response.data
    console.log("Checkout response:", response);

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

export const getWalletBalance = async (): Promise<number> => {
  try {
    // const response = await axios.get('/user/get-user-wallet')
    // console.log("Wallet Balance Response:", response);
    await new Promise((resolve) => setTimeout(resolve, 300))
    return 10000 // Dummy wallet balance
    // return response.data.data.balance;
  } catch (error) {
    console.error("Error fetching wallet balance:", error)
    throw error
  }
}
