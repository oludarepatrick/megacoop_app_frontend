// Types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating?: number
  reviews?: number
}

export interface CarouselItem {
  id: string
  title: string
  subtitle: string
  description: string
  discount: string
  image: string
  backgroundColor: string
}

export interface RecentlyViewed {
  id: string
  image: string
  name: string
}

export type FilterType = "all" | "newest" | "oldest" | "cheapest" | "most_expensive"