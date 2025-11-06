import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, Flower2, ShoppingBasket } from 'lucide-react';

interface ProductDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
}

export const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({
  open,
  onOpenChange,
  product
}) => {
  if (!product) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'FLOWER':
        return <Flower2 className="h-4 w-4" />;
      case 'ITEM':
        return <ShoppingBasket className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'FLOWER':
        return 'Hoa';
      case 'ITEM':
        return 'Phụ kiện';
      case 'PRODUCT':
        return 'Sản phẩm';
      default:
        return type;
    }
  };

  const mainImages = JSON.parse(product.images || '[]');
  const totalCompositionPrice =
    product.compositions?.reduce(
      (sum: number, comp: any) => sum + comp.childPrice * comp.quantity,
      0
    ) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-rose-700">
            Chi tiết sản phẩm
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Thông tin chính */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Hình ảnh sản phẩm */}
            <div className="space-y-3">
              {mainImages.length > 0 && (
                <div className="overflow-hidden rounded-lg border-2 border-rose-200">
                  <img
                    src={mainImages[0]}
                    alt={product.name}
                    className="h-80 w-full object-cover"
                  />
                </div>
              )}
              {mainImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {mainImages.slice(1, 5).map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-md border border-rose-100"
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 2}`}
                        className="h-20 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {product.name}
                </h2>
                <p className="mt-2 text-gray-600">{product.description}</p>
              </div>

              <Separator className="bg-rose-100" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Giá:</span>
                  <span className="text-2xl font-bold text-rose-600">
                    {product.price > 0
                      ? formatCurrency(product.price)
                      : 'Liên hệ'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Loại sản phẩm:</span>
                  <Badge
                    variant="outline"
                    className="border-rose-300 bg-rose-50 text-rose-700"
                  >
                    <span className="mr-1">
                      {getTypeIcon(product.productType)}
                    </span>
                    {getTypeLabel(product.productType)}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tồn kho:</span>
                  <span className="font-semibold text-gray-800">
                    {product.stock} sản phẩm
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <Badge
                    className={
                      product.isActive
                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                    }
                  >
                    {product.isActive ? 'Đang bán' : 'Ngừng bán'}
                  </Badge>
                </div>
              </div>

              {/* Danh mục */}
              {product.categories && product.categories.length > 0 && (
                <>
                  <Separator className="bg-rose-100" />
                  <div>
                    <span className="mb-2 block text-sm font-semibold text-gray-700">
                      Danh mục:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.categories.map((cat: any) => (
                        <Badge
                          key={cat.id}
                          variant="secondary"
                          className="bg-rose-100 text-rose-700 hover:bg-rose-200"
                        >
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Thành phần cấu tạo */}
          {product.compositions && product.compositions.length > 0 && (
            <>
              <Separator className="bg-rose-200" />
              <div className="space-y-4 rounded-lg border-2 border-rose-100 bg-rose-50/30 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-rose-700">
                    Thành phần cấu tạo
                  </h3>
                  <span className="text-sm text-gray-600">
                    {product.compositions.length} thành phần
                  </span>
                </div>

                <div className="space-y-3">
                  {product.compositions.map((comp: any, index: number) => {
                    const images = JSON.parse(comp.childImage || '[]');
                    return (
                      <div
                        key={index}
                        className="flex gap-4 rounded-lg border border-rose-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                      >
                        {/* Hình ảnh */}
                        {images.length > 0 && (
                          <div className="overflow-hidden rounded-md border border-rose-100">
                            <img
                              src={images[0]}
                              alt={comp.childName}
                              className="h-20 w-20 object-cover"
                            />
                          </div>
                        )}

                        {/* Thông tin */}
                        <div className="flex flex-1 items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-semibold text-gray-800">
                              {comp.childName}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="border-rose-200 text-xs"
                              >
                                <span className="mr-1">
                                  {getTypeIcon(comp.childType)}
                                </span>
                                {getTypeLabel(comp.childType)}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                Số lượng: {comp.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-gray-600">Đơn giá</p>
                            <p className="font-bold text-rose-600">
                              {formatCurrency(comp.childPrice)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Tổng:{' '}
                              {formatCurrency(comp.childPrice * comp.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tổng giá trị thành phần */}
                <Separator className="bg-rose-200" />
                <div className="flex items-center justify-between rounded-lg bg-white p-3">
                  <span className="font-semibold text-gray-700">
                    Tổng giá trị các thành phần:
                  </span>
                  <span className="text-xl font-bold text-rose-600">
                    {formatCurrency(totalCompositionPrice)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
