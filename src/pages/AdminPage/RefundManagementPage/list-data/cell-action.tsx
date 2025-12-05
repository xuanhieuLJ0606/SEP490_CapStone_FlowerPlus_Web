import { Button } from '@/components/ui/button';
import { useProcessRefund } from '@/queries/order.query';
import { EyeIcon, CheckCircle2, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import UploadImage from '@/components/shared/upload-image';

interface CellActionProps {
  data: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { mutateAsync: processRefund } = useProcessRefund();
  const [openView, setOpenView] = useState(false);
  const [openProcess, setOpenProcess] = useState(false);
  const [status, setStatus] = useState('COMPLETED');
  const [adminNote, setAdminNote] = useState('');
  const [proofImageUrl, setProofImageUrl] = useState('');

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminNote.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập ghi chú',
        variant: 'destructive'
      });
      return;
    }

    if (status === 'COMPLETED' && !proofImageUrl) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng upload ảnh minh chứng khi hoàn tiền',
        variant: 'destructive'
      });
      return;
    }

    const [err] = await processRefund({
      refundId: data.id,
      status,
      adminNote: adminNote.trim(),
      proofImageUrl: proofImageUrl || ''
    });

    if (err) {
      toast({
        title: 'Thất bại',
        description: err?.data?.message || 'Không thể xử lý yêu cầu hoàn tiền',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Thành công',
      description: 'Xử lý yêu cầu hoàn tiền thành công',
      variant: 'success'
    });

    setOpenProcess(false);
    setAdminNote('');
    setProofImageUrl('');
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
        <DialogContent className="max-h-[90vh] max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu hoàn tiền</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Mã đơn hàng:</span>
              <span>{data.orderCode}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Khách hàng:</span>
              <span>{data.userName}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Email:</span>
              <span>{data.userEmail}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Số tiền hoàn:</span>
              <span className="font-semibold text-green-600">
                {data.refundAmount.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                })}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Ngày yêu cầu:</span>
              <span>
                {format(new Date(data.requestedAt), 'dd/MM/yyyy HH:mm', {
                  locale: vi
                })}
              </span>
            </div>
            {data.reason && (
              <div>
                <span className="font-medium">Lý do hủy:</span>
                <p className="mt-1 text-sm text-gray-600">{data.reason}</p>
              </div>
            )}
            {data.adminNote && (
              <div>
                <span className="font-medium">Ghi chú admin:</span>
                <p className="mt-1 text-sm text-gray-600">{data.adminNote}</p>
              </div>
            )}
            {data.proofImageUrl && (
              <div>
                <span className="font-medium">Ảnh minh chứng:</span>
                <img
                  src={data.proofImageUrl}
                  alt="Minh chứng"
                  className="mt-2 max-w-full rounded-lg border"
                />
              </div>
            )}
            {data.processedAt && (
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Xử lý lúc:</span>
                <span>
                  {format(new Date(data.processedAt), 'dd/MM/yyyy HH:mm', {
                    locale: vi
                  })}
                </span>
              </div>
            )}
            {data.processedByName && (
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Xử lý bởi:</span>
                <span>{data.processedByName}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button size="sm" className="bg-gray-200 text-gray-700">
                Đóng
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Process button */}
      {data.status === 'PENDING' && (
        <Dialog open={openProcess} onOpenChange={setOpenProcess}>
          <Button
            className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
            size="sm"
            type="button"
            onClick={() => {
              setStatus('COMPLETED');
              setAdminNote('');
              setProofImageUrl('');
              setOpenProcess(true);
            }}
          >
            <CheckCircle2 className="size-4" />
            Xử lý
          </Button>
          <DialogContent className="max-h-[90vh] max-w-[600px] overflow-scroll">
            <DialogHeader>
              <DialogTitle>Xử lý yêu cầu hoàn tiền</DialogTitle>
              <DialogDescription>
                Đơn hàng #{data.orderCode} - Số tiền:{' '}
                {data.refundAmount.toLocaleString('vi-VN')}₫
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleProcess} className="space-y-4">
              <div>
                <Label>
                  Trạng thái <span className="text-red-500">*</span>
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPLETED">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Chấp nhận hoàn tiền
                      </div>
                    </SelectItem>
                    <SelectItem value="REJECTED">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        Từ chối hoàn tiền
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>
                  Ghi chú <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder={
                    status === 'COMPLETED'
                      ? 'VD: Đã hoàn tiền qua chuyển khoản ngân hàng'
                      : 'VD: Đơn hàng đã được xử lý, không thể hoàn tiền'
                  }
                  rows={3}
                  required
                />
              </div>

              {status === 'COMPLETED' && (
                <div>
                  <Label>
                    Ảnh minh chứng <span className="text-red-500">*</span>
                  </Label>
                  <UploadImage
                    onChange={(url) => {
                      if (typeof url === 'string') {
                        setProofImageUrl(url);
                      } else if (Array.isArray(url) && url.length > 0) {
                        setProofImageUrl(url[0]);
                      }
                    }}
                  />
                  {proofImageUrl && (
                    <div className="mt-2">
                      <img
                        src={proofImageUrl}
                        alt="Preview"
                        className="max-w-full rounded-lg border"
                      />
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Upload ảnh chuyển khoản hoặc biên lai hoàn tiền
                  </p>
                </div>
              )}

              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Hủy
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className={
                    status === 'COMPLETED'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }
                >
                  Xác nhận
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {data.status !== 'PENDING' && (
        <span className="text-sm text-gray-500">Đã xử lý</span>
      )}
    </div>
  );
};
