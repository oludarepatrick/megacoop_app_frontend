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


export const dummyProducts: Product[] = [
  {
    product_id: "1",
    product_name: "Fresh Tomatoes",
    brief_description: "Lorem ipsum dolor sit amet consectetur",
    price: 3200,
    // image: FreshTomatoes,
    images: [FreshTomatoes],
    product_category: "Groceries",
    rating: 4.5,
    reviews: 128,
  },
  {
    product_id: "2",
    product_name: "Organic Apples",
    brief_description: "Lorem ipsum dolor sit amet consectetur",
    price: 1700,
    images: [OrganicApples],
    product_category: "Premium Fruits",
    rating: 4.8,
    reviews: 256,
  },
  {
    product_id: "3",
    product_name: "Coffee Maker",
    brief_description: "Lorem ipsum dolor sit amet consectetur",
    price: 5400,
    images: [CoffeeMaker],
    product_category: "Home & Kitchen",
    rating: 4.3,
    reviews: 89,
  },
  {
    product_id: "4",
    product_name: "Casual T-Shirt",
    brief_description: "Lorem ipsum dolor sit amet consectetur",
    price: 2100,
    images: [CasualTShirt],
    product_category: "Fashion",
    rating: 4.6,
    reviews: 342,
  },
  {
    product_id: "5",
    product_name: "Wireless Headphones",
    brief_description: "Lorem ipsum dolor sit amet consectetur",
    price: 8900,
    images: [WirelessHeadphones],
    product_category: "Electronics",
    rating: 4.7,
    reviews: 512,
  },
  {
    product_id: "6",
    product_name: "Face Cream",
    brief_description: "Lorem ipsum dolor sit amet consectetur",
    price: 4200,
    images: [FaceCreamDisplay],
    product_category: "Beauty",
    rating: 4.4,
    reviews: 178,
  },
  {
    product_id: "7",
    product_name: "Paint Brush Set",
    brief_description: "Lorem ipsum dolor sit amet consectetur",
    price: 1500,
    images: [PaintBrushSet],
    product_category: "Home Improvement",
    rating: 4.2,
    reviews: 67,
  },
  {
    product_id: "8",
    product_name: "Running Shoes",
    brief_description: "Lorem ipsum dolor sit amet consectetur",
    price: 6800,
    images: [RunningShoes],
    product_category: "Sports, Toys & Luggage",
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
  category?: string,
  // page = 1
): Promise<Product[]> => {
  try {
    // TODO: Replace with actual API call when ready
    // const response = await axios.get(`/markets/products/by-category`, {
    //   params: {
    //     // page,
    //     category_name: category
    //   }
    // })
    // console.log("Products by Category Response:", response.data)
    // return response.data

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (category && category !== "all") {
      return dummyProducts.filter((p) => p.product_category === category)
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
    // console.log("All Products Response:", response.data)
    const apiData = response.data
    // return response

    await new Promise((resolve) => setTimeout(resolve, 300))
    // return {
    //   status: true,
    //   message: "Products fetched successfully",
    //   data: {
    //     current_page: page,
    //     data: dummyProducts,
    //     first_page_url: `/markets/products?page=1`,
    //     last_page: 1,
    //     next_page_url: null,
    //     prev_page_url: null,
    //     per_page: dummyProducts.length,
    //     total: dummyProducts.length,
    //   },

      return {
      status: apiData.status,
      message: apiData.message,
      data: {
        current_page: apiData.data.current_page,
        data: apiData.data.data,
        first_page_url: apiData.data.first_page_url,
        last_page: apiData.data.last_page,
        next_page_url: apiData.data.next_page_url,
        prev_page_url: apiData.data.prev_page_url,
        per_page: apiData.data.per_page,
        total: apiData.data.total,
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
    return dummyProducts.find((p) => p.product_id === id) || null
  } catch (error) {
    console.error("Error fetching product:", error)
    throw error
  }
}

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    // TODO: Replace with actual API call when ready
    const response = await axios.get(`/products/search`, {
      params: {
        product_name: query
      }
    })
    console.log("Search Products Response:", response)
    // return response.data

    await new Promise((resolve) => setTimeout(resolve, 300))
    const lowerQuery = query.toLowerCase()
    return dummyProducts.filter(
      (p) =>
        p.product_name.toLowerCase().includes(lowerQuery) ||
        p.brief_description.toLowerCase().includes(lowerQuery) ||
        p.product_category.toLowerCase().includes(lowerQuery),
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


