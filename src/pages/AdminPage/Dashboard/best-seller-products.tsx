'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BestSellerProductsProps {
  data: Array<{
    productId: number;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
    orderCount: number;
  }>;
}

export function BestSellerProducts({ data }: BestSellerProductsProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">
            Sản phẩm bán chạy
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Top sản phẩm bán chạy nhất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-slate-500 dark:text-slate-400">
            Chưa có dữ liệu
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-white">
          Sản phẩm bán chạy
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Top {data.length} sản phẩm bán chạy nhất
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((product, index) => {
            const totalRevenue = parseFloat(
              product.totalRevenue?.toString() || '0'
            );
            const totalQuantity = parseInt(
              product.totalQuantity?.toString() || '0'
            );
            const orderCount = parseInt(product.orderCount?.toString() || '0');

            return (
              <div
                key={product.productId}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {product.productName || 'N/A'}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {totalQuantity.toLocaleString('vi-VN')} sản phẩm
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {orderCount} đơn
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-white">
                    {totalRevenue.toLocaleString('vi-VN')} ₫
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tổng doanh thu
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
