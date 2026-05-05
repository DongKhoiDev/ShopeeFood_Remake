import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RestaurantCard from '../components/RestaurantCard';
import { motion } from 'motion/react';
import BottomNav from '../components/BottomNav';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import FilterModal from '../components/FilterModal';
import { useRestaurants } from '../hooks/useRestaurants';

export default function SearchResults() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { restaurants, loading } = useRestaurants();
  const [activeFilters, setActiveFilters] = useState<{sort: string, filters: string[], price: string}>({
    sort: 'Gần nhất',
    filters: [],
    price: 'all'
  });

  const getPriceRange = (restaurant: any) => {
    if (!restaurant.menu || restaurant.menu.length === 0) return 0;
    const avg = restaurant.menu.reduce((acc: number, item: any) => acc + item.price, 0) / restaurant.menu.length;
    return avg;
  };

  const filteredRestaurants = React.useMemo(() => {
    let result = restaurants.filter(r => 
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.menu.some((item: any) => item.name.toLowerCase().includes(query.toLowerCase())) ||
      r.categories.some((cat: string) => cat.toLowerCase().includes(query.toLowerCase()))
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
  }, [activeFilters, query, restaurants]);

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24">
      <Navbar />
      
      <main className="max-w-[1200px] mx-auto flex py-6 px-4 md:px-0">
        <Sidebar />

        <div className="flex-1 px-4 md:px-6 space-y-6 min-w-0">
          {/* Header & Sort */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
             <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">
                  {query ? `Kết quả cho "${query}"` : 'Tất cả cửa hàng'}
                </h1>
                <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Tìm thấy {filteredRestaurants.length} cửa hàng</p>
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

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <RestaurantCard restaurant={restaurant} />
              </motion.div>
            ))}
          </div>

          {/* Empty state simulation */}
          {filteredRestaurants.length === 0 && (
            <div className="py-24 text-center">
               <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center mx-auto mb-6 shadow-xl border border-gray-100">
                  <span className="material-symbols-outlined text-5xl text-gray-200">search_off</span>
               </div>
               <h3 className="text-2xl font-black text-gray-900 mb-2 italic">HUYÊN QUYÊN!</h3>
               <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Không tìm thấy quán phù hợp cho "{query}"</p>
               <button 
                  onClick={() => window.history.back()}
                  className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#ee4d2d] transition-all shadow-xl"
               >
                  Quay lại trang chủ
               </button>
            </div>
          )}
        </div>
      </main>

      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApply={handleApplyFilters} 
      />

      <BottomNav />
    </div>
  );
}
