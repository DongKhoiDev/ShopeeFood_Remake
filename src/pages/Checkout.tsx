import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { MapPin, CreditCard, Ticket, Clock, ChevronRight, Wallet, ShoppingCart, ReceiptText, Star, Bike, RotateCcw, Banknote } from 'lucide-react';
import { motion } from 'motion/react';
import { getRestaurantImage, getFoodImage } from '../lib/images';
import { ImageWithFallback } from '../components/ImageWithFallback';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, addToCart } = useCart();
  const { token, user, updateProfileData } = useAuth();
  const [activeTab, setActiveTab] = useState<'cart' | 'active' | 'history'>('cart');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [restaurantRating, setRestaurantRating] = useState(5);
  const [driverRating, setDriverRating] = useState(5);
  const [restaurantReview, setRestaurantReview] = useState('');
  const [driverReview, setDriverReview] = useState('');

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddress, setEditAddress] = useState(user?.address || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  const handleSaveAddress = async () => {
    try {
      await updateProfileData(user?.name || '', editPhone, editAddress);
      setIsEditingAddress(false);
    } catch (e) {
      console.error(e);
    }
  };
  
  const [paymentMethod, setPaymentMethod] = useState<'shopeepay' | 'momo' | 'zalopay' | 'credit' | 'cash'>('shopeepay');
  
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{code: string, discount: number} | null>(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [pastOrders, setPastOrders] = useState<any[]>([]);
  
  const [ratedOrders, setRatedOrders] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('sf_rated_orders') || '[]');
    } catch {
      return [];
    }
  });

  const handleRateOrder = async () => {
    if (selectedOrder) {
      try {
        if (selectedOrder.restaurantId) {
          const { doc, getDoc, updateDoc } = await import('firebase/firestore');
          const restaurantRef = doc(db, 'restaurants', selectedOrder.restaurantId);
          const rSnap = await getDoc(restaurantRef);
          if (rSnap.exists()) {
             const rData = rSnap.data();
             const currReviews = rData.reviews || 0;
             const currRating = rData.rating || 5;
             const newReviews = currReviews + 1;
             const newRating = ((currRating * currReviews) + restaurantRating) / newReviews;
             
             await updateDoc(restaurantRef, {
                rating: Number(newRating.toFixed(1)),
                reviews: newReviews,
                reviewCount: `${newReviews}`
             });
          }
        }
        
        // If order has driverId, update driver rating. Else we can fake update a mock driver if we want,
        // but since driver is not in DB yet for this app, we'll gracefully handle it.
        // The user says "đánh giá món ăn và cả tài xế, sau khi món ăn được đánh giá thì tính lại số sao chia trung bình thực tế và cập nhật các dữ liệu liên quan"
        // Let's also update order to save the rating and review locally.
        const { doc, updateDoc } = await import('firebase/firestore');
        await updateDoc(doc(db, 'orders', selectedOrder.id), {
          restaurantRating,
          driverRating,
          restaurantReview,
          driverReview,
          isRated: true
        });

      } catch (e) {
        console.error("Error updating rating:", e);
      }

      const updated = [...ratedOrders, selectedOrder.id];
      setRatedOrders(updated);
      localStorage.setItem('sf_rated_orders', JSON.stringify(updated));
    }
    setShowRatingModal(false);
  };

  const handleReorder = (order: any) => {
    // Add all items from order to cart
    let orderItems = order.items;
    if (typeof orderItems === 'string') {
      try { orderItems = JSON.parse(orderItems); } catch(e) {}
    }
    
    if (Array.isArray(orderItems)) {
      clearCart();
      orderItems.forEach((item: any) => {
        // Mock a food item format and add to cart
        addToCart(item); // Note: quantity is handled inside addToCart
      });
      setActiveTab('cart');
    }
  };

  useEffect(() => {
    if (activeTab !== 'cart') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user.id),
      );
      const snapshot = await getDocs(q);
      const data: any[] = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      // Sort in JS instead of compound query to avoid building index if not yet ready
      data.sort((a, b) => b.createdAt - a.createdAt);

      setActiveOrders(data.filter((o: any) => o.status === 'PENDING' || o.status === 'PREPARING' || o.status === 'DELIVERING'));
      setPastOrders(data.filter((o: any) => o.status === 'COMPLETED' || o.status === 'CANCELLED'));
    } catch (e) {
      console.error('Lỗi khi tải đơn hàng:', e);
    }
  };

  const paymentMethods = [
    { id: 'shopeepay', label: 'Ví ShopeePay', icon: Wallet, color: 'bg-[#ee4d2d]', promo: 'Ưu đãi -20k đơn từ 100k' },
    { id: 'momo', label: 'Ví MoMo', icon: Wallet, color: 'bg-[#ae2070]', promo: 'Hoàn xu 5% tối đa 10k' },
    { id: 'zalopay', label: 'Ví ZaloPay', icon: Wallet, color: 'bg-[#008fe5]', promo: 'Giảm 10k cho bạn mới' },
    { id: 'credit', label: 'Thẻ tín dụng/ghi nợ', icon: CreditCard, color: 'bg-gray-800', promo: undefined },
    { id: 'cash', label: 'Tiền mặt', icon: Banknote, color: 'bg-green-600', promo: undefined },
  ] as { id: 'shopeepay' | 'momo' | 'zalopay' | 'credit' | 'cash', label: string, icon: any, color: string, promo?: string }[];

  const deliveryFee = 15000;
  const paymentDiscount = paymentMethod === 'shopeepay' && totalPrice >= 100000 ? 20000 : 0;
  const voucherDiscount = appliedVoucher ? appliedVoucher.discount : 0;
  const totalDiscount = paymentDiscount + voucherDiscount;

  const handleApplyVoucher = (code: string) => {
    // Simple mock voucher logic
    if (code.toUpperCase() === 'FREESHIP') {
      setAppliedVoucher({ code: 'FREESHIP', discount: deliveryFee });
    } else if (code.toUpperCase() === 'FOOD50K') {
      setAppliedVoucher({ code: 'FOOD50K', discount: Math.min(totalPrice * 0.15, 50000) });
    } else if (code.toUpperCase() === 'SFAPP25') {
       if (totalPrice >= 50000) {
          setAppliedVoucher({ code: 'SFAPP25', discount: 25000 });
       } else {
          alert('Đơn hàng chưa đạt giá trị tối thiểu 50k');
       }
    } else {
      alert('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    }
    setShowVoucherModal(false);
  };


  const handlePlaceOrder = async () => {
    if (!user) {
       alert('Bạn cần đăng nhập để đặt hàng!');
       return;
    }
    try {
      const restaurantId = items[0]?.restaurantId || 'unknown';
      const restaurantName = items[0]?.restaurantName || 'Nhà hàng';
      const restaurantImage = items[0]?.image || '';
      
      const newOrderInfo = {
        userId: user.id,
        restaurantId,
        restaurantName,
        restaurantImage,
        address: editAddress || user?.address || '72 Lê Thánh Tôn, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        items,
        totalPrice: Math.max(0, totalPrice + deliveryFee - totalDiscount),
        paymentMethod,
        status: 'PENDING',
        date: new Date().toLocaleString(),
        createdAt: Date.now()
      };
      
      const docRef = await addDoc(collection(db, 'orders'), newOrderInfo);
      clearCart();
      setActiveTab('active');
      fetchOrders();
    } catch (e) {
      console.error(e);
      alert('Có lỗi xảy ra khi đặt hàng');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24">
      <Navbar />

      <main className="max-w-[1200px] mx-auto py-8 px-4 md:px-12">
        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white p-1 rounded-2xl shadow-sm border border-gray-100 mb-8 w-fit mx-auto md:mx-0">
          {[
            { id: 'cart', label: 'Giỏ hàng', icon: ShoppingCart },
            { id: 'active', label: 'Đang đến', count: activeOrders.length, icon: Clock },
            { id: 'history', label: 'Lịch sử', icon: ReceiptText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-[#ee4d2d] text-white shadow-lg shadow-orange-100' 
                : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white text-[#ee4d2d]' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'cart' && (
          items.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <ShoppingCart className="w-10 h-10 text-gray-200" />
               </div>
               <h2 className="text-xl font-bold text-gray-400 mb-6">Giỏ hàng của bạn đang trống</h2>
               <button onClick={() => navigate('/')} className="bg-[#ee4d2d] text-white font-bold px-8 py-3 rounded-full hover:bg-[#d73211] shadow-lg shadow-orange-200">
                 Tiếp thêm năng lượng ngay
               </button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column: Details */}
              <div className="flex-1 space-y-6">
                {/* Address Section */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#ee4d2d]" />
                      Địa chỉ nhận hàng
                    </div>
                    {!isEditingAddress ? (
                       <button onClick={() => setIsEditingAddress(true)} className="text-[#ee4d2d] text-sm font-bold hover:underline">Thay đổi</button>
                    ) : (
                       <button onClick={() => setIsEditingAddress(false)} className="text-gray-400 text-sm font-bold hover:underline">Hủy</button>
                    )}
                  </h3>
                  
                  {isEditingAddress ? (
                     <div className="space-y-4">
                        <input 
                           value={editPhone} 
                           onChange={e => setEditPhone(e.target.value)} 
                           className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#ee4d2d]"
                           placeholder="Số điện thoại"
                        />
                        <textarea 
                           value={editAddress} 
                           onChange={e => setEditAddress(e.target.value)} 
                           className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#ee4d2d]"
                           placeholder="Địa chỉ giao hàng"
                        />
                        <button onClick={handleSaveAddress} className="bg-[#ee4d2d] text-white px-4 py-2 rounded-xl text-sm font-bold">Cập nhật lưu lại</button>
                     </div>
                  ) : (
                     <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                       <p className="font-bold text-gray-900 mb-1">{user?.name || 'Nguyễn Văn A'} | {user?.phone || 'Chưa cập nhật SĐT'}</p>
                       <p className="text-sm text-gray-600">{user?.address || '72 Lê Thánh Tôn, Bến Nghé, Quận 1, TP. Hồ Chí Minh'}</p>
                       <p className="text-xs text-gray-400 mt-2 italic">* Ghi chú: Giao trước sảnh tòa nhà</p>
                     </div>
                  )}
                </section>

                {/* Items Section */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="w-1 h-5 bg-[#ee4d2d] rounded-full"></div>
                    Sản phẩm đã chọn
                  </h3>
                  <div className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                          <ImageWithFallback src={getFoodImage(item.image, item.id)} fallbackType="food" fallbackId={item.id} className="w-full h-full object-cover" alt={item.name} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                          <p className="text-xs text-gray-400 font-bold uppercase mb-2">{item.category}</p>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400 font-bold">Số lượng: {item.quantity}</span>
                            <span className="font-black text-[#ee4d2d]">{((item.price || 0) * item.quantity).toLocaleString()}đ</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Payment Method */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#ee4d2d]" />
                      Phương thức thanh toán
                    </div>
                    <button className="text-[#ee4d2d] text-sm font-bold hover:underline">Thay đổi</button>
                  </h3>
                  <div className="flex flex-col gap-3">
                    {paymentMethods.map((method) => (
                      <div 
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition-all ${
                          paymentMethod === method.id 
                          ? 'border-[#ee4d2d] bg-orange-50 shadow-sm' 
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${method.color} rounded-xl flex items-center justify-center text-white shadow-sm`}>
                            <method.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-black text-sm text-gray-900">{method.label}</p>
                            {method.promo && (
                              <p className="text-[10px] text-green-600 font-black uppercase tracking-tight">{method.promo}</p>
                            )}
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          paymentMethod === method.id 
                          ? 'border-[#ee4d2d] bg-[#ee4d2d]' 
                          : 'border-gray-200'
                        }`}>
                          {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Summary */}
              <div className="w-full lg:w-[380px] shrink-0">
                <div className="sticky top-24 bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-200/50">
                  <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight">Chi phí dự tính</h3>
                  
                  <div className="space-y-4 mb-8">
                     <div className="flex justify-between items-center text-gray-500 font-medium">
                        <span className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-orange-500" />
                          Mã giảm giá
                        </span>
                        <button onClick={() => setShowVoucherModal(true)} className="text-[#ee4d2d] font-bold text-sm flex items-center">
                          {appliedVoucher ? appliedVoucher.code : 'Chọn mã'} <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                     </div>
                     {appliedVoucher && (
                        <div className="flex justify-end mt-1">
                           <button onClick={() => setAppliedVoucher(null)} className="text-xs text-gray-400 hover:text-red-500">Bỏ chọn</button>
                        </div>
                     )}
                     <div className="h-px bg-gray-100 my-4"></div>
                     
                     <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Tạm tính ({items.length} món)</span>
                        <span className="font-bold text-gray-800">{totalPrice.toLocaleString()}đ</span>
                     </div>
                     <div className="flex justify-between text-sm text-gray-500 mb-2">
                        <span>Phí giao hàng</span>
                        <span className="font-bold text-gray-800">{deliveryFee.toLocaleString()}đ</span>
                     </div>
                     {paymentDiscount > 0 && (
                       <div className="flex justify-between text-sm text-green-600 font-bold mb-2">
                          <span>Giảm giá {paymentMethods.find(m => m.id === paymentMethod)?.label}</span>
                          <span>-{paymentDiscount.toLocaleString()}đ</span>
                       </div>
                     )}
                     {voucherDiscount > 0 && (
                       <div className="flex justify-between text-sm text-green-600 font-bold mb-2">
                          <span>Giảm giá Voucher ({appliedVoucher?.code})</span>
                          <span>-{voucherDiscount.toLocaleString()}đ</span>
                       </div>
                     )}
                  </div>
 
                   <div className="bg-gray-50 p-6 rounded-2xl mb-8">
                      <div className="flex flex-col mb-1">
                         <span className="text-xs text-gray-400 font-black uppercase tracking-widest mb-1">Tổng thanh toán</span>
                         <span className="text-3xl font-black text-[#ee4d2d]">{(Math.max(0, totalPrice + deliveryFee - totalDiscount)).toLocaleString()}đ</span>
                      </div>
                     <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mt-2">
                        <Clock className="w-3 h-3" /> Giao trong khoảng 25-30 phút
                     </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceOrder}
                    className="w-full bg-[#ee4d2d] text-white font-black py-5 rounded-2xl shadow-lg shadow-orange-200 hover:bg-[#d73211] transition-all text-lg"
                  >
                    Đặt hàng ngay
                  </motion.button>
                </div>
              </div>
            </div>
          )
        )}

        {activeTab === 'active' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Đơn hàng đang đến</h2>
            {activeOrders.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-gray-100">
                <Bike className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 font-bold">Bạn không có đơn hàng nào đang giao</p>
              </div>
            ) : (
              activeOrders.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-50 bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                       <ImageWithFallback src={getRestaurantImage(order.restaurantImage, order.restaurantId || order.id)} fallbackType="restaurant" fallbackId={order.restaurantId || order.id} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 line-clamp-1">{order.restaurantName || `Đơn hàng ${order.id.slice(-6)}`}</h4>
                      <p className="text-xs text-[#ee4d2d] font-bold mt-1 animate-pulse">Trạng thái: {order.status}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-tight">{order.id} | Tổng: {order.totalPrice?.toLocaleString()}đ</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/track/${order.id}`)}
                    className="bg-orange-50 text-[#ee4d2d] font-bold px-8 py-3 rounded-xl hover:bg-[#ee4d2d] hover:text-white transition-all shadow-sm active:scale-95 whitespace-nowrap"
                  >
                    Xem lộ trình
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Lịch sử mua hàng</h2>
            {pastOrders.length === 0 && <p className="text-gray-400 font-bold text-center py-10">Chưa có đơn hàng nào</p>}
            {pastOrders.map(order => {
              const isRated = ratedOrders.includes(order.id);
              return (
              <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-gray-200 transition-all">
                <div onClick={() => navigate(`/track/${order.id}`)} className="flex gap-4 cursor-pointer w-full md:w-auto">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-50 bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                     <ImageWithFallback src={getRestaurantImage(order.restaurantImage, order.restaurantId || order.id)} fallbackType="restaurant" fallbackId={order.restaurantId || order.id} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 group-hover:text-[#ee4d2d] transition-colors line-clamp-1">{order.restaurantName || `Đơn hàng ${order.id.slice(-6)}`}</h4>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{order.createdAt && new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight line-clamp-1">{order.status}</p>
                    <p className="text-xs font-bold text-gray-800 mt-2">{order.totalPrice?.toLocaleString()}đ</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  {isRated ? (
                    <button 
                      disabled
                      className="flex-1 md:flex-none border border-transparent bg-gray-100 text-gray-400 font-bold px-6 py-2.5 rounded-xl text-sm opacity-60"
                    >
                      Đã đánh giá
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setSelectedOrder(order);
                        setRestaurantRating(5);
                        setDriverRating(5);
                        setRestaurantReview('');
                        setDriverReview('');
                        setShowRatingModal(true);
                      }}
                      className="flex-1 md:flex-none border border-[#ee4d2d] text-[#ee4d2d] font-bold px-6 py-2.5 rounded-xl hover:bg-orange-50 transition-all text-sm"
                    >
                      Đánh giá
                    </button>
                  )}
                  <button 
                    onClick={() => handleReorder(order)}
                    className="flex-1 md:flex-none bg-[#ee4d2d] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#d73211] transition-all shadow-md text-sm"
                  >
                    Đặt lại
                  </button>
                </div>
              </div>
            )})}
          </div>
        )}
      </main>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl"
          >
            <h3 className="text-2xl font-black text-gray-900 mb-2">Đánh giá dịch vụ</h3>
            <p className="text-sm text-gray-400 mb-8">Đơn hàng tại <span className="text-gray-900 font-bold">{selectedOrder?.restaurantName}</span></p>
            
            <div className="mb-6 border-b border-gray-100 pb-6">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Đánh giá món ăn</h4>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={`food-${star}`} onClick={() => setRestaurantRating(star)} className="p-1 hover:scale-110 transition-transform">
                    <Star className={`w-8 h-8 ${star <= restaurantRating ? 'fill-[#f9ad00] text-[#f9ad00]' : 'text-gray-200'}`} />
                  </button>
                ))}
              </div>
              <textarea 
                placeholder="Bạn thấy món ăn như thế nào?"
                value={restaurantReview}
                onChange={e => setRestaurantReview(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all min-h-[80px]"
              />
            </div>

            <div className="mb-8">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Đánh giá tài xế</h4>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={`driver-${star}`} onClick={() => setDriverRating(star)} className="p-1 hover:scale-110 transition-transform">
                    <Star className={`w-8 h-8 ${star <= driverRating ? 'fill-[#f9ad00] text-[#f9ad00]' : 'text-gray-200'}`} />
                  </button>
                ))}
              </div>
              <textarea 
                placeholder="Tài xế phục vụ tốt chứ?"
                value={driverReview}
                onChange={e => setDriverReview(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all min-h-[80px]"
              />
            </div>

            <div className="flex gap-4">
               <button onClick={() => setShowRatingModal(false)} className="flex-1 text-gray-400 font-bold py-3 hover:bg-gray-50 rounded-2xl transition-all">Hủy</button>
               <button onClick={handleRateOrder} className="flex-1 bg-[#ee4d2d] text-white font-black py-3 rounded-2xl shadow-lg shadow-orange-200 hover:bg-[#d73211] transition-all">Gửi</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Voucher Modal */}
      {showVoucherModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl"
          >
            <h3 className="text-xl font-black text-gray-900 mb-6">Chọn mã giảm giá</h3>
            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="Nhập mã (VD: FREESHIP)"
                value={voucherCode}
                onChange={e => setVoucherCode(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/20 font-bold"
              />
              <button 
                onClick={() => handleApplyVoucher(voucherCode)}
                className="bg-gray-900 text-white font-bold px-6 rounded-2xl hover:bg-gray-800 transition-all"
              >
                Áp dụng
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-[10px]">Mã phổ biến</p>
               {[
                 { code: 'FREESHIP', desc: 'Miễn phí vận chuyển (Tối đa 15k)' },
                 { code: 'SFAPP25', desc: 'Giảm 25k cho đơn từ 50k' },
                 { code: 'FOOD50K', desc: 'Giảm 15% tối đa 50k' }
               ].map(v => (
                 <div key={v.code} className="flex justify-between items-center bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <div>
                      <p className="font-bold text-[#ee4d2d]">{v.code}</p>
                      <p className="text-xs text-gray-600 font-medium">{v.desc}</p>
                    </div>
                    <button 
                      onClick={() => handleApplyVoucher(v.code)}
                      className="text-[#ee4d2d] font-black text-xs uppercase hover:underline"
                    >
                      Dùng
                    </button>
                 </div>
               ))}
            </div>

            <button onClick={() => setShowVoucherModal(false)} className="w-full text-gray-400 font-bold py-3 hover:bg-gray-50 rounded-2xl transition-all">Đóng</button>
          </motion.div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
