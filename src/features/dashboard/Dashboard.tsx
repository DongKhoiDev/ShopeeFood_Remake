import React, { useState, useMemo, useEffect } from 'react';
import AdminLayout, { StatsCard } from '../../layouts/AdminLayout';
import { DollarSign, ShoppingBag, Store } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { useRestaurants } from '../../hooks/useRestaurants';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { getFoodImage } from '../../lib/images';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
   const [chartPeriod, setChartPeriod] = useState<'7d' | '30d' | '3m'>('7d');
   const [orders, setOrders] = useState<any[]>([]);
   const { restaurants, loading } = useRestaurants();
   const { user } = useAuth();

   useEffect(() => {
      const unsub = onSnapshot(collection(db, 'orders'), (snap) => {
         const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
         setOrders(data);
      }, (err) => console.error(err));
      return () => unsub();
   }, []);

   const stats = useMemo(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const completedOrders = orders.filter(o => o.status === 'COMPLETED');
      const todayRevenue = completedOrders
         .filter(o => o.createdAt && o.createdAt >= today.getTime())
         .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const yesterdayRevenue = completedOrders
         .filter(o => o.createdAt && o.createdAt >= yesterday.getTime() && o.createdAt < today.getTime())
         .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      const calcChange = (current: number, prev: number) => {
         if (prev === 0) return current > 0 ? "+100%" : "0%";
         const diff = ((current - prev) / prev) * 100;
         return `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`;
      };

      const revenueChange = calcChange(todayRevenue, yesterdayRevenue);

      const todayOrdersCount = orders.filter(o => o.createdAt && o.createdAt >= today.getTime()).length;
      const yesterdayOrdersCount = orders.filter(o => o.createdAt && o.createdAt >= yesterday.getTime() && o.createdAt < today.getTime()).length;
      const ordersChange = calcChange(todayOrdersCount, yesterdayOrdersCount);

      const todayRestaurants = restaurants.filter(r => r.createdAt && r.createdAt >= today.getTime()).length;
      const yesterdayRestaurants = restaurants.filter(r => r.createdAt && r.createdAt >= yesterday.getTime() && r.createdAt < today.getTime()).length;
      const restaurantsChange = calcChange(todayRestaurants, yesterdayRestaurants);

      const todayProducts = restaurants.filter(r => r.createdAt && r.createdAt >= today.getTime()).reduce((sum, r) => sum + (r.menu?.length || 0), 0);
      const yesterdayProducts = restaurants.filter(r => r.createdAt && r.createdAt >= yesterday.getTime() && r.createdAt < today.getTime()).reduce((sum, r) => sum + (r.menu?.length || 0), 0);
      const productsChange = calcChange(todayProducts, yesterdayProducts);

      // Calculate revenue for charts
      const now = new Date();

      // 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
         const d = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
         d.setHours(0, 0, 0, 0);
         return {
            name: d.toLocaleDateString('vi-VN', { weekday: 'short' }),
            timestamp: d.getTime(),
            revenue: 0
         };
      });

      // 30 days
      const last30Days = Array.from({ length: 30 }, (_, i) => {
         const d = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
         d.setHours(0, 0, 0, 0);
         return {
            name: `${d.getDate()}/${d.getMonth() + 1}`,
            timestamp: d.getTime(),
            revenue: 0
         };
      });

      // 3 months
      const last3Months = Array.from({ length: 3 }, (_, i) => {
         const d = new Date(now.getFullYear(), now.getMonth() - (2 - i), 1);
         return {
            name: `Tháng ${d.getMonth() + 1}`,
            month: d.getMonth(),
            year: d.getFullYear(),
            revenue: 0
         };
      });

      completedOrders.forEach(o => {
         if (!o.createdAt) return;
         const oDate = new Date(o.createdAt);
         const oTime = new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate()).getTime();

         // 7d
         const day7 = last7Days.find(d => d.timestamp === oTime);
         if (day7) day7.revenue += (o.totalPrice || 0);

         // 30d
         const day30 = last30Days.find(d => d.timestamp === oTime);
         if (day30) day30.revenue += (o.totalPrice || 0);

         // 3m
         const m3 = last3Months.find(d => d.month === oDate.getMonth() && d.year === oDate.getFullYear());
         if (m3) m3.revenue += (o.totalPrice || 0);
      });

      const statusCounts = orders.reduce((acc, o) => {
         acc[o.status] = (acc[o.status] || 0) + 1;
         return acc;
      }, {} as Record<string, number>);

      return {
         todayRevenue,
         totalOrders: orders.length,
         revenueData7d: last7Days,
         revenueData30d: last30Days,
         revenueData3m: last3Months,
         statusCounts,
         revenueChange,
         ordersChange,
         restaurantsChange,
         productsChange
      };
   }, [orders, restaurants]);

   const orderStatusData = useMemo(() => [
      { name: 'Hoàn thành', value: stats.statusCounts['COMPLETED'] || 0, color: '#10b981' },
      { name: 'Đang giao', value: (stats.statusCounts['DELIVERING'] || 0) + (stats.statusCounts['PREPARING'] || 0), color: '#3b82f6' },
      { name: 'Chờ xử lý', value: stats.statusCounts['PENDING'] || 0, color: '#f59e0b' },
      { name: 'Đơn huỷ', value: stats.statusCounts['CANCELLED'] || 0, color: '#ef4444' },
   ].filter(s => s.value > 0), [stats.statusCounts]);

   // If no data, show empty state for donut
   const finalOrderStatusData = orderStatusData.length > 0 ? orderStatusData : [{ name: 'Chưa có đơn', value: 1, color: '#e5e7eb' }];
   const totalStatusCount = orderStatusData.reduce((sum, item) => sum + item.value, 0);

   const chartData = chartPeriod === '7d' ? stats.revenueData7d : chartPeriod === '30d' ? stats.revenueData30d : stats.revenueData3m;

   const topSellingItems = restaurants.flatMap(r => r.menu).sort((a: any, b: any) => parseInt(b.soldCount?.replace(/\D/g, '') || '0') - parseInt(a.soldCount?.replace(/\D/g, '') || '0')).slice(0, 5);

   return (
      <AdminLayout title="Tổng quan">
         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatsCard
               title="Doanh thu hôm nay"
               value={`${stats.todayRevenue.toLocaleString()}đ`}
               change={stats.revenueChange}
               icon={DollarSign}
               color="bg-orange-50 text-[#ee4d2d]"
            />
            <StatsCard
               title="Tổng số đơn hàng"
               value={stats.totalOrders}
               change={stats.ordersChange}
               icon={ShoppingBag}
               color="bg-blue-50 text-blue-500"
            />
            <StatsCard
               title="Tổng nhà hàng"
               value={restaurants.length}
               change={stats.restaurantsChange}
               icon={Store}
               color="bg-red-50 text-red-500"
            />
            <StatsCard
               title="Tổng sản phẩm"
               value={restaurants.reduce((sum, r) => sum + r.menu.length, 0)}
               change={stats.productsChange}
               icon={Store}
               color="bg-green-50 text-green-500"
            />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Revenue Bar Chart */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Biểu đồ doanh thu</h3>
                  <div className="flex bg-gray-50 p-1 rounded-xl">
                     <button
                        onClick={() => setChartPeriod('7d')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${chartPeriod === '7d' ? 'bg-white text-[#ee4d2d] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                     >7 Ngày</button>
                     <button
                        onClick={() => setChartPeriod('30d')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${chartPeriod === '30d' ? 'bg-white text-[#ee4d2d] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                     >30 Ngày</button>
                     <button
                        onClick={() => setChartPeriod('3m')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${chartPeriod === '3m' ? 'bg-white text-[#ee4d2d] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                     >3 Tháng</button>
                  </div>
               </div>
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} dy={10} interval={chartPeriod === '30d' ? 6 : 0} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} tickFormatter={(val) => `${val / 1000}k`} />
                        <Tooltip
                           cursor={{ fill: '#f9fafb' }}
                           contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                           itemStyle={{ fontWeight: 800, color: '#ee4d2d' }}
                           formatter={(value: number) => [`${value.toLocaleString()}đ`, 'Doanh thu']}
                        />
                        <Bar dataKey="revenue" fill="#ee4d2d" radius={[6, 6, 0, 0]} maxBarSize={40} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Order Status Donut Chart */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col">
               <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Trạng thái đơn hàng</h3>
               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Tất cả thời gian</p>

               <div className="flex-1 min-h-[200px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={finalOrderStatusData}
                           cx="50%"
                           cy="50%"
                           innerRadius={60}
                           outerRadius={80}
                           paddingAngle={5}
                           dataKey="value"
                           stroke="none"
                        >
                           {finalOrderStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                        </Pie>
                        <Tooltip
                           contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                           itemStyle={{ fontWeight: 800, color: '#111827' }}
                        />
                     </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-3xl font-black text-gray-900">{stats.totalOrders}</span>
                     <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Tổng đơn</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mt-6">
                  {orderStatusData.map(status => (
                     <div key={status.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                        <div>
                           <p className="text-xs font-bold text-gray-900">{status.name}</p>
                           <p className="text-[10px] font-black text-gray-400">{totalStatusCount > 0 ? Math.round((status.value / totalStatusCount) * 100) : 0}%</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Top 5 Products Table */}
         <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Top 5 món nổi bật</h3>

            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead>
                     <tr className="border-b border-gray-100">
                        <th className="text-left pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sản phẩm</th>
                        <th className="text-left pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Danh mục</th>
                        <th className="text-right pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Giá bán</th>
                        <th className="text-right pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Đã bán</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     {topSellingItems.map((item, idx) => (
                        <tr key={item.id} className="group hover:bg-gray-50 transition-colors">
                           <td className="py-4 flex items-center gap-4">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${idx < 3 ? 'bg-orange-100 text-[#ee4d2d]' : 'bg-gray-100 text-gray-500'}`}>
                                 {idx + 1}
                              </span>
                              <img referrerPolicy="no-referrer" src={getFoodImage(item.image, item.id)} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                              <div>
                                 <p className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</p>
                                 {item.rating && (
                                    <div className="flex items-center gap-1 text-[#ee4d2d]">
                                       <span className="material-symbols-outlined text-[10px] font-black">star</span>
                                       <span className="text-[10px] font-bold">{item.rating}</span>
                                    </div>
                                 )}
                              </div>
                           </td>
                           <td className="py-4">
                              <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-gray-600">{item.category}</span>
                           </td>
                           <td className="py-4 text-right">
                              <p className="font-black text-[#ee4d2d] text-sm">{(item.price || 0).toLocaleString()}đ</p>
                           </td>
                           <td className="py-4 text-right">
                              <p className="font-black text-gray-900">{item.soldCount}</p>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </AdminLayout>
   );
}
