import { useQuery } from '@tanstack/react-query';
import { Province } from '@/types/address';

const API_BASE = 'https://provinces.open-api.vn/api/v1';

// Fetch all provinces
export const useProvinces = () => {
  return useQuery<Province[]>({
    queryKey: ['provinces'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch provinces');
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60 // Cache for 1 hour
  });
};

// Fetch districts and wards for a province
export const useProvinceDetails = (provinceCode: number | null) => {
  return useQuery<Province>({
    queryKey: ['province-details', provinceCode],
    queryFn: async () => {
      if (!provinceCode) throw new Error('Province code is required');

      const response = await fetch(`${API_BASE}/p/${provinceCode}?depth=3`);
      if (!response.ok) {
        throw new Error('Failed to fetch province details');
      }
      return response.json();
    },
    enabled: !!provinceCode,
    staleTime: 1000 * 60 * 60 // Cache for 1 hour
  });
};
