'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ShoppingCart } from 'lucide-react';

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
  children?: SubProduct[];
}

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
}

export function QuickViewModal({
  product,
  onClose,
  onAddToCart
}: QuickViewModalProps) {
  const flowers = product.children?.filter((p) => p.type === 'FLOWER') || [];
  const items = product.children?.filter((p) => p.type === 'ITEM') || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-6">
          <h2 className="text-2xl font-bold text-foreground">Xem Nhanh</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-muted"
          >
            <X size={24} className="text-foreground" />
          </button>
        </div>

        <div className="p-6">
          {/* Product Info */}
          <div className="mb-6">
            <img
              src={
                product.images?.[0]?.url ||
                '/placeholder.svg?height=300&width=400&query=flower'
              }
              alt={product.name}
              className="mb-4 h-64 w-full rounded-lg object-cover"
            />
            <h3 className="mb-2 text-xl font-bold text-foreground">
              {product.name}
            </h3>
            <p className="mb-4 text-muted-foreground">{product.description}</p>
            <p className="mb-2 text-3xl font-bold text-primary">
              {product.price.toLocaleString('vi-VN')} đ
            </p>
            <p className="text-sm text-muted-foreground">
              Có sẵn: {product.stock} sản phẩm
            </p>
          </div>

          {/* Sub Products */}
          {(flowers.length > 0 || items.length > 0) && (
            <div className="mb-6">
              <h4 className="mb-4 text-lg font-semibold text-foreground">
                Thành phần sản phẩm
              </h4>

              {/* Flowers Section */}
              {flowers.length > 0 && (
                <div className="mb-6">
                  <h5 className="mb-3 text-sm font-semibold text-foreground">
                    🌸 Loại Hoa
                  </h5>
                  <div className="space-y-2">
                    {flowers.map((flower) => (
                      <div
                        key={flower.id}
                        className="flex items-center justify-between rounded-lg bg-muted p-3"
                      >
                        <span className="text-foreground">{flower.name}</span>
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

              {/* Items Section */}
              {items.length > 0 && (
                <div>
                  <h5 className="mb-3 text-sm font-semibold text-foreground">
                    🎀 Phụ Kiện
                  </h5>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg bg-muted p-3"
                      >
                        <span className="text-foreground">{item.name}</span>
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
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onAddToCart}
              disabled={product.stock === 0}
              className="flex-1 gap-2"
            >
              <ShoppingCart size={18} />
              Thêm vào giỏ
            </Button>
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
