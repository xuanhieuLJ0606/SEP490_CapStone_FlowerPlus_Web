'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Plus, Edit2, User, Phone } from 'lucide-react';
import AddressSelector from '@/components/shared/address-selector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useCreateUpdateAddress } from '@/queries/auth.query';
import { AddressFormData } from '@/types/address';
import { useProvinces, useProvinceDetails } from '@/hooks/useAddressApi';

interface UserAddress {
  id: number;
  address: string;
  recipientName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  default: boolean;
}

export default function AddressManagement() {
  const { infoUser } = useSelector((state: RootState) => state.auth);
  const { mutateAsync: createUpdateAddress } = useCreateUpdateAddress();
  const userAddresses: UserAddress[] = infoUser?.deliveryAddresses || [];

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addressForm: {
      provinceCode: null as number | null,
      districtCode: null as number | null,
      wardCode: null as number | null,
      specificAddress: ''
    } as AddressFormData
  });

  // Fetch provinces and province details for resolving names
  const { data: provinces } = useProvinces();
  const { data: provinceDetails } = useProvinceDetails(
    formData.addressForm.provinceCode
  );

  // Helper function to resolve names from codes
  const resolveAddressNames = () => {
    let provinceName = '';
    let districtName = '';
    let wardName = '';

    if (formData.addressForm.provinceCode && provinces) {
      const province = provinces.find(
        (p) => p.code === formData.addressForm.provinceCode
      );
      provinceName = province?.name || '';
    }

    if (formData.addressForm.districtCode && provinceDetails) {
      const district = provinceDetails.districts.find(
        (d) => d.code === formData.addressForm.districtCode
      );
      districtName = district?.name || '';
    }

    if (formData.addressForm.wardCode && provinceDetails) {
      const district = provinceDetails.districts.find(
        (d) => d.code === formData.addressForm.districtCode
      );
      if (district) {
        const ward = district.wards.find(
          (w) => w.code === formData.addressForm.wardCode
        );
        wardName = ward?.name || '';
      }
    }

    return { provinceName, districtName, wardName };
  };

  const handleSave = async () => {
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.addressForm.specificAddress.trim()
    ) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive'
      });
      return;
    }

    if (
      !formData.addressForm.provinceCode ||
      !formData.addressForm.districtCode ||
      !formData.addressForm.wardCode
    ) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn đầy đủ tỉnh/thành, quận/huyện, phường/xã',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { provinceName, districtName, wardName } = resolveAddressNames();

      const addressData = {
        id: editingAddress?.id || null,
        recipientName: formData.name,
        phoneNumber: formData.phone,
        address: formData.addressForm.specificAddress,
        province: provinceName,
        district: districtName,
        ward: wardName,
        userId: infoUser?.id || 0,
        default: userAddresses.length === 0 // First address is default
      };

      await createUpdateAddress(addressData);

      // Reset form
      setFormData({
        name: '',
        phone: '',
        addressForm: {
          provinceCode: null,
          districtCode: null,
          wardCode: null,
          specificAddress: ''
        }
      });
      setIsAddingNew(false);
      setEditingAddress(null);

      toast({
        title: 'Thành công',
        description: editingAddress
          ? 'Cập nhật địa chỉ thành công'
          : 'Thêm địa chỉ thành công'
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra, vui lòng thử lại',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (address: UserAddress) => {
    setFormData({
      name: address.recipientName,
      phone: address.phoneNumber,
      addressForm: {
        provinceCode: null, // Would need to resolve from address text
        districtCode: null,
        wardCode: null,
        specificAddress: address.address
      }
    });
    setEditingAddress(address);
    setIsAddingNew(true);
  };

  const handleSetDefault = async (address: UserAddress) => {
    try {
      await createUpdateAddress({
        ...address,
        default: true
      });
      toast({
        title: 'Thành công',
        description: 'Đã đặt làm địa chỉ mặc định'
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra',
        variant: 'destructive'
      });
    }
  };

  const getFullAddressText = (address: UserAddress): string => {
    const parts = [
      address.address,
      address.ward,
      address.district,
      address.province
    ].filter(Boolean);
    return parts.join(', ') || 'Địa chỉ không hợp lệ';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <MapPin className="h-5 w-5" />
          Địa chỉ giao hàng
        </h3>

        {!isAddingNew && (
          <Button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Thêm địa chỉ
          </Button>
        )}
      </div>

      {/* Address List */}
      {userAddresses.length > 0 && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {userAddresses.map((address) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-lg border-2 p-4 transition-all ${
                  address.default
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <h4 className="font-medium text-gray-900">
                        {address.recipientName}
                      </h4>
                      {address.default && (
                        <div className="flex items-center gap-1 rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-700">
                          <Star className="h-3 w-3 fill-current" />
                          Mặc định
                        </div>
                      )}
                    </div>
                    <div className="mb-2 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <p className="text-sm text-gray-600">
                        {address.phoneNumber}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 text-gray-600" />
                      <p className="text-sm text-gray-800">
                        {getFullAddressText(address)}
                      </p>
                    </div>
                  </div>

                  <div className="ml-4 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                      className="text-xs"
                    >
                      <Edit2 className="mr-1 h-3 w-3" />
                      Sửa
                    </Button>
                    {!address.default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address)}
                        className="text-xs"
                      >
                        Đặt mặc định
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Address Form */}
      {isAddingNew && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name and Phone */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Tên người nhận <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Nhập tên người nhận"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value
                      }))
                    }
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              {/* Address Selector */}
              <AddressSelector
                value={formData.addressForm}
                onChange={(addressForm) =>
                  setFormData((prev) => ({ ...prev, addressForm }))
                }
                required
              />

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  {editingAddress ? 'Cập nhật' : 'Lưu địa chỉ'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingAddress(null);
                    setFormData({
                      name: '',
                      phone: '',
                      addressForm: {
                        provinceCode: null,
                        districtCode: null,
                        wardCode: null,
                        specificAddress: ''
                      }
                    });
                  }}
                >
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {userAddresses.length === 0 && !isAddingNew && (
        <Card className="py-8 text-center">
          <CardContent>
            <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Chưa có địa chỉ giao hàng
            </h3>
            <p className="mb-4 text-gray-500">
              Thêm địa chỉ để nhận hoa tươi đẹp đến tận nhà bạn
            </p>
            <Button onClick={() => setIsAddingNew(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm địa chỉ đầu tiên
            </Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
