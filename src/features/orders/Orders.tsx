import React, { useState, useMemo, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Search, Eye, CheckCircle2, XCircle, Clock, Truck, ChevronRight, SlidersHorizontal, MapPin, User, Download, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../../types';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // MOCK dynamic states for local demo
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
     const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
     const unsubscribe = onSnapshot(q, (snapshot) => {
        const orderData: any[] = [];
        snapshot.forEach(doc => {
           const data = doc.data();
           orderData.push({
              id: doc.id,
              ...data,
              total: data.totalPrice, // mapping
              customer: 'Khách hàng', // Can map properly if user data is linked
              driver: 'Chưa có',
              paymentMethod: data.paymentMethod || 'cash'
           });
        });
        setOrders(orderData);
     });
     return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      const updated = orders.find(o => o.id === selectedOrder.id);
      if (updated && updated.status !== selectedOrder.status) {
        setSelectedOrder(updated);
      }
    }
  }, [orders, selectedOrder]);

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (activeTab !== 'ALL') {
      result = result.filter(o => o.status === activeTab);
    }
    if (searchQuery) {
      result = result.filter(o => o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    // Process Advanced Filters
    if (dateRange.start) {
      // Very basic mock check 
      result = result.filter(o => o.date >= dateRange.start);
    }
    if (dateRange.end) {
      result = result.filter(o => o.date <= dateRange.end);
    }
    if (priceRange.min) {
      result = result.filter(o => o.total >= Number(priceRange.min));
    }
    if (priceRange.max) {
      result = result.filter(o => o.total <= Number(priceRange.max));
    }

    return result;
  }, [orders, activeTab, searchQuery, dateRange, priceRange]);

  const TAB_LABELS = {
    ALL: 'Tất cả', PENDING: 'Chờ xử lý',
    DELIVERING: 'Đang giao', COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã huỷ'
  };

  const exportCSV = () => {
    const headers = ['Mã Đơn', 'Nhà Hàng', 'Khách', 'Trạng Thái', 'Thanh Toán', 'Tổng Tiền\n'];
    const rows = filteredOrders.map(o => `${o.id},"${o.restaurantName}","${(o as any).customer}",${o.status},${o.paymentMethod},${o.total}\n`);
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows.join('');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-50 text-orange-500';
      case 'DELIVERING': return 'bg-blue-50 text-blue-500';
      case 'COMPLETED': return 'bg-green-50 text-green-500';
      case 'CANCELLED': return 'bg-red-50 text-red-500';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return Clock;
      case 'DELIVERING': return Truck;
      case 'COMPLETED': return CheckCircle2;
      case 'CANCELLED': return XCircle;
      default: return Clock;
    }
  };

  return (
    <AdminLayout title="Quản lý đơn hàng">
      {/* Top filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto custom-scrollbar">
          {['ALL', 'PENDING', 'DELIVERING', 'COMPLETED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab 
                ? 'bg-[#ee4d2d] text-white shadow-lg shadow-orange-100' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {TAB_LABELS[tab as keyof typeof TAB_LABELS] || tab}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm mã đơn, nhà hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold w-64 focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all shadow-sm outline-none"
              />
           </div>
           
           <button 
             onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
             className={`h-12 px-4 border rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 ${showAdvancedFilters ? 'bg-orange-50/50 border-orange-200 text-[#ee4d2d]' : 'bg-white border-gray-100 text-gray-600 hover:text-[#ee4d2d] hover:border-orange-200'}`}
           >
              <SlidersHorizontal className="w-5 h-5" />
           </button>

           <button onClick={exportCSV} className="h-12 px-4 bg-gray-900 border border-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all shadow-sm flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest">
              <Download className="w-5 h-5" />
              Export
           </button>
        </div>
      </div>

      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Từ ngày</label>
                <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Đến ngày</label>
                <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Từ (VNĐ)</label>
                <input type="number" placeholder="50000" value={priceRange.min} onChange={e => setPriceRange({...priceRange, min: e.target.value})} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Đến (VNĐ)</label>
                <input type="number" placeholder="250000" value={priceRange.max} onChange={e => setPriceRange({...priceRange, max: e.target.value})} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all" />
              </div>
              <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-3 pt-2">
                <button onClick={() => { setDateRange({start: '', end: ''}); setPriceRange({min: '', max: ''}); }} className="px-6 py-3 rounded-2xl font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-all text-xs uppercase tracking-widest">Xoá bộ lọc</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
         {filteredOrders.map((order) => {
           const StatusIcon = getStatusIcon(order.status);
           return (
             <div key={order.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col xl:flex-row xl:items-center gap-6 group hover:border-gray-200 hover:shadow-md transition-all">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${getStatusColor(order.status)}`}>
                   <StatusIcon className="w-7 h-7" />
                </div>
                
                <div className="flex-1 min-w-[200px]">
                   <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-black text-gray-900">{order.id}</h4>
                      <span className="text-[10px] bg-gray-50 text-gray-400 px-2 py-0.5 rounded font-black uppercase tracking-tight">{order.date}</span>
                   </div>
                   <p className="text-sm font-bold text-gray-400 flex items-center gap-1">Khách: <span className="text-gray-900">{(order as any).customer}</span></p>
                </div>

                <div className="text-left w-48">
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Nhà hàng</p>
                   <p className="text-sm font-bold text-gray-900 line-clamp-1">{order.restaurantName}</p>
                </div>

                <div className="text-left w-32">
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Thanh toán</p>
                   <p className="text-sm font-bold text-gray-900">{order.paymentMethod}</p>
                </div>

                <div className="text-right w-32">
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Khách trả</p>
                   <p className="text-lg font-black text-[#ee4d2d]">{(order.total || order.totalPrice || 0).toLocaleString()}đ</p>
                </div>

                <div className="flex gap-2 shrink-0">
                   <button 
                     onClick={() => setSelectedOrder(order)}
                     className="p-3 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
                   >
                      <Eye className="w-5 h-5" />
                   </button>
                   <button 
                     onClick={() => setSelectedOrder(order)}
                     className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-[#ee4d2d] transition-all shadow-sm"
                   >
                      Xử lý
                      <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
             </div>
           );
         })}
         
         {filteredOrders.length === 0 && (
           <div className="py-20 text-center">
             <p className="text-gray-400 font-bold uppercase tracking-widest">Không tìm thấy đơn hàng</p>
           </div>
         )}
      </div>

      <AnimatePresence>
         {selectedOrder && (
           <>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
               onClick={() => setSelectedOrder(null)}
             />
             <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="fixed top-0 right-0 bottom-0 w-full md:w-[600px] bg-white z-50 shadow-2xl flex flex-col"
             >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                   <div>
                     <h3 className="text-xl font-black text-gray-900">Chi tiết đơn {selectedOrder.id}</h3>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{selectedOrder.date}</p>
                   </div>
                   <button onClick={() => setSelectedOrder(null)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors">
                      <X className="w-6 h-6" />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                   {/* Status timeline */}
                   <section>
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Trạng thái</h4>
                      <div className="flex gap-2">
                         {['PENDING', 'DELIVERING', 'COMPLETED'].map((step, idx) => (
                            <div key={idx} className={`flex-1 h-2 rounded-full ${['COMPLETED', 'DELIVERING'].includes(selectedOrder.status) && idx <= 1 ? 'bg-green-500' : selectedOrder.status === 'COMPLETED' ? 'bg-green-500' : selectedOrder.status === 'CANCELLED' ? 'bg-red-500' : 'bg-gray-100'}`}></div>
                         ))}
                      </div>
                   </section>

                   {/* Customer & Driver info */}
                   <section className="grid grid-cols-2 gap-4">
                     <div className="bg-gray-50 p-4 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2 text-[#ee4d2d]">
                           <User className="w-4 h-4" />
                           <h5 className="font-black text-xs uppercase tracking-widest">Khách hàng</h5>
                        </div>
                        <p className="font-bold text-gray-900">{(selectedOrder as any).customer}</p>
                        <p className="text-xs font-medium text-gray-500 mt-1">0901234567</p>
                     </div>
                     <div className="bg-gray-50 p-4 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2 text-blue-500">
                           <Truck className="w-4 h-4" />
                           <h5 className="font-black text-xs uppercase tracking-widest">Tài xế</h5>
                        </div>
                        <p className="font-bold text-gray-900">{(selectedOrder as any).driver}</p>
                        <p className="text-xs font-medium text-gray-500 mt-1">59-B1 123.45</p>
                     </div>
                   </section>

                   <section>
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Danh sách món</h4>
                      <div className="bg-gray-50 rounded-2xl overflow-hidden">
                         {selectedOrder.items.map((item, idx) => (
                           <div key={idx} className="flex justify-between items-center p-4 border-b border-white last:border-b-0">
                              <div className="flex items-center gap-3">
                                 <span className="font-black text-gray-400 w-6">{item.quantity}x</span>
                                 <span className="font-bold text-gray-900">{item.name}</span>
                              </div>
                              <span className="font-black text-gray-900">{(item.price || 0).toLocaleString()}đ</span>
                           </div>
                         ))}
                         <div className="p-4 bg-gray-100 flex justify-between items-center">
                            <span className="font-black text-gray-900 uppercase tracking-widest">Tổng thu</span>
                            <span className="font-black text-[#ee4d2d] text-xl">{(selectedOrder.total || selectedOrder.totalPrice || 0).toLocaleString()}đ</span>
                         </div>
                      </div>
                   </section>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-3">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cập nhật trạng thái</h4>
                   <div className="flex gap-2 text-xs font-black uppercase tracking-widest">
                     {selectedOrder.status === 'PENDING' && (
                        <button 
                           onClick={async () => {
                              try {
                                 await updateDoc(doc(db, 'orders', selectedOrder.id), { status: 'PREPARING' });
                                 setOrders(orders.map(o => o.id === selectedOrder.id ? {...o, status: 'PREPARING'} : o));
                                 setSelectedOrder({...selectedOrder, status: 'PREPARING'} as Order);
                              } catch(e) { console.error(e); }
                           }}
                           className="flex-1 bg-yellow-500 text-white py-3 rounded-xl hover:bg-yellow-600 transition-colors shadow-sm"
                        >
                           Chuẩn bị món
                        </button>
                     )}
                     {selectedOrder.status === 'PREPARING' && (
                        <button 
                           onClick={async () => {
                              try {
                                 await updateDoc(doc(db, 'orders', selectedOrder.id), { status: 'DELIVERING' });
                                 setOrders(orders.map(o => o.id === selectedOrder.id ? {...o, status: 'DELIVERING'} : o));
                                 setSelectedOrder({...selectedOrder, status: 'DELIVERING'} as Order);
                              } catch(e) { console.error(e); }
                           }}
                           className="flex-1 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
                        >
                           Bắt đầu giao
                        </button>
                     )}
                     {selectedOrder.status === 'DELIVERING' && (
                        <button 
                           onClick={async () => {
                              try {
                                 await updateDoc(doc(db, 'orders', selectedOrder.id), { status: 'COMPLETED' });
                                 setOrders(orders.map(o => o.id === selectedOrder.id ? {...o, status: 'COMPLETED'} : o));
                                 setSelectedOrder({...selectedOrder, status: 'COMPLETED'} as Order);
                              } catch(e) { console.error(e); }
                           }}
                           className="flex-1 bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition-colors shadow-sm"
                        >
                           Hoàn thành
                        </button>
                     )}
                     
                     {['PENDING', 'PREPARING'].includes(selectedOrder.status) && (
                        <button 
                           onClick={async () => {
                           try {
                              await updateDoc(doc(db, 'orders', selectedOrder.id), { status: 'CANCELLED' });
                              setOrders(orders.map(o => o.id === selectedOrder.id ? {...o, status: 'CANCELLED'} : o));
                              setSelectedOrder({...selectedOrder, status: 'CANCELLED'} as Order);
                           } catch(e) { console.error(e); }
                           }}
                           className="flex-1 bg-red-100 text-red-500 py-3 rounded-xl hover:bg-red-200 transition-colors"
                        >
                           Huỷ đơn
                        </button>
                     )}
                   </div>
                </div>

             </motion.div>
           </>
         )}
      </AnimatePresence>
    </AdminLayout>
  );
}
