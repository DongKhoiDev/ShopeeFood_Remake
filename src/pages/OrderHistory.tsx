import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { MOCK_ORDERS } from '../constants';
import { ReceiptText, Trash2, RotateCcw, ChevronRight, Search } from 'lucide-react';
import { motion } from 'motion/react';

export default function OrderHistory() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24">
      <Navbar />

      <main className="max-w-[1000px] mx-auto py-8 px-4 md:px-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100">
               <ReceiptText className="w-6 h-6 text-[#ee4d2d]" />
            </div>
            Lịch sử đơn hàng
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm theo món, nhà hàng..." 
              className="bg-white border border-gray-100 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/10 w-64 shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-6">
          {MOCK_ORDERS.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row group"
            >
              <div className="p-6 flex-1 flex gap-6">
                <div className="w-24 h-24 rounded-xl overflow-hidden shadow-inner shrink-0 border border-gray-50">
                   <img src={order.restaurantImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={order.restaurantName} />
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-start mb-1">
                      <h4 className="font-black text-gray-900 text-lg group-hover:text-[#ee4d2d] transition-colors">{order.restaurantName}</h4>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${order.status === 'DELIVERING' ? 'bg-orange-50 text-[#ee4d2d]' : 'bg-gray-100 text-gray-500'}`}>
                         {order.status === 'DELIVERING' ? 'Đang giao' : 'Hoàn thành'}
                      </span>
                   </div>
                   <p className="text-xs text-gray-400 font-medium mb-3">{order.date}</p>
                   <div className="flex flex-wrap gap-2 mb-4">
                      {order.items.map(item => (
                        <span key={item.name} className="text-[11px] bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg border border-gray-100">
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                   </div>
                   <div className="flex items-center gap-4">
                      <span className="text-lg font-black text-[#ee4d2d]">{order.total.toLocaleString()}đ</span>
                      <span className="text-xs text-gray-400 font-medium">Thanh toán qua ví ShopeePay</span>
                   </div>
                </div>
              </div>

              <div className="bg-gray-50/50 p-6 md:w-56 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-center gap-3">
                 <button 
                  onClick={() => navigate(`/track/${order.id}`)}
                  className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:border-[#ee4d2d] hover:text-[#ee4d2d] transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                 >
                    <Search className="w-4 h-4" /> Chi tiết
                 </button>
                 <button 
                  className="w-full bg-[#ee4d2d] text-white font-bold py-2.5 rounded-xl hover:bg-[#d73211] transition-all flex items-center justify-center gap-2 text-sm shadow-md"
                 >
                    <RotateCcw className="w-4 h-4" /> Đặt lại
                 </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center py-12 border-2 border-dashed border-gray-200 rounded-3xl">
           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <ReceiptText className="w-8 h-8" />
           </div>
           <p className="text-gray-400 font-bold text-sm">Bạn chỉ mới thấy {MOCK_ORDERS.length} đơn hàng gần đây</p>
           <button className="text-[#ee4d2d] font-bold text-xs mt-2 uppercase tracking-widest hover:underline">Xem thêm lịch sử</button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
