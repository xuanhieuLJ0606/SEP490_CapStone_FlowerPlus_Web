import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Heart } from 'lucide-react';
import OccasionProducts from '../../components/OccasionProducts';

const UserHome: React.FC = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'Hoa hồng đỏ',
      price: '299,000',
      image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&h=300&fit=crop',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Hoa tulip vàng',
      price: '199,000',
      image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=300&h=300&fit=crop',
      rating: 4.6
    },
    {
      id: 3,
      name: 'Hoa cẩm chướng',
      price: '149,000',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Hoa ly trắng',
      price: '399,000',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
      rating: 4.9
    }
  ];

  const features = [
    {
      icon: <Truck className="h-8 w-8 text-green-600" />,
      title: 'Giao hàng nhanh',
      description: 'Giao hàng trong 2-4 giờ tại TP.HCM'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: 'Chất lượng đảm bảo',
      description: 'Hoa tươi 100% từ các vườn hoa uy tín'
    },
    {
      icon: <Heart className="h-8 w-8 text-green-600" />,
      title: 'Tư vấn chuyên nghiệp',
      description: 'Đội ngũ chuyên gia tư vấn nhiệt tình'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-green-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Hoa tươi cho mọi dịp
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Khám phá bộ sưu tập hoa tươi đẹp nhất với dịch vụ giao hàng tận nơi nhanh chóng và chuyên nghiệp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  Xem sản phẩm
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <button className="border border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                  Liên hệ tư vấn
                </button>
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            >
              <img
                src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&h=400&fit=crop"
                alt="Beautiful flowers"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sản phẩm nổi bật
            </h2>
            <p className="text-gray-600">
              Những bó hoa đẹp nhất được khách hàng yêu thích
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? 'fill-current' : ''
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {product.rating}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">
                      {product.price}đ
                    </span>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors">
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/products"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center"
            >
              Xem tất cả sản phẩm
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      <OccasionProducts />
      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sẵn sàng tạo nên những khoảnh khắc đẹp?
          </h2>
          <p className="text-green-100 mb-8 text-lg">
            Liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Gọi ngay: 1900 1234
            </button>
            <Link
              to="/contact"
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Liên hệ qua form
            </Link>
          </div>
        </div>
      </section>

      {/* Occasion Products Section */}
      
    </div>
  );
};

export default UserHome;
