import { db } from '../firebase';
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';

const RESTAURANTS: any[] = [
  {
    id: 'r1', name: 'Phở Thìn Lò Đúc',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad4f39fb?auto=format&fit=crop&q=80&w=800',
    rating: 4.9, reviewCount: '5.2k+', reviews: 5200,
    categories: ['Vietnamese', 'Noodles', 'Asian'],
    distance: '0.8 km', deliveryTime: '15-20 min', deliveryFee: 'Miễn phí',
    address: '13 Lò Đúc, Hai Bà Trưng, Hà Nội', isPromo: true, isPartner: true,
    menu: [
      { id: 'r1m1', name: 'Phở Bò Đặc Biệt', description: 'Tái, nạm, gầu, bò viên, nước dùng xương ninh 8 giờ', price: 75000, image: 'https://images.unsplash.com/photo-1582878826629-29b7ad4f39fb?auto=format&fit=crop&q=80&w=800', category: 'Cơm & Mì', rating: 4.9, soldCount: '2.1k+ đã bán', isBestseller: true },
      { id: 'r1m2', name: 'Phở Gà Ta', description: 'Gà ta đồng quê, nước dùng thanh ngọt', price: 65000, image: 'https://images.unsplash.com/photo-1576577445504-6af96477db52?auto=format&fit=crop&q=80&w=800', category: 'Cơm & Mì', rating: 4.7, soldCount: '980+ đã bán' },
      { id: 'r1m3', name: 'Quẩy Giòn', description: 'Quẩy chiên giòn ăn kèm phở', price: 10000, image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?auto=format&fit=crop&q=80&w=800', category: 'Snacks', soldCount: '1.5k+ đã bán' },
      { id: 'r1m4', name: 'Cà Phê Trứng', description: 'Cà phê trứng Hà Nội truyền thống', price: 35000, image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&q=80&w=800', category: 'Đồ uống', rating: 4.8, soldCount: '700+ đã bán' },
    ]
  },
  {
    id: 'r2', name: 'Bún Bò Huế Mệ Thanh',
    image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&q=80&w=800',
    rating: 4.8, reviewCount: '3.1k+', reviews: 3100,
    categories: ['Vietnamese', 'Spicy', 'Noodles'],
    distance: '1.2 km', deliveryTime: '20-30 min', deliveryFee: '10.000đ',
    address: '15 Nguyễn Thị Minh Khai, Q.1, TP.HCM', isPromo: false, isPartner: true,
    menu: [
      { id: 'r2m1', name: 'Bún Bò Huế Đặc Biệt', description: 'Bắp bò, chả cua, huyết, sả cay', price: 70000, image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&q=80&w=800', category: 'Cơm & Mì', rating: 4.8, soldCount: '1.8k+ đã bán', isBestseller: true },
      { id: 'r2m2', name: 'Bánh Mì Thịt Nướng', description: 'Bánh mì giòn, thịt nướng mật ong, đồ chua', price: 35000, image: 'https://images.unsplash.com/photo-1627308595229-7830f5c95f9d?auto=format&fit=crop&q=80&w=800', category: 'Burgers', rating: 4.6, soldCount: '920+ đã bán' },
      { id: 'r2m3', name: 'Chả Cua Huế', description: 'Chả cua đồng thơm ngon', price: 25000, image: 'https://images.unsplash.com/photo-1543352634-99a5d50ae78e?auto=format&fit=crop&q=80&w=800', category: 'Snacks', soldCount: '500+ đã bán' },
      { id: 'r2m4', name: 'Nước Sâm Mát', description: 'Nước sâm giải nhiệt truyền thống', price: 15000, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800', category: 'Đồ uống', soldCount: '400+ đã bán' },
    ]
  },
  {
    id: 'r3', name: 'Pizza 4P\'s',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    rating: 4.7, reviewCount: '8.4k+', reviews: 8400,
    categories: ['Italian', 'Pizza', 'Pasta'],
    distance: '2.1 km', deliveryTime: '30-40 min', deliveryFee: '20.000đ',
    address: '8/15 Lê Thánh Tôn, Q.1, TP.HCM', isPromo: true, isPartner: true,
    menu: [
      { id: 'r3m1', name: 'Pizza Burrata & Prosciutto', description: 'Burrata tươi, giăm bông Ý, sốt cà chua San Marzano', price: 285000, image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&q=80&w=800', category: 'Pizza', rating: 4.9, soldCount: '3.2k+ đã bán', isBestseller: true },
      { id: 'r3m2', name: 'Spaghetti Carbonara', description: 'Mì Ý trứng, thịt xông khói, Parmesan', price: 185000, image: 'https://images.unsplash.com/photo-1612450866873-196024ef482d?auto=format&fit=crop&q=80&w=800', category: 'Mì Ý', rating: 4.7, soldCount: '1.1k+ đã bán' },
      { id: 'r3m3', name: 'Tiramisu', description: 'Tiramisu cổ điển Ý với espresso', price: 95000, image: 'https://images.unsplash.com/photo-1571877223202-556260842db3?auto=format&fit=crop&q=80&w=800', category: 'Tráng miệng', soldCount: '600+ đã bán', isBestseller: true },
    ]
  },
  {
    id: 'r4', name: 'Burger Bros TPHCM',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
    rating: 4.6, reviewCount: '2.7k+', reviews: 2700,
    categories: ['Burgers', 'American', 'Fast Food'],
    distance: '1.5 km', deliveryTime: '20-30 min', deliveryFee: 'Miễn phí',
    address: '20 Võ Văn Tần, Q.3, TP.HCM', isPromo: true, isPartner: false,
    menu: [
      { id: 'r4m1', name: 'Double Smash Burger', description: 'Hai patty beef 150g, phô mai American, sốt đặc biệt', price: 125000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800', category: 'Burgers', rating: 4.8, soldCount: '2.5k+ đã bán', isBestseller: true },
      { id: 'r4m2', name: 'Phô Mai Que (6 pcs)', description: 'Phô mai mozzarella tẩm bột chiên giòn', price: 65000, image: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&q=80&w=800', category: 'Snacks', rating: 4.5, soldCount: '800+ đã bán' },
      { id: 'r4m3', name: 'Khoai Tây Chiên Lớn', description: 'Khoai tây cắt dày, giòn vàng', price: 45000, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800', category: 'Snacks', soldCount: '1.2k+ đã bán' },
      { id: 'r4m4', name: 'Coca Cola', description: 'Lon 330ml lạnh', price: 20000, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800', category: 'Đồ uống', soldCount: '2k+ đã bán' },
    ]
  },
  {
    id: 'r5', name: 'Sushi Hokkaido',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800',
    rating: 4.9, reviewCount: '1.9k+', reviews: 1900,
    categories: ['Japanese', 'Sushi', 'Seafood'],
    distance: '3.0 km', deliveryTime: '35-45 min', deliveryFee: '15.000đ',
    address: '5 Nguyễn Huệ, Q.1, TP.HCM', isPromo: false, isPartner: true,
    menu: [
      { id: 'r5m1', name: 'Set Sashimi 15 miếng', description: 'Cá hồi, cá ngừ, bạch tuộc tươi nhập khẩu', price: 320000, image: 'https://images.unsplash.com/photo-1534083222144-f908759714da?auto=format&fit=crop&q=80&w=800', category: 'Sushi', rating: 4.9, soldCount: '1.5k+ đã bán', isBestseller: true },
      { id: 'r5m2', name: 'Dragon Roll (8 cuộn)', description: 'Cơm cuộn lươn nướng, bơ, sốt unagi', price: 195000, image: 'https://images.unsplash.com/photo-1559483253-938221c97042?auto=format&fit=crop&q=80&w=800', category: 'Sushi', rating: 4.8, soldCount: '900+ đã bán' },
      { id: 'r5m3', name: 'Ramen Tonkotsu', description: 'Nước dùng xương heo đậm đặc, chashu, trứng ngâm', price: 145000, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800', category: 'Cơm & Mì', rating: 4.7, soldCount: '700+ đã bán' },
      { id: 'r5m4', name: 'Matcha Latte', description: 'Trà xanh Uji Nhật Bản pha sữa tươi', price: 65000, image: 'https://images.unsplash.com/photo-1582733315328-84996963ef51?auto=format&fit=crop&q=80&w=800', category: 'Đồ uống', soldCount: '500+ đã bán' },
    ]
  },
  {
    id: 'r6', name: 'Cơm Tấm Sài Gòn Xưa',
    image: 'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?auto=format&fit=crop&q=80&w=800',
    rating: 4.7, reviewCount: '4.3k+', reviews: 4300,
    categories: ['Vietnamese', 'Rice', 'Southern'],
    distance: '0.5 km', deliveryTime: '15-25 min', deliveryFee: 'Miễn phí',
    address: '87 Bùi Viện, Q.1, TP.HCM', isPromo: true, isPartner: true,
    menu: [
      { id: 'r6m1', name: 'Cơm Tấm Sườn Bì Chả', description: 'Sườn nướng, bì lợn, chả trứng, nước mắm chua ngọt', price: 65000, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800', category: 'Cơm & Mì', rating: 4.8, soldCount: '3.1k+ đã bán', isBestseller: true },
      { id: 'r6m2', name: 'Cơm Tấm Gà Nướng', description: 'Gà nướng ngũ vị, cơm tấm, dưa leo', price: 60000, image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&q=80&w=800', category: 'Cơm & Mì', soldCount: '1.2k+ đã bán' },
      { id: 'r6m3', name: 'Chè Thái', description: 'Chè thái nhiều màu, sữa dừa béo ngậy', price: 30000, image: 'https://images.unsplash.com/photo-1571197119738-670e97c3f9e0?auto=format&fit=crop&q=80&w=800', category: 'Tráng miệng', soldCount: '800+ đã bán' },
    ]
  },
];

const DRIVERS = [
  { id: 'drv1', name: 'Nguyễn Văn Tài', phone: '0909123456', license: '59A1-12345', rating: 4.9, status: 'ONLINE', totalTrips: 1250, joinDate: '2023-01-10', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200' },
  { id: 'drv2', name: 'Lê Hoàng Phong', phone: '0918234567', license: '59B2-98765', rating: 4.6, status: 'ONLINE', totalTrips: 840, joinDate: '2023-03-22', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200' },
  { id: 'drv3', name: 'Trần Minh Tuấn', phone: '0937345678', license: '60C1-55555', rating: 4.2, status: 'OFFLINE', totalTrips: 520, joinDate: '2023-06-05', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' },
  { id: 'drv4', name: 'Phạm Đức Huy', phone: '0946456789', license: '51F1-88899', rating: 4.8, status: 'ONLINE', totalTrips: 2100, joinDate: '2022-11-15', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
  { id: 'drv5', name: 'Vũ Thị Lan', phone: '0955567890', license: '29D1-44321', rating: 4.7, status: 'ONLINE', totalTrips: 670, joinDate: '2024-01-20', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
  { id: 'drv6', name: 'Đỗ Văn Bình', phone: '0964678901', license: '51G1-23456', rating: 4.5, status: 'OFFLINE', totalTrips: 380, joinDate: '2024-03-10', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(days: number): number {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

const STATUSES = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'DELIVERING', 'PENDING', 'CANCELLED'];
const PAYMENT_METHODS = ['shopeepay', 'momo', 'zalopay', 'cash', 'credit'];
const CUSTOMER_NAMES = ['Nguyễn Minh Anh', 'Trần Thị Thu', 'Lê Văn Nam', 'Phạm Quỳnh Anh', 'Hoàng Đức Long', 'Vũ Thị Hoa', 'Đặng Văn Sơn', 'Bùi Thanh Tú', 'Lý Hồng Nhung', 'Dương Minh Quân'];

export async function seedDatabase(adminId: string) {
  console.log('🌱 Bắt đầu seed dữ liệu...');

  // 1. Seed Restaurants
  for (const r of RESTAURANTS) {
    const { menu, ...rest } = r;
    await setDoc(doc(db, 'restaurants', r.id), {
      ...rest,
      menu,
      ownerId: adminId,
      createdAt: daysAgo(randomBetween(30, 90)),
    });
  }
  console.log('✅ Đã seed', RESTAURANTS.length, 'nhà hàng');

  // 2. Seed Drivers
  for (const d of DRIVERS) {
    await setDoc(doc(db, 'drivers', d.id), {
      ...d,
      createdAt: daysAgo(randomBetween(30, 180)),
    });
  }
  console.log('✅ Đã seed', DRIVERS.length, 'tài xế');

  // 3. Seed Orders (60 orders spread over 30 days)
  const allMenuItems = RESTAURANTS.flatMap(r => r.menu.map(m => ({ ...m, restaurantId: r.id, restaurantName: r.name, restaurantImage: r.image })));

  for (let i = 0; i < 60; i++) {
    const restaurant = randomElement(RESTAURANTS);
    const menuItems = restaurant.menu;
    const numItems = randomBetween(1, 3);
    const items = Array.from({ length: numItems }, () => {
      const item = randomElement(menuItems);
      const qty = randomBetween(1, 3);
      const anyItem = item as any;
      return { id: anyItem.id, name: anyItem.name, price: anyItem.price, quantity: qty, category: anyItem.category, image: anyItem.image, restaurantId: restaurant.id, restaurantName: restaurant.name };
    });
    const totalPrice = items.reduce((s, it) => s + it.price * it.quantity, 0) + 15000;
    const status = randomElement(STATUSES);
    const driver = randomElement(DRIVERS);
    const customer = randomElement(CUSTOMER_NAMES);
    const daysBack = randomBetween(0, 29);

    await addDoc(collection(db, 'orders'), {
      userId: `user_${Math.floor(Math.random() * 100)}`,
      customerName: customer,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantImage: restaurant.image,
      items,
      totalPrice: status === 'CANCELLED' ? 0 : totalPrice,
      paymentMethod: randomElement(PAYMENT_METHODS),
      status,
      driverId: driver.id,
      driverName: driver.name,
      address: '72 Lê Thánh Tôn, Bến Nghé, Q.1, TP.HCM',
      date: new Date(daysAgo(daysBack)).toLocaleString('vi-VN'),
      createdAt: daysAgo(daysBack) + randomBetween(0, 86400000),
    });
  }
  console.log('✅ Đã seed 60 đơn hàng');
  console.log('🎉 Seed hoàn tất!');
  return true;
}
