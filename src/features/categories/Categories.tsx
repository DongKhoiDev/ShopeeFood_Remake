import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { CATEGORIES } from '../../constants';
import { Plus, Edit2, Trash2, GripVertical, CheckSquare, Square, EyeOff, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CategoryManagement() {
  const [categories, setCategories] = useState(CATEGORIES.map((c, i) => ({ ...c, isHidden: false, order: i })));
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({ name: '', order: 1, isHidden: false });
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const openAddModal = () => {
    setFormData({ name: '', order: categories.length + 1, isHidden: false });
    setEditingCategory(null);
    setShowAddModal(true);
  };

  const openEditModal = (category: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData({ name: category.name, order: category.order, isHidden: category.isHidden || false });
    setEditingCategory(category);
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!formData.name) return alert('Vui lòng nhập tên danh mục!');

    if (editingCategory) {
       setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c));
    } else {
       const newCat = {
          id: `C${Math.floor(Math.random() * 10000)}`,
          name: formData.name,
          icon: 'category', // Default fallback
          color: 'bg-orange-50',
          iconColor: 'text-[#ee4d2d]',
          isHidden: formData.isHidden,
          order: formData.order
       };
       setCategories(prev => [...prev, newCat]);
    }
    setShowAddModal(false);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    const newCategories = [...categories];
    const draggedItem = newCategories[draggedItemIndex];
    
    newCategories.splice(draggedItemIndex, 1);
    newCategories.splice(index, 0, draggedItem);
    
    setCategories(newCategories.map((c, i) => ({ ...c, order: i })));
    setDraggedItemIndex(null);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === categories.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(categories.map(c => c.id));
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleVisibility = (id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, isHidden: !c.isHidden } : c));
  };

  return (
    <AdminLayout title="Quản lý danh mục">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
         <p className="text-gray-400 font-medium text-sm md:text-base">Kéo thả <GripVertical className="inline w-4 h-4" /> để thay đổi thứ tự hiển thị danh mục.</p>
         <button 
           onClick={openAddModal}
           className="flex items-center justify-center gap-2 px-8 py-4 bg-[#ee4d2d] w-full md:w-auto text-white rounded-2xl font-black shadow-lg shadow-orange-100 hover:bg-[#d73211] transition-all text-sm uppercase tracking-wider"
         >
            <Plus className="w-5 h-5" />
            Thêm danh mục
         </button>
      </div>

      <AnimatePresence>
         {selectedItems.length > 0 && (
            <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="bg-gray-900 text-white p-4 rounded-2xl mb-6 flex justify-between items-center shadow-lg"
            >
               <div className="font-bold text-sm">
                  Đã chọn {selectedItems.length} danh mục
               </div>
               <div className="flex gap-3">
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold text-xs transition-colors flex items-center gap-2">
                     <EyeOff className="w-4 h-4" /> Ẩn
                  </button>
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl font-bold text-xs transition-colors flex items-center gap-2" onClick={() => {
                     if (window.confirm("Bạn có chắc muốn xoá các danh mục này?")) {
                        setCategories(prev => prev.filter(c => !selectedItems.includes(c.id)));
                        setSelectedItems([]);
                     }
                  }}>
                     <Trash2 className="w-4 h-4" /> Xoá
                  </button>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
         <div className="overflow-x-auto min-h-[300px]">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-5 w-12 cursor-pointer" onClick={toggleSelectAll}>
                     {selectedItems.length === categories.length && categories.length > 0 ? (
                        <CheckSquare className="w-5 h-5 text-[#ee4d2d]" />
                     ) : (
                        <Square className="w-5 h-5 text-gray-300" />
                     )}
                  </th>
                  <th className="w-12 px-2 py-5 text-[10px] font-black text-center text-gray-400">#</th>
                  <th className="px-4 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên danh mục</th>
                  <th className="px-4 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest w-32">Trạng thái</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-32">Thao tác</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {categories.map((cat, idx) => (
                  <tr 
                     key={cat.id} 
                     draggable
                     onDragStart={(e) => handleDragStart(e, idx)}
                     onDragOver={(e) => handleDragOver(e, idx)}
                     onDrop={(e) => handleDrop(e, idx)}
                     className={`hover:bg-gray-50 transition-colors group cursor-grab active:cursor-grabbing ${draggedItemIndex === idx ? 'opacity-50' : 'opacity-100'}`}
                  >
                     <td className="px-6 py-4 cursor-pointer" onClick={(e) => toggleSelect(cat.id, e)}>
                        {selectedItems.includes(cat.id) ? (
                           <CheckSquare className="w-5 h-5 text-[#ee4d2d]" />
                        ) : (
                           <Square className="w-5 h-5 text-gray-300" />
                        )}
                     </td>
                     <td className="px-2 py-4">
                        <div className="flex items-center justify-center text-gray-300 group-hover:text-gray-500 transition-colors">
                           <GripVertical className="w-5 h-5" />
                        </div>
                     </td>
                     <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                           <div className={`w-12 h-12 ${cat.color} rounded-2xl flex items-center justify-center ${cat.iconColor} shrink-0`}>
                              <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                           </div>
                           <div>
                              <p className="font-black text-gray-900 group-hover:text-[#ee4d2d] transition-colors">{cat.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Mã: {cat.id}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-4 py-4">
                        <label className="relative inline-flex items-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                           <input type="checkbox" className="sr-only peer" checked={!cat.isHidden} onChange={() => toggleVisibility(cat.id)} />
                           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ee4d2d]"></div>
                        </label>
                     </td>
                     <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                           <button 
                              onClick={(e) => openEditModal(cat, e)}
                              className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition-all shadow-sm"
                           >
                              <Edit2 className="w-4 h-4" />
                           </button>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               if (window.confirm('Bạn có chắc muốn xoá danh mục này?')) {
                                  setCategories(prev => prev.filter(c => c.id !== cat.id));
                               }
                             }}
                             className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition-all shadow-sm"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </td>
                  </tr>
               ))}
               {categories.length === 0 && (
                 <tr>
                    <td colSpan={5} className="py-20 text-center text-gray-400 font-bold tracking-widest uppercase">
                       Không có danh mục nào
                    </td>
                 </tr>
               )}
            </tbody>
         </table>
         </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl relative my-8"
            >
               <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white rounded-t-[32px] z-10">
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">{editingCategory ? 'Chỉnh sửa' : 'Thêm'} danh mục</h2>
                  <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                     <X className="w-6 h-6 text-gray-500" />
                  </button>
               </div>
               
               <div className="p-6 md:p-8 space-y-6">
                  <div className="flex gap-6 items-center">
                     <div className="w-20 h-20 bg-orange-50 text-[#ee4d2d] rounded-2xl flex items-center justify-center border-2 border-orange-100 border-dashed cursor-pointer hover:bg-orange-100 transition-colors">
                        {editingCategory ? <span className="material-symbols-outlined text-3xl">{editingCategory.icon}</span> : <Plus className="w-8 h-8" />}
                     </div>
                     <div>
                        <p className="font-bold text-gray-900 text-sm">Icon vật lý / Hình ảnh</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">Chọn ảnh hoặc Google Material Icon</p>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên danh mục <span className="text-red-500">*</span></label>
                     <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#ee4d2d]/20 focus:bg-white transition-all font-bold text-gray-900 outline-none" placeholder="Nhập tên..." />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vị trí, thứ tự mặc định</label>
                     <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#ee4d2d]/20 focus:bg-white transition-all font-bold text-gray-900 outline-none" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                     <div>
                        <h4 className="font-black text-gray-900 text-sm">Trạng thái hiển thị</h4>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={!formData.isHidden} onChange={() => setFormData({...formData, isHidden: !formData.isHidden})} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ee4d2d]"></div>
                     </label>
                  </div>
               </div>

               <div className="p-6 md:p-8 border-t border-gray-100 flex gap-4 sticky bottom-0 bg-white rounded-b-[32px] z-10">
                  <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-gray-900 font-black bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all uppercase tracking-widest text-xs">Hủy bỏ</button>
                  <button onClick={handleSave} className="flex-[2] py-4 bg-[#ee4d2d] flex items-center justify-center gap-2 text-white font-black rounded-2xl shadow-lg shadow-orange-100 hover:bg-[#d73211] transition-all uppercase tracking-widest text-xs">
                    <Save className="w-4 h-4" /> Lưu danh mục
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
