import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RestaurantCard from '../components/RestaurantCard';
import { CATEGORIES } from '../constants';
import { useRestaurants } from '../hooks/useRestaurants';
import { motion } from 'motion/react';
import BottomNav from '../components/BottomNav';
import FilterModal from '../components/FilterModal';
import { SlidersHorizontal } from 'lucide-react';

import { getRestaurantImage, getFoodImage } from '../lib/images';
import { ImageWithFallback } from '../components/ImageWithFallback';

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('Cơm & Mì');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const { restaurants, loading } = useRestaurants();
  const [activeFilters, setActiveFilters] = React.useState<{sort: string, filters: string[], price: string}>({
    sort: 'Gần nhất',
    filters: [],
    price: 'all'
  });

  const getPriceRange = (restaurant: any) => {
    // calculate average price of menu items or just use a mock logic
    if (!restaurant.menu || restaurant.menu.length === 0) return 0;
    const avg = restaurant.menu.reduce((acc: number, item: any) => acc + item.price, 0) / restaurant.menu.length;
    return avg;
  };

  const filteredRestaurants = React.useMemo(() => {
    let result = [...restaurants];

    // Filter by features
    if (activeFilters.filters.includes('Đánh giá 4.5+')) {
      result = result.filter(r => r.rating >= 4.5);
    }
    if (activeFilters.filters.includes('Ưu đãi Partner')) {
      result = result.filter(r => r.isPartner);
    }
    // Filter by price
    if (activeFilters.price === 'under50') {
      result = result.filter(r => getPriceRange(r) <= 50000);
    } else if (activeFilters.price === '50-100') {
      result = result.filter(r => getPriceRange(r) > 50000 && getPriceRange(r) <= 100000);
    } else if (activeFilters.price === 'above100') {
      result = result.filter(r => getPriceRange(r) > 100000);
    }

    // Sort
    if (activeFilters.sort === 'Đánh giá') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (activeFilters.sort === 'Bán chạy') {
      // Mock logic for bestseller
      result.sort((a, b) => b.reviews - a.reviews);
    } else if (activeFilters.sort === 'Giá giảm dần') {
      result.sort((a, b) => getPriceRange(b) - getPriceRange(a));
    }

    return result;
  }, [activeFilters, restaurants]);

  // For suggestion food items, optionally we can filter too, but the request was "bộ lọc của trang chủ và các danh mục khác không hoạt động" which usually applies to restaurants. 

  
  const promos = [
    { title: 'Giảm 50% đơn 0đ', subtitle: 'Dành cho bạn mới', color: 'from-orange-500 to-red-600', icon: 'celebration' },
    { title: 'Freeship mọi nơi', subtitle: 'Nhập mã: FS0D', color: 'from-blue-500 to-cyan-600', icon: 'local_shipping' },
    { title: 'Hoàn xu 20%', subtitle: 'Thanh toán ShopeePay', color: 'from-purple-500 to-pink-600', icon: 'payments' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navbar />
      
      <main className="max-w-[1200px] mx-auto flex py-6 px-4 md:px-0">
        <Sidebar />
        
        <div className="flex-1 px-4 md:px-6 space-y-12 min-w-0">
          {/* Enhanced Hero Section */}
          <section className="relative overflow-hidden group">
            <div className="bg-gradient-to-br from-[#ee4d2d] via-[#f55d3e] to-[#ff7337] rounded-[40px] p-8 md:p-14 text-white shadow-2xl shadow-orange-100 relative">
               <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
                  <div className="absolute top-10 right-10 rotate-12 scale-150"><span className="material-symbols-outlined text-9xl text-white">fastfood</span></div>
                  <div className="absolute bottom-10 right-40 -rotate-12 scale-125"><span className="material-symbols-outlined text-8xl text-white">local_pizza</span></div>
               </div>
               
               <div className="relative z-10">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 mb-6"
                  >
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Khám phá ngay</span>
                  </motion.div>
                  <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase drop-shadow-lg">
                    Ăn gì <span className="text-yellow-300 underline underline-offset-8 decoration-white/30">cũng có</span>,<br/> freeship <span className="text-gray-900">mọi nơi</span>
                  </h2>
                  <p className="text-orange-50 font-medium max-w-md mb-8 text-sm md:text-base opacity-90">
                    Hơn 10,000 quán ngon đang chờ bạn khám phá. Đặt ngay để nhận ưu đãi giảm tới 50% hôm nay!
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button onClick={() => navigate('/flash-sale')} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-gray-800 transition-all shadow-xl text-sm uppercase tracking-widest">Đặt món ngay</button>
                  </div>
               </div>
            </div>
          </section>

          {/* Promos Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {promos.map((promo, i) => (
               <motion.div 
                 key={i}
                 whileHover={{ y: -5 }}
                 className={`bg-gradient-to-br ${promo.color} p-6 rounded-[32px] text-white shadow-lg relative overflow-hidden group cursor-pointer`}
               >
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{promo.subtitle}</p>
                    <h3 className="text-lg font-black">{promo.title}</h3>
                  </div>
                  <span className="material-symbols-outlined absolute right-[-10px] bottom-[-10px] text-8xl opacity-20 group-hover:scale-110 transition-transform">
                    {promo.icon}
                  </span>
               </motion.div>
             ))}
          </section>

          {/* Categories Horizontal Scroll */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Hôm nay ăn gì?</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Danh mục món ăn phổ biến</p>
              </div>
              <button onClick={() => navigate('/search')} className="text-[#ee4d2d] font-black text-xs uppercase tracking-widest hover:underline px-4 py-2 bg-orange-50 rounded-xl transition-all">Xem tất cả</button>
            </div>
            
            <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x pb-4">
              {CATEGORIES.map((cat, index) => (
                <button 
                  key={cat.id}
                  onClick={() => navigate(`/category/${cat.id}`)}
                  className="flex flex-col items-center gap-3 min-w-[85px] snap-start group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-[28px] ${cat.color} flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-2xl group-hover:shadow-orange-200 border-4 border-white`}
                  >
                    <span className={`material-symbols-outlined ${cat.iconColor} text-2xl md:text-3xl drop-shadow-sm`}>{cat.icon}</span>
                  </motion.div>
                  <span className="text-[11px] md:text-xs font-black text-gray-500 group-hover:text-[#ee4d2d] text-center whitespace-nowrap uppercase tracking-tighter transition-colors">{cat.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Restaurants Grid */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 text-[#ee4d2d] rounded-2xl flex items-center justify-center">
                   <span className="material-symbols-outlined text-2xl">local_fire_department</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Cửa hàng nổi bật</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Những quán được đặt nhiều nhất</p>
                </div>
              </div>
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#ee4d2d] transition-all shadow-lg active:scale-95"
              >
                 <SlidersHorizontal className="w-4 h-4" /> Bộ lọc
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredRestaurants.slice(0, 6).map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RestaurantCard restaurant={restaurant} />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Categorized Food Items Section - Compact with Tabs */}
          <section className="bg-white rounded-[40px] p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Gợi ý món ngon</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Dành riêng cho bạn</p>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {['Cơm & Mì', 'Đồ uống', 'Pizza', 'Sushi'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeTab === tab ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-100' : 'bg-gray-50 text-gray-500 border-transparent hover:border-orange-100 hover:text-orange-600'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {restaurants.flatMap(r => 
                r.menu.filter((item: any) => item.category === activeTab).map((item: any) => ({...item, restaurantId: r.id, restaurantName: r.name}))
              ).slice(0, 10).map((item, idx) => (
                <motion.div
                  key={`${item.id}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  className="bg-gray-50 rounded-[28px] p-2.5 border border-transparent hover:border-orange-100 hover:bg-white hover:shadow-xl hover:shadow-orange-100/50 transition-all cursor-pointer group"
                  onClick={() => navigate(`/restaurant/${item.restaurantId}`)}
                >
                  <div className="aspect-square rounded-[20px] overflow-hidden mb-3 relative">
                    <ImageWithFallback src={getFoodImage(item.image, item.id)} alt={item.name} fallbackType="food" fallbackId={item.id} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    {item.isBestseller && (
                      <div className="absolute top-1.5 right-1.5 bg-yellow-400 text-white p-1 rounded-lg">
                        <span className="material-symbols-outlined text-[8px] font-black">star</span>
                      </div>
                    )}
                  </div>
                  <h5 className="font-black text-gray-900 text-[11px] line-clamp-1 mb-0.5 group-hover:text-[#ee4d2d] transition-colors">{item.name}</h5>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter truncate mb-2">{item.restaurantName}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-[#ee4d2d]">{(item.price || 0).toLocaleString()}đ</span>
                    <div className="bg-white text-gray-900 p-1 rounded-lg group-hover:bg-[#ee4d2d] group-hover:text-white shadow-sm transition-all">
                       <span className="material-symbols-outlined text-[10px] font-black">add</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <button className="w-full mt-8 py-3 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 hover:text-orange-500 hover:border-orange-200 transition-all"> Xem thêm món ngon </button>
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-12 mt-12 md:pb-12 pb-24">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-12 text-center text-gray-400">
          <h1 className="text-2xl font-black mb-2 flex items-center justify-center gap-2 opacity-20">
             SH <div className="w-4 h-4 bg-gray-200 rounded-sm"></div> PEEFOOD
          </h1>
          <p className="text-[10px] uppercase font-bold tracking-widest">© 2023 ShopeeFood. Bảo lưu mọi quyền.</p>
        </div>
      </footer>

      <BottomNav />
      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApply={(filters) => {
          setActiveFilters(filters);
          setIsFilterOpen(false);
        }} 
      />
    </div>
  );
}
