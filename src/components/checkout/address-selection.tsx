'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Check, User, Phone, ChevronRight } from 'lucide-react';
import AddressSelector from '@/components/shared/address-selector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { AddressFormData } from '@/types/address';
import { useProvinces, useProvinceDetails } from '@/hooks/useAddressApi';
import { useCreateUpdateAddress } from '@/queries/auth.query';
import { toast } from '@/components/ui/use-toast';

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

interface AddressSelectionProps {
  onAddressSelect: (address: any) => void;
  selectedAddressId?: string;
}

export default function AddressSelection({
  onAddressSelect,
  selectedAddressId
}: AddressSelectionProps) {
  const { infoUser } = useSelector((state: RootState) => state.auth);
  const userAddresses: UserAddress[] = infoUser?.deliveryAddresses || [];
  const { mutateAsync: createUpdateAddress } = useCreateUpdateAddress();

  const [openDialog, setOpenDialog] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [newAddressData, setNewAddressData] = useState({
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
    newAddressData.addressForm.provinceCode
  );

  // Auto-select default address on load
  useEffect(() => {
    if (!selectedAddressId && userAddresses.length > 0) {
      const defaultAddr =
        userAddresses.find((addr) => addr.default) || userAddresses[0];
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
        onAddressSelect({
          id: defaultAddr.id.toString(),
          name: defaultAddr.recipientName,
          phone: defaultAddr.phoneNumber,
          address: defaultAddr.address
        });
      }
    } else if (selectedAddressId) {
      const addr = userAddresses.find(
        (a) => a.id.toString() === selectedAddressId
      );
      if (addr) {
        setSelectedAddress(addr);
        onAddressSelect({
          id: addr.id.toString(),
          name: addr.recipientName,
          phone: addr.phoneNumber,
          address: addr.address
        });
      }
    }
  }, [userAddresses, selectedAddressId, onAddressSelect]);

  const handleAddressSelect = (address: UserAddress) => {
    setSelectedAddress(address);
    onAddressSelect({
      id: address.id.toString(),
      name: address.recipientName,
      phone: address.phoneNumber,
      address: address.address
    });
    setShowAddForm(false);
    setOpenDialog(false);
  };

  // Helper function to resolve names from codes
  const resolveAddressNames = () => {
    let provinceName = '';
    let districtName = '';
    let wardName = '';

    if (newAddressData.addressForm.provinceCode && provinces) {
      const province = provinces.find(
        (p) => p.code === newAddressData.addressForm.provinceCode
      );
      provinceName = province?.name || '';
    }

    if (newAddressData.addressForm.districtCode && provinceDetails) {
      const district = provinceDetails.districts.find(
        (d) => d.code === newAddressData.addressForm.districtCode
      );
      districtName = district?.name || '';
    }

    if (newAddressData.addressForm.wardCode && provinceDetails) {
      const district = provinceDetails.districts.find(
        (d) => d.code === newAddressData.addressForm.districtCode
      );
      if (district) {
        const ward = district.wards.find(
          (w) => w.code === newAddressData.addressForm.wardCode
        );
        wardName = ward?.name || '';
      }
    }

    return { provinceName, districtName, wardName };
  };

  const handleSaveNewAddress = async () => {
    if (
      !newAddressData.name.trim() ||
      !newAddressData.phone.trim() ||
      !newAddressData.addressForm.specificAddress.trim()
    ) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive'
      });
      return;
    }

    if (
      !newAddressData.addressForm.provinceCode ||
      !newAddressData.addressForm.districtCode ||
      !newAddressData.addressForm.wardCode
    ) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn đầy đủ tỉnh/thành, quận/huyện, phường/xã',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);

    try {
      const { provinceName, districtName, wardName } = resolveAddressNames();

      // Save address to database
      const addressData = {
        id: null,
        recipientName: newAddressData.name,
        phoneNumber: newAddressData.phone,
        address: newAddressData.addressForm.specificAddress,
        province: provinceName,
        district: districtName,
        ward: wardName,
        userId: infoUser?.id || 0,
        default: userAddresses.length === 0 // First address is default
      };

      await createUpdateAddress(addressData);

      // Create address object for checkout selection
      const newSavedAddress = {
        id: Date.now(), // Temporary ID, will be replaced by real ID from server
        recipientName: newAddressData.name,
        phoneNumber: newAddressData.phone,
        address: newAddressData.addressForm.specificAddress,
        province: provinceName,
        district: districtName,
        ward: wardName,
        default: userAddresses.length === 0
      };

      // Select the newly created address
      handleAddressSelect(newSavedAddress);

      toast({
        title: 'Thành công',
        description: 'Đã lưu và chọn địa chỉ mới'
      });

      // Reset form
      setNewAddressData({
        name: '',
        phone: '',
        addressForm: {
          provinceCode: null,
          districtCode: null,
          wardCode: null,
          specificAddress: ''
        }
      });
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể lưu địa chỉ. Vui lòng thử lại.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
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
    <div className="space-y-4">
      {/* Selected Address Display */}
      {selectedAddress ? (
        <Card className="border-rose-200 bg-rose-50/30">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">
                    {selectedAddress.recipientName}
                  </h4>
                  {selectedAddress.default && (
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      Mặc định
                    </span>
                  )}
                </div>
                <div className="mb-1 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <p className="text-sm text-gray-700">
                    {selectedAddress.phoneNumber}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-gray-600" />
                  <p className="text-sm text-gray-800">
                    {getFullAddressText(selectedAddress)}
                  </p>
                </div>
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500">
                <Check className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : userAddresses.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50 py-8 text-center">
          <CardContent>
            <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Chưa có địa chỉ giao hàng
            </h3>
            <p className="mb-4 text-sm text-gray-500">
              Vui lòng thêm địa chỉ giao hàng để tiếp tục đặt hàng
            </p>
            <Button onClick={() => setOpenDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm địa chỉ giao hàng
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {/* Button to open address selection dialog */}
      {selectedAddress && (
        <Button
          variant="outline"
          onClick={() => setOpenDialog(true)}
          className="w-full border-rose-200 hover:border-rose-300 hover:bg-rose-50"
        >
          <ChevronRight className="mr-2 h-4 w-4" />
          Chọn địa chỉ khác
        </Button>
      )}

      {/* Address Selection Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Chọn địa chỉ giao hàng
            </DialogTitle>
            <DialogDescription>
              Chọn địa chỉ có sẵn hoặc thêm địa chỉ mới
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              {userAddresses.length > 0 && !showAddForm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Thêm địa chỉ mới
                </Button>
              )}
            </div>

            {/* Existing Address List */}
            {userAddresses.length > 0 && !showAddForm && (
              <div className="space-y-3">
                {userAddresses.map((address) => (
                  <motion.div
                    key={address.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedAddress?.id === address.id
                          ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-500'
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => handleAddressSelect(address)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-600" />
                              <h4 className="font-medium text-gray-900">
                                {address.recipientName}
                              </h4>
                              {address.default && (
                                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <div className="mb-1 flex items-center gap-2">
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

                          {selectedAddress?.id === address.id && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-500">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Add New Address Form */}
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardContent className="space-y-4 p-6">
                    <div>
                      <h4 className="text-lg font-semibold">
                        Thêm địa chỉ mới
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Địa chỉ sẽ được lưu vào tài khoản của bạn để sử dụng cho
                        các lần đặt hàng sau
                      </p>
                    </div>

                    {/* Name and Phone */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Tên người nhận <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={newAddressData.name}
                          onChange={(e) =>
                            setNewAddressData((prev) => ({
                              ...prev,
                              name: e.target.value
                            }))
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
                          value={newAddressData.phone}
                          onChange={(e) =>
                            setNewAddressData((prev) => ({
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
                      value={newAddressData.addressForm}
                      onChange={(addressForm) =>
                        setNewAddressData((prev) => ({ ...prev, addressForm }))
                      }
                      required
                    />

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4">
                      <Button
                        onClick={handleSaveNewAddress}
                        disabled={isSaving}
                        className="flex items-center gap-2"
                      >
                        {isSaving ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            Lưu và sử dụng địa chỉ này
                          </>
                        )}
                      </Button>

                      {userAddresses.length > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => setShowAddForm(false)}
                          disabled={isSaving}
                        >
                          Hủy
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Empty State - only show if no addresses and not showing form */}
            {userAddresses.length === 0 && !showAddForm && (
              <Card className="py-8 text-center">
                <CardContent>
                  <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    Chưa có địa chỉ giao hàng
                  </h3>
                  <p className="mb-4 text-gray-500">
                    Vui lòng thêm địa chỉ giao hàng để tiếp tục đặt hàng
                  </p>
                  <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm địa chỉ giao hàng
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
