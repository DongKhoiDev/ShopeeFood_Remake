import { Restaurant, Order } from './types';

export const CATEGORIES = [
  { id: '1', name: 'Cơm & Mì', icon: 'ramen_dining', color: 'bg-orange-100', iconColor: 'text-[#EE4D2D]' },
  { id: '2', name: 'Đồ uống', icon: 'local_cafe', color: 'bg-blue-100', iconColor: 'text-blue-600' },
  { id: '3', name: 'Pizza', icon: 'local_pizza', color: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  { id: '4', name: 'Sushi', icon: 'set_meal', color: 'bg-teal-100', iconColor: 'text-teal-600' },
  { id: '5', name: 'Burgers', icon: 'lunch_dining', color: 'bg-red-100', iconColor: 'text-[#EE4D2D]' },
  { id: '6', name: 'Snacks', icon: 'tapas', color: 'bg-purple-100', iconColor: 'text-purple-600' },
  { id: '7', name: 'Mì Ý', icon: 'restaurant_menu', color: 'bg-green-100', iconColor: 'text-green-600' },
  { id: '8', name: 'Tráng miệng', icon: 'icecream', color: 'bg-pink-100', iconColor: 'text-pink-600' },
];

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Burger Joint Extraordinaire',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=2000',
    rating: 4.8,
    reviewCount: '1.2k+',
    categories: ['Burgers', 'American', 'Fast Food'],
    distance: '2.5 km',
    deliveryTime: '25-35 min',
    deliveryFee: 'Miễn phí',
    address: '123 Đường Main, Khu trung tâm',
    isPromo: true,
    menu: [
      { id: 'b1', name: 'Signature Double Cheeseburger', description: 'Thêm dưa chuột muối, không hành', price: 45000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800', category: 'Burgers', rating: 4.8, isBestseller: true, variants: [{name: 'Nhỏ', price: 45000}, {name: 'Vừa', price: 55000}, {name: 'Lớn', price: 65000}] },
      { id: 'b2', name: 'Large French Fries', description: 'Bao gồm gói tương cà', price: 20000, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800', category: 'Snacks' },
      { id: 'b3', name: 'Coca Cola Zero', description: 'Lon 330ml ướp lạnh', price: 15000, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800', category: 'Đồ uống', variants: [{name: 'M', price: 15000}, {name: 'L', price: 22000}], optionGroups: [ { name: 'Lượng đá', required: true, multiple: false, choices: [{name: 'Bình thường', priceDelta: 0}, {name: 'Ít đá', priceDelta: 0}, {name: 'Không đá', priceDelta: 0}] } ] },
      { id: 'b4', name: 'Cơm Gà Xối Mỡ', description: 'Cơm chiên, đùi gà chiên giòn, dưa leo, cà chua', price: 45000, image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&q=80&w=800', category: 'Cơm & Mì', isBestseller: true },
      { id: 'b5', name: 'Chicken Nuggets (6pcs)', description: 'Gà rán miếng, tặng kèm tương ớt', price: 35000, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=800', category: 'Snacks', rating: 4.5 },
      { id: 'b6', name: 'Spicy Chicken Burger', description: 'Gà rán cay giòn kẹp phô mai', price: 55000, image: 'https://images.unsplash.com/photo-1615486171448-4fbef0fc39c9?auto=format&fit=crop&q=80&w=800', category: 'Burgers', rating: 4.7 },
      { id: 'b7', name: 'Strawberry Milkshake', description: 'Sữa lắc vị dâu tây tươi', price: 30000, image: 'https://images.unsplash.com/photo-1572656306390-40a9fc3899f7?auto=format&fit=crop&q=80&w=800', category: 'Tráng miệng', isBestseller: true }
    ]
  },
  {
    id: '2',
    name: 'Sakura Sushi House',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=2000',
    rating: 4.9,
    reviewCount: '800+',
    categories: ['Japanese', 'Sushi', 'Seafood'],
    distance: '3.1 km',
    deliveryTime: '40-50 min',
    deliveryFee: '$2.99',
    address: '456 Sushi Ave',
    isPromo: true,
    menu: [
      { id: 's1', name: 'Salmon Sashimi (5pcs)', description: 'Cá hồi tươi nhập khẩu từ Nauy, cắt lát dày', price: 125000, image: 'https://images.unsplash.com/photo-1534083222144-f908759714da?auto=format&fit=crop&q=80&w=800', category: 'Sushi', rating: 4.9, isBestseller: true },
      { id: 's2', name: 'Dragon Roll', description: 'Cơm cuộn lươn nhật, bơ trái và sốt teriyaki', price: 155000, image: 'https://images.unsplash.com/photo-1559483253-938221c97042?auto=format&fit=crop&q=80&w=800', category: 'Sushi' },
      { id: 's3', name: 'Miso Ramen', description: 'Mì Ramen nước dùng tương đậu, thịt xá xíu, trứng ngâm', price: 95000, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800', category: 'Cơm & Mì', isBestseller: true },
      { id: 's4', name: 'Trà Xanh Nhật (Nóng/Lạnh)', description: 'Trà xanh Matcha truyền thống Nhật Bản', price: 35000, image: 'https://images.unsplash.com/photo-1582733315328-84996963ef51?auto=format&fit=crop&q=80&w=800', category: 'Đồ uống' },
      { id: 's5', name: 'Shrimp Tempura', description: 'Tôm sú tẩm bột chiên xù kiểu Nhật', price: 85000, image: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&q=80&w=800', category: 'Snacks', rating: 4.6 },
      { id: 's6', name: 'Matcha Ice Cream', description: 'Kem trà xanh ăn kèm đậu đỏ', price: 45000, image: 'https://plus.unsplash.com/premium_photo-1663100769321-9eb8fe5a8e6b?auto=format&fit=crop&q=80&w=800', category: 'Tráng miệng', isBestseller: true },
      { id: 's7', name: 'Spicy Tuna Roll', description: 'Cơm cuộn cá ngừ sốt cay', price: 140000, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=800', category: 'Sushi', rating: 4.8 }
    ]
  },
  {
    id: '3',
    name: "Luigi's Woodfired Pizza",
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000',
    rating: 4.7,
    reviewCount: '2.5k+',
    categories: ['Italian', 'Pizza', 'Pasta'],
    distance: '1.2 km',
    deliveryTime: '20-30 min',
    deliveryFee: '$1.49',
    address: '789 Napoli St',
    menu: [
      { id: 'p1', name: 'Margherita Pizza', description: 'Sốt cà chua truyền thống, phô mai mozzarella tươi, húng tây rừng', price: 150000, image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&q=80&w=800', category: 'Pizza', rating: 4.9, isBestseller: true },
      { id: 'p2', name: 'Pepperoni Feast', description: 'Gấp đôi xúc xích pepperoni, phô mai mozzarella', price: 180000, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800', category: 'Pizza' },
      { id: 'p3', name: 'Spaghetti Carbonara', description: 'Mì Ý sốt kem trứng, thịt xông khói, phô mai Parmesan', price: 120000, image: 'https://images.unsplash.com/photo-1612450866873-196024ef482d?auto=format&fit=crop&q=80&w=800', category: 'Mì Ý', isBestseller: true },
      { id: 'p4', name: 'Tiramisu Klasik', description: 'Bánh Tiramisu truyền thống Ý với cà phê espresso và bột cacao', price: 65000, image: 'https://images.unsplash.com/photo-1571877223202-556260842db3?auto=format&fit=crop&q=80&w=800', category: 'Tráng miệng' },
      { id: 'p5', name: 'Garlic Bread', description: 'Bánh mì nướng bơ tỏi và ngò rí', price: 45000, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=800', category: 'Snacks' },
      { id: 'p6', name: 'Seafood Marinara Pizza', description: 'Pizza hải sản tươi: mực, tôm, phô mai', price: 210000, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800', category: 'Pizza', rating: 4.8 },
      { id: 'p7', name: 'Classic Gelato', description: 'Kem Gelato vị Ý truyền thống', price: 50000, image: 'https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?auto=format&fit=crop&q=80&w=800', category: 'Tráng miệng' }
    ]
  },
  {
    id: '4',
    name: 'Phở & Bún Chả Hà Nội',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad4f39fb?auto=format&fit=crop&q=80&w=2000',
    rating: 4.9,
    reviewCount: '5.1k+',
    categories: ['Vietnamese', 'Noodles', 'Asian'],
    distance: '0.8 km',
    deliveryTime: '15-20 min',
    deliveryFee: 'Miễn phí',
    address: '12 Nguyễn Dinh, Hà Nội',
    isPromo: true,
    menu: [
      { id: 'v1', name: 'Phở Bò Đặc Biệt', description: 'Bánh phở tươi, tái, nạm, gầu, bò viên, lá thơm', price: 65000, image: 'https://images.unsplash.com/photo-1582878826629-29b7ad4f39fb?auto=format&fit=crop&q=80&w=800', category: 'Cơm & Mì', rating: 4.9, isBestseller: true, variants: [{name: 'Bát thường', price: 65000}, {name: 'Bát lớn', price: 85000}], optionGroups: [ { name: 'Thêm gia vị', required: false, multiple: true, choices: [{name: 'Thêm quẩy', priceDelta: 5000}, {name: 'Thêm hành trần', priceDelta: 0}, {name: 'Không bột ngọt', priceDelta: 0}] } ] },
      { id: 'v2', name: 'Bún Chả Hà Nội', description: 'Chả băm, chả miếng nướng than hoa, bún tươi, rau sống', price: 55000, image: 'https://images.unsplash.com/photo-1632709664539-72c1c3fcd105?auto=format&fit=crop&q=80&w=800', category: 'Cơm & Mì', isBestseller: true },
      { id: 'v3', name: 'Gỏi Cuốn Tôm Thịt', description: 'Gỏi cuốn tôm sú, thịt luộc ăn kèm tương đen mắm nêm', price: 35000, image: 'https://images.unsplash.com/photo-1596624522923-288339dc8399?auto=format&fit=crop&q=80&w=800', category: 'Snacks' },
      { id: 'v4', name: 'Cà Phê Sữa Đá', description: 'Cà phê pha phin truyền thống với sữa đặc', price: 25000, image: 'https://images.unsplash.com/photo-1582285145802-99bd850e0544?auto=format&fit=crop&q=80&w=800', category: 'Đồ uống', isBestseller: true },
      { id: 'v5', name: 'Bánh Mì Thịt Nướng', description: 'Bánh mì giòn kẹp thịt nướng, pate, chả mỡ, rau mùi', price: 30000, image: 'https://images.unsplash.com/photo-1627308595229-7830f5c95f9d?auto=format&fit=crop&q=80&w=800', category: 'Burgers' },
      { id: 'v6', name: 'Trà Đá', description: 'Trà đá mát lạnh giải nhiệt', price: 5000, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800', category: 'Đồ uống' },
      { id: 'v7', name: 'Chè Khúc Bạch', description: 'Chè khúc bạch mát lạnh, nhãn lồng, hạnh nhân lát', price: 25000, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800', category: 'Tráng miệng' }
    ]
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'SPF-192837465',
    restaurantName: 'Napoli Pizzeria',
    restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop',
    date: 'Hôm nay, 12:30 PM',
    items: [
      { name: 'Margherita Pizza (Large)', quantity: 1, price: 150000 },
      { name: 'Garlic Bread', quantity: 1, price: 45000 },
      { name: 'Cola', quantity: 2, price: 20000 }
    ],
    total: 235000,
    status: 'DELIVERING',
    eta: '12:45',
    paymentMethod: 'ShopeePay'
  },
  {
    id: 'SPF-827364512',
    restaurantName: 'Smash Burger Co.',
    restaurantImage: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2072&auto=format&fit=crop',
    date: '12 Oct 2023, 19:45 PM',
    items: [
      { name: 'Classic Double Smash', quantity: 2, price: 75000 },
      { name: 'Large Fries', quantity: 1, price: 30000 }
    ],
    total: 180000,
    status: 'COMPLETED',
    paymentMethod: 'Tiền mặt'
  }
];
