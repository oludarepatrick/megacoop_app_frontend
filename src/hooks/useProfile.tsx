import { fetchAccountInfo } from "@/services/profileService";
import { useQuery } from "@tanstack/react-query";

export const useAccountInfo = () => {
    return useQuery({
        queryKey: ['profileAccountInfo'],
        queryFn: fetchAccountInfo,
    }
)};