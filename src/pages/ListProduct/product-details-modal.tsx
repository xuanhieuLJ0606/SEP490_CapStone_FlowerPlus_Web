'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ShoppingCart, Star, Truck, Shield } from 'lucide-react';
import { useState } from 'react';

interface SubProduct {
  id: number;
  type: 'FLOWER' | 'ITEM';
  name: string;
  quantity?: number;
  price?: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: Array<{ id: number; url: string }>;
  subProducts?: SubProduct[];
}

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
}

export function ProductDetailsModal({
  product,
  onClose,
  onAddToCart
}: ProductDetailsModalProps) {
  const [quantity, setQuantity] = useState(1);
  const flowers = product.subProducts?.filter((p) => p.type === 'FLOWER') || [];
  const items = product.subProducts?.filter((p) => p.type === 'ITEM') || [];

  const totalPrice = product.price * quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="max-h-[90vh] w-full max-w-4xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-6">
          <h2 className="text-2xl font-bold text-foreground">
            Chi Tiết Sản Phẩm
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-muted"
          >
            <X size={24} className="text-foreground" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Images */}
            <div>
              <img
                src={
                  product.images?.[0]?.url ||
                  '/placeholder.svg?height=400&width=400&query=flower'
                }
                alt={product.name}
                className="mb-4 h-96 w-full rounded-lg object-cover"
              />
              <div className="grid grid-cols-3 gap-2">
                {product.images
                  ?.slice(0, 3)
                  .map((img) => (
                    <img
                      key={img.id}
                      src={img.url || '/placeholder.svg'}
                      alt=""
                      className="h-24 w-full cursor-pointer rounded-lg object-cover transition-opacity hover:opacity-75"
                    />
                  ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <h3 className="mb-2 text-3xl font-bold text-foreground">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="mb-4 flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  (128 đánh giá)
                </span>
              </div>

              <p className="mb-6 leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              {/* Price */}
              <div className="mb-6 rounded-lg bg-muted p-4">
                <p className="mb-2 text-sm text-muted-foreground">Giá</p>
                <p className="mb-2 text-4xl font-bold text-primary">
                  {product.price.toLocaleString('vi-VN')} đ
                </p>
                <p className="text-sm text-primary">
                  Tổng: {totalPrice.toLocaleString('vi-VN')} đ
                </p>
              </div>

              {/* Stock */}
              <div className="mb-6">
                <p className="mb-2 text-sm text-muted-foreground">Tình trạng</p>
                <p
                  className={
                    product.stock > 0
                      ? 'font-semibold text-green-600'
                      : 'font-semibold text-destructive'
                  }
                >
                  {product.stock > 0
                    ? `Có sẵn (${product.stock} sản phẩm)`
                    : 'Hết hàng'}
                </p>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold text-foreground">
                  Số lượng
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                onClick={onAddToCart}
                disabled={product.stock === 0}
                className="mb-4 h-12 w-full gap-2 text-lg"
              >
                <ShoppingCart size={20} />
                Thêm vào giỏ
              </Button>

              {/* Features */}
              <div className="space-y-3 border-t border-border pt-6">
                <div className="flex items-center gap-3">
                  <Truck className="text-primary" size={20} />
                  <span className="text-sm text-muted-foreground">
                    Giao hàng miễn phí
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="text-primary" size={20} />
                  <span className="text-sm text-muted-foreground">
                    Bảo hành 100% hài lòng
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub Products */}
          {(flowers.length > 0 || items.length > 0) && (
            <div className="mt-8 border-t border-border pt-8">
              <h4 className="mb-6 text-2xl font-bold text-foreground">
                Thành phần sản phẩm
              </h4>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Flowers */}
                {flowers.length > 0 && (
                  <div>
                    <h5 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                      <span className="text-xl">🌸</span> Loại Hoa
                    </h5>
                    <div className="space-y-2">
                      {flowers.map((flower) => (
                        <div
                          key={flower.id}
                          className="flex items-center justify-between rounded-lg bg-muted p-4"
                        >
                          <span className="font-medium text-foreground">
                            {flower.name}
                          </span>
                          {flower.quantity && (
                            <span className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                              {flower.quantity} bông
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Items */}
                {items.length > 0 && (
                  <div>
                    <h5 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                      <span className="text-xl">🎀</span> Phụ Kiện
                    </h5>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-lg bg-muted p-4"
                        >
                          <span className="font-medium text-foreground">
                            {item.name}
                          </span>
                          {item.price && (
                            <span className="text-sm font-semibold text-primary">
                              +{item.price.toLocaleString('vi-VN')} đ
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="mt-8 flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-transparent"
            >
              Đóng
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
