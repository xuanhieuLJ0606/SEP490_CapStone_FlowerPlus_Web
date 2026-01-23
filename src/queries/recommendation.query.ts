import { useQuery } from '@tanstack/react-query';
import BaseRequest from '@/config/axios.config';

interface Recommendation {
  favorite_count: number;
  images: string;
  name: string;
  price: number;
  product_id: number;
  purchase_count: string;
  reason: string;
  score: number;
  stock: number;
}

interface RecommendationResponse {
  count: number;
  recommendations: Recommendation[];
  success: boolean;
  user_id: number;
}

export const useGetPersonalizedRecommendations = (
  limit: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['personalized-recommendations', limit],
    queryFn: async (): Promise<RecommendationResponse> => {
      const res = await BaseRequest.Get<RecommendationResponse>(
        `/recommendations/personalized?limit=${limit}`
      );
      return res.data;
    },
    enabled: enabled, // Only fetch if enabled (user is logged in)
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
};
