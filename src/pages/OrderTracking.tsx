import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Circle, Bike, MapPin, Phone, MessageSquare, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!orderId) return;
    const docRef = doc(db, 'orders', orderId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setOrder({ id: docSnap.id, ...docSnap.data() });
      }
    }, (error) => {
      console.error("Error listening to order:", error);
    });

    return () => unsubscribe();
  }, [orderId]);

  if (!order) return <div className="p-8 text-center">Đang tải thông tin đơn hàng...</div>;

  // Derive steps based on order.status
  const isDelivered = order.status === 'COMPLETED';
  const steps = [
    { label: 'Đã nhận đơn', time: '--:--', completed: true },
    { label: 'Đang chuẩn bị', time: '--:--', completed: order.status !== 'PENDING' },
    { label: 'Đang giao hàng', time: '--:--', completed: isDelivered || order.status === 'DELIVERING', current: order.status === 'DELIVERING' },
    { label: 'Hoàn thành', time: '--:--', completed: isDelivered, current: isDelivered },
  ];

  return (
    <div className="min-h-screen pb-32 bg-[#F9F9F9]">
      <Navbar />

      <main className="max-w-[1000px] mx-auto py-8 px-4 md:px-12">
        <div className="flex flex-col lg:flex-row gap-8">
           {/* Tracking Main */}
           <div className="flex-1 space-y-6">
              <section className="bg-white p-8 rounded-[32px] shadow-sm border border-[#EEEEEE]">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                       <span className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase mb-2 block w-max ${isDelivered ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-[#EE4D2D]'}`}>
                         {isDelivered ? 'Thành công' : 'Đang được giao'}
                       </span>
                       <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                         {isDelivered ? 'Đơn hàng đã hoàn thành' : 'Món ăn sắp đến nơi rồi!'}
                       </h1>
                       <p className="text-gray-400 text-sm font-medium mt-1">Mã đơn hàng: <span className="text-gray-900 font-bold uppercase">{order.id}</span></p>
                    </div>
                    <div className="bg-[#EE4D2D] text-white p-4 rounded-2xl flex flex-col items-center justify-center min-w-[120px] shadow-lg shadow-orange-200">
                       <span className="text-xs font-bold opacity-80">Dự kiến</span>
                       <span className="text-2xl font-black">15 PHÚT</span>
                    </div>
                 </div>

                 <div className="relative">
                    {steps.map((step, idx) => (
                       <div key={step.label} className="flex gap-6 mb-10 last:mb-0">
                          <div className="flex flex-col items-center">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${step.completed ? 'bg-[#EE4D2D] text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                                {step.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-5 h-5" />}
                             </div>
                             {idx !== steps.length - 1 && (
                                <div className={`w-0.5 h-12 my-1 transition-all duration-500 ${step.completed ? 'bg-[#EE4D2D]' : 'bg-gray-100'}`}></div>
                             )}
                          </div>
                          <div className={`flex-1 pt-1 transition-all duration-300 ${step.current ? 'translate-x-2' : ''}`}>
                             <div className="flex items-center justify-between">
                                <h3 className={`font-black text-lg ${step.completed ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</h3>
                                <span className={`text-xs font-bold ${step.completed ? 'text-[#EE4D2D]' : 'text-gray-300'}`}>{step.time}</span>
                             </div>
                             {step.current && (
                                <motion.p 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-gray-400 text-sm mt-1 font-medium"
                                >
                                  Tài xế đang cách bạn 1.2km
                                </motion.p>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>
              </section>

              {/* Driver Card */}
              <section className="bg-white p-6 rounded-3xl shadow-sm border border-[#EEEEEE] flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden shadow-inner border border-gray-100">
                       <img referrerPolicy="no-referrer" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Driver" />
                    </div>
                    <div>
                       <h4 className="font-black text-gray-900 text-lg">Nguyễn Văn Shipper</h4>
                       <div className="flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1 text-[11px] font-bold text-[#f9ad00] bg-orange-50 px-2 py-0.5 rounded outline outline-1 outline-orange-100">
                             <span className="material-symbols-outlined text-[14px] fill-current">star</span> 4.9
                          </span>
                          <span className="text-[#EE4D2D] font-bold text-xs">Shopee Driver</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#EE4D2D] hover:text-white transition-all shadow-sm active:scale-90">
                       <Phone className="w-5 h-5" />
                    </button>
                    <button className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-[#EE4D2D] hover:text-white transition-all shadow-sm active:scale-90">
                       <MessageSquare className="w-5 h-5" />
                    </button>
                 </div>
              </section>
           </div>

           {/* Order Summary Sidebar */}
           <div className="w-full lg:w-[320px] shrink-0 space-y-6">
              <section className="bg-white p-6 rounded-3xl shadow-sm border border-[#EEEEEE]">
                 <h3 className="font-black text-gray-900 mb-6 flex items-center justify-between">
                    Địa chỉ nhận hàng
                    <button className="text-[#EE4D2D] text-xs font-black hover:underline underline-offset-4 tracking-tighter">Thay đổi</button>
                 </h3>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#EE4D2D] shrink-0 outline outline-1 outline-red-100">
                       <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="font-black text-gray-900 text-sm leading-tight">Nơi nhận hàng</p>
                       <p className="text-xs text-gray-400 font-medium mt-1 leading-relaxed">{order.address || "208 Nguyễn Hữu Cảnh, P.22, Q.Bình Thạnh, TP.HCM"}</p>
                    </div>
                 </div>
              </section>

              <section className="bg-white p-6 rounded-3xl shadow-sm border border-[#EEEEEE]">
                 <h3 className="font-black text-gray-900 mb-6 flex items-center justify-between">
                    Chi tiết đơn hàng
                    <Link to="/checkout" className="text-gray-400 hover:text-[#EE4D2D] transition-colors"><ChevronRight className="w-5 h-5" /></Link>
                 </h3>
                 <div className="space-y-4 mb-6">
                    {(typeof order.items === 'string' ? JSON.parse(order.items) : order.items)?.map((item: any) => (
                       <div key={item.name} className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">x{item.quantity} {item.name}</span>
                          <span className="font-black text-gray-900">{((item.price || 0) * item.quantity).toLocaleString()}đ</span>
                       </div>
                    ))}
                 </div>
                 <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-lg font-black tracking-tight">
                       <span>Tổng cộng</span>
                       <span className="text-[#EE4D2D]">{(order.totalPrice || order.total || 0).toLocaleString()}đ</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-right">Đã thanh toán qua AirPay</p>
                 </div>
              </section>

              <button className="w-full border-2 border-gray-100 text-gray-600 font-black py-4 rounded-3xl hover:border-[#EE4D2D]/20 hover:bg-gray-50 transition-all active:scale-95 text-sm shadow-sm">
                 Gặp vấn đề với đơn hàng?
              </button>
           </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
