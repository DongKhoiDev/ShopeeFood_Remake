import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { useRestaurants } from '../hooks/useRestaurants';
import { Star, ShieldCheck, Minus, Plus, ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { getRestaurantImage, getFoodImage } from '../lib/images';
import { ImageWithFallback } from '../components/ImageWithFallback';

export default function ItemDetail() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { restaurants, loading } = useRestaurants();
  
  // Find the item in mock data
  let foundItem = null;
  let foundRestaurant = null;
  for (const res of restaurants) {
    const item = res.menu.find((i: any) => i.id === itemId);
    if (item) {
      foundItem = item;
      foundRestaurant = res;
      break;
    }
  }

  const item = foundItem || (restaurants.length > 0 ? restaurants[0].menu[0] : null);
  const restaurant = foundRestaurant || (restaurants.length > 0 ? restaurants[0] : null);
  const [activeTab, setActiveTab ] = useState<'info' | 'reviews'>('info');
  const [selectedVariant, setSelectedVariant] = useState<any>(item?.variants?.[0] || null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    if(!item) return;
    setSelectedVariant(item.variants?.[0] || null);
    
    // Initialize default options
    const initialOptions: Record<string, Record<string, boolean>> = {};
    if (item.optionGroups) {
      item.optionGroups.forEach((group: any) => {
         initialOptions[group.name] = {};
         if (group.required && group.choices.length > 0) {
            initialOptions[group.name][group.choices[0].name] = true;
         }
      });
    }
    setSelectedOptions(initialOptions);
    setQuantity(1);
  }, [item?.id, itemId]);

  if (loading) return <div className="p-8 text-center text-orange-500 font-bold">Đang tải dữ liệu món ăn...</div>;
  if (!item || !restaurant) return null;

  const toggleOption = (groupName: string, choiceName: string, isMultiple: boolean) => {
    setSelectedOptions(prev => {
       const newGroupOptions = { ...prev[groupName] };
       
       if (isMultiple) {
          if (newGroupOptions[choiceName]) {
             delete newGroupOptions[choiceName];
          } else {
             newGroupOptions[choiceName] = true;
          }
       } else {
          // If single choice, clear others
          Object.keys(newGroupOptions).forEach(k => delete newGroupOptions[k]);
          newGroupOptions[choiceName] = true;
       }
       
       return { ...prev, [groupName]: newGroupOptions };
    });
  };

  const getOptionsPriceDelta = () => {
    let delta = 0;
    if (item.optionGroups) {
       item.optionGroups.forEach(group => {
          const selectedInGroup = selectedOptions[group.name] || {};
          group.choices.forEach(choice => {
             if (selectedInGroup[choice.name]) {
                delta += Number(choice.priceDelta);
             }
          });
       });
    }
    return delta;
  };

  const displayPrice = (selectedVariant ? Number(selectedVariant.price) : (item.price || 0)) + getOptionsPriceDelta();

  const MOCK_REVIEWS = [
    {
      id: 'r1',
      user: 'Trần Minh Tâm',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      rating: 5,
      date: '2 ngày trước',
      comment: 'Món này thực sự rất ngon, vị đậm đà và nóng hổi. Rất đáng tiền!',
      tags: ['Ngon', 'Nóng hổi', 'Size to'],
      images: [getFoodImage(item.image, item.id)]
    },
    {
      id: 'r2',
      user: 'Phạm Hồng Nhung',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      rating: 4,
      date: '1 tuần trước',
      comment: 'Giao hàng nhanh, đóng gói cẩn thận. Tuy nhiên mình thấy hơi mặn một chút.',
      tags: ['Giao nhanh', 'Đóng gói đẹp'],
    }
  ];

  return (
    <div className="min-h-screen pb-32">
      <Navbar />

      <main className="max-w-[1200px] mx-auto py-8 px-4 md:px-12">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-[#EE4D2D] font-bold text-sm transition-colors group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Quay lại thực đơn
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Image Gallery */}
          <div className="flex-1">
             <div className="aspect-square w-full rounded-[32px] overflow-hidden bg-gray-100 shadow-xl border border-[#EEEEEE]">
                <ImageWithFallback src={getFoodImage(item.image, item.id)} fallbackType="food" fallbackId={item.id} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt={item.name} />
             </div>
             
             <div className="grid grid-cols-4 gap-4 mt-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${i === 1 ? 'border-[#EE4D2D] shadow-md' : 'border-transparent hover:border-gray-200'}`}>
                    <ImageWithFallback src={getFoodImage(item.image, item.id)} fallbackType="food" fallbackId={item.id} className="w-full h-full object-cover opacity-80" alt="Thumbnail" />
                  </div>
                ))}
             </div>
          </div>

          {/* Product Actions */}
          <div className="flex-1 flex flex-col pt-4">
             <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#f9ad00]/10 text-[#7f5600] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                   <Star className="w-3 h-3 fill-current" /> Fast Food
                </span>
                <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                   <ShieldCheck className="w-3 h-3" /> Đảm bảo chất lượng
                </span>
             </div>

             <h1 className="text-4xl font-black text-gray-900 mb-2">{item.name}</h1>
             <p className="text-gray-400 font-bold mb-6 hover:text-[#EE4D2D] cursor-pointer transition-colors" onClick={() => navigate(`/restaurant/${restaurant.id}`)}>
               {restaurant.name}
             </p>

             <div className="flex items-end gap-3 mb-8">
                <span className="text-4xl font-black text-[#EE4D2D]">{(displayPrice).toLocaleString()}đ</span>
                <span className="text-xl text-gray-300 line-through font-bold mb-1">{(displayPrice * 1.3).toLocaleString()}đ</span>
                <span className="bg-[#EE4D2D] text-white px-2 py-0.5 rounded font-black text-xs mb-2">-30%</span>
             </div>

             <div className="space-y-8 mb-10">
                {item.variants && item.variants.length > 0 && (
                <div>
                   <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                      Kích cỡ <span className="text-gray-400 text-xs font-bold">(Yêu cầu)</span>
                   </h3>
                   <div className="flex flex-wrap gap-3">
                      {item.variants.map((variant) => {
                        const isSelected = selectedVariant?.name === variant.name;
                        return (
                           <button 
                              key={variant.name} 
                              onClick={() => setSelectedVariant(variant)}
                              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all border-2 ${isSelected ? 'border-[#EE4D2D] bg-orange-50 text-[#EE4D2D]' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                           >
                              {variant.name}
                           </button>
                        );
                      })}
                   </div>
                </div>
                )}

                {item.optionGroups && item.optionGroups.map((group, groupIdx) => (
                   <div key={groupIdx}>
                      <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                         {group.name} {group.required && <span className="text-gray-400 text-xs font-bold">(Yêu cầu)</span>}
                      </h3>
                      <div className="flex flex-col gap-3">
                         {group.choices.map((choice) => {
                            const isSelected = !!selectedOptions[group.name]?.[choice.name];
                            const displayDelta = Number(choice.priceDelta) > 0 ? `+${Number(choice.priceDelta).toLocaleString()}đ` : '';

                            return (
                               <button 
                                  key={choice.name} 
                                  onClick={() => toggleOption(group.name, choice.name, group.multiple)}
                                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${isSelected ? 'border-[#EE4D2D] bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}
                               >
                                  <div className="flex items-center gap-3">
                                     {group.multiple ? (
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#EE4D2D] border-[#EE4D2D]' : 'border-gray-300 bg-white'}`}>
                                           {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                     ) : (
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-[#EE4D2D] bg-white' : 'border-gray-300'}`}>
                                           {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#EE4D2D]" />}
                                        </div>
                                     )}
                                     <span className={`font-bold text-sm ${isSelected ? 'text-[#EE4D2D]' : 'text-gray-700'}`}>{choice.name}</span>
                                  </div>
                                  {displayDelta && <span className={`font-black text-sm ${isSelected ? 'text-[#EE4D2D]' : 'text-gray-500'}`}>{displayDelta}</span>}
                               </button>
                            );
                         })}
                      </div>
                   </div>
                ))}

                <div>
                   <h3 className="font-black text-gray-900 mb-4">Ghi chú</h3>
                   <textarea 
                     placeholder="Ví dụ: Không hành, nhiều cay..." 
                     className="w-full bg-[#F5F5F5] rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]/20 transition-all min-h-[100px] font-medium"
                   />
                </div>
             </div>

             <div className="mt-auto flex items-center gap-6">
                <div className="flex items-center gap-2 bg-[#F5F5F5] p-2 rounded-full border border-gray-100">
                   <button 
                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
                     className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-[#EE4D2D] hover:text-white transition-all shadow-sm active:scale-90"
                   >
                     <Minus className="w-5 h-5" />
                   </button>
                   <span className="text-xl font-black text-gray-900 w-8 text-center">{quantity}</span>
                   <button 
                     onClick={() => setQuantity(quantity + 1)}
                     className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 hover:bg-[#EE4D2D] hover:text-white transition-all shadow-sm active:scale-90"
                   >
                     <Plus className="w-5 h-5" />
                   </button>
                </div>

                <div className="flex-1 flex gap-3">
                   <motion.button 
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={() => {
                        let finalName = item.name;
                        if (selectedVariant) {
                           finalName += ` (${selectedVariant.name})`;
                        }
                        
                        const optionNames: string[] = [];
                        if (item.optionGroups) {
                           item.optionGroups.forEach(group => {
                              const selectedInGroup = selectedOptions[group.name] || {};
                              group.choices.forEach(choice => {
                                 if (selectedInGroup[choice.name]) {
                                    optionNames.push(choice.name);
                                 }
                              });
                           });
                        }
                        
                        if (optionNames.length > 0) {
                           finalName += ` [${optionNames.join(', ')}]`;
                        }

                        // Generate unique id for the combination
                        const cartItemId = `${item.id}-${selectedVariant?.name || 'base'}-${optionNames.join('-')}`;

                        const cartItem = {
                           ...item,
                           id: cartItemId,
                           name: finalName,
                           price: displayPrice
                        };
                        
                        addToCart(cartItem, quantity);
                        navigate(-1);
                     }}
                     className="flex-1 bg-[#ee4d2d] text-white font-black py-4 rounded-full shadow-xl shadow-orange-200 hover:bg-[#d73211] transition-all flex items-center justify-center gap-3"
                   >
                     <ShoppingCart className="w-5 h-5" />
                     Thêm {(displayPrice * quantity).toLocaleString()}đ
                   </motion.button>
                   <button className="w-14 h-14 rounded-full border-2 border-[#EEEEEE] flex items-center justify-center text-gray-400 hover:text-[#EE4D2D] hover:border-[#EE4D2D] hover:bg-orange-50 transition-all active:scale-90">
                      <Heart className="w-6 h-6" />
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Info & Reviews Section */}
        <div className="mt-16 border-t border-gray-100 pt-10">
           <div className="flex gap-10 border-b border-gray-100 mb-8">
              {[
                { id: 'info', label: 'Thông tin món ăn' },
                { id: 'reviews', label: `Đánh giá (${MOCK_REVIEWS.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                    activeTab === tab.id ? 'text-[#ee4d2d]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-1 bg-[#ee4d2d] rounded-full" />
                  )}
                </button>
              ))}
           </div>

           {activeTab === 'info' ? (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="max-w-[800px]"
             >
                <h3 className="text-xl font-black text-gray-900 mb-4">Mô tả sản phẩm</h3>
                <p className="text-gray-500 leading-relaxed mb-8">
                   {item.description}. Được chế biến từ những nguyên liệu tươi ngon nhất trong ngày, đảm bảo vệ sinh an toàn thực phẩm. 
                   Hương vị đặc trưng chuẩn vị, được chuẩn bị bởi các đầu bếp hàng đầu tại {restaurant.name}.
                </p>
                <div className="grid grid-cols-2 gap-8">
                   <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-2">Thành phần chính</h4>
                      <p className="text-sm text-gray-500">Bột mì, phô mai, sốt cà chua, dầu oliu và gia vị thảo mộc.</p>
                   </div>
                   <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-2">Thông tin dinh dưỡng</h4>
                      <p className="text-sm text-gray-500">250-300 Calo / phần ăn vừa.</p>
                   </div>
                </div>
             </motion.div>
           ) : (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-10"
             >
                {/* Summary Header */}
                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start bg-orange-50/30 p-8 rounded-[32px] border border-orange-100">
                   <div className="text-center">
                      <div className="text-6xl font-black text-[#ee4d2d]">4.8</div>
                      <div className="flex gap-1 justify-center my-2">
                        {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-[#f9ad00] text-[#f9ad00]" />)}
                      </div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Từ 1.2k đánh giá</p>
                   </div>
                   <div className="flex-1 w-full space-y-2">
                      {[5, 4, 3, 2, 1].map(score => (
                        <div key={score} className="flex items-center gap-3">
                           <span className="text-xs font-bold text-gray-400 w-4">{score}</span>
                           <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#f9ad00]" 
                                style={{ width: `${score === 5 ? 85 : score === 4 ? 10 : 5}%` }} 
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="md:w-64 text-center md:text-left">
                      <h4 className="font-black text-gray-900 mb-2">Bạn đã dùng món này?</h4>
                      <p className="text-xs text-gray-400 font-medium mb-4">Để lại đánh giá để giúp những người mua khác nhé!</p>
                      <button className="bg-white border-2 border-[#ee4d2d] text-[#ee4d2d] font-black px-6 py-2 rounded-xl text-sm hover:bg-[#ee4d2d] hover:text-white transition-all shadow-sm">
                         Viết nhận xét
                      </button>
                   </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-8 divide-y divide-gray-100">
                   {MOCK_REVIEWS.map(review => (
                     <div key={review.id} className="pt-8 first:pt-0">
                        <div className="flex gap-4 mb-4">
                           <img referrerPolicy="no-referrer" src={review.avatar} className="w-12 h-12 rounded-full border border-gray-100" />
                           <div>
                              <h5 className="font-black text-gray-900">{review.user}</h5>
                              <div className="flex items-center gap-3">
                                 <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map(star => (
                                      <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-[#f9ad00] text-[#f9ad00]' : 'text-gray-200'}`} />
                                    ))}
                                 </div>
                                 <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{review.date}</span>
                              </div>
                           </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.comment}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                           {review.tags?.map(tag => (
                             <span key={tag} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded-lg border border-gray-100 font-medium">#{tag}</span>
                           ))}
                        </div>
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2">
                             {review.images.map((img, i) => (
                               <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100">
                                  <img referrerPolicy="no-referrer" src={img} className="w-full h-full object-cover" />
                               </div>
                             ))}
                          </div>
                        )}
                     </div>
                   ))}
                </div>
             </motion.div>
           )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
