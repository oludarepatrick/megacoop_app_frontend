// import axiosInstance from '@/lib/axiosInstance';
import axios from '@/lib/axiosInstance';
// import { formConfig, jsonConfig } from '@/common/utils';
import SmartWatch from "@/assets/marketplace/smartwatch-lifestyle.png";
import ElectronicsGadgets from "@/assets/marketplace/electronics-gadgets.png";
import DiverseFashionCollection from "@/assets/marketplace/diverse-fashion-collection.png";
import FreshTomatoes from "@/assets/marketplace/fresh-tomatoes.png";
import OrganicApples from "@/assets/marketplace/organic-apples.png";
import CoffeeMaker from "@/assets/marketplace/modern-coffee-maker.png";
import CasualTShirt from "@/assets/marketplace/casual-t-shirt.png";
import WirelessHeadphones from "@/assets/marketplace/wireless-headphones.png";
import FaceCreamDisplay from "@/assets/marketplace/face-cream-display.png";
import PaintBrushSet from "@/assets/marketplace/paint-brush-set.png";
import RunningShoes from "@/assets/marketplace/running-shoes.jpg";


import type { CarouselItem, FilterType, Product, RecentlyViewed } from "@/types/marketplaceTypes";

// API Base URL - Todo - Replace with actual API when ready
// const API_BASE_URL = process.env.VITE_API_BASE_URL ?? 'https://api.schooldrive.com.ng/api/v1/';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.schooldrive.com.ng/api/v1/';

export interface PaginatedProductsResponse {
  status: boolean;
  message: string;
  data: {
    current_page: number;
    data: Product[];
    first_page_url?: string;
    last_page: number;
    next_page_url?: string | null;
    prev_page_url?: string | null;
    per_page: number;
    total: number;
  };
}



// Dummy Data
export const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Fresh Tomatoes",
    description: "Lorem ipsum dolor sit amet consectetur",
    price: 3200,
    // image: FreshTomatoes,
    images: [FreshTomatoes],
    category: "Groceries",
    rating: 4.5,
    reviews: 128,
  },
  {
    id: "2",
    name: "Organic Apples",
    description: "Lorem ipsum dolor sit amet consectetur",
    price: 1700,
    images: [OrganicApples],
    category: "Premium Fruits",
    rating: 4.8,
    reviews: 256,
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Lorem ipsum dolor sit amet consectetur",
    price: 5400,
    images: [CoffeeMaker],
    category: "Home & Kitchen",
    rating: 4.3,
    reviews: 89,
  },
  {
    id: "4",
    name: "Casual T-Shirt",
    description: "Lorem ipsum dolor sit amet consectetur",
    price: 2100,
    images: [CasualTShirt],
    category: "Fashion",
    rating: 4.6,
    reviews: 342,
  },
  {
    id: "5",
    name: "Wireless Headphones",
    description: "Lorem ipsum dolor sit amet consectetur",
    price: 8900,
    images: [WirelessHeadphones],
    category: "Electronics",
    rating: 4.7,
    reviews: 512,
  },
  {
    id: "6",
    name: "Face Cream",
    description: "Lorem ipsum dolor sit amet consectetur",
    price: 4200,
    images: [FaceCreamDisplay],
    category: "Beauty",
    rating: 4.4,
    reviews: 178,
  },
  {
    id: "7",
    name: "Paint Brush Set",
    description: "Lorem ipsum dolor sit amet consectetur",
    price: 1500,
    images: [PaintBrushSet],
    category: "Home Improvement",
    rating: 4.2,
    reviews: 67,
  },
  {
    id: "8",
    name: "Running Shoes",
    description: "Lorem ipsum dolor sit amet consectetur",
    price: 6800,
    images: [RunningShoes],
    category: "Sports, Toys & Luggage",
    rating: 4.9,
    reviews: 423,
  },
]

const dummyCarouselItems: CarouselItem[] = [
  {
    id: "1",
    title: "Best Deal Online on smart watches",
    subtitle: "SMART WEARABLE.",
    description: "UP to 80% OFF",
    discount: "80%",
    image: SmartWatch,
    backgroundColor: "bg-slate-900",
  },
  {
    id: "2",
    title: "Premium Electronics Collection",
    subtitle: "LATEST GADGETS.",
    description: "UP to 60% OFF",
    discount: "60%",
    image: ElectronicsGadgets,
    backgroundColor: "bg-blue-900",
  },
  {
    id: "3",
    title: "Fashion Week Special",
    subtitle: "TRENDY OUTFITS.",
    description: "UP to 50% OFF",
    discount: "50%",
    image: DiverseFashionCollection,
    backgroundColor: "bg-purple-900",
  },
]

