import React, { useState, useMemo, useEffect } from 'react';
import AdminLayout, { StatsCard } from '../../layouts/AdminLayout';
import { DollarSign, ShoppingBag, Store } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useRestaurants } from '../../hooks/useRestaurants';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { getFoodImage } from '../../lib/images';
import { useAuth } from '../../context/AuthContext';
import { Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AdminDashboard() {
   const [orders, setOrders] = useState<any[]>([]);
   const { restaurants, loading } = useRestaurants();
   const { user } = useAuth();

   useEffect(() => {
      const unsub = onSnapshot(collection(db, 'orders'), (snap) => {
         const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
         // Sort descending by date
         data.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
         setOrders(data);
      }, (err) => console.error(err));
      return () => unsub();
   }, []);

   const stats = useMemo(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayOrders = orders.filter(o => o.createdAt && o.createdAt >= today.getTime());
      
      const totalOrders = todayOrders.length;
      const completedOrders = todayOrders.filter(o => o.status === 'COMPLETED');
      const cancelledOrders = todayOrders.filter(o => o.status === 'CANCELLED');
      const deliveringOrders = todayOrders.filter(o => o.status === 'DELIVERING' || o.status === 'PREPARING');

      const todayRevenue = completedOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const successRate = totalOrders > 0 ? ((completedOrders.length / totalOrders) * 100).toFixed(1) : '0.0';
      const cancelledCount = cancelledOrders.length;
      
      // Avg delivery time (mocked around 25 mins)
      const avgDeliveryTime = 25.4;

      // Orders per hour
      const ordersPerHour = Array.from({ length: 24 }, (_, i) => ({
         hour: `${i}h`,
         completed: 0,
         delivering: 0,
         cancelled: 0
      }));

      todayOrders.forEach(o => {
         const hour = new Date(o.createdAt).getHours();
         if (o.status === 'COMPLETED') ordersPerHour[hour].completed++;
         else if (o.status === 'CANCELLED') ordersPerHour[hour].cancelled++;
         else ordersPerHour[hour].delivering++;
      });

      // Heatmap Data: Top 5 restaurants by order count today
      const restaurantCounts: Record<string, number> = {};
      todayOrders.forEach(o => {
         restaurantCounts[o.restaurantId] = (restaurantCounts[o.restaurantId] || 0) + 1;
      });
      
      const topRestaurantIds = Object.entries(restaurantCounts)
         .sort((a, b) => b[1] - a[1])
         .slice(0, 5)
         .map(entry => entry[0]);

      // Map to full restaurant info and timeframes
      const heatmapData = topRestaurantIds.map(rId => {
         const restaurant = restaurants.find(r => r.id === rId);
         const rOrders = todayOrders.filter(o => o.restaurantId === rId);
         
         let count_6_11 = 0;
         let count_11_14 = 0;
         let count_14_18 = 0;
         let count_18_24 = 0;

         rOrders.forEach(o => {
            const hour = new Date(o.createdAt).getHours();
            if (hour >= 6 && hour < 11) count_6_11++;
            else if (hour >= 11 && hour < 14) count_11_14++;
            else if (hour >= 14 && hour < 18) count_14_18++;
            else if (hour >= 18 && hour < 24) count_18_24++;
         });

         return {
            id: rId,
            name: restaurant ? restaurant.name : 'Unknown',
            timeframes: [count_6_11, count_11_14, count_14_18, count_18_24]
         };
      });

      return {
         totalOrders,
         todayRevenue,
         successRate,
         avgDeliveryTime,
         cancelledCount,
         ordersPerHour,
         heatmapData
      };
   }, [orders, restaurants]);

   return (
      <AdminLayout title="Operation Center">
         {/* 1. 5 KPI Cards */}
         <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <StatsCard title="Tổng số đơn" value={stats.totalOrders} icon={ShoppingBag} color="bg-blue-50 text-blue-500" />
            <StatsCard title="Doanh thu" value={`${stats.todayRevenue.toLocaleString()}đ`} icon={DollarSign} color="bg-green-50 text-green-500" />
            <StatsCard title="Tỷ lệ thành công" value={`${stats.successRate}%`} icon={CheckCircle2} color="bg-teal-50 text-teal-500" />
            <StatsCard title="TG Giao (TB)" value={`${stats.avgDeliveryTime} phút`} icon={Clock} color="bg-orange-50 text-orange-500" />
            <div className={`bg-white p-6 rounded-3xl border-2 shadow-sm ${stats.cancelledCount > 0 ? 'border-red-500 animate-pulse' : 'border-gray-100'}`}>
               <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-50 text-red-500">
                     <AlertTriangle className="w-6 h-6" />
                  </div>
               </div>
               <p className="text-sm font-bold text-gray-500 mb-1">Đơn bị huỷ / Sự cố</p>
               <div className="flex items-end gap-3">
                  <h4 className="text-3xl font-black text-gray-900">{stats.cancelledCount}</h4>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* 2. Line Chart: Orders per Hour */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
               <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight">Lưu lượng đơn hàng theo giờ</h3>
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={stats.ordersPerHour} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                        <Line type="monotone" name="Hoàn thành" dataKey="completed" stroke="#10b981" strokeWidth={3} dot={false} />
                        <Line type="monotone" name="Đang giao" dataKey="delivering" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                        <Line type="monotone" name="Đã huỷ" dataKey="cancelled" stroke="#ef4444" strokeWidth={3} dot={false} />
                     </LineChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* 3. Heatmap */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
               <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight">Mật độ đơn hàng theo Nhà hàng</h3>
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr>
                           <th className="pb-4 text-xs font-black text-gray-400 uppercase">Nhà hàng</th>
                           <th className="pb-4 text-xs font-black text-gray-400 uppercase text-center w-20">6-11h</th>
                           <th className="pb-4 text-xs font-black text-gray-400 uppercase text-center w-20">11-14h</th>
                           <th className="pb-4 text-xs font-black text-gray-400 uppercase text-center w-20">14-18h</th>
                           <th className="pb-4 text-xs font-black text-gray-400 uppercase text-center w-20">18-24h</th>
                        </tr>
                     </thead>
                     <tbody className="space-y-2">
                        {stats.heatmapData.map((row, idx) => (
                           <tr key={idx} className="border-t border-gray-50">
                              <td className="py-3 font-bold text-sm text-gray-900 pr-4 line-clamp-1 max-w-[150px]" title={row.name}>{row.name}</td>
                              {row.timeframes.map((count, i) => {
                                 let bgColor = 'bg-blue-50 text-blue-600';
                                 if (count >= 30) bgColor = 'bg-red-500 text-white';
                                 else if (count >= 10) bgColor = 'bg-yellow-400 text-white';
                                 else if (count === 0) bgColor = 'bg-gray-50 text-gray-400';

                                 return (
                                    <td key={i} className="py-2 px-1">
                                       <div className={`h-10 w-full rounded-lg flex items-center justify-center font-black text-xs transition-all hover:scale-105 cursor-pointer ${bgColor}`} title={`${count} đơn`}>
                                          {count}
                                       </div>
                                    </td>
                                 );
                              })}
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* 4. Live Orders Table */}
         <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-black text-gray-900 tracking-tight">Theo dõi đơn hàng trực tiếp (Live Orders)</h3>
               <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
               </span>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead>
                     <tr className="border-b border-gray-100">
                        <th className="text-left pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">OrderID</th>
                        <th className="text-left pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Khách hàng</th>
                        <th className="text-left pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nhà hàng</th>
                        <th className="text-left pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tài xế</th>
                        <th className="text-right pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng tiền</th>
                        <th className="text-center pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {orders.slice(0, 10).map((order) => {
                        let statusColor = 'bg-gray-100 text-gray-600';
                        if (order.status === 'COMPLETED') statusColor = 'bg-green-100 text-green-700';
                        else if (order.status === 'DELIVERING') statusColor = 'bg-orange-100 text-orange-700';
                        else if (order.status === 'PENDING') statusColor = 'bg-yellow-100 text-yellow-700';
                        else if (order.status === 'CANCELLED') statusColor = 'bg-red-100 text-red-700';

                        return (
                           <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-4 text-xs font-bold text-gray-500">{order.id.slice(0, 8).toUpperCase()}</td>
                              <td className="py-4 text-sm font-bold text-gray-900">{order.userName || 'Guest'}</td>
                              <td className="py-4 text-sm font-bold text-gray-900">{order.restaurantName || '-'}</td>
                              <td className="py-4 text-sm font-bold text-gray-500">{order.driverName || 'Chưa nhận'}</td>
                              <td className="py-4 text-right text-sm font-black text-[#ee4d2d]">{(order.totalPrice || 0).toLocaleString()}đ</td>
                              <td className="py-4 text-center">
                                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColor}`}>
                                    {order.status}
                                 </span>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </div>
      </AdminLayout>
   );
}
