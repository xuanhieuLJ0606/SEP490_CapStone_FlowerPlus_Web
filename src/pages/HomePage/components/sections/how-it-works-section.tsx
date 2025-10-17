import { Flower, Play, Package, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: Flower,
    title: 'MUA HOA TƯƠI',
    description: 'Chọn bộ DIY hoặc tự tạo theo ý thích'
  },
  {
    icon: Play,
    title: 'XEM HƯỚNG DẪN',
    description: 'Xem tất cả mẹo hay, từ chuẩn bị đến vận chuyển'
  },
  {
    icon: Package,
    title: 'MỞ HỘP VÀ CẮM HOA',
    description: 'Biến phòng khách thành studio hoa'
  },
  {
    icon: Sparkles,
    title: 'KHOE THÀNH QUẢ',
    description: 'Ứng tuyển làm Rose Bowl Parade năm sau'
  }
];

const stepAnimation = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6
    }
  })
};

export default function HowItWorksSection() {
  return (
    <div className="bg-[#fae9e1] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* How it works card */}
        <div className="mb-12 rounded-3xl border border-rose-100 bg-white p-6 shadow-sm md:p-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
                variants={stepAnimation}
                className="flex flex-col items-center text-center md:border-r md:border-rose-100 md:px-6 last:md:border-r-0 lg:px-8"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 ring-1 ring-rose-100">
                  <step.icon className="h-8 w-8 text-rose-500" />
                </div>
                <h3 className="mb-2 text-sm font-extrabold tracking-wide text-rose-500 md:text-base">
                  {step.title}
                </h3>
                <p className="text-center text-xs leading-5 text-gray-600 md:text-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Loved by full-width band */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full bg-[#e88a97] py-10"
      >
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="mb-8 text-xl font-extrabold tracking-wider text-white md:text-2xl">
            ĐƯỢC YÊU THÍCH BỞI
          </h2>
          <div className="grid grid-cols-2 items-center justify-items-center gap-y-8 md:grid-cols-3 lg:grid-cols-7">
            <span className="text-base font-semibold text-white md:text-lg">
              REFINERY29
            </span>
            <span className="text-base font-semibold text-white md:text-lg">
              Forbes
            </span>
            <span className="text-base font-semibold text-white md:text-lg">
              domino
            </span>
            <span className="text-base font-semibold text-white md:text-lg">
              The New York Times
            </span>
            <span className="text-base font-semibold text-white md:text-lg">
              weddings
            </span>
            <span className="text-base font-semibold text-white md:text-lg">
              BRIT+CO.
            </span>
            <span className="text-base font-semibold text-white md:text-lg">
              BUSTLE
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}