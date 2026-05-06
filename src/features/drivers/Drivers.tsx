import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Users, Plus, Edit2, Trash2, Search, Filter, Star, Eye, ShieldCheck, MapPin, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function Drivers() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', license: '', status: 'ONLINE', avatar: '' });
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedDriverReviews, setSelectedDriverReviews] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ status: '', minRating: '' });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'drivers'), (snap) => {
      setDrivers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const filteredDrivers = drivers.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.phone.includes(searchTerm);
    const matchStatus = filters.status ? d.status === filters.status : true;
    const matchRating = filters.minRating ? d.rating >= Number(filters.minRating) : true;
    return matchSearch && matchStatus && matchRating;
  });

  const openAddModal = () => {
    setFormData({ name: '', phone: '', license: '', status: 'ONLINE', avatar: '' });
    setEditingDriver(null);
    setShowAddModal(true);
  };

  const openEditModal = (driver: any) => {
    setFormData({ name: driver.name, phone: driver.phone, license: driver.license, status: driver.status, avatar: driver.avatar });
    setEditingDriver(driver);
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.phone) return alert('Vui lòng nhập tên và số điện thoại!');
    try {
      if (editingDriver) {
        await updateDoc(doc(db, 'drivers', editingDriver.id), { ...formData });
      } else {
        const newId = `drv_${Date.now()}`;
        await setDoc(doc(db, 'drivers', newId), {
          ...formData,
          rating: 0,
          totalTrips: 0,
          joinDate: new Date().toISOString().split('T')[0],
          avatar: formData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
          createdAt: Date.now()
        });
      }
    } catch(e) { console.error(e); alert('Lỗi khi lưu tài xế'); }
    setShowAddModal(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xoá tài xế này?')) {
      try { await deleteDoc(doc(db, 'drivers', id)); } catch(e) { console.error(e); }
    }
  };

  return (
    <AdminLayout title="Quản lý tài xế">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
         <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm tài xế, sđt..."
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
               Thêm tài xế
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
                  <option value="ONLINE">Trực tuyến</option>
                  <option value="OFFLINE">Ngoại tuyến</option>
                  <option value="BANNED">Khoá</option>
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
                     <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tài xế</th>
                     <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phương tiện</th>
                     <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hiệu suất</th>
                     <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                     <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Thao tác</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {filteredDrivers.map(driver => (
                     <tr key={driver.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4 font-bold text-gray-500 text-xs">#{driver.id}</td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <img referrerPolicy="no-referrer" src={driver.avatar} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                              <div>
                                 <p className="font-black text-gray-900 leading-tight flex items-center gap-1">
                                    {driver.name} 
                                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                                 </p>
                                 <p className="text-xs text-gray-500 font-medium mt-0.5">{driver.phone}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-bold text-gray-700 text-xs">{driver.license}</p>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                 <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                                 <span className="font-bold text-yellow-700 text-xs">{driver.rating}</span>
                              </div>
                              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                                 <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                 <span className="font-bold text-blue-700 text-xs">{driver.totalTrips} chuyến</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                              driver.status === 'ONLINE' ? 'bg-green-50 text-green-500' : 
                              driver.status === 'OFFLINE' ? 'bg-gray-100 text-gray-500' : 
                              'bg-red-50 text-red-500'
                           }`}>
                              {driver.status === 'ONLINE' ? 'Trực tuyến' : driver.status === 'OFFLINE' ? 'Ngoại tuyến' : 'Khoá tk'}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center justify-center gap-1">
                              <button 
                                onClick={() => {
                                  setSelectedDriverReviews({ driver, reviews: [] });
                                  setShowReviewsModal(true);
                                }}
                                className="p-2.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
                              >
                                 <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => openEditModal(driver)}
                                className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition-all shadow-sm"
                              >
                                 <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(driver.id)}
                                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                              >
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
                  {filteredDrivers.length === 0 && (
                     <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">Không tìm thấy tài xế</td>
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
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">{editingDriver ? 'Sửa thông tin tài xế' : 'Thêm tài xế mới'}</h2>
                  <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                     <X className="w-6 h-6 text-gray-500" />
                  </button>
               </div>
               
               <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên tài xế <span className="text-red-500">*</span></label>
                     <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#ee4d2d]/20 focus:bg-white transition-all font-bold text-gray-900 outline-none" placeholder="VD: Nguyễn Văn Tài" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại <span className="text-red-500">*</span></label>
                     <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#ee4d2d]/20 focus:bg-white transition-all font-bold text-gray-900 outline-none" placeholder="VD: 0909123456" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Biển số xe</label>
                     <input type="text" value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#ee4d2d]/20 focus:bg-white transition-all font-bold text-gray-900 outline-none" placeholder="VD: 59A1-12345" />
                  </div>
                  <div className="space-y-2 md:col-span-2 flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                     <div>
                        <h4 className="font-black text-gray-900 text-sm">Trạng thái hoạt động</h4>
                     </div>
                     <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="bg-white border-gray-200 rounded-xl p-2 font-bold text-sm outline-none">
                        <option value="ONLINE">Trực tuyến</option>
                        <option value="OFFLINE">Ngoại tuyến</option>
                        <option value="BANNED">Khoá tài khoản</option>
                     </select>
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Hình đại diện</label>
                     <label className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col justify-center items-center gap-4 hover:bg-orange-50/50 hover:border-orange-200 transition-colors cursor-pointer group w-full">
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                           const file = e.target.files?.[0];
                           if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => setFormData({...formData, avatar: e.target?.result as string});
                              reader.readAsDataURL(file);
                           }
                        }} />
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all overflow-hidden border border-gray-100 shrink-0">
                           {formData.avatar ? <img referrerPolicy="no-referrer" src={formData.avatar} className="w-full h-full object-cover" /> : <Plus className="w-8 h-8 text-gray-400 group-hover:text-[#ee4d2d]" />}
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
        {showReviewsModal && selectedDriverReviews && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl relative my-8 flex flex-col max-h-[80vh]"
            >
               <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center shrink-0">
                  <div>
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-1">Đánh giá khách hàng</h2>
                    <p className="text-sm text-gray-500 font-medium">Tài xế: <span className="font-bold text-gray-900">{selectedDriverReviews.driver.name}</span></p>
                  </div>
                  <button onClick={() => setShowReviewsModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                     <X className="w-6 h-6 text-gray-500" />
                  </button>
               </div>
               
               <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                  {selectedDriverReviews.reviews.length > 0 ? (
                    selectedDriverReviews.reviews.map((review: any) => (
                      <div key={review.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                         <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900">{review.customerName}</h4>
                            <span className="text-xs text-gray-400 font-bold">{review.date}</span>
                         </div>
                         <div className="flex items-center gap-1 mb-2 bg-white w-fit px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
                            {[...Array(5)].map((_, i) => (
                               <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-100 text-gray-200'}`} />
                            ))}
                         </div>
                         <p className="text-sm text-gray-600 leading-relaxed font-medium">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                       <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Chưa có đánh giá nào</p>
                    </div>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
