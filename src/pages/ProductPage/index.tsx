import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import {
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  Leaf,
  Sparkles,
  ChevronRight,
  Loader2,
  ShoppingCart
} from 'lucide-react';
import { useGetProductById } from '@/queries/product.query';
import { toast } from '@/components/ui/use-toast';
import { useAddItemToCart } from '@/queries/cart.query';
import { PRODUCT_TYPE_MEAN } from '@/constants/data';
import { useGetVouchers } from '@/queries/voucher.query';

type Composition = {
  childId: number;
  childName: string;
  childType: string;
  quantity: number;
  childPrice: number;
  childImage: string;
};

type Category = {
  id: number;
  name: string;
};

function formatVND(n: number) {
  try {
    return n.toLocaleString('vi-VN');
  } catch {
    return `${n}`;
  }
}

function parseImages(imagesString: string | null | undefined): string[] {
  if (!imagesString) return [];
  try {
    const parsed = JSON.parse(imagesString);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const productId = Number(id);
  const { data: resProduct, isLoading } = useGetProductById(productId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { data: resVouchers } = useGetVouchers();
  const vouchers = resVouchers?.data || [];
  console.log(vouchers);
  const product = resProduct?.data || resProduct;

  const productImages = useMemo(() => {
    if (!product?.images) return [];
    return parseImages(product.images);
  }, [product]);

  const mainImage = productImages[selectedImageIndex] || productImages[0] || '';

  const compositionsWithImages = useMemo(() => {
    if (!product?.compositions) return [];
    return product.compositions.map((comp: Composition) => ({
      ...comp,
      parsedImages: parseImages(comp.childImage)
    }));
  }, [product]);

  const { mutateAsync: addItemToCart } = useAddItemToCart();

  const handleAddToCart = async (productId: number) => {
    const payload = {
      productId: productId,
      quantity: 1
    };
    const [error] = await addItemToCart(payload);

    if (error) {
      toast({
        title: 'Thêm sản phẩm vào giỏ hàng thất bại',
        description:
          error.message || 'Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Thêm sản phẩm vào giỏ hàng thành công',
      description: 'Sản phẩm đã được thêm vào giỏ hàng',
      variant: 'success'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4">
        <Card className="border-dashed">
          <CardContent className="p-10 text-center">
            <p className="text-lg font-medium">Không tìm thấy sản phẩm.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Có thể sản phẩm đã được cập nhật hoặc tạm ngưng kinh doanh.
            </p>
            <Button asChild className="mt-4">
              <Link to="/">Về trang chủ</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Xử lý discount (nếu có originalPrice sau này)
  const hasDiscount = false; // TODO: Thêm khi có originalPrice
  const discountPercent = 0;

  return (
    <div className="container mx-auto p-4">
      {/* Top banner / trust badges */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-2 rounded-lg border bg-gradient-to-br from-pink-50 to-white p-3">
          <Sparkles className="h-5 w-5" />
          <p className="text-sm">
            <span className="font-medium">Hoa tươi mỗi ngày</span> – cắm mới
            theo đơn
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-gradient-to-br from-rose-50 to-white p-3">
          <Truck className="h-5 w-5" />
          <p className="text-sm">
            <span className="font-medium">Giao nhanh 2–4 giờ</span> nội thành
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border bg-gradient-to-br from-blue-50 to-white p-3">
          <ShieldCheck className="h-5 w-5" />
          <p className="text-sm">
            <span className="font-medium">Đổi miễn phí</span> nếu héo trong 24h
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Image gallery */}
        <div className="lg:col-span-6">
          <div className="relative">
            <div className="group aspect-square overflow-hidden rounded-xl border bg-white shadow-sm">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <span className="text-muted-foreground">Không có ảnh</span>
                </div>
              )}
              {/* floating actions */}
              <div className="pointer-events-none absolute left-3 top-3 flex gap-2">
                {hasDiscount && (
                  <Badge className="pointer-events-auto bg-red-600 text-white hover:bg-red-600/90">
                    -{discountPercent}%
                  </Badge>
                )}
                {product.isActive && (
                  <Badge
                    variant="secondary"
                    className="pointer-events-auto gap-1"
                  >
                    <Leaf className="h-3.5 w-3.5" />
                    Tươi mới
                  </Badge>
                )}
              </div>
              <div className="pointer-events-none absolute right-3 top-3 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="pointer-events-auto h-9 w-9 rounded-full"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="pointer-events-auto h-9 w-9 rounded-full"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Thumbnails */}
            {productImages.length > 0 && (
              <div className="mt-3">
                <Carousel>
                  <CarouselContent className="-ml-2">
                    {productImages.map((img, idx) => (
                      <CarouselItem key={idx} className="basis-1/4 pl-2">
                        <button
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`block w-full overflow-hidden rounded-lg border transition-all ${
                            selectedImageIndex === idx
                              ? 'border-primary ring-2 ring-primary'
                              : 'bg-white'
                          }`}
                          aria-label={`Ảnh ${idx + 1}`}
                        >
                          <img
                            src={img}
                            alt={`${product.name} - Ảnh ${idx + 1}`}
                            className="h-20 w-full object-cover transition-transform hover:scale-105"
                          />
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            )}
          </div>
        </div>

        {/* Right: Content */}
        <div className="space-y-5 lg:col-span-6">
          {/* Breadcrumb + Title */}
          <div>
            <nav className="flex items-center gap-1 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span>Chi tiết</span>
            </nav>
            <h1 className="mt-2 text-2xl font-semibold leading-tight md:text-3xl">
              {product.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {product.productType && (
                <Badge variant="secondary">{product.productType}</Badge>
              )}
              {product.stock !== undefined && (
                <Badge variant="outline">Còn {product.stock} sản phẩm</Badge>
              )}
            </div>
          </div>

          {/* Price block */}
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
              {hasDiscount && (
                <span className="text-muted-foreground line-through">
                  {formatVND(product.originalPrice)} ₫
                </span>
              )}
              <span className="text-3xl font-extrabold tracking-tight text-rose-600">
                {formatVND(product.price)} ₫
              </span>
              {hasDiscount && (
                <Badge variant="success" className="text-xs text-white">
                  Tiết kiệm {formatVND(product.originalPrice - product.price)} ₫
                </Badge>
              )}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Giá đã bao gồm giấy gói & thiệp (viết tay theo yêu cầu).
            </div>
          </div>

          <Separator />

          {/* Key info */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <div className="text-muted-foreground">Tình trạng</div>
                  <div className="font-medium">
                    {product.isActive ? 'Đang bán' : 'Tạm ngưng'}
                  </div>
                </div>
                {product.stock !== undefined && (
                  <div>
                    <div className="text-muted-foreground">Tồn kho</div>
                    <div className="font-medium">{product.stock} sản phẩm</div>
                  </div>
                )}
                {product.categories && product.categories.length > 0 && (
                  <div>
                    <div className="text-muted-foreground">Danh mục</div>
                    <div className="font-medium">
                      {product.categories
                        .map((cat: Category) => cat.name)
                        .join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Compositions */}
          {compositionsWithImages.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium">Thành phần sản phẩm</h3>
              <div className="grid grid-cols-1 gap-3">
                {compositionsWithImages.map((comp: any, idx: number) => (
                  <Card key={idx} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        {comp.parsedImages && comp.parsedImages.length > 0 && (
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border">
                            <img
                              src={comp.parsedImages[0]}
                              alt={comp.childName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">
                                {comp.childName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {PRODUCT_TYPE_MEAN[comp.childType]} • Số lượng:{' '}
                                {comp.quantity}
                              </div>
                            </div>
                            {comp.childPrice && (
                              <div className="text-sm font-semibold text-muted-foreground">
                                Giá lẻ: {formatVND(comp.childPrice)} ₫
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="flex h-12 flex-1 items-center gap-2 bg-rose-500 text-base"
              onClick={() => handleAddToCart(product.id)}
            >
              <ShoppingCart className="h-5 w-5" />
              Thêm vào giỏ hàng
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-12 flex-1 text-base"
            >
              Mua ngay
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="desc" className="mt-10">
        <TabsList>
          <TabsTrigger value="desc">Mô tả</TabsTrigger>
          <TabsTrigger value="policy">Chính sách hoa tươi</TabsTrigger>
          <TabsTrigger value="shipping">Giao/nhận</TabsTrigger>
        </TabsList>
        <TabsContent value="desc" className="prose max-w-none">
          {product.description ? (
            <p>{product.description}</p>
          ) : (
            <p className="text-muted-foreground">Chưa có mô tả sản phẩm.</p>
          )}
          <ul className="mt-2 list-disc pl-6 text-sm text-muted-foreground">
            <li>Thiết kế phối màu tinh tế, phù hợp nhiều dịp tặng.</li>
            <li>Hoa tuyển chọn, độ nở đẹp, cắm theo layout mẫu.</li>
            <li>Tặng thiệp viết tay & gói quà cao cấp.</li>
          </ul>
        </TabsContent>
        <TabsContent value="policy">
          <div className="text-sm leading-6">
            <p className="mb-2">
              <span className="font-medium">Đổi mới trong 24 giờ</span> nếu hoa
              bị dập/héo do vận chuyển.
            </p>
            <p className="mb-2">
              Ảnh chụp thành phẩm sẽ được gửi trước khi giao; miễn phí chỉnh sửa
              nhẹ (thay giấy, thêm nơ).
            </p>
            <p className="text-muted-foreground">
              Lưu ý: Màu hoa có thể chênh lệch 5–10% do mùa vụ & ánh sáng chụp.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="shipping">
          <div className="text-sm leading-6">
            <p>
              Giao nội thành trong <span className="font-medium">2–4 giờ</span>,
              ngoại tỉnh <span className="font-medium">1–3 ngày</span>.
            </p>
            <p className="text-muted-foreground">
              Hỗ trợ giao nhanh theo khung giờ yêu cầu (có phụ phí).
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related - TODO: Thêm khi có API related products */}
    </div>
  );
}
