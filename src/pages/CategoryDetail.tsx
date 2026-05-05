import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import RestaurantCard from '../components/RestaurantCard';
import FilterModal from '../components/FilterModal';
import { motion } from 'motion/react';
import { Filter, ChevronDown, UtensilsCrossed, SlidersHorizontal } from 'lucide-react';
import { useRestaurants } from '../hooks/useRestaurants';

export default function CategoryDetail() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { restaurants, loading } = useRestaurants();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{sort: string, filters: string[], price: string}>({
    sort: 'Gần nhất',
    filters: [],
    price: 'all'
  });

  const category = CATEGORIES.find(c => c.id === categoryId);
  
  const getPriceRange = (restaurant: any) => {
    if (!restaurant.menu || restaurant.menu.length === 0) return 0;
    const avg = restaurant.menu.reduce((acc: number, item: any) => acc + item.price, 0) / restaurant.menu.length;
    return avg;
  };

  const filteredRestaurants = React.useMemo(() => {
    let result = restaurants.filter(r => 
      r.categories.some((cat: string) => cat.toLowerCase() === category?.name.toLowerCase()) ||
      r.menu.some((item: any) => item.category.toLowerCase() === category?.name.toLowerCase())
    );

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
      result.sort((a, b) => b.reviews - a.reviews);
    } else if (activeFilters.sort === 'Giá giảm dần') {
      result.sort((a, b) => getPriceRange(b) - getPriceRange(a));
    }

    return result;
  }, [activeFilters, category, restaurants]);

  if (!category) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Navbar />
        <main className="max-w-[1200px] mx-auto flex py-6 px-4">
          <Sidebar />
          <div className="flex-1 py-20 px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-400">Không tìm thấy danh mục này</h2>
            <button onClick={() => navigate('/')} className="mt-4 text-[#ee4d2d] font-bold">Quay lại trang chủ</button>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24">
      <Navbar />
      
      <main className="max-w-[1200px] mx-auto flex py-6 px-4 md:px-0">
        <Sidebar />
        
        <div className="flex-1 px-4 md:px-6 space-y-8 min-w-0">
          {/* Category Banner - Enhanced with Orange Theme & Pattern */}
          <div className="relative overflow-hidden rounded-[32px] p-8 md:p-12 text-white shadow-2xl shadow-orange-200/50 bg-gradient-to-br from-[#ee4d2d] via-[#f55d3e] to-[#ff7337]">
            {/* Background Pattern: Food Illustrations */}
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
               <div className="absolute top-4 left-10 rotate-12"><UtensilsCrossed className="w-20 h-20" /></div>
               <div className="absolute top-20 right-20 -rotate-12"><UtensilsCrossed className="w-16 h-16" /></div>
               <div className="absolute bottom-10 left-1/4 rotate-45"><UtensilsCrossed className="w-12 h-12" /></div>
               <div className="absolute top-1/2 right-1/3 -rotate-45"><UtensilsCrossed className="w-24 h-24" /></div>
               <div className="absolute bottom-4 right-10 rotate-12"><UtensilsCrossed className="w-32 h-32" /></div>
            </div>

            {/* Dark gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent z-[1]"></div>

            <div className="relative z-10">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                  <span className="material-symbols-outlined text-white text-2xl drop-shadow-sm">{category.icon}</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90 drop-shadow-sm">Danh mục món ăn</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4 italic drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]"
              >
                Quán {category.name}
              </motion.h1>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <p className="text-white/95 font-bold max-w-md text-sm md:text-base drop-shadow-md bg-black/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                  Tìm thấy <span className="text-yellow-300 font-black">{filteredRestaurants.length} cửa hàng</span> đang phục vụ
                </p>
              </motion.div>
            </div>
          </div>

          {/* Filters Bar */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
             <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Khu vực cửa hàng</h2>
                <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Sắp xếp để tìm quán ngon nhất</p>
             </div>
             
             <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#ee4d2d] transition-all shadow-lg active:scale-95"
                >
                   <SlidersHorizontal className="w-4 h-4" /> Bộ lọc
                </button>
                <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center gap-2 bg-white px-6 py-2.5 rounded-xl text-xs font-black text-gray-900 border border-gray-200 shadow-sm hover:border-[#ee4d2d] transition-all uppercase tracking-widest active:scale-95"
                >
                   {activeFilters.sort} <ChevronDown className="w-4 h-4" />
                </button>
             </div>
          </section>

          {/* Applied Filters Tags */}
          <div className="flex flex-wrap gap-3">
             {activeFilters.filters.map(tag => (
               <div key={tag} className="bg-orange-50 text-[#ee4d2d] text-[10px] font-black px-4 py-2 rounded-xl border border-orange-100 uppercase tracking-widest flex items-center gap-3 shadow-sm italic">
                  {tag}
                  <span 
                    onClick={() => setActiveFilters(prev => ({...prev, filters: prev.filters.filter(f => f !== tag)}))}
                    className="cursor-pointer hover:bg-[#ee4d2d] hover:text-white rounded-full w-4 h-4 flex items-center justify-center transition-all bg-white"
                  >×</span>
               </div>
             ))}
             {activeFilters.price !== 'all' && (
               <div className="bg-gray-900 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest flex items-center gap-3 shadow-lg">
                  Giá: {activeFilters.price}
                  <span 
                    onClick={() => setActiveFilters(prev => ({...prev, price: 'all'}))}
                    className="cursor-pointer hover:text-orange-500 transition-all font-black"
                  >×</span>
               </div>
             )}
          </div>

          {/* Restaurant List */}
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <RestaurantCard restaurant={restaurant} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center bg-white rounded-[32px] border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-10 h-10 text-gray-200" />
              </div>
              <h2 className="text-xl font-bold text-gray-400 mb-2">Hiện chưa có cửa hàng nào</h2>
              <p className="text-sm text-gray-400 px-6">Vui lòng quay lại sau hoặc thử tìm danh mục khác nhé!</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
      
      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApply={(filters) => {
          setActiveFilters(filters);
        }} 
      />
    </div>
  );
}
