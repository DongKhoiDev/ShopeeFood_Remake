import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useRestaurants } from '../../hooks/useRestaurants';
import { Store, Plus, Edit2, Trash2, Search, Filter, Star, Eye, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getRestaurantImage } from '../../lib/images';

// Mock Data
const MOCK_RESTAURANTS_DATA = [
  { id: 'R001', name: 'Cơm Tấm Ba Ghiền', owner: 'Nguyễn Văn A', phone: '0901234567', rating: 4.8, status: 'ACTIVE', revenue: 15000000, joinDate: '2023-01-15', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=200' },
  { id: 'R002', name: 'Phở Hòa Pasteur', owner: 'Trần Thị B', phone: '0912345678', rating: 4.5, status: 'ACTIVE', revenue: 22000000, joinDate: '2023-02-20', image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?auto=format&fit=crop&q=80&w=200' },
  { id: 'R003', name: 'Bún Chả Hương Liên', owner: 'Lê Văn C', phone: '0923456789', rating: 4.9, status: 'INACTIVE', revenue: 0, joinDate: '2023-03-10', image: 'https://images.unsplash.com/photo-1626804475297-4160aecefab3?auto=format&fit=crop&q=80&w=200' },
];

export default function Restaurants() {
  const { restaurants: fetchedRestaurants, loading } = useRestaurants();
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
     setRestaurants(fetchedRestaurants);
  }, [fetchedRestaurants]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', owner: '', phone: '', status: 'ACTIVE', image: '' });

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRestaurantView, setSelectedRestaurantView] = useState<any>(null);
  const [viewTab, setViewTab] = useState('menu'); // 'menu' | 'orders' | 'settings'

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: '', minRating: '' });

  const filteredRestaurants = restaurants.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filters.status ? r.status === filters.status : true;
    const matchRating = filters.minRating ? r.rating >= Number(filters.minRating) : true;
    return matchSearch && matchStatus && matchRating;
  });

  const openAddModal = () => {
    setFormData({ name: '', owner: '', phone: '', status: 'ACTIVE', image: '' });
    setEditingRestaurant(null);
    setShowAddModal(true);
  };

  const openEditModal = (restaurant: any) => {
    setFormData({ name: restaurant.name, owner: restaurant.owner, phone: restaurant.phone, status: restaurant.status, image: restaurant.image });
    setEditingRestaurant(restaurant);
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.owner) return alert('Vui lòng nhập tên nhà hàng và chủ quán!');

    if (editingRestaurant) {
       setRestaurants(prev => prev.map(r => r.id === editingRestaurant.id ? { ...r, ...formData } : r));
    } else {
       const newRest = {
          id: `R${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          ...formData,
          rating: 0,
          revenue: 0,
          joinDate: new Date().toISOString().split('T')[0],
          image: formData.image || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=200'
       };
       setRestaurants(prev => [newRest, ...prev]);
    }
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xoá nhà hàng này?')) {
       setRestaurants(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <AdminLayout title="Quản lý nhà hàng">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
         <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhà hàng, chủ quán..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#ee4d2d]/10 focus:border-orange-200 transition-all font-medium text-sm outline-none shadow-sm"
            />
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            <button 
               onClick={() => setShowFilters(!showFilters)}
               className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border rounded-2xl font-bold transition-all text-sm shadow-sm ${showFilters ? 'bg-orange-50 border-orange-200 text-[#ee4d2d]' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'}`}
            >
               <Filter className="w-4 h-4" />
               Bộ lọc
            </button>
            <button 
               onClick={openAddModal}
               className="flex-[2] md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#ee4d2d] text-white rounded-2xl font-black shadow-lg shadow-orange-100 hover:bg-[#d73211] transition-all text-sm"
            >
               <Plus className="w-4 h-4" />
               Thêm nhà hàng
            </button>
         </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Trạng thái</label>
                <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all">
                  <option value="">Tất cả trạng thái</option>
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="INACTIVE">Tạm nghỉ</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Đánh giá tối thiểu</label>
                <select value={filters.minRating} onChange={e => setFilters({...filters, minRating: e.target.value})} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all">
                  <option value="">Tất cả</option>
                  <option value="5">5 Sao</option>
                  <option value="4">Từ 4 Sao</option>
                  <option value="3">Từ 3 Sao</option>
                </select>
              </div>
              <div className="flex justify-end items-end gap-3 pt-2">
                <button onClick={() => setFilters({status: '', minRating: ''})} className="px-6 h-12 w-full rounded-2xl font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-all text-xs uppercase tracking-widest">Xoá bộ lọc</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
         <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                     <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-20">ID</th>
                     <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nhà hàng / Chủ quán</th>
                     <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Liên hệ</th>
                     <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Đánh giá</th>
                     <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Doanh thu</th>
                     <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                     <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Thao tác</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {filteredRestaurants.map(restaurant => (
                     <tr key={restaurant.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 font-bold text-gray-500 text-xs">#{restaurant.id}</td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <img referrerPolicy="no-referrer" src={getRestaurantImage(restaurant.image, restaurant.id)} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                              <div>
                                 <p className="font-black text-gray-900 leading-tight">{restaurant.name}</p>
                                 <p className="text-xs text-gray-500 font-medium mt-0.5">{restaurant.owner}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-bold text-gray-700 text-xs">{restaurant.phone}</p>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-bold text-gray-900 text-xs">{restaurant.rating}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-bold text-gray-900 text-xs">{(restaurant.revenue || 0).toLocaleString()}đ</p>
                           <p className="text-[10px] text-gray-400">Tham gia: {restaurant.joinDate}</p>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                              restaurant.status === 'ACTIVE' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
                           }`}>
                              {restaurant.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm nghỉ'}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center justify-center gap-1">
                              <button 
                                onClick={() => {
                                  setSelectedRestaurantView(restaurant);
                                  setShowViewModal(true);
                                }}
                                className="p-2.5 text-gray-400 hover:text-[#ee4d2d] hover:bg-orange-50 rounded-xl transition-all"
                              >
                                 <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => openEditModal(restaurant)}
                                className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition-all shadow-sm"
                              >
                                 <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(restaurant.id)}
                                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                              >
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
                  {filteredRestaurants.length === 0 && (
                     <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">Không tìm thấy nhà hàng</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl relative my-8"
            >
               <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white rounded-t-[32px] z-10">
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">{editingRestaurant ? 'Sửa nhà hàng' : 'Thêm nhà hàng'}</h2>
                  <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                     <X className="w-6 h-6 text-gray-500" />
                  </button>
               </div>
               
               <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên nhà hàng <span className="text-red-500">*</span></label>
                     <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#ee4d2d]/20 focus:bg-white transition-all font-bold text-gray-900 outline-none" placeholder="VD: Cơm Tấm Ba Ghiền" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên chủ quán <span className="text-red-500">*</span></label>
                     <input type="text" value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#ee4d2d]/20 focus:bg-white transition-all font-bold text-gray-900 outline-none" placeholder="VD: Nguyễn Văn A" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                     <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#ee4d2d]/20 focus:bg-white transition-all font-bold text-gray-900 outline-none" placeholder="VD: 0901234567" />
                  </div>
                  <div className="space-y-2 md:col-span-2 flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                     <div>
                        <h4 className="font-black text-gray-900 text-sm">Trạng thái hoạt động</h4>
                     </div>
                     <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="bg-white border-gray-200 rounded-xl p-2 font-bold text-sm outline-none">
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="INACTIVE">Tạm nghỉ</option>
                     </select>
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Hình ảnh đại diện</label>
                     <label className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col justify-center items-center gap-4 hover:bg-orange-50/50 hover:border-orange-200 transition-colors cursor-pointer group w-full">
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                           const file = e.target.files?.[0];
                           if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => setFormData({...formData, image: e.target?.result as string});
                              reader.readAsDataURL(file);
                           }
                        }} />
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all overflow-hidden shrink-0">
                           {formData.image ? <img referrerPolicy="no-referrer" src={formData.image} className="w-full h-full object-cover" /> : <Plus className="w-8 h-8 text-gray-400 group-hover:text-[#ee4d2d]" />}
                        </div>
                        <div className="text-center">
                           <p className="font-bold text-gray-900">Click hoặc kéo thả ảnh vào đây</p>
                           <p className="text-xs text-gray-400 font-medium mt-1">PNG, JPG, WEBP tối đa 5MB</p>
                        </div>
                     </label>
                  </div>
               </div>

               <div className="p-6 md:p-8 border-t border-gray-100 flex gap-4 sticky bottom-0 bg-white rounded-b-[32px] z-10">
                  <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-gray-900 font-black bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all uppercase tracking-widest text-xs">Hủy bỏ</button>
                  <button onClick={handleSave} className="flex-[2] py-4 bg-[#ee4d2d] flex items-center justify-center gap-2 text-white font-black rounded-2xl shadow-lg shadow-orange-100 hover:bg-[#d73211] transition-all uppercase tracking-widest text-xs">
                    <Save className="w-4 h-4" /> Lưu thông tin
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showViewModal && selectedRestaurantView && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="bg-white w-full max-w-3xl rounded-[32px] shadow-2xl relative my-8"
            >
               <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white rounded-t-[32px] z-10">
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">Chi tiết nhà hàng</h2>
                  <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                     <X className="w-6 h-6 text-gray-500" />
                  </button>
               </div>
               
               <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-8 mb-8">
                     <img referrerPolicy="no-referrer" src={getRestaurantImage(selectedRestaurantView.image, selectedRestaurantView.id)} className="w-32 h-32 rounded-2xl object-cover shadow-sm border border-gray-100" />
                     <div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">{selectedRestaurantView.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium mb-4">
                           <span className="flex items-center gap-1"><Store className="w-4 h-4" /> {selectedRestaurantView.owner}</span>
                           <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {selectedRestaurantView.rating} Sao</span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs font-bold">
                           <span className="bg-orange-50 text-[#ee4d2d] px-3 py-1.5 rounded-lg">Doanh thu: {(selectedRestaurantView.revenue || 0).toLocaleString()}đ</span>
                           <span className="bg-blue-50 text-blue-500 px-3 py-1.5 rounded-lg">SĐT: {selectedRestaurantView.phone}</span>
                           <span className={`px-3 py-1.5 rounded-lg ${selectedRestaurantView.status === 'ACTIVE' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>Trạng thái: {selectedRestaurantView.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm nghỉ'}</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6 border-t border-gray-100 pt-6">
                     <div className="flex gap-4 border-b border-gray-100 mb-6">
                        <button 
                           onClick={() => setViewTab('menu')}
                           className={`pb-3 font-bold text-sm uppercase tracking-widest transition-colors ${viewTab === 'menu' ? 'border-b-2 border-[#ee4d2d] text-[#ee4d2d]' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                           Thực đơn
                        </button>
                        <button 
                           onClick={() => setViewTab('orders')}
                           className={`pb-3 font-bold text-sm uppercase tracking-widest transition-colors ${viewTab === 'orders' ? 'border-b-2 border-[#ee4d2d] text-[#ee4d2d]' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                           Đơn hàng gần đây
                        </button>
                        <button 
                           onClick={() => setViewTab('settings')}
                           className={`pb-3 font-bold text-sm uppercase tracking-widest transition-colors ${viewTab === 'settings' ? 'border-b-2 border-[#ee4d2d] text-[#ee4d2d]' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                           Cài đặt chiết khấu
                        </button>
                     </div>

                     {viewTab === 'menu' && (
                        <div className="space-y-3">
                           <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div>
                                   <p className="font-bold text-gray-900 text-sm">Cơm sườn bi chả</p>
                                   <p className="text-xs text-[#ee4d2d] font-black mt-1">55.000đ</p>
                                </div>
                                <span className="text-[10px] uppercase font-black tracking-widest px-2 py-1 bg-green-50 text-green-500 rounded-lg">Còn hàng</span>
                           </div>
                           <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div>
                                   <p className="font-bold text-gray-900 text-sm">Cơm sườn ốp la</p>
                                   <p className="text-xs text-[#ee4d2d] font-black mt-1">45.000đ</p>
                                </div>
                                <span className="text-[10px] uppercase font-black tracking-widest px-2 py-1 bg-green-50 text-green-500 rounded-lg">Còn hàng</span>
                           </div>
                           <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 opacity-60">
                                <div>
                                   <p className="font-bold text-gray-900 text-sm">Trà đá</p>
                                   <p className="text-xs text-[#ee4d2d] font-black mt-1">5.000đ</p>
                                </div>
                                <span className="text-[10px] uppercase font-black tracking-widest px-2 py-1 bg-gray-200 text-gray-500 rounded-lg">Hết hàng</span>
                           </div>
                        </div>
                     )}

                     {viewTab === 'orders' && (
                        <div className="space-y-3">
                           <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div>
                                   <p className="font-bold text-gray-900 text-sm">#ORD-1052</p>
                                   <p className="text-xs text-gray-500 font-medium mt-1">15/10/2023 12:30</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-900 font-black mb-1">105.000đ</p>
                                    <span className="text-[10px] uppercase font-black tracking-widest px-2 py-1 bg-green-50 text-green-500 rounded-lg">Hoàn thành</span>
                                </div>
                           </div>
                           <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div>
                                   <p className="font-bold text-gray-900 text-sm">#ORD-1053</p>
                                   <p className="text-xs text-gray-500 font-medium mt-1">15/10/2023 13:00</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-900 font-black mb-1">55.000đ</p>
                                    <span className="text-[10px] uppercase font-black tracking-widest px-2 py-1 bg-green-50 text-green-500 rounded-lg">Hoàn thành</span>
                                </div>
                           </div>
                           <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div>
                                   <p className="font-bold text-gray-900 text-sm">#ORD-1054</p>
                                   <p className="text-xs text-gray-500 font-medium mt-1">15/10/2023 18:15</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-900 font-black mb-1">60.000đ</p>
                                    <span className="text-[10px] uppercase font-black tracking-widest px-2 py-1 bg-red-50 text-red-500 rounded-lg">Đã hủy</span>
                                </div>
                           </div>
                        </div>
                     )}

                     {viewTab === 'settings' && (
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                           <h4 className="font-black text-gray-900 text-sm mb-4 uppercase tracking-widest">Chiết khấu hệ thống</h4>
                           <div className="flex items-center gap-4 mb-6">
                              <input type="number" defaultValue={20} className="w-24 bg-white border border-gray-200 rounded-2xl p-4 font-black text-lg text-gray-900 outline-none text-center focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all" />
                              <span className="font-black text-gray-400 text-xl">%</span>
                           </div>
                           <p className="text-xs text-gray-500 font-medium mb-6">Đây là phần trăm nền tảng thu từ mỗi đơn hàng thành công của quán.</p>
                           <button className="w-full md:w-auto px-8 py-4 bg-[#ee4d2d] text-white rounded-2xl font-black shadow-lg shadow-orange-100 hover:bg-[#d73211] transition-all text-sm uppercase tracking-widest flex justify-center items-center gap-2">
                              Lưu cài đặt
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
