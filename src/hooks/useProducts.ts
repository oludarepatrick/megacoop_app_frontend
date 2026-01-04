import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from "@/services/marketplaceService"; // Adjust import path
import type { Product } from "@/types/marketplaceTypes";

export const useTrendingProducts = (limit: number = 3) => {
  return useQuery({
    queryKey: ['trending-products', limit],
    queryFn: async () => {
      const response = await getAllProducts(1); // Get first page
      return response.data.data.slice(0, limit); // Take first 3 products
    },
    select: (data: Product[]) => {
      // Optional: Filter for active products only
      return data.filter(product => product.status === 'active');
    }
  });
};

// Alternative: Get all products (for other uses)
// export const useAllProducts = (page: number = 1) => {
//   return useQuery({
//     queryKey: ['products', page],
//     queryFn: () => getAllProducts(page),
//     staleTime: 5 * 60 * 1000,
//   });
// };