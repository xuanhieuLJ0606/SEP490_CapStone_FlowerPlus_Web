import { useState, useEffect } from 'react';

interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  address: {
    provinceCode: number | null;
    districtCode: number | null;
    wardCode: number | null;
    specificAddress: string;
  };
  isDefault: boolean;
}

const STORAGE_KEY = 'flower-plus-addresses';

export const useAddressStorage = () => {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load addresses from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAddresses(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading addresses from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save addresses to localStorage whenever addresses change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
      } catch (error) {
        console.error('Error saving addresses to localStorage:', error);
      }
    }
  }, [addresses, isLoading]);

  const addAddress = (address: Omit<SavedAddress, 'id'>) => {
    const newAddress: SavedAddress = {
      ...address,
      id: Date.now().toString(),
      isDefault: addresses.length === 0 // First address is default
    };

    setAddresses((prev) => [...prev, newAddress]);
    return newAddress;
  };

  const updateAddress = (id: string, updates: Partial<SavedAddress>) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === id ? { ...addr, ...updates } : addr))
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((addr) => addr.id !== id);

      // If we deleted the default address, make the first remaining address default
      if (filtered.length > 0 && !filtered.some((addr) => addr.isDefault)) {
        filtered[0].isDefault = true;
      }

      return filtered;
    });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id
      }))
    );
  };

  const getDefaultAddress = (): SavedAddress | null => {
    return addresses.find((addr) => addr.isDefault) || addresses[0] || null;
  };

  const getAddressById = (id: string): SavedAddress | null => {
    return addresses.find((addr) => addr.id === id) || null;
  };

  return {
    addresses,
    isLoading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,
    getAddressById
  };
};
