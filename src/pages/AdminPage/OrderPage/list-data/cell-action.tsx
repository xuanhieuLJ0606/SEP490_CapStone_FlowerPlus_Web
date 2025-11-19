import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import {
  useAddTransactionToOrder,
  useUpdateDeliveryStatus
} from '@/queries/order.query';
import { useGetProductByIdMutation } from '@/queries/product.query';
import { Edit, PackageCheck } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { ProductDetailDialog } from './ProductDetailDialog';
import UploadImage from '@/components/shared/upload-image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface CellActionProps {
  data: any;
}

const deliveryStepMap: Record<string, string> = {
  PENDING_CONFIRMATION: 'Chờ xác nhận',
  PREPARING: 'Đang chuẩn bị',
  DELIVERING: 'Đang giao',
  DELIVERED: 'Giao thành công',
  DELIVERY_FAILED: 'Giao thất bại'
};

// Các bước được phép chuyển tiếp từ mỗi trạng thái hiện tại
const deliveryStepTransitions: Record<string, string[]> = {
  PENDING_CONFIRMATION: [
    'PREPARING',
    'DELIVERING',
    'DELIVERED',
    'DELIVERY_FAILED'
  ],
  PREPARING: ['DELIVERING', 'DELIVERED', 'DELIVERY_FAILED'],
  DELIVERING: ['DELIVERED', 'DELIVERY_FAILED'],
  DELIVERED: [], // đã giao thành công => không cho cập nhật nữa
  DELIVERY_FAILED: [] // thất bại => tuỳ logic, tạm không cho cập nhật nữa
};

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openDeliveryDialog, setOpenDeliveryDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [finalAmount, setFinalAmount] = useState<string>('');

  // Delivery status update states
  const [deliveryStep, setDeliveryStep] = useState<string>('');
  const [deliveryNote, setDeliveryNote] = useState<string>('');
  const [deliveryLocation, setDeliveryLocation] = useState<string>('');
  const [deliveryImageUrl, setDeliveryImageUrl] = useState<string>('');

  const { mutateAsync: addTransactionToOrder, isPending } =
    useAddTransactionToOrder();
  const {
    mutateAsync: updateDeliveryStatus,
    isPending: isUpdatingDeliveryStatus
  } = useUpdateDeliveryStatus();
  const { mutateAsync: getProductById } = useGetProductByIdMutation();

  const handleGetProductById = async (id: number) => {
    const res = await getProductById(id);
    setSelectedProduct(res);
    setOpenProductDialog(true);
  };

  const handleConfirmOrder = async () => {
    if (!finalAmount || parseFloat(finalAmount) <= 0) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập số tiền hợp lệ',
        variant: 'destructive'
      });
      return;
    }

    try {
      const [err] = await addTransactionToOrder({
        orderId: data.id,
        amount: parseFloat(finalAmount)
      });
      if (err) {
        toast({
          title: 'Lỗi',
          description: err.message || 'Có lỗi xảy ra khi chốt đơn',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Thành công',
        description: 'Đã tạo đơn thanh toán thành công'
      });

      setOpenDialog(false);
      setFinalAmount('');
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi chốt đơn',
        variant: 'destructive'
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleDeliveryImageChange = useCallback((urls: string | string[]) => {
    const imageUrl = typeof urls === 'string' ? urls : urls[0] || '';
    setDeliveryImageUrl(imageUrl);
  }, []);

  // ========= LOGIC TÍNH STEP HIỆN TẠI & CÁC STEP HỢP LỆ =========
  const deliveryStatuses = data.deliveryStatuses || [];

  // Lấy step hiện tại = bản ghi có eventAt mới nhất
  const currentDeliveryStep: string | null = React.useMemo(() => {
    if (!deliveryStatuses.length) return null;

    const latest = deliveryStatuses.reduce((prev: any, curr: any) => {
      return new Date(prev.eventAt) > new Date(curr.eventAt) ? prev : curr;
    });

    return latest.step as string;
  }, [deliveryStatuses]);

  // Những step được phép chọn tiếp theo
  const allowedNextSteps: string[] = React.useMemo(() => {
    if (!currentDeliveryStep) {
      // Nếu chưa có status nào, tuỳ bạn: cho phép tất cả
      return Object.keys(deliveryStepMap);
    }
    return deliveryStepTransitions[currentDeliveryStep] || [];
  }, [currentDeliveryStep]);

  const handleUpdateDeliveryStatus = async () => {
    if (!deliveryStep) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn trạng thái giao hàng',
        variant: 'destructive'
      });
      return;
    }

    // Nếu user cố tình hack chọn step không hợp lệ (ví dụ qua devtool)
    if (currentDeliveryStep && !allowedNextSteps.includes(deliveryStep)) {
      toast({
        title: 'Lỗi',
        description:
          'Trạng thái này không hợp lệ với trạng thái hiện tại của đơn hàng',
        variant: 'destructive'
      });
      return;
    }

    try {
      const payload = {
        step: deliveryStep,
        note: deliveryNote,
        location: deliveryLocation,
        imageUrl: deliveryImageUrl,
        order_id: data.id
      };

      const [err] = await updateDeliveryStatus({
        orderId: data.id,
        ...payload
      });

      if (err) {
        toast({
          title: 'Lỗi',
          description: err.message || 'Có lỗi xảy ra khi cập nhật trạng thái',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật trạng thái giao hàng thành công'
      });

      setOpenDeliveryDialog(false);
      // Reset form
      setDeliveryStep('');
      setDeliveryNote('');
      setDeliveryLocation('');
      setDeliveryImageUrl('');
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi cập nhật trạng thái',
        variant: 'destructive'
      });
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
          size="icon"
          type="button"
          disabled={data.transaction == null}
          onClick={() => setOpenDeliveryDialog(true)}
        >
          <Edit className="size-4" />
        </Button>
        <Button
          className="flex items-center gap-2 bg-orange-500 text-white hover:bg-orange-600"
          size="icon"
          type="button"
          disabled={data.transaction != null}
          onClick={() => setOpenDialog(true)}
        >
          <PackageCheck className="size-4" />
        </Button>
      </div>

      {/* Dialog chốt đơn / tạo transaction */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-rose-700">
              Chốt đơn hàng #{data.orderCode}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Thông tin khách hàng */}
            <div className="space-y-2 rounded-lg border-2 border-rose-100 bg-rose-50/30 p-4">
              <h3 className="mb-3 text-lg font-semibold text-rose-700">
                Thông tin khách hàng
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Tên:</span>
                  <span className="ml-2 font-medium">
                    {data.user.firstName} {data.user.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium">{data.user.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">SĐT:</span>
                  <span className="ml-2 font-medium">
                    {data.user.deliveryAddresses[0]?.phoneNumber || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Địa chỉ giao hàng */}
            <div className="space-y-2 rounded-lg border-2 border-rose-100 bg-rose-50/30 p-4">
              <h3 className="mb-3 text-lg font-semibold text-rose-700">
                Địa chỉ giao hàng
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-gray-600">Người nhận:</span>
                  <span className="ml-2 font-medium">
                    {data.user.deliveryAddresses[0]?.recipientName}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">Địa chỉ:</span>
                  <span className="ml-2 font-medium">
                    {data.user.deliveryAddresses[0]?.address}
                  </span>
                </p>
              </div>
            </div>

            {/* Sản phẩm */}
            <div className="space-y-3 rounded-lg border-2 border-rose-100 bg-rose-50/30 p-4">
              <h3 className="mb-3 text-lg font-semibold text-rose-700">
                Sản phẩm
              </h3>
              {data.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-lg border border-rose-200 bg-white p-3 last:border-b-0"
                >
                  <img
                    src={JSON.parse(item.productImage)[0]}
                    alt={item.productName}
                    className="h-16 w-16 rounded border border-rose-100 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                  <Button
                    className="bg-rose-500 text-white hover:bg-rose-600"
                    onClick={() => handleGetProductById(item.productId)}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              ))}
            </div>

            {/* Trạng thái giao hàng hiện tại */}
            <div className="space-y-2 rounded-lg border-2 border-rose-100 bg-rose-50/30 p-4">
              <h3 className="mb-3 text-lg font-semibold text-rose-700">
                Trạng thái
              </h3>
              <div className="text-sm">
                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                  {currentDeliveryStep
                    ? deliveryStepMap[currentDeliveryStep] ||
                      currentDeliveryStep
                    : 'Chưa có trạng thái'}
                </span>
              </div>
            </div>

            {/* Nhập số tiền cuối */}
            <div className="space-y-3 rounded-lg border-2 border-rose-200 bg-rose-100/50 p-4">
              <Label
                htmlFor="finalAmount"
                className="text-base font-semibold text-rose-700"
              >
                Số tiền thanh toán cuối cùng{' '}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="finalAmount"
                type="number"
                placeholder="Nhập số tiền (VNĐ)"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                className="border-rose-300 text-lg focus-visible:ring-rose-500"
                min="0.1"
                step="0.01"
              />
              {finalAmount && parseFloat(finalAmount) > 0 && (
                <p className="text-sm text-gray-600">
                  Số tiền:{' '}
                  <span className="font-semibold text-rose-600">
                    {formatCurrency(parseFloat(finalAmount))}
                  </span>
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Hủy
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleConfirmOrder}
              disabled={
                isPending || !finalAmount || parseFloat(finalAmount) <= 0
              }
              className="bg-rose-500 text-white hover:bg-rose-600"
            >
              {isPending ? 'Đang xử lý...' : 'Xác nhận chốt đơn'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Detail Dialog */}
      <ProductDetailDialog
        open={openProductDialog}
        onOpenChange={setOpenProductDialog}
        product={selectedProduct}
      />

      {/* Update Delivery Status Dialog */}
      <Dialog open={openDeliveryDialog} onOpenChange={setOpenDeliveryDialog}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-green-700">
              Cập nhật trạng thái giao hàng #{data.orderCode}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Trạng thái giao hàng */}
            <div className="space-y-2">
              <Label htmlFor="deliveryStep" className="text-base font-semibold">
                Trạng thái giao hàng <span className="text-red-500">*</span>
              </Label>
              <Select
                value={deliveryStep}
                onValueChange={setDeliveryStep}
                disabled={allowedNextSteps.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      allowedNextSteps.length === 0
                        ? 'Không thể cập nhật thêm trạng thái'
                        : 'Chọn trạng thái'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {allowedNextSteps.length === 0 ? (
                    <SelectItem value="__DISABLED__" disabled>
                      Không thể cập nhật thêm trạng thái
                    </SelectItem>
                  ) : (
                    allowedNextSteps.map((key) => (
                      <SelectItem key={key} value={key}>
                        {deliveryStepMap[key]}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {currentDeliveryStep && (
                <p className="text-xs text-gray-500">
                  Trạng thái hiện tại:{' '}
                  <span className="font-medium">
                    {deliveryStepMap[currentDeliveryStep] ||
                      currentDeliveryStep}
                  </span>
                </p>
              )}
            </div>

            {/* Ghi chú */}
            <div className="space-y-2">
              <Label htmlFor="deliveryNote" className="text-base font-semibold">
                Ghi chú
              </Label>
              <Textarea
                id="deliveryNote"
                placeholder="Nhập ghi chú..."
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                rows={3}
              />
            </div>

            {/* Địa điểm */}
            <div className="space-y-2">
              <Label
                htmlFor="deliveryLocation"
                className="text-base font-semibold"
              >
                Địa điểm
              </Label>
              <Input
                id="deliveryLocation"
                placeholder="Nhập địa điểm..."
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
              />
            </div>

            {/* Upload ảnh */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Hình ảnh</Label>
              <UploadImage
                multiple={false}
                maxFiles={1}
                onChange={handleDeliveryImageChange}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Hủy
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleUpdateDeliveryStatus}
              disabled={
                isUpdatingDeliveryStatus ||
                !deliveryStep ||
                allowedNextSteps.length === 0
              }
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isUpdatingDeliveryStatus
                ? 'Đang cập nhật...'
                : 'Cập nhật trạng thái'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
