import { Button } from '@/components/ui/button';
import { useUpdateVoucher, useDeleteVoucher } from '@/queries/voucher.query';
import { useGetListProductByPaging } from '@/queries/product.query';
import { TYPE_PRODUCT } from '@/pages/AdminPage/ProductsPage/list/overview';
import { PencilIcon, Trash2Icon, EyeIcon, Package } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface CellActionProps {
  data: any;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { mutateAsync: updateVoucher } = useUpdateVoucher();
  const { mutateAsync: deleteVoucher } = useDeleteVoucher();

  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const { data: productsRes } = useGetListProductByPaging(
    1,
    1000,
    '',
    TYPE_PRODUCT.PRODUCT
  );

  // Get products that are in the voucher's productIds
  const applicableProducts = useMemo(() => {
    if (!data.productIds || data.productIds.length === 0) return [];
    if (!productsRes?.listObjects) return [];

    return productsRes.listObjects.filter((product: any) =>
      data.productIds?.includes(product.id)
    );
  }, [data.productIds, productsRes]);

  // Form states
  const [code, setCode] = useState(data.code);
  const [type, setType] = useState(data.type);
  const [percent, setPercent] = useState(data.percent || 0);
  const [amount, setAmount] = useState(data.amount || 0);
  const [minOrderValue, setMinOrderValue] = useState(data.minOrderValue || 0);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(
    data.maxDiscountAmount || 0
  );
  const [startsAt, setStartsAt] = useState<Date | undefined>(
    data.startsAt ? new Date(data.startsAt) : undefined
  );
  const [endsAt, setEndsAt] = useState<Date | undefined>(
    data.endsAt ? new Date(data.endsAt) : undefined
  );
  const [usageLimit, setUsageLimit] = useState(data.usageLimit || 100);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập mã voucher',
        variant: 'destructive'
      });
      return;
    }
    if (code.length < 3 || code.length > 64) {
      toast({
        title: 'Lỗi',
        description: 'Mã voucher phải từ 3-64 ký tự',
        variant: 'destructive'
      });
      return;
    }
    if (type === 'PERCENTAGE' && (percent <= 0 || percent > 1)) {
      toast({
        title: 'Lỗi',
        description: 'Phần trăm giảm phải từ 0 đến 1',
        variant: 'destructive'
      });
      return;
    }
    if (type === 'FIXED' && amount <= 0) {
      toast({
        title: 'Lỗi',
        description: 'Số tiền giảm phải lớn hơn 0',
        variant: 'destructive'
      });
      return;
    }
    if (minOrderValue < 0) {
      toast({
        title: 'Lỗi',
        description: 'Giá trị đơn hàng tối thiểu không được âm',
        variant: 'destructive'
      });
      return;
    }
    if (usageLimit <= 0) {
      toast({
        title: 'Lỗi',
        description: 'Giới hạn sử dụng phải lớn hơn 0',
        variant: 'destructive'
      });
      return;
    }
    if (!startsAt || !endsAt) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn ngày bắt đầu và kết thúc',
        variant: 'destructive'
      });
      return;
    }
    if (endsAt <= startsAt) {
      toast({
        title: 'Lỗi',
        description: 'Ngày kết thúc phải sau ngày bắt đầu',
        variant: 'destructive'
      });
      return;
    }

    const payload = {
      code,
      type,
      percent: type === 'PERCENTAGE' ? percent : 0,
      amount: type === 'FIXED' ? amount : 0,
      minOrderValue,
      maxDiscountAmount: type === 'PERCENTAGE' ? maxDiscountAmount : 0,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      usageLimit,
      applyAllProducts: data.applyAllProducts,
      productIds: data.productIds || []
    };

    const [err] = await updateVoucher({ id: data.id, payload });

    if (err) {
      toast({
        title: 'Thất bại',
        description: err?.data?.message || 'Không thể cập nhật voucher',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Thành công',
      description: 'Cập nhật voucher thành công',
      variant: 'success'
    });
    setOpenEdit(false);
  };

  const handleDelete = async () => {
    const [err] = await deleteVoucher(data.id);

    if (err) {
      toast({
        title: 'Thất bại',
        description: err?.data?.message || 'Không thể xóa voucher',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Thành công',
      description: 'Xóa voucher thành công',
      variant: 'success'
    });
    setOpenDelete(false);
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
            <DialogTitle>Chi tiết voucher</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Mã voucher:</span>
              <span className="font-semibold text-rose-600">{data.code}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Loại:</span>
              <span>
                {data.type === 'FIXED' ? 'Giảm cố định' : 'Giảm theo %'}
              </span>
            </div>
            {data.type === 'PERCENTAGE' && (
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Phần trăm giảm:</span>
                <span>{(data.percent * 100).toFixed(0)}%</span>
              </div>
            )}
            {data.type === 'FIXED' && (
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Số tiền giảm:</span>
                <span>{data.amount?.toLocaleString('vi-VN')}₫</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Đơn tối thiểu:</span>
              <span>{data.minOrderValue?.toLocaleString('vi-VN')}₫</span>
            </div>
            {data.type === 'PERCENTAGE' && data.maxDiscountAmount > 0 && (
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">Giảm tối đa:</span>
                <span>{data.maxDiscountAmount?.toLocaleString('vi-VN')}₫</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Thời gian:</span>
              <span>
                {data.startsAt &&
                  format(new Date(data.startsAt), 'dd/MM/yyyy', { locale: vi })}
                {' - '}
                {data.endsAt &&
                  format(new Date(data.endsAt), 'dd/MM/yyyy', { locale: vi })}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Sử dụng:</span>
              <span>
                {data.usedCount || 0} / {data.usageLimit || '∞'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Áp dụng:</span>
              <div>
                {data.applyAllProducts ? (
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    Tất cả sản phẩm
                  </Badge>
                ) : (
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                    Giới hạn sản phẩm ({data.productIds?.length || 0} sản phẩm)
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Product List Section */}
          {!data.applyAllProducts &&
            data.productIds &&
            data.productIds.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <div className="mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Danh sách sản phẩm áp dụng</h3>
                  <Badge variant="secondary" className="ml-2">
                    {data.productIds.length} sản phẩm
                  </Badge>
                </div>
                {applicableProducts.length > 0 ? (
                  <div className="max-h-64 space-y-2 overflow-y-auto">
                    {applicableProducts.map((product: any) => {
                      const parseImages = (images: string) => {
                        try {
                          const parsed = JSON.parse(images);
                          return Array.isArray(parsed) && parsed.length > 0
                            ? parsed[0]
                            : null;
                        } catch {
                          return null;
                        }
                      };
                      const firstImage = parseImages(product.images);

                      return (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 rounded-lg border p-3"
                        >
                          {firstImage ? (
                            <img
                              src={firstImage}
                              alt={product.name}
                              className="h-12 w-12 rounded-md border object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-muted">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.categories?.[0]?.name ||
                                'Chưa phân loại'}
                            </p>
                          </div>
                          {product.isActive ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              Đang bán
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                              Tạm dừng
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                    Đang tải thông tin sản phẩm...
                  </div>
                )}
              </div>
            )}

          <DialogFooter>
            <DialogClose asChild>
              <Button size="sm" className="bg-gray-200 text-gray-700">
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
            setCode(data.code);
            setType(data.type);
            setPercent(data.percent || 0);
            setAmount(data.amount || 0);
            setMinOrderValue(data.minOrderValue || 0);
            setMaxDiscountAmount(data.maxDiscountAmount || 0);
            setStartsAt(data.startsAt ? new Date(data.startsAt) : undefined);
            setEndsAt(data.endsAt ? new Date(data.endsAt) : undefined);
            setUsageLimit(data.usageLimit || 100);
            setOpenEdit(true);
          }}
        >
          <PencilIcon className="size-4" />
        </Button>
        <DialogContent className="max-h-[80vh] max-w-[600px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa voucher</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label>Mã voucher</Label>
              <Input
                disabled
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Loại voucher</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIXED">Giảm cố định</SelectItem>
                  <SelectItem value="PERCENTAGE">Giảm theo %</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {type === 'PERCENTAGE' ? (
              <div>
                <Label>Phần trăm giảm (0-1)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={percent}
                  onChange={(e) => setPercent(parseFloat(e.target.value))}
                  required
                />
              </div>
            ) : (
              <div>
                <Label>Số tiền giảm</Label>
                <Input
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  required
                />
              </div>
            )}

            <div>
              <Label>Giá trị đơn tối thiểu</Label>
              <Input
                type="number"
                min="0"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(parseFloat(e.target.value))}
                required
              />
            </div>

            {type === 'PERCENTAGE' && (
              <div>
                <Label>Giảm tối đa</Label>
                <Input
                  type="number"
                  min="0"
                  value={maxDiscountAmount}
                  onChange={(e) =>
                    setMaxDiscountAmount(parseFloat(e.target.value))
                  }
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ngày bắt đầu</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {startsAt
                        ? format(startsAt, 'dd/MM/yyyy', { locale: vi })
                        : 'Chọn ngày'}
                      <CalendarIcon className="ml-auto h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startsAt}
                      onSelect={setStartsAt}
                      locale={vi}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Ngày kết thúc</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {endsAt
                        ? format(endsAt, 'dd/MM/yyyy', { locale: vi })
                        : 'Chọn ngày'}
                      <CalendarIcon className="ml-auto h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endsAt}
                      onSelect={setEndsAt}
                      locale={vi}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label>Giới hạn sử dụng</Label>
              <Input
                type="number"
                min="1"
                value={usageLimit}
                onChange={(e) => setUsageLimit(parseInt(e.target.value))}
                required
              />
            </div>

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Hủy
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-blue-600 text-white">
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete button */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <Button
          className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600"
          size="icon"
          type="button"
          onClick={() => setOpenDelete(true)}
        >
          <Trash2Icon className="size-4" />
        </Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa voucher</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa voucher <strong>{data.code}</strong>?
              <br />
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
