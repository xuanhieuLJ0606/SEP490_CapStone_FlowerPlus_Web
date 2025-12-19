'use client';

import { useState, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProvinces, useProvinceDetails } from '@/hooks/useAddressApi';
import { District, Ward, AddressFormData } from '@/types/address';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface AddressSelectorProps {
  value?: AddressFormData;
  onChange: (address: AddressFormData) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function AddressSelector({
  value,
  onChange,
  className = '',
  disabled = false,
  required = false
}: AddressSelectorProps) {
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);
  const [specificAddress, setSpecificAddress] = useState('');

  // Fetch provinces
  const {
    data: provinces,
    isLoading: provincesLoading,
    error: provincesError
  } = useProvinces();

  // Fetch province details (districts and wards)
  const { data: provinceDetails, isLoading: provinceDetailsLoading } =
    useProvinceDetails(selectedProvince);

  // Sync initial values from prop (only once on mount)
  useEffect(() => {
    if (value) {
      setSelectedProvince(value.provinceCode || null);
      setSelectedDistrict(value.districtCode || null);
      setSelectedWard(value.wardCode || null);
      setSpecificAddress(value.specificAddress || '');
    }
  }, []); // Empty deps - chỉ chạy khi component mount

  // Update form data when selections change
  useEffect(() => {
    onChange({
      provinceCode: selectedProvince,
      districtCode: selectedDistrict,
      wardCode: selectedWard,
      specificAddress
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvince, selectedDistrict, selectedWard, specificAddress]);
  // Bỏ onChange khỏi dependencies để tránh infinite loop

  // Reset district and ward when province changes
  useEffect(() => {
    setSelectedDistrict(null);
    setSelectedWard(null);
  }, [selectedProvince]);

  // Reset ward when district changes
  useEffect(() => {
    setSelectedWard(null);
  }, [selectedDistrict]);

  const getDistrictsByProvince = (): District[] => {
    return provinceDetails?.districts || [];
  };

  const getWardsByDistrict = (): Ward[] => {
    if (!selectedDistrict || !provinceDetails) return [];

    const district = provinceDetails.districts.find(
      (d) => d.code === selectedDistrict
    );
    return district?.wards || [];
  };

  const getFullAddress = (): string => {
    const parts: string[] = [];

    if (specificAddress.trim()) {
      parts.push(specificAddress.trim());
    }

    if (selectedWard && provinceDetails) {
      const ward = getWardsByDistrict().find((w) => w.code === selectedWard);
      if (ward) parts.push(ward.name);
    }

    if (selectedDistrict && provinceDetails) {
      const district = getDistrictsByProvince().find(
        (d) => d.code === selectedDistrict
      );
      if (district) parts.push(district.name);
    }

    if (selectedProvince && provinces) {
      const province = provinces.find((p) => p.code === selectedProvince);
      if (province) parts.push(province.name);
    }

    return parts.join(', ');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Province Selection */}
      <div className="space-y-2">
        <Label htmlFor="province" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Tỉnh/Thành phố {required && <span className="text-red-500">*</span>}
        </Label>
        <Select
          value={selectedProvince?.toString() || ''}
          onValueChange={(value) =>
            setSelectedProvince(value ? parseInt(value) : null)
          }
          disabled={disabled || provincesLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                provincesLoading ? 'Đang tải...' : 'Chọn tỉnh/thành phố'
              }
            />
          </SelectTrigger>
          <SelectContent className="z-[9999] max-h-[200px] overflow-y-auto">
            {provincesLoading ? (
              <SelectItem value="loading" disabled>
                Đang tải...
              </SelectItem>
            ) : provincesError ? (
              <SelectItem value="error" disabled>
                Lỗi tải dữ liệu
              </SelectItem>
            ) : provinces && provinces.length > 0 ? (
              provinces.map((province) => (
                <SelectItem
                  key={province.code}
                  value={province.code.toString()}
                >
                  {province.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-data" disabled>
                Không có dữ liệu
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* District Selection */}
      <div className="space-y-2">
        <Label htmlFor="district">
          Quận/Huyện {required && <span className="text-red-500">*</span>}
        </Label>
        <Select
          value={selectedDistrict?.toString() || ''}
          onValueChange={(value) =>
            setSelectedDistrict(value ? parseInt(value) : null)
          }
          disabled={disabled || !selectedProvince || provinceDetailsLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                !selectedProvince
                  ? 'Chọn tỉnh/thành phố trước'
                  : provinceDetailsLoading
                    ? 'Đang tải...'
                    : 'Chọn quận/huyện'
              }
            />
          </SelectTrigger>
          <SelectContent className="z-[9999] max-h-[200px] overflow-y-auto">
            {provinceDetailsLoading ? (
              <SelectItem value="loading" disabled>
                Đang tải...
              </SelectItem>
            ) : getDistrictsByProvince().length > 0 ? (
              getDistrictsByProvince().map((district) => (
                <SelectItem
                  key={district.code}
                  value={district.code.toString()}
                >
                  {district.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-data" disabled>
                Không có dữ liệu
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Ward Selection */}
      <div className="space-y-2">
        <Label htmlFor="ward">
          Phường/Xã {required && <span className="text-red-500">*</span>}
        </Label>
        <Select
          value={selectedWard?.toString() || ''}
          onValueChange={(value) =>
            setSelectedWard(value ? parseInt(value) : null)
          }
          disabled={disabled || !selectedDistrict}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                !selectedDistrict ? 'Chọn quận/huyện trước' : 'Chọn phường/xã'
              }
            />
          </SelectTrigger>
          <SelectContent className="z-[9999] max-h-[200px] overflow-y-auto">
            {getWardsByDistrict().length > 0 ? (
              getWardsByDistrict().map((ward) => (
                <SelectItem key={ward.code} value={ward.code.toString()}>
                  {ward.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-data" disabled>
                Không có dữ liệu
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Specific Address */}
      <div className="space-y-2">
        <Label htmlFor="specificAddress">
          Địa chỉ cụ thể {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id="specificAddress"
          value={specificAddress}
          onChange={(e) => setSpecificAddress(e.target.value)}
          placeholder="Số nhà, tên đường..."
          disabled={disabled}
          className="w-full"
        />
      </div>

      {/* Full Address Preview */}
      {getFullAddress() && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-gray-200 bg-gray-50 p-3"
        >
          <Label className="text-sm font-medium text-gray-700">
            Địa chỉ đầy đủ:
          </Label>
          <p className="mt-1 text-sm text-gray-900">{getFullAddress()}</p>
        </motion.div>
      )}

      {/* Loading States */}
      {(provincesLoading || provinceDetailsLoading) && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
          <span className="ml-2 text-sm text-gray-500">
            Đang tải dữ liệu...
          </span>
        </div>
      )}
    </div>
  );
}
