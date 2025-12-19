'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import AddressSelector from './address-selector';
import { AddressFormData } from '@/types/address';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  address: AddressFormData;
  isDefault: boolean;
}

interface AddressFormProps {
  mode: 'profile' | 'checkout';
  savedAddresses?: SavedAddress[];
  onSave?: (address: SavedAddress) => void;
  onSelect?: (address: SavedAddress) => void;
  onDelete?: (addressId: string) => void;
  selectedAddressId?: string;
  className?: string;
}

export default function AddressForm({
  mode,
  savedAddresses = [],
  onSave,
  onSelect,
  onDelete,
  selectedAddressId,
  className = ''
}: AddressFormProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      provinceCode: null,
      districtCode: null,
      wardCode: null,
      specificAddress: ''
    } as AddressFormData
  });

  const handleSave = () => {
    // Validate form
    if (!formData.name.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập tên người nhận',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.phone.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập số điện thoại',
        variant: 'destructive'
      });
      return;
    }

    if (
      !formData.address.provinceCode ||
      !formData.address.districtCode ||
      !formData.address.wardCode ||
      !formData.address.specificAddress.trim()
    ) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin địa chỉ',
        variant: 'destructive'
      });
      return;
    }

    const newAddress: SavedAddress = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      isDefault: savedAddresses.length === 0 // First address is default
    };

    onSave?.(newAddress);

    // Reset form
    setFormData({
      name: '',
      phone: '',
      address: {
        provinceCode: null,
        districtCode: null,
        wardCode: null,
        specificAddress: ''
      }
    });
    setIsAddingNew(false);
    setEditingId(null);

    toast({
      title: 'Thành công',
      description: editingId
        ? 'Cập nhật địa chỉ thành công'
        : 'Thêm địa chỉ thành công'
    });
  };

  const handleEdit = (address: SavedAddress) => {
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address
    });
    setEditingId(address.id);
    setIsAddingNew(true);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      phone: '',
      address: {
        provinceCode: null,
        districtCode: null,
        wardCode: null,
        specificAddress: ''
      }
    });
    setIsAddingNew(false);
    setEditingId(null);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <MapPin className="h-5 w-5" />
          {mode === 'profile' ? 'Địa chỉ giao hàng' : 'Chọn địa chỉ giao hàng'}
        </h3>

        {mode === 'profile' && !isAddingNew && (
          <Button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Thêm địa chỉ
          </Button>
        )}
      </div>

      {/* Saved Addresses List */}
      {savedAddresses.length > 0 && (
        <div className="space-y-3">
          {savedAddresses.map((address) => (
            <Card
              key={address.id}
              className={`cursor-pointer transition-all ${
                selectedAddressId === address.id
                  ? 'border-pink-500 ring-2 ring-pink-500'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => mode === 'checkout' && onSelect?.(address)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h4 className="font-medium">{address.name}</h4>
                      {address.isDefault && (
                        <span className="rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-700">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="mb-1 text-sm text-gray-600">
                      {address.phone}
                    </p>
                    <p className="text-sm text-gray-800">
                      {/* Render full address */}
                      {address.address.specificAddress}
                      {/* You would need to resolve the codes to names here */}
                    </p>
                  </div>

                  {mode === 'profile' && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(address);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(address.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Address Form */}
      {(isAddingNew ||
        (mode === 'checkout' && savedAddresses.length === 0)) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {editingId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
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
                value={formData.address}
                onChange={(address) =>
                  setFormData((prev) => ({ ...prev, address }))
                }
                required
              />

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {editingId ? 'Cập nhật' : 'Lưu địa chỉ'}
                </Button>

                {mode === 'profile' && (
                  <Button variant="outline" onClick={handleCancel}>
                    Hủy
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {savedAddresses.length === 0 && !isAddingNew && mode === 'profile' && (
        <Card className="py-8 text-center">
          <CardContent>
            <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Chưa có địa chỉ giao hàng
            </h3>
            <p className="mb-4 text-gray-500">
              Thêm địa chỉ giao hàng để đặt hàng nhanh chóng hơn
            </p>
            <Button onClick={() => setIsAddingNew(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm địa chỉ đầu tiên
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
