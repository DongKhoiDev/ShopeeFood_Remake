import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { useRestaurants } from '../hooks/useRestaurants';
import { motion } from 'motion/react';
import { Flame, Timer, Zap, ChevronRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFoodImage } from '../lib/images';
import { ImageWithFallback } from '../components/ImageWithFallback';

export default function FlashSale() {
  const navigate = useNavigate();
  const { restaurants, loading } = useRestaurants();
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Mock sale items
  const saleItems = restaurants.flatMap(r => 
    r.menu.slice(0, 2).map((item: any) => {
      const price = item.price || 0;
      return {
        ...item,
        price,
        restaurantId: r.id,
        restaurantName: r.name,
        originalPrice: Math.round(price * 1.5),
        soldCount: Math.floor(Math.random() * 50) + 10,
        totalCount: 100
      };
    })
  ).sort(() => Math.random() - 0.5);

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24">
      <Navbar />
      
      <main className="max-w-[1200px] mx-auto flex py-6 px-4 md:px-0">
        <Sidebar />
        
        <div className="flex-1 px-4 md:px-6 space-y-8 min-w-0">
          {/* Flash Sale Banner */}
          <div className="relative overflow-hidden rounded-[40px] p-8 md:p-12 text-white shadow-2xl bg-gradient-to-br from-[#FF4D4D] via-[#FF8C00] to-[#FFD700]">
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute inset-0 bg-black/10 z-[1]"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div>
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 mb-6"
                >
                  <Flame className="w-4 h-4 fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Đang diễn ra</span>
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4 drop-shadow-lg uppercase">
                  Flash <span className="text-yellow-300">Sale</span>
                </h1>
                <p className="text-white/90 font-bold max-w-sm mb-6 drop-shadow-sm">
                  Săn ngay món ngon với giá cực sốc. Kết thúc sau:
                </p>
                <div className="flex items-center justify-center md:justify-start gap-3">
                   <div className="bg-black text-white px-4 py-3 rounded-2xl font-black text-2xl min-w-[70px] text-center shadow-xl">
                      {formatTime(timeLeft).split(':')[0]}
                   </div>
                   <span className="text-2xl font-black text-white">:</span>
                   <div className="bg-black text-white px-4 py-3 rounded-2xl font-black text-2xl min-w-[70px] text-center shadow-xl">
                      {formatTime(timeLeft).split(':')[1]}
                   </div>
                   <span className="text-2xl font-black text-white">:</span>
                   <div className="bg-[#ee4d2d] text-white px-4 py-3 rounded-2xl font-black text-2xl min-w-[70px] text-center shadow-xl">
                      {formatTime(timeLeft).split(':')[2]}
                   </div>
                </div>
              </div>
              
              <div className="hidden lg:block relative">
                 <div className="w-64 h-64 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 flex items-center justify-center rotate-12">
                    <Zap className="w-32 h-32 text-yellow-300 fill-current drop-shadow-2xl" />
                 </div>
              </div>
            </div>
          </div>

          {/* Sale Items Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {saleItems.map((item, index) => (
              <motion.div
                key={`${item.restaurantId}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm group hover:shadow-xl hover:shadow-orange-100 transition-all duration-500 cursor-pointer"
                onClick={() => navigate(`/restaurant/${item.restaurantId}`)}
              >
                <div className="relative aspect-square">
                  <ImageWithFallback src={getFoodImage(item.image, item.id)} alt={item.name} fallbackType="food" fallbackId={item.id} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-red-600 text-white font-black text-[10px] px-3 py-1.5 rounded-full shadow-lg z-10">
                     Giam {Math.round((1 - item.price / item.originalPrice) * 100)}%
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-black text-gray-900 group-hover:text-[#ee4d2d] transition-colors line-clamp-1 mb-1">{item.name}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-tighter truncate">{item.restaurantName}</p>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-black text-[#ee4d2d]">{item.price.toLocaleString()}đ</span>
                    <span className="text-xs font-bold text-gray-400 line-through">{item.originalPrice.toLocaleString()}đ</span>
                  </div>

                  <div className="relative h-4 bg-orange-100 rounded-full overflow-hidden mb-2">
                     <div 
                       className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                       style={{ width: `${(item.soldCount / item.totalCount) * 100}%` }}
                     ></div>
                     <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white uppercase tracking-widest drop-shadow-sm">
                        Đã bán {item.soldCount}
                     </span>
                  </div>
                  
                  <button className="w-full mt-2 py-3 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#ee4d2d] transition-all flex items-center justify-center gap-2">
                     MUA NGAY
                     <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
