export interface FavoriteResponse {
  id: number;
  userId: number;
  productId: number;
  product: ProductResponse;
  createdAt: string;
}

export interface FavoriteStatusResponse {
  productId: number;
  favorited: boolean;
}

export interface FavoriteToggleRequest {
  productId: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string;
  isActive: boolean;
  productType: string;
}

export interface FavoriteStatusMap {
  [productId: number]: boolean;
}
