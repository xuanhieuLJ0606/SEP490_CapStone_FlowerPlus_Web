import React from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-green-100 rounded-full blur-3xl opacity-70" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-70" />

        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Về FlowerPlus
            </motion.h1>
            <motion.p
              className="mt-6 text-lg md:text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Chúng tôi mang đến những bó hoa tinh tế, kể câu chuyện yêu thương qua từng cánh hoa.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Năm kinh nghiệm', value: '10+' },
            { label: 'Bó hoa mỗi năm', value: '50,000+' },
            { label: 'Đánh giá 5 sao', value: '8,000+' },
            { label: 'Đối tác tin cậy', value: '200+' },
          ].map((item) => (
            <motion.div
              key={item.label}
              variants={fadeInUp}
              className="bg-green-50 rounded-2xl p-6 text-center border border-green-100"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-green-700">
                {item.value}
              </div>
              <div className="mt-2 text-sm md:text-base text-green-800/80 font-medium">
                {item.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-green-100 rounded-2xl -z-10" />
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://datviettour.com.vn/uploads/images/chau-au/phap/danh-thang/canh-dong-hoa-lavender-tour-du-lich-chau-au-2.jpg"
                alt="Fresh flowers"
                className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700"
              />
            </div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className=""
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900">
              Sứ mệnh của chúng tôi
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-gray-600 leading-7">
              FlowerPlus ra đời với mong muốn mang đến niềm vui và cảm xúc qua những bó hoa được thiết kế tỉ mỉ. Chúng tôi tin rằng mỗi bó hoa đều mang một câu chuyện riêng dành cho người nhận.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Hoa nhập khẩu, tươi mới mỗi ngày',
                'Thiết kế tinh tế, hiện đại',
                'Giao nhanh trong 2 giờ',
                'CSKH tận tâm 24/7',
              ].map((benefit) => (
                <div key={benefit} className="flex items-start space-x-3">
                  <span className="mt-1 text-green-600">✔</span>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-gray-900 text-center"
          >
            Hành trình phát triển
          </motion.h3>
          <div className="mt-10 max-w-3xl mx-auto">
            {[
              { year: '2015', text: 'Thành lập FlowerPlus với đội ngũ 3 người yêu hoa.' },
              { year: '2018', text: 'Mở rộng 2 cửa hàng và triển khai giao hàng nhanh.' },
              { year: '2021', text: 'Đạt 5000+ đơn hàng/tháng, nâng cấp xưởng thiết kế.' },
              { year: '2024', text: 'Ra mắt nền tảng đặt hoa online thế hệ mới.' },
            ].map((item, idx) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
                className="relative pl-8 md:pl-10 py-6 border-l-2 border-green-200"
              >
                <span className="absolute -left-3 top-7 w-6 h-6 rounded-full bg-white border-2 border-green-500" />
                <div className="text-sm text-green-600 font-semibold">{item.year}</div>
                <div className="mt-1 text-gray-700">{item.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-gray-900 text-center"
        >
          Đội ngũ của chúng tôi
        </motion.h3>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { name: 'Lan Phương', role: 'Floral Designer', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop' },
            { name: 'Minh Quân', role: 'Logistics Lead', img: 'https://images.unsplash.com/photo-1508341591423-4347099e1f19?q=80&w=1200&auto=format&fit=crop' },
            { name: 'Bảo Trâm', role: 'Creative Director', img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=1200&auto=format&fit=crop' },
            { name: 'Hoàng Anh', role: 'Customer Success', img: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1200&auto=format&fit=crop' },
          ].map((member) => (
            <motion.div
              key={member.name}
              variants={fadeInUp}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-5">
                <div className="font-semibold text-gray-900">{member.name}</div>
                <div className="text-sm text-gray-500">{member.role}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-500 opacity-95" />
        <div className="container mx-auto px-4 py-14 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h3 className="text-2xl md:text-3xl font-bold">Gửi hoa ngay hôm nay</h3>
            <p className="mt-2 text-white/90">
              Chọn một bó hoa và để FlowerPlus giúp bạn gửi gắm yêu thương.
            </p>
            <a
              href="/products"
              className="inline-block mt-6 px-6 py-3 rounded-xl bg-white text-green-700 font-semibold shadow hover:shadow-lg hover:-translate-y-0.5 transition"
            >
              Khám phá sản phẩm
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


