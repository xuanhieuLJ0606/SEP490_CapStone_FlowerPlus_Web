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
import { useAddTransactionToOrder } from '@/queries/order.query';
import { useGetProductByIdMutation } from '@/queries/product.query';
import { PackageCheck, Trash2Icon } from 'lucide-react';
import React, { useState } from 'react';
import { ProductDetailDialog } from './ProductDetailDialog';

interface CellActionProps {
  data: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [finalAmount, setFinalAmount] = useState<string>('');
  const { mutateAsync: addTransactionToOrder, isPending } =
    useAddTransactionToOrder();
  const { mutateAsync: getProductById } = useGetProductByIdMutation();

  const handleGetProductById = async (id: number) => {
    const res = await getProductById(id);
    console.log('data', res);

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
      await addTransactionToOrder({
        amount: parseFloat(finalAmount)
      });

      toast({
        title: 'Thành công',
        description: 'Đã chốt đơn hàng thành công'
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

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          className="flex items-center gap-2 bg-rose-500 text-white hover:bg-rose-600"
          size="icon"
          type="button"
          onClick={() => setOpenDialog(true)}
        >
          <PackageCheck className="size-4" />
        </Button>

        <Button
          className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600"
          size="icon"
          type="button"
        >
          <Trash2Icon className="size-4" />
        </Button>
      </div>

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
              {data.items.map((item: any, index: number) => (
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

            {/* Trạng thái giao hàng */}
            <div className="space-y-2 rounded-lg border-2 border-rose-100 bg-rose-50/30 p-4">
              <h3 className="mb-3 text-lg font-semibold text-rose-700">
                Trạng thái
              </h3>
              <div className="text-sm">
                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                  {data.deliveryStatuses[0]?.step === 'PENDING_CONFIRMATION'
                    ? 'Chờ xác nhận'
                    : data.deliveryStatuses[0]?.step}
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
    </>
  );
};