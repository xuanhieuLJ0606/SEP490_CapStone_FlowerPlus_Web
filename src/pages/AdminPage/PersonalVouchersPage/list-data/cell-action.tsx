import { AlertModal } from '@/components/shared/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { PersonalVoucher } from './columns';
import { MoreHorizontal, Trash, Pencil, Eye, Package } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useDeletePersonalVoucher } from '@/queries/personal-voucher.query';
import { useGetListProductByPaging } from '@/queries/product.query';
import { TYPE_PRODUCT } from '@/pages/AdminPage/ProductsPage/list/overview';
import { toast } from 'sonner';
import UpdatePersonalVoucher from '../components/update/index';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface CellActionProps {
  data: PersonalVoucher;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);

  const deletePersonalVoucher = useDeletePersonalVoucher();
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

  const onConfirm = async () => {
    try {
      setLoading(true);
      await deletePersonalVoucher.mutateAsync(data.userVoucherId);
      toast.success('Voucher cá nhân đã được vô hiệu hóa');
      setOpenDelete(false);
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi xảy ra khi vô hiệu hóa voucher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onConfirm}
        loading={loading}
        title="Vô hiệu hóa voucher cá nhân"
        description="Bạn có chắc chắn muốn vô hiệu hóa voucher này? Hành động này không thể hoàn tác."
      />

      <UpdatePersonalVoucher
        voucher={data}
        open={openEdit}
        onOpenChange={setOpenEdit}
      />

      <Dialog open={openView} onOpenChange={setOpenView}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chi tiết Voucher Cá Nhân</DialogTitle>
            <DialogDescription>Thông tin chi tiết về voucher</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Mã voucher
                </p>
                <p className="font-mono font-semibold">{data.code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Trạng thái
                </p>
                <div className="mt-1">
                  {data.isUsed ? (
                    <Badge variant="secondary">Đã sử dụng</Badge>
                  ) : data.isExpired ? (
                    <Badge variant="destructive">Hết hạn</Badge>
                  ) : data.isActive ? (
                    <Badge className="bg-green-500">Hoạt động</Badge>
                  ) : (
                    <Badge variant="outline">Chưa kích hoạt</Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Người dùng
                </p>
                <p className="font-medium">{data.userName}</p>
                <p className="text-sm text-muted-foreground">
                  {data.userEmail}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Loại voucher
                </p>
                <p>
                  {data.type === 'PERCENTAGE'
                    ? `Giảm ${data.percent}%`
                    : `Giảm ${data.amount?.toLocaleString('vi-VN')}đ`}
                </p>
              </div>
              {data.minOrderValue && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Đơn tối thiểu
                  </p>
                  <p>{data.minOrderValue.toLocaleString('vi-VN')}đ</p>
                </div>
              )}
              {data.type === 'PERCENTAGE' && data.maxDiscountAmount && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Giảm tối đa
                  </p>
                  <p>{data.maxDiscountAmount.toLocaleString('vi-VN')}đ</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ngày bắt đầu
                </p>
                <p>
                  {data.startsAt
                    ? format(new Date(data.startsAt), 'dd/MM/yyyy HH:mm', {
                        locale: vi
                      })
                    : 'Không giới hạn'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ngày kết thúc
                </p>
                <p>
                  {data.endsAt
                    ? format(new Date(data.endsAt), 'dd/MM/yyyy HH:mm', {
                        locale: vi
                      })
                    : 'Không giới hạn'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Giới hạn sử dụng
                </p>
                <p>
                  {data.usageLimit
                    ? `${data.usedCount}/${data.usageLimit}`
                    : 'Không giới hạn'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Áp dụng
                </p>
                <div className="mt-1">
                  {data.applyAllProducts ? (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                      Tất cả sản phẩm
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                      Giới hạn sản phẩm ({data.productIds?.length || 0} sản
                      phẩm)
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ngày tạo
                </p>
                <p>
                  {format(new Date(data.assignedAt), 'dd/MM/yyyy HH:mm', {
                    locale: vi
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tạo bởi
                </p>
                <p>{data.createdBy}</p>
              </div>
              {data.isUsed && data.usedAt && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Ngày sử dụng
                  </p>
                  <p>
                    {format(new Date(data.usedAt), 'dd/MM/yyyy HH:mm', {
                      locale: vi
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Product List Section */}
            {!data.applyAllProducts &&
              data.productIds &&
              data.productIds.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">
                      Danh sách sản phẩm áp dụng
                    </h3>
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
          </div>
        </DialogContent>
      </Dialog>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setOpenView(true)}>
            <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
          </DropdownMenuItem>
          {!data.isUsed && (
            <>
              <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setOpenDelete(true)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" /> Vô hiệu hóa
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
