// import axiosInstance from '@/lib/axiosInstance';
import axios from '@/lib/axiosInstance';
// import { formConfig, jsonConfig } from '@/common/utils';
import SmartWatch from "@/assets/marketplace/smartwatch-lifestyle.png";
import ElectronicsGadgets from "@/assets/marketplace/electronics-gadgets.png";
import DiverseFashionCollection from "@/assets/marketplace/diverse-fashion-collection.png";
import type { CarouselItem, FilterType, Product } from "@/types/marketplaceTypes";


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
): Promise<Product[]> => {
  try {
    const response = await axios.get(`/products/products/by-category`, {
      params: {
        category_name: category
      }
    })
    console.log("Products by Category Response:", response.data)
    
    // Handle different response structures
    if (Array.isArray(response.data)) {
      return response.data
    }
    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data
    }
    
    return []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
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
    const response = await axios.get(`/markets/products/${id}`)
    return response.data

    // await new Promise((resolve) => setTimeout(resolve, 200))
    // return dummyProducts.find((p) => p.product_id === id) || null
  } catch (error) {
    console.error("Error fetching product:", error)
    throw error
  }
}

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    if (!query || query.trim().length === 0) {
      return []
    }

    const response = await axios.get(`/products/search`, {
      params: {
        product_name: query.trim()
      }
    })
    
    console.log("Search Products Response:", response)
    
    // Handle different possible response structures
    if (response.data) {
      // If response.data is already an array
      if (Array.isArray(response.data)) {
        return response.data
      }
      // If response has a data.data structure (paginated)
      if (response.data.data) {
        return Array.isArray(response.data.data) ? response.data.data : []
      }
      // If response has a products array
      if (response.data.products) {
        return Array.isArray(response.data.products) ? response.data.products : []
      }
    }
    
    return []
  } catch (error) {
    console.error("Error searching products:", error)
    // Return empty array instead of throwing to prevent UI errors
    return []
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

// export const getRecentlyViewed = async (): Promise<RecentlyViewed[]> => {
//   try {
//     // TODO: Replace with actual API call when ready
//     // const response = await axios.get(`${API_BASE_URL}/recently-viewed`)
//     // return response.data

//     await new Promise((resolve) => setTimeout(resolve, 200))
//     return dummyRecentlyViewed
//   } catch (error) {
//     console.error("Error fetching recently viewed:", error)
//     throw error
//   }
// }