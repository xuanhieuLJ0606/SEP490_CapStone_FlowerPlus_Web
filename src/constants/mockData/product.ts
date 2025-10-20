export const ListProduct = [
  {
    id: 1,
    name: 'Hoa hồng đỏ tình yêu',
    price: 350000,
    originalPrice: 420000,
    discount: 17,
    description:
      'Bó hoa hồng đỏ tượng trưng cho tình yêu nồng cháy, thích hợp tặng người thương.',
    image:
      'https://flowersight.com/wp-content/uploads/2023/05/bo-hoa-tuoi-gia-re.webp',
    categoryId: 1,
    children: [
      { id: 'flower', name: 'Loại hoa', value: 'Hoa hồng đỏ' },
      { id: 'quantity', name: 'Số lượng', value: '15 bông' },
      { id: 'style', name: 'Kiểu bó', value: 'Bó tròn' }
    ]
  },
  {
    id: 2,
    name: 'Hoa baby trắng tinh khôi',
    price: 290000,
    originalPrice: 350000,
    discount: 17,
    description:
      'Bó hoa baby trắng nhỏ xinh, mang vẻ đẹp nhẹ nhàng và tinh tế.',
    image:
      'https://vuonhoatuoi.vn/wp-content/uploads/2024/01/z5045635948850_205bfcd220e2fb8607a66d0b14771c1e.webp',
    categoryId: 1,
    children: [
      { id: 'flower', name: 'Loại hoa', value: 'Baby trắng' },
      { id: 'style', name: 'Kiểu bó', value: 'Bó dài' },
      { id: 'meaning', name: 'Ý nghĩa', value: 'Sự thuần khiết và trong sáng' }
    ]
  },
  {
    id: 3,
    name: 'Giỏ hoa sinh nhật rực rỡ',
    price: 550000,
    originalPrice: 690000,
    discount: 20,
    description:
      'Giỏ hoa tươi phối nhiều loại hoa rực rỡ, thích hợp chúc mừng sinh nhật.',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIZesAEzGumBe-jNVRcDJ_Yj1S_EgoNJrEmQ&s',
    categoryId: 2,
    children: [
      { id: 'type', name: 'Kiểu dáng', value: 'Giỏ hoa' },
      { id: 'flowers', name: 'Thành phần', value: 'Hoa hồng, cúc, đồng tiền' }
    ]
  },
  {
    id: 4,
    name: 'Hoa hướng dương năng lượng',
    price: 320000,
    originalPrice: 400000,
    discount: 20,
    description:
      'Bó hoa hướng dương tươi tắn, biểu tượng của sự lạc quan và niềm tin.',
    image:
      'https://hoayeuthuong.com/hinh-hoa-tuoi/thumb/bo-hoa-huong-duong-nang-luong-3935.jpg',
    categoryId: 2,
    children: [
      { id: 'flower', name: 'Loại hoa', value: 'Hướng dương' },
      { id: 'quantity', name: 'Số lượng', value: '7 bông' }
    ]
  },
  {
    id: 5,
    name: 'Lẵng hoa khai trương phát tài',
    price: 950000,
    originalPrice: 1200000,
    discount: 21,
    description:
      'Lẵng hoa tươi sang trọng chúc mừng khai trương, mang ý nghĩa may mắn và phát đạt.',
    image:
      'https://hoayeuthuong.com/hinh-hoa-tuoi/thumb/lang-hoa-khai-truong-phat-tai-3872.jpg',
    categoryId: 3,
    children: [
      { id: 'occasion', name: 'Dịp tặng', value: 'Khai trương' },
      {
        id: 'flowers',
        name: 'Thành phần',
        value: 'Hoa ly, lan vũ nữ, đồng tiền'
      }
    ]
  },
  {
    id: 6,
    name: 'Bó hoa lan hồ điệp trắng',
    price: 1250000,
    originalPrice: 1500000,
    discount: 17,
    description:
      'Hoa lan hồ điệp sang trọng, biểu tượng của sự thanh lịch và cao quý.',
    image:
      'https://hoayeuthuong.com/hinh-hoa-tuoi/thumb/lan-ho-diep-trang-3762.jpg',
    categoryId: 4,
    children: [
      { id: 'flower', name: 'Loại hoa', value: 'Lan hồ điệp' },
      { id: 'color', name: 'Màu sắc', value: 'Trắng' },
      { id: 'meaning', name: 'Ý nghĩa', value: 'Thanh khiết, sang trọng' }
    ]
  },
  {
    id: 7,
    name: 'Hoa cúc họa mi mùa thu',
    price: 180000,
    originalPrice: 230000,
    discount: 22,
    description:
      'Bó hoa cúc họa mi tinh khôi, mang nét đẹp mộc mạc và trong trẻo.',
    image:
      'https://hoayeuthuong.com/hinh-hoa-tuoi/thumb/hoa-cuc-hoa-mi-mua-thu-4803.jpg',
    categoryId: 5,
    children: [
      { id: 'flower', name: 'Loại hoa', value: 'Cúc họa mi' },
      { id: 'quantity', name: 'Số lượng', value: '20 bông' }
    ]
  },
  {
    id: 8,
    name: 'Bó hoa tulip Hà Lan',
    price: 780000,
    originalPrice: 950000,
    discount: 18,
    description:
      'Bó hoa tulip nhập khẩu, sang trọng và tinh tế, thích hợp tặng người yêu.',
    image:
      'https://hoayeuthuong.com/hinh-hoa-tuoi/thumb/bo-hoa-tulip-ha-lan-3999.jpg',
    categoryId: 6,
    children: [
      { id: 'flower', name: 'Loại hoa', value: 'Tulip' },
      { id: 'origin', name: 'Xuất xứ', value: 'Hà Lan' },
      { id: 'color', name: 'Màu sắc', value: 'Đỏ, vàng, tím' }
    ]
  },
  {
    id: 9,
    name: 'Hoa hồng sáp hộp quà',
    price: 350000,
    originalPrice: 450000,
    discount: 22,
    description:
      'Hộp quà hoa sáp thơm lâu, thích hợp làm quà tặng kỷ niệm, Valentine.',
    image:
      'https://hoayeuthuong.com/hinh-hoa-tuoi/thumb/hoa-hong-sap-hop-qua-4120.jpg',
    categoryId: 7,
    children: [
      { id: 'material', name: 'Chất liệu', value: 'Hoa sáp thơm' },
      { id: 'package', name: 'Đóng gói', value: 'Hộp quà cao cấp' }
    ]
  },
  {
    id: 10,
    name: 'Combo 3 chậu cây mini trang trí',
    price: 270000,
    originalPrice: 350000,
    discount: 23,
    description:
      'Bộ 3 chậu cây nhỏ xinh, thích hợp trang trí bàn làm việc hoặc tặng bạn bè.',
    image:
      'https://hoayeuthuong.com/hinh-hoa-tuoi/thumb/combo-chau-cay-mini-trang-tri-4832.jpg',
    categoryId: 8,
    children: [
      {
        id: 'plants',
        name: 'Thành phần',
        value: 'Sen đá, xương rồng, cây may mắn'
      }
    ]
  },
  {
    id: 11,
    name: 'Hoa cẩm chướng hồng ngọt ngào',
    price: 280000,
    originalPrice: 350000,
    discount: 20,
    description:
      'Bó hoa cẩm chướng hồng tượng trưng cho tình mẹ và lòng biết ơn.',
    image:
      'https://hoayeuthuong.com/hinh-hoa-tuoi/thumb/hoa-cam-chuong-hong-ngot-ngao-3954.jpg',
    categoryId: 9,
    children: [
      { id: 'flower', name: 'Loại hoa', value: 'Cẩm chướng hồng' },
      { id: 'meaning', name: 'Ý nghĩa', value: 'Tình cảm chân thành' }
    ]
  },
  {
    id: 12,
    name: 'Lẵng hoa tang lễ trang nhã',
    price: 890000,
    originalPrice: 1100000,
    discount: 19,
    description:
      'Lẵng hoa chia buồn với tông màu nhã nhặn, thể hiện lòng thành kính.',
    image:
      'https://hoayeuthuong.com/hinh-hoa-tuoi/thumb/lang-hoa-chia-buon-trang-nha-4060.jpg',
    categoryId: 10,
    children: [
      { id: 'occasion', name: 'Dịp tặng', value: 'Chia buồn - Tang lễ' },
      {
        id: 'flowers',
        name: 'Thành phần',
        value: 'Hoa ly trắng, cúc trắng, lan tím'
      }
    ]
  }
];