const dummyRecentlyViewed: RecentlyViewed[] = [
  {
    id: "1",
    image: "/diverse-person.png",
    name: "Person 1",
  },
  {
    id: "2",
    image: "/diverse-group-two.png",
    name: "Person 2",
  },
  {
    id: "3",
    image: "/diverse-group-outdoors.png",
    name: "Person 3",
  },
  {
    id: "4",
    image: "/diverse-group-four.png",
    name: "Person 4",
  },
  {
    id: "5",
    image: "/diverse-group-five.png",
    name: "Person 5",
  },
]

export const CATEGORIES = [
  "Groceries",
  "Premium Fruits",
  "Home & Kitchen",
  "Fashion",
  "Electronics",
  "Beauty",
  "Home Improvement",
  "Sports, Toys & Luggage",
]

// Service Functions
export const getProducts = async (
  category?: string
  // , page?: number
): Promise<Product[]> => {
  try {
    // TODO: Replace with actual API call when ready
    // const response = await axios.get(`/markets/products?page=${page}`, {
    //   params: { category }
    // })
    // return response.data

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (category && category !== "all") {
      return dummyProducts.filter((p) => p.category === category)
    }
    return dummyProducts
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

export const getAllProducts = async (page = 1): Promise<PaginatedProductsResponse> => {
  try {
    // TODO: Replace with actual API call when ready
    const response = await axios.get(`/markets/products?page=${page}`)
    console.log("All Products Response:", response)
    // return response

    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      status: true,
      message: "Products fetched successfully",
      data: {
        current_page: page,
        data: dummyProducts,
        first_page_url: `/markets/products?page=1`,
        last_page: 1,
        next_page_url: null,
        prev_page_url: null,
        per_page: dummyProducts.length,
        total: dummyProducts.length,
      },
    } 
    
  } catch (error) {
    console.error("Error fetching all products:", error)
    throw error
  }
}

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    // TODO: Replace with actual API call when ready
    // const response = await axios.get(`/markets/products/${id}`)
    // return response.data

    await new Promise((resolve) => setTimeout(resolve, 200))
    return dummyProducts.find((p) => p.id === id) || null
  } catch (error) {
    console.error("Error fetching product:", error)
    throw error
  }
}

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    // TODO: Replace with actual API call when ready
    // const response = await axios.get(`/products/search`, {
    //   params: { q: query }
    // })
    // return response.data

    await new Promise((resolve) => setTimeout(resolve, 300))
    const lowerQuery = query.toLowerCase()
    return dummyProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery),
    )
  } catch (error) {
    console.error("Error searching products:", error)
    throw error
  }
}

export const filterProducts = async (products: Product[], filterType: FilterType): Promise<Product[]> => {
  try {
    // TODO: Replace with actual API call when ready
    // const response = await axios.post(`/products/filter`, {
    //   products,
    //   filterType
    // })
    // return response.data

    await new Promise((resolve) => setTimeout(resolve, 200))

    const sorted = [...products]
    switch (filterType) {
      case "newest":
        return sorted.reverse()
      case "oldest":
        return sorted
      case "cheapest":
        return sorted.sort((a, b) => a.price - b.price)
      case "most_expensive":
        return sorted.sort((a, b) => b.price - a.price)
      case "all":
      default:
        return sorted
    }
  } catch (error) {
    console.error("Error filtering products:", error)
    throw error
  }
}

export const getCarouselItems = async (): Promise<CarouselItem[]> => {
  try {
    // TODO: Replace with actual API call when ready
    // const response = await axios.get(`${API_BASE_URL}/carousel`)
    // return response.data

    await new Promise((resolve) => setTimeout(resolve, 200))
    return dummyCarouselItems
  } catch (error) {
    console.error("Error fetching carousel items:", error)
    throw error
  }
}

export const getRecentlyViewed = async (): Promise<RecentlyViewed[]> => {
  try {
    // TODO: Replace with actual API call when ready
    // const response = await axios.get(`${API_BASE_URL}/recently-viewed`)
    // return response.data

    await new Promise((resolve) => setTimeout(resolve, 200))
    return dummyRecentlyViewed
  } catch (error) {
    console.error("Error fetching recently viewed:", error)
    throw error
  }
}


