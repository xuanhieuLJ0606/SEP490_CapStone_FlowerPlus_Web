import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ListProduct } from '@/constants/mockData/product';
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
  ChevronRight
} from 'lucide-react';

type ProductChild = { id: string; name: string; value: string };

function formatVND(n: number) {
  try {
    return n.toLocaleString('vi-VN');
  } catch {
    return `${n}`;
  }
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const productId = Number(id);

  const product = useMemo(
    () => ListProduct.find((p: any) => p.id === productId),
    [productId]
  );

  const related = useMemo(() => {
    if (!product) return [] as any[];
    return ListProduct.filter(
      (p: any) => p.categoryId === product.categoryId && p.id !== product.id
    ).slice(0, 8);
  }, [product]);

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

  const hasDiscount =
    Boolean(product.originalPrice) && product.originalPrice > product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const galleryImages = [product.image, product.image, product.image];

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
        <div className="flex items-center gap-2 rounded-lg border bg-gradient-to-br from-green-50 to-white p-3">
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
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* floating actions */}
              <div className="pointer-events-none absolute left-3 top-3 flex gap-2">
                {hasDiscount ? (
                  <Badge className="pointer-events-auto bg-red-600 text-white hover:bg-red-600/90">
                    -{discountPercent || product.discount || 0}%
                  </Badge>
                ) : null}
                <Badge
                  variant="secondary"
                  className="pointer-events-auto gap-1"
                >
                  <Leaf className="h-3.5 w-3.5" />
                  Tươi mới
                </Badge>
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
            <div className="mt-3">
              <Carousel>
                <CarouselContent className="-ml-2">
                  {galleryImages.map((img, idx) => (
                    <CarouselItem key={idx} className="basis-1/4 pl-2">
                      <button
                        className="block w-full overflow-hidden rounded-lg border bg-white"
                        aria-label={`Ảnh ${idx + 1}`}
                      >
                        <img
                          src={img}
                          className="h-20 w-full object-cover transition-transform hover:scale-105"
                        />
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
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
              <Badge variant="secondary">New 100%</Badge>
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
              <span className="text-3xl font-extrabold tracking-tight text-green-600">
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
                  <div className="text-muted-foreground">Thương hiệu</div>
                  <div className="font-medium">Tổng hợp</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Tình trạng</div>
                  <div className="font-medium">Cắm mới trong ngày</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Danh mục</div>
                  <div className="font-medium">#{product.categoryId}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attributes */}
          {Array.isArray(product.children) && product.children.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium">Thành phần / Thuộc tính</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {product.children.map((c: ProductChild) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-lg border bg-white/60 p-2 text-sm"
                  >
                    <span className="text-muted-foreground">{c.name}</span>
                    <span className="font-medium">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="h-12 flex-1 text-base">
              Gửi yêu cầu tư vấn
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-12 flex-1 text-base"
            >
              Đặt nhanh qua Zalo
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
          <p>{product.description}</p>
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

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Có thể bạn sẽ thích</h3>
            <Link to="/" className="text-sm text-primary hover:underline">
              Xem thêm
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {related.map((item: any) => {
              const itemHasDiscount =
                Boolean(item.originalPrice) && item.originalPrice > item.price;
              return (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden transition-all hover:shadow-lg">
                    <CardContent className="p-0">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {itemHasDiscount ? (
                          <Badge className="absolute left-2 top-2 bg-red-600 text-white">
                            -
                            {Math.round(
                              ((item.originalPrice - item.price) /
                                item.originalPrice) *
                                100
                            )}
                            %
                          </Badge>
                        ) : null}
                      </div>
                      <div className="space-y-1 p-3">
                        <div className="line-clamp-2 text-sm font-medium">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2">
                          {itemHasDiscount ? (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatVND(item.originalPrice)} ₫
                            </span>
                          ) : null}
                          <span className="text-sm font-semibold text-red-600">
                            {formatVND(item.price)} ₫
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}