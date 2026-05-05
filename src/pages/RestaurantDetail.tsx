import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { useRestaurants } from '../hooks/useRestaurants';
import { Star, MapPin, Share2, Heart, Plus, Receipt, ShoppingCart, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Restaurant, FoodItem } from '../types';
import { getRestaurantImage, getFoodImage } from '../lib/images';
import { ImageWithFallback } from '../components/ImageWithFallback';

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { restaurants, loading } = useRestaurants();
  const { items, addToCart, totalPrice, updateQuantity } = useCart();
  const { user } = useAuth();
  const deliveryFee = 15000;

  const restaurant = restaurants.find(r => r.id === id) || restaurants[0];

  if (loading) return <div className="p-8 text-center text-orange-500 font-bold">Đang tải dữ liệu quán...</div>;
  if (!restaurant) return null;

  // Group menu items by category
  const groupedMenu = restaurant.menu.reduce((acc, item) => {
    const category = item.category || 'Khác';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof restaurant.menu>);

  const bestSellers = restaurant.menu.filter(item => item.isBestseller);
  const categories = Object.keys(groupedMenu);

  const scrollToCategory = (category: string) => {
    const element = document.getElementById(`category-${category}`);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-[#f8f8f8]">
      <Navbar />

      <main className="max-w-[1200px] mx-auto pt-6 px-4 md:px-12">
        {/* Banner */}
        <div className="relative w-full h-48 md:h-[320px] rounded-3xl overflow-hidden shadow-lg mb-8">
          <ImageWithFallback 
            src={getRestaurantImage(restaurant.image, restaurant.id)} 
            className="w-full h-full object-cover" 
            alt={restaurant.name}
            fallbackType="restaurant"
            fallbackId={restaurant.id}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-gray-900">arrow_back</span>
          </button>
        </div>

        {/* Info Card */}
        <div className="relative z-10 bg-white p-6 md:p-8 rounded-[40px] shadow-xl border border-gray-100 -mt-24 mx-4 md:mx-10 mb-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{restaurant.name}</h1>
                {restaurant.isPromo && (
                   <div className="bg-[#EE4D2D] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-orange-100">Sale Off</div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                <div className="flex items-center gap-1.5 text-orange-500 font-black">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-xl">{restaurant.rating}</span>
                </div>
                <div className="h-4 w-px bg-gray-200"></div>
                <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">{restaurant.reviewCount} ĐÁNH GIÁ</span>
                <div className="h-4 w-px bg-gray-200"></div>
                <button className="text-[#EE4D2D] font-black text-[10px] uppercase tracking-widest hover:underline transition-all">Chi tiết quán</button>
              </div>

              <div className="space-y-3">
                <p className="flex items-center gap-2 text-gray-500 text-sm font-bold bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <MapPin className="w-4 h-4 text-[#EE4D2D]" />
                  <span className="line-clamp-1">{restaurant.address} • {restaurant.distance}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {restaurant.categories.map(c => (
                    <span key={c} className="bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider italic border border-orange-100">{c}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4 md:mt-2">
              <button className="w-12 h-12 flex items-center justify-center border border-gray-100 text-gray-400 hover:text-[#EE4D2D] hover:border-orange-100 hover:bg-orange-50 transition-all rounded-2xl active:scale-90 bg-white">
                <Heart className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 flex items-center justify-center border border-gray-100 text-gray-400 hover:text-gray-900 transition-all rounded-2xl active:scale-90 bg-white">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Menu Sections */}
          <div className="flex-1 min-w-0">
             {/* Sticky Category Tabs */}
             <div className="sticky top-20 z-30 flex gap-2 mb-10 overflow-x-auto no-scrollbar py-4 bg-[#f8f8f8]">
                {bestSellers.length > 0 && (
                   <button 
                     onClick={() => scrollToCategory('popular')}
                     className="bg-gray-900 text-white font-black px-6 py-3 rounded-2xl shadow-xl text-[10px] uppercase tracking-widest whitespace-nowrap active:scale-95 transition-all"
                   >
                     Khuyên dùng ⭐
                   </button>
                )}
                {categories.map(category => (
                  <button 
                    key={category}
                    onClick={() => scrollToCategory(category)}
                    className="bg-white text-gray-500 border border-gray-100 font-black px-6 py-3 rounded-2xl hover:border-[#ee4d2d] hover:text-[#ee4d2d] text-[10px] uppercase tracking-widest whitespace-nowrap active:scale-95 transition-all shadow-sm"
                  >
                    {category}
                  </button>
                ))}
             </div>

             <div className="space-y-16">
                {bestSellers.length > 0 && (
                  <section id="category-popular">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-10 h-10 bg-yellow-400 text-white rounded-xl flex items-center justify-center shadow-lg shadow-yellow-100">
                          <Star className="w-6 h-6 fill-current" />
                       </div>
                       <h2 className="text-2xl font-black text-gray-900 tracking-tight italic">MÓN BÁN CHẠY</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {bestSellers.map(item => (
                          <MenuItem key={item.id} item={item} addToCart={addToCart} navigate={navigate} />
                       ))}
                    </div>
                  </section>
                )}

                {categories.map(category => (
                  <section key={category} id={`category-${category}`}>
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-1 h-8 bg-[#ee4d2d] rounded-full"></div>
                       <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">{category}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {groupedMenu[category].map(item => (
                          <MenuItem key={item.id} item={item} addToCart={addToCart} navigate={navigate} />
                       ))}
                    </div>
                  </section>
                ))}
             </div>
          </div>

          {/* Cart Sidebar Desktop */}
          <div className="hidden lg:block w-[380px] shrink-0">
             <div className="sticky top-24 bg-white rounded-[40px] border border-gray-100 p-8 shadow-2xl shadow-gray-100">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                   <Receipt className="w-5 h-5 text-[#ee4d2d]" />
                   Đơn hàng của bạn
                </h3>

                {items.length === 0 ? (
                  <div className="py-12 text-center">
                    <ShoppingCart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold text-sm">Chưa có món nào được chọn</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto no-scrollbar">
                       {items.map(item => (
                          <div key={item.id} className="flex flex-col gap-2">
                            <div className="flex justify-between items-start text-sm">
                              <div className="flex gap-3 flex-1">
                                 <span className="bg-[#ee4d2d]/10 text-[#ee4d2d] text-xs font-bold min-w-[24px] h-6 flex items-center justify-center rounded">{item.quantity}</span>
                                 <div className="flex flex-col">
                                   <span className="font-bold text-gray-800 line-clamp-1">{item.name}</span>
                                   <span className="text-[10px] text-gray-400 font-bold uppercase">Small</span>
                                 </div>
                              </div>
                              <span className="font-bold shrink-0">{((item.price || 0) * item.quantity).toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-end gap-2 ml-9">
                               <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-gray-400 hover:text-[#ee4d2d]">
                                  <Trash2 className="w-4 h-4" />
                               </button>
                               <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-gray-400 hover:text-[#ee4d2d]">
                                  <Plus className="w-4 h-4" />
                               </button>
                            </div>
                          </div>
                       ))}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl mb-6 space-y-2 border border-gray-100">
                       <div className="flex justify-between text-sm text-gray-500 font-medium">
                          <span>Tạm tính</span>
                          <span>{totalPrice.toLocaleString()}đ</span>
                       </div>
                       <div className="flex justify-between text-sm text-gray-500 font-medium pb-2 border-b border-gray-100">
                          <span>Phí giao hàng</span>
                          <span>{deliveryFee.toLocaleString()}đ</span>
                       </div>
                       <div className="flex justify-between text-lg font-black pt-2">
                          <span>Tổng cộng</span>
                          <span className="text-[#ee4d2d]">{(totalPrice + deliveryFee).toLocaleString()}đ</span>
                       </div>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/checkout')}
                      className="w-full bg-[#ee4d2d] text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-200 hover:bg-[#d73211] transition-all"
                    >
                      Thanh toán ({(totalPrice + deliveryFee).toLocaleString()}đ)
                    </motion.button>
                  </>
                )}
             </div>
          </div>
        </div>
      </main>

      {/* Mobile Cart Bar */}
      {items.length > 0 && (
         <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 z-40 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="relative">
                   <ShoppingCart className="w-7 h-7 text-[#ee4d2d]" />
                   <span className="absolute -top-1 -right-1 bg-[#ee4d2d] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white">{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
                </div>
                <div className="flex flex-col">
                   <span className="font-black text-lg">{(totalPrice + deliveryFee).toLocaleString()}đ</span>
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight line-clamp-1">Giao đến {user?.address || '72 Lê Thánh Tôn'}</span>
                </div>
             </div>
             <button 
              onClick={() => navigate('/checkout')}
              className="bg-[#ee4d2d] text-white font-bold px-8 py-3 rounded-full shadow-md active:scale-95 transition-transform"
             >
               Thanh toán
             </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

interface MenuItemProps {
  item: FoodItem;
  addToCart: (item: FoodItem) => void;
  navigate: ReturnType<typeof useNavigate>;
  key?: React.Key;
}

function MenuItem({ item, addToCart, navigate }: MenuItemProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-5 rounded-[32px] flex gap-5 border border-gray-100 hover:shadow-xl hover:shadow-orange-100 transition-all cursor-pointer group"
      onClick={() => navigate(`/item/${item.id}`)}
    >
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-900 group-hover:text-[#ee4d2d] transition-colors leading-tight">{item.name}</h3>
        </div>
        <p className="text-[11px] text-gray-400 font-medium line-clamp-2 mb-4 leading-relaxed">{item.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-black text-[#ee4d2d]">{(item.price || 0).toLocaleString()}đ</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(item);
            }}
            className="bg-gray-900 text-white p-2 rounded-xl hover:bg-[#ee4d2d] hover:scale-110 active:scale-95 transition-all shadow-lg"
          >
             <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-50 relative">
        <ImageWithFallback src={getFoodImage(item.image, item.id)} fallbackType="food" fallbackId={item.id} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
        {item.isBestseller && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-white p-1 rounded-lg">
            <Star className="w-3 h-3 fill-current" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
