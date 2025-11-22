import { useGetListProductByPaging } from '@/queries/product.query';
import ProductGrid from './product-grid';
import { PRODUCT_TYPE } from '@/constants/data';

// Hàm helper để parse JSON string của images
const parseImages = (imagesString: string): string[] => {
  try {
    return JSON.parse(imagesString);
  } catch {
    return [];
  }
};

// Hàm chuyển đổi data từ API sang format của ProductGrid
const transformProductData = (apiProducts: any[]) => {
  return apiProducts.map((product) => {
    const images = parseImages(product.images);
    const firstImage = images[0] || '/placeholder-image.jpg';
    console.log(firstImage);
    const originalPrice = product.price;
    const discountedPrice = product.price; // Nếu API có trường discountPrice thì dùng product.discountPrice
    const discount =
      originalPrice > discountedPrice
        ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
        : 0;

    let label = null;
    let labelColor = '';

    // Logic label dựa trên ngày tạo
    if (product.createdAt) {
      const createdDate = new Date(product.createdAt);
      const daysDiff =
        (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff <= 7) {
        label = 'New' as any;
        labelColor = 'bg-green-500';
      }
    }

    // Logic label dựa trên discount
    if (discount >= 20) {
      label = 'HOT' as any;
      labelColor = 'bg-red-500';
    }

    return {
      id: product.id,
      name: product.name,
      originalPrice: originalPrice,
      discountedPrice: discountedPrice,
      discount: discount,
      label: label,
      labelColor: labelColor,
      image: firstImage,
      categories: product.categories,
      compositions: product.compositions,
      stock: product.stock,
      description: product.description
    };
  });
};

// Hàm lọc sản phẩm theo category name
const filterProductsByCategory = (products: any[], categoryName: string) => {
  return products.filter((product) =>
    product.categories?.some((cat: any) =>
      cat.name.toLowerCase().includes(categoryName.toLowerCase())
    )
  );
};

export default function ProductSection() {
  const { data: resProducts } = useGetListProductByPaging(
    1,
    100, // Tăng số lượng để lấy đủ sản phẩm cho tất cả categories
    '',
    PRODUCT_TYPE.PRODUCT
  );

  const allProducts = resProducts?.listObjects
    ? transformProductData(resProducts.listObjects)
    : [];

  // Config cho các section
  const sections = [
    {
      title: 'BÓ HOA RẺ HÔM NAY',
      backgroundColor: 'bg-white',
      filterFn: (products: any[]) =>
        [...products].sort((a, b) => a.discountedPrice - b.discountedPrice)
    },
    {
      title: 'HOA HỒNG',
      backgroundColor: 'bg-[#f3e2d9]',
      filterFn: (products: any[]) =>
        filterProductsByCategory(products, 'hoa hồng')
    },
    {
      title: 'HOA LY',
      backgroundColor: 'bg-white',
      filterFn: (products: any[]) =>
        filterProductsByCategory(products, 'hoa ly')
    },
    {
      title: 'HOA CÚC',
      backgroundColor: 'bg-[#f3e2d9]',
      filterFn: (products: any[]) =>
        filterProductsByCategory(products, 'hoa cúc')
    }
  ];

  return (
    <div>
      {sections.map((section, index) => {
        const filteredProducts = section.filterFn(allProducts);

        // Không hiển thị section nếu không có sản phẩm
        if (filteredProducts.length === 0) return null;

        return (
          <ProductGrid
            key={index}
            products={filteredProducts}
            maxShowProduct={5}
            title={section.title}
            backgroundColor={section.backgroundColor}
          />
        );
      })}
    </div>
  );
}
