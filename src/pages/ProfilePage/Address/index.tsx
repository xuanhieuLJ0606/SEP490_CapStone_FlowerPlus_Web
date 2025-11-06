import { RootState } from '@/redux/store';
import { Button } from '@/components/ui/button';
import {
  Plus,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  Edit,
  Trash2,
  Star
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useCreateUpdateAddress } from '@/queries/auth.query';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface DeliveryAddress {
  id: number | null;
  address: string;
  recipientName: string;
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  userId: number;
  default: boolean;
}

export default function Address() {
  const { infoUser } = useSelector((state: RootState) => state.auth);
  const { mutateAsync: createUpdateAddress } = useCreateUpdateAddress();
  const deliveryAddresses = infoUser?.deliveryAddresses || [];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(
    null
  );
  const [formData, setFormData] = useState<DeliveryAddress>({
    id: null,
    address: '',
    recipientName: '',
    phoneNumber: '',
    province: '',
    district: '',
    ward: '',
    userId: infoUser?.id || 0,
    default: false
  });

  const handleOpenDialog = (address?: DeliveryAddress) => {
    if (address) {
      setFormData(address);
      setEditingAddress(address);
    } else {
      setFormData({
        id: null,
        address: '',
        recipientName: '',
        phoneNumber: '',
        province: '',
        district: '',
        ward: '',
        userId: infoUser?.id || 0,
        default: deliveryAddresses.length === 0
      });
      setEditingAddress(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUpdateAddress(formData);
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleSetDefault = async (address: any) => {
    try {
      await createUpdateAddress({
        ...address,
        default: true
      });
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleInputChange = (field: keyof DeliveryAddress, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Địa chỉ giao hàng
          </h2>
          <p className="mt-1 text-gray-500">
            Quản lý địa chỉ nhận hàng của bạn
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-rose-500 text-white shadow-lg hover:bg-rose-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm địa chỉ
        </Button>
      </div>

      {/* Address List */}
      {deliveryAddresses.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-rose-200 bg-rose-50 py-16 text-center">
          <MapPin className="mx-auto mb-4 h-16 w-16 text-rose-300" />
          <h3 className="mb-2 text-xl font-semibold text-gray-700">
            Chưa có địa chỉ giao hàng
          </h3>
          <p className="mb-6 text-gray-500">
            Thêm địa chỉ để nhận hoa tươi đẹp đến tận nhà bạn
          </p>
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-rose-500 text-white hover:bg-rose-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm địa chỉ đầu tiên
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {deliveryAddresses.map((address: any) => (
            <div
              key={address.id}
              className={`relative rounded-xl border-2 bg-white p-6 transition-all hover:shadow-lg ${
                address.default
                  ? 'border-rose-300 shadow-md'
                  : 'border-gray-200 hover:border-rose-200'
              }`}
            >
              {/* Default Badge */}
              {address.default && (
                <div className="absolute right-4 top-4">
                  <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Mặc định
                  </span>
                </div>
              )}

              <div className="space-y-3">
                {/* Recipient Name */}
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-500" />
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {address.recipientName}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 flex-shrink-0 text-rose-500" />
                  <p className="text-gray-600">{address.phoneNumber}</p>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-500" />
                  <div className="flex-1">
                    <p className="text-gray-700">{address.address}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {[address.ward, address.district, address.province]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenDialog(address)}
                  className="border-rose-200 text-rose-600 hover:border-rose-300 hover:bg-rose-50"
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Chỉnh sửa
                </Button>

                {!address.default && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address)}
                      className="border-rose-200 text-rose-600 hover:border-rose-300 hover:bg-rose-50"
                    >
                      <Star className="mr-1 h-4 w-4" />
                      Đặt làm mặc định
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Xóa
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Điền đầy đủ thông tin để nhận hoa tươi đẹp
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-4 space-y-5">
            {/* Recipient Name */}
            <div className="space-y-2">
              <Label
                htmlFor="recipientName"
                className="font-medium text-gray-700"
              >
                Họ và tên người nhận <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) =>
                  handleInputChange('recipientName', e.target.value)
                }
                placeholder="Ví dụ: Nguyễn Văn A"
                required
                className="border-gray-300 focus:border-rose-500 focus:ring-rose-500"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label
                htmlFor="phoneNumber"
                className="font-medium text-gray-700"
              >
                Số điện thoại <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange('phoneNumber', e.target.value)
                }
                placeholder="Ví dụ: 0912345678"
                required
                className="border-gray-300 focus:border-rose-500 focus:ring-rose-500"
              />
            </div>

            {/* Province, District, Ward */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="province" className="font-medium text-gray-700">
                  Tỉnh/Thành
                </Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) =>
                    handleInputChange('province', e.target.value)
                  }
                  placeholder="TP. HCM"
                  className="border-gray-300 focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district" className="font-medium text-gray-700">
                  Quận/Huyện
                </Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) =>
                    handleInputChange('district', e.target.value)
                  }
                  placeholder="Gò Vấp"
                  className="border-gray-300 focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward" className="font-medium text-gray-700">
                  Phường/Xã
                </Label>
                <Input
                  id="ward"
                  value={formData.ward}
                  onChange={(e) => handleInputChange('ward', e.target.value)}
                  placeholder="Phường 1"
                  className="border-gray-300 focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="font-medium text-gray-700">
                Địa chỉ chi tiết <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Số nhà, tên đường..."
                required
                className="border-gray-300 focus:border-rose-500 focus:ring-rose-500"
              />
            </div>

            {/* Default Checkbox */}
            <div className="flex items-center space-x-2 rounded-lg bg-rose-50 p-4">
              <Checkbox
                id="default"
                checked={formData.default}
                onCheckedChange={(checked) =>
                  handleInputChange('default', checked)
                }
                className="border-rose-300 data-[state=checked]:bg-rose-500"
              />
              <Label
                htmlFor="default"
                className="cursor-pointer text-sm font-medium text-gray-700"
              >
                Đặt làm địa chỉ mặc định
              </Label>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                className="border-gray-300"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-rose-500 text-white hover:bg-rose-600"
              >
                {editingAddress ? 'Cập nhật' : 'Thêm địa chỉ'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
