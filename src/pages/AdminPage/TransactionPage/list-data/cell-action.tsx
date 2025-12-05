import { Button } from '@/components/ui/button';
import { useUpdateTransactionStatus } from '@/queries/transaction.query';
import { PencilIcon, EyeIcon } from 'lucide-react';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

interface CellActionProps {
  data: any;
}

const statusMap: Record<string, string> = {
  PENDING: 'Chờ thanh toán',
  SUCCESS: 'Thành công',
  FAILED: 'Thất bại',
  CANCELED: 'Đã hủy',
  EXPIRED: 'Hết hạn'
};

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { mutateAsync: updateStatus } = useUpdateTransactionStatus();
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [editStatus, setEditStatus] = useState(data.status);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [err] = await updateStatus({
      transactionId: data.id,
      status: editStatus
    });

    if (err) {
      toast({
        title: 'Thất bại',
        description: err?.data?.message || 'Không thể cập nhật trạng thái',
        variant: 'destructive'
      });
      return;
    }
    toast({
      title: 'Thành công',
      description: 'Cập nhật trạng thái giao dịch thành công',
      variant: 'success'
    });
    setOpenEdit(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* View button */}
      <Dialog open={openView} onOpenChange={setOpenView}>
        <Button
          className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
          size="icon"
          type="button"
          onClick={() => setOpenView(true)}
        >
          <EyeIcon className="size-4" />
        </Button>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết giao dịch</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Mã đơn hàng:</span>
              <span>{data.orderCode}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Khách hàng:</span>
              <span>{data.userName || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Email:</span>
              <span>{data.userEmail || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">SĐT:</span>
              <span>{data.userPhone || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Số tiền:</span>
              <span className="font-semibold text-green-600">
                {(data.amount ?? 0).toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                })}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Trạng thái:</span>
              <span>{statusMap[data.status] || data.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Địa chỉ giao hàng:</span>
              <span>{data.shippingAddress || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">SĐT nhận hàng:</span>
              <span>{data.phoneNumber || 'N/A'}</span>
            </div>
            {data.note && (
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Ghi chú:</span>
                <span>{data.note}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                size="sm"
                className="mt-2 bg-gray-200 text-gray-700"
                type="button"
              >
                Đóng
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit button */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <Button
          className="flex items-center gap-2 bg-orange-600 text-white hover:bg-orange-700"
          size="icon"
          type="button"
          onClick={() => {
            setEditStatus(data.status);
            setOpenEdit(true);
          }}
        >
          <PencilIcon className="size-4" />
        </Button>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái giao dịch</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block font-medium">
                Mã đơn hàng
                <input
                  type="text"
                  className="mt-1 w-full rounded border bg-gray-100 px-2 py-1"
                  value={data.orderCode}
                  disabled
                />
              </label>
            </div>
            <div>
              <label className="mb-1 block font-medium">
                Trạng thái
                <select
                  className="mt-1 w-full rounded border px-2 py-1"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  required
                >
                  <option value="PENDING">Chờ thanh toán</option>
                  <option value="SUCCESS">Thành công</option>
                  <option value="FAILED">Thất bại</option>
                  <option value="CANCELED">Đã hủy</option>
                  <option value="EXPIRED">Hết hạn</option>
                </select>
              </label>
            </div>
            <DialogFooter className="mt-2 gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  size="sm"
                  className="bg-gray-200 text-gray-700"
                  onClick={() => setOpenEdit(false)}
                >
                  Hủy
                </Button>
              </DialogClose>
              <Button
                type="submit"
                size="sm"
                className="bg-blue-600 text-white"
              >
                Lưu
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
