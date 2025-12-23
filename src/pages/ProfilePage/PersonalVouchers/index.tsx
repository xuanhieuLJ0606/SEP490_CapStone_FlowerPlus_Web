import { useState } from 'react';
import {
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Gift,
  Copy,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useGetMyActivePersonalVouchers,
  useGetMyPersonalVoucherCount,
  useGetMyPersonalVouchersWithPagination
} from '@/queries/personal-voucher.query';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import VoucherDetailModal from './voucher-detail-modal.tsx';
import { useSearchParams } from 'react-router-dom';

interface UserVoucher {
  userVoucherId: number;
  voucherId?: number;
  assignedAt: string;
  isUsed: boolean;
  usedAt?: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  percent?: number;
  amount?: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  startsAt?: string;
  endsAt?: string;
  usageLimit?: number;
  applyAllProducts: boolean;
  isExpired: boolean;
  isActive: boolean;
  status: string;
  daysUntilExpiry?: number;
}

export default function PersonalVouchers() {
  const [selectedVoucher, setSelectedVoucher] = useState<UserVoucher | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current page from URL params (default to 1)
  const currentPage = parseInt(searchParams.get('page') || '1');
  const pageSize = 10;

  const { data: allVouchersRes, isLoading: loadingAll } =
    useGetMyPersonalVouchersWithPagination({
      page: currentPage,
      size: pageSize
    });
  const { data: activeVouchersRes, isLoading: loadingActive } =
    useGetMyActivePersonalVouchers();
  const { data: countRes } = useGetMyPersonalVoucherCount();

  const allVouchers = allVouchersRes?.data?.content || [];
  const totalPages = allVouchersRes?.data?.totalPages || 0;
  const totalElements = allVouchersRes?.data?.totalElements || 0;

  const activeVouchers = activeVouchersRes?.data || [];
  const voucherCount = countRes?.data || 0;

  const usedVouchers = allVouchers.filter((v: UserVoucher) => v.isUsed);
  const expiredVouchers = allVouchers.filter(
    (v: UserVoucher) => v.isExpired && !v.isUsed
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Đã sao chép mã voucher!');
  };

  const handleViewDetails = (voucher: UserVoucher) => {
    setSelectedVoucher(voucher);
    setShowDetailModal(true);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  const formatVoucherValue = (voucher: UserVoucher) => {
    if (voucher.type === 'PERCENTAGE') {
      return `${voucher.percent}% OFF`;
    }
    return `${voucher.amount?.toLocaleString()}đ OFF`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Không giới hạn';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (voucher: UserVoucher) => {
    switch (voucher.status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500">Có thể sử dụng</Badge>;
      case 'USED':
        return <Badge variant="secondary">Đã sử dụng</Badge>;
      case 'EXPIRED':
        return <Badge variant="destructive">Hết hạn</Badge>;
      case 'NOT_STARTED':
        return <Badge variant="outline">Chưa kích hoạt</Badge>;
      default:
        return <Badge variant="outline">{voucher.status}</Badge>;
    }
  };

  const VoucherCard = ({ voucher }: { voucher: UserVoucher }) => (
    <Card
      className={`transition-all hover:shadow-md ${voucher.isActive ? 'border-green-200 bg-green-50/30' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex items-center gap-1 font-mono text-lg font-bold">
                <Tag className="h-4 w-4" />
                {voucher.code}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyCode(voucher.code)}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-600">
                  {formatVoucherValue(voucher)}
                </span>
                {getStatusBadge(voucher)}
              </div>

              {voucher.minOrderValue && (
                <p className="text-sm text-gray-600">
                  Đơn hàng tối thiểu: {voucher.minOrderValue.toLocaleString()}đ
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>HSD: {formatDate(voucher.endsAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDetails(voucher)}
            >
              <Eye className="mr-1 h-4 w-4" />
              Chi tiết
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const VoucherSkeleton = () => (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
      </CardContent>
    </Card>
  );

  const PaginationControls = () => (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Hiển thị {Math.min((currentPage - 1) * pageSize + 1, totalElements)} -{' '}
        {Math.min(currentPage * pageSize, totalElements)} trong tổng số{' '}
        {totalElements} voucher
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Trước
        </Button>
        <span className="text-sm font-medium">
          Trang {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Sau
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Gift className="h-6 w-6 text-green-600" />
            Voucher Cá Nhân
          </h2>
          <p className="mt-1 text-gray-600">
            Quản lý và sử dụng các voucher giảm giá dành riêng cho bạn
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {voucherCount}
          </div>
          <div className="text-sm text-gray-500">voucher khả dụng</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalElements}
            </div>
            <div className="text-sm text-gray-600">Tổng voucher</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {activeVouchers.length}
            </div>
            <div className="text-sm text-gray-600">Có thể sử dụng</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {usedVouchers.length}
            </div>
            <div className="text-sm text-gray-600">Đã sử dụng</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {expiredVouchers.length}
            </div>
            <div className="text-sm text-gray-600">Hết hạn</div>
          </CardContent>
        </Card>
      </div>

      {/* Voucher Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Có thể dùng ({activeVouchers.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tất cả ({totalElements})
          </TabsTrigger>
          <TabsTrigger value="used" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Đã dùng ({usedVouchers.length})
          </TabsTrigger>
          <TabsTrigger value="expired" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Hết hạn ({expiredVouchers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {loadingActive ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <VoucherSkeleton key={i} />
              ))}
            </div>
          ) : activeVouchers.length > 0 ? (
            <div className="grid gap-4">
              {activeVouchers.map((voucher: UserVoucher) => (
                <VoucherCard key={voucher.userVoucherId} voucher={voucher} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Gift className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  Chưa có voucher khả dụng
                </h3>
                <p className="text-gray-600">
                  Bạn chưa có voucher nào có thể sử dụng. Hãy tiếp tục mua sắm
                  để nhận voucher!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {loadingAll ? (
            <div className="grid gap-4">
              {[...Array(5)].map((_, i) => (
                <VoucherSkeleton key={i} />
              ))}
            </div>
          ) : allVouchers.length > 0 ? (
            <>
              <div className="grid gap-4">
                {allVouchers.map((voucher: UserVoucher) => (
                  <VoucherCard key={voucher.userVoucherId} voucher={voucher} />
                ))}
              </div>
              {totalPages > 1 && <PaginationControls />}
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Tag className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  Chưa có voucher nào
                </h3>
                <p className="text-gray-600">
                  Bạn chưa nhận được voucher cá nhân nào từ cửa hàng.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="used" className="space-y-4">
          {usedVouchers.length > 0 ? (
            <div className="grid gap-4">
              {usedVouchers.map((voucher: UserVoucher) => (
                <VoucherCard key={voucher.userVoucherId} voucher={voucher} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  Chưa sử dụng voucher nào
                </h3>
                <p className="text-gray-600">
                  Bạn chưa sử dụng voucher nào. Hãy sử dụng voucher để tiết kiệm
                  chi phí!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          {expiredVouchers.length > 0 ? (
            <div className="grid gap-4">
              {expiredVouchers.map((voucher: UserVoucher) => (
                <VoucherCard key={voucher.userVoucherId} voucher={voucher} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <XCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  Không có voucher hết hạn
                </h3>
                <p className="text-gray-600">
                  Bạn đã sử dụng voucher kịp thời. Tuyệt vời!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Voucher Detail Modal */}
      <VoucherDetailModal
        voucher={selectedVoucher}
        open={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedVoucher(null);
        }}
      />
    </div>
  );
}
