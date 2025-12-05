import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useCancelOrder } from '@/queries/order.query';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CancelOrderButtonProps {
  order: any;
}

export default function CancelOrderButton({ order }: CancelOrderButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const { mutateAsync: cancelOrder, isPending } = useCancelOrder();

  // Kiểm tra có thể hủy không
  const canCancel = () => {
    if (!order.deliveryStatuses || order.deliveryStatuses.length === 0) {
      return false;
    }

    // Lấy trạng thái hiện tại
    const currentStatus =
      order.deliveryStatuses[order.deliveryStatuses.length - 1]?.step;

    // Chỉ cho phép hủy khi đang PREPARING
    if (currentStatus !== 'PREPARING') {
      return false;
    }

    // Kiểm tra trong vòng 2 giờ
    const createdAt = new Date(order.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    return hoursDiff <= 2;
  };

  const handleCancel = async () => {
    if (!reason.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập lý do hủy đơn hàng',
        variant: 'destructive'
      });
      return;
    }

    const [err] = await cancelOrder({
      orderId: order.id,
      reason: reason.trim()
    });

    if (err) {
      toast({
        title: 'Thất bại',
        description:
          err?.data?.message || 'Không thể hủy đơn hàng. Vui lòng thử lại.',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Thành công',
      description:
        'Đơn hàng đã được hủy thành công. Yêu cầu hoàn tiền đang được xử lý.',
      variant: 'success'
    });

    setOpen(false);
    setReason('');
  };

  if (!canCancel()) {
    return null;
  }

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setOpen(true)}
        className="w-full sm:w-auto"
      >
        Hủy đơn hàng
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Hủy đơn hàng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đơn hàng #{order.orderCode}?
            </DialogDescription>
          </DialogHeader>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Sau khi hủy, yêu cầu hoàn tiền sẽ được gửi đến admin. Bạn có thể
              theo dõi trạng thái hoàn tiền trong trang cá nhân.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="reason">
              Lý do hủy <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Vui lòng nhập lý do hủy đơn hàng..."
              rows={4}
              disabled={isPending}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Đóng
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={isPending}
            >
              {isPending ? 'Đang xử lý...' : 'Xác nhận hủy'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
