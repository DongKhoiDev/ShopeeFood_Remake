import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useRestaurants } from '../../hooks/useRestaurants';
import { Plus, Search, Filter, Edit2, Trash2, CheckSquare, Square, ChevronLeft, ChevronRight, EyeOff, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getFoodImage } from '../../lib/images';

export default function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [formData, setFormData] = useState({ name: '', price: '', category: '', restaurant: '', desc: '', status: true, image: '', variants: [] as {name: string, price: string}[], optionGroups: [] as { name: string, required: boolean, multiple: boolean, choices: { name: string, priceDelta: string }[] }[] });

  const { restaurants, loading } = useRestaurants();

  // Flattened products from mock data for demo
  const [localProducts, setLocalProducts] = useState<any[]>([]);

  useEffect(() => {
    setLocalProducts(
      restaurants.flatMap(r => 
        r.menu.map((item: any) => ({ ...item, restaurant: r.name, isHidden: false, salePrice: null }))
      )
    );
  }, [restaurants]);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ category: '', restaurant: '', minPrice: '', maxPrice: '' });

  const filteredProducts = localProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.restaurant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filters.category ? p.category === filters.category : true;
    const matchRestaurant = filters.restaurant ? p.restaurant === filters.restaurant : true;
    const matchMinPrice = filters.minPrice ? p.price >= Number(filters.minPrice) : true;
    const matchMaxPrice = filters.maxPrice ? p.price <= Number(filters.maxPrice) : true;
    return matchSearch && matchCategory && matchRestaurant && matchMinPrice && matchMaxPrice;
  });

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedItems.length === paginatedProducts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <AdminLayout title="Quản lý sản phẩm">
      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm">
         <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm sản phẩm, nhà hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-[#ee4d2d]/10 focus:bg-white transition-all font-medium text-sm outline-none"
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
               onClick={() => {
                  setFormData({ name: '', price: '', category: '', restaurant: '', desc: '', status: true, image: '', variants: [], optionGroups: [] });
                  setEditingProduct(null);
                  setShowAddModal(true);
               }}
               className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-[#ee4d2d] text-white rounded-2xl font-black shadow-lg shadow-orange-100 hover:bg-[#d73211] transition-all text-sm uppercase tracking-wider"
            >
               <Plus className="w-4 h-4" />
               Thêm mới
            </button>
         </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Danh mục</label>
                <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all">
                  <option value="">Tất cả danh mục</option>
                  {Array.from(new Set(localProducts.map(p => p.category))).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Nhà hàng</label>
                <select value={filters.restaurant} onChange={e => setFilters({...filters, restaurant: e.target.value})} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all">
                  <option value="">Tất cả nhà hàng</option>
                  {Array.from(new Set(localProducts.map(p => p.restaurant))).map(res => (
                    <option key={res} value={res}>{res}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Từ (VNĐ)</label>
                <input type="number" placeholder="0" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Đến (VNĐ)</label>
                <input type="number" placeholder="100000" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} className="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl px-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all" />
              </div>
              <div className="flex justify-end items-end gap-3 pt-2">
                <button onClick={() => setFilters({category: '', restaurant: '', minPrice: '', maxPrice: ''})} className="px-6 h-12 w-full rounded-2xl font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-all text-xs uppercase tracking-widest">Xoá bộ lọc</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
         {selectedItems.length > 0 && (
            <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="bg-gray-900 text-white p-4 rounded-2xl mb-4 flex justify-between items-center shadow-lg"
            >
               <div className="font-bold text-sm">
                  Đã chọn {selectedItems.length} sản phẩm
               </div>
               <div className="flex gap-3">
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold text-xs transition-colors flex items-center gap-2">
                     <EyeOff className="w-4 h-4" /> Ẩn
                  </button>
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl font-bold text-xs transition-colors flex items-center gap-2" onClick={() => {
                     if (window.confirm("Bạn có chắc muốn xoá các sản phẩm này?")) {
                        setSelectedItems([]);
                     }
                  }}>
                     <Trash2 className="w-4 h-4" /> Xoá
                  </button>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Product Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden mb-10">
         <div className="overflow-x-auto min-h-[400px]">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-5 w-12 cursor-pointer" onClick={toggleSelectAll}>
                     {selectedItems.length === paginatedProducts.length && paginatedProducts.length > 0 ? (
                        <CheckSquare className="w-5 h-5 text-[#ee4d2d]" />
                     ) : (
                        <Square className="w-5 h-5 text-gray-300" />
                     )}
                  </th>
                  <th className="py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest min-w-[250px]">Sản phẩm</th>
                  <th className="px-4 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Danh mục</th>
                  <th className="px-4 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Giá</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Thao tác</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {paginatedProducts.map((product, idx) => (
                  <tr key={product.id || idx} className="hover:bg-gray-50 transition-colors group">
                     <td className="px-8 py-6 cursor-pointer" onClick={() => toggleSelect(product.id)}>
                        {selectedItems.includes(product.id) ? (
                           <CheckSquare className="w-5 h-5 text-[#ee4d2d]" />
                        ) : (
                           <Square className="w-5 h-5 text-gray-300" />
                        )}
                     </td>
                     <td className="py-6 pr-4">
                        <div className="flex items-center gap-4">
                           <img referrerPolicy="no-referrer" src={getFoodImage(product.image, product.id)} className="w-12 h-12 rounded-xl object-cover border border-gray-100 group-hover:scale-105 transition-transform shrink-0" />
                           <div>
                              <p className="font-black text-gray-900 group-hover:text-[#ee4d2d] transition-colors">{product.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{product.restaurant}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-4 py-6">
                        <span className="bg-orange-50 text-[#ee4d2d] px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight">
                           {product.category}
                        </span>
                     </td>
                     <td className="px-4 py-6">
                        <span className="bg-green-50 text-green-500 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight">
                           Hiển thị
                        </span>
                     </td>
                     <td className="px-8 py-6 text-right font-black text-gray-900">
                        {(product.price || 0).toLocaleString()}đ
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-1">
                           <button 
                             onClick={() => {
                               setFormData({
                                 name: product.name,
                                 price: product.price,
                                 category: product.category || '',
                                 restaurant: product.restaurant || '',
                                 desc: product.description || '',
                                 status: !product.isHidden,
                                 image: product.image || '',
                                 variants: product.variants ? product.variants.map((v: any) => ({ name: v.name, price: v.price.toString() })) : [],
                                 optionGroups: product.optionGroups ? product.optionGroups.map((g: any) => ({ ...g, choices: g.choices.map((c: any) => ({ name: c.name, priceDelta: c.priceDelta.toString() })) })) : []
                               });
                               setEditingProduct(product);
                               setShowAddModal(true);
                             }}
                             className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition-all shadow-sm"
                           >
                              <Edit2 className="w-4 h-4" />
                           </button>
                           <button 
                             onClick={() => {
                               if (window.confirm('Bạn có chắc muốn xoá sản phẩm này?')) {
                                 setLocalProducts(localProducts.filter(p => p.id !== product.id));
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
               {paginatedProducts.length === 0 && (
                 <tr>
                    <td colSpan={6} className="py-20 text-center text-gray-400 font-bold tracking-widest uppercase">
                       Không tìm thấy sản phẩm
                    </td>
                 </tr>
               )}
            </tbody>
         </table>
         </div>

         {/* Pagination */}
         <div className="p-6 md:p-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center bg-gray-50/30 gap-4">
            <p className="text-sm font-bold text-gray-400 text-center md:text-left">Đang hiển thị <span className="text-gray-900">{paginatedProducts.length}</span> từ <span className="text-gray-900">{filteredProducts.length}</span> sản phẩm</p>
            <div className="flex gap-2">
               <button 
                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                 disabled={currentPage === 1}
                 className="p-2 text-gray-400 hover:text-gray-900 bg-white rounded-xl border border-gray-100 shadow-sm disabled:opacity-50"
               >
                  <ChevronLeft className="w-5 h-5" />
               </button>
               <button 
                 onClick={() => setCurrentPage(p => p + 1)}
                 disabled={currentPage * itemsPerPage >= filteredProducts.length}
                 className="p-2 text-gray-400 hover:text-gray-900 bg-white rounded-xl border border-gray-100 shadow-sm disabled:opacity-50"
               >
                  <ChevronRight className="w-5 h-5" />
               </button>
            </div>
         </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="bg-white w-full max-w-3xl rounded-[32px] shadow-2xl relative my-8"
            >
               <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white rounded-t-[32px] z-10">
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">{editingProduct ? 'Sửa thông tin sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                  <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                     <X className="w-6 h-6 text-gray-500" />
                  </button>
               </div>
               
               <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Image Upload Area */}
                  <div className="md:col-span-2">
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Hình ảnh sản phẩm</label>
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

                  <div className="space-y-2 md:col-span-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tên món ăn <span className="text-red-500">*</span></label>
                     <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#ee4d2d]/20 focus:bg-white transition-all font-bold text-gray-900 outline-none" placeholder="Nhập tên món..." />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Giá bán (đ) <span className="text-red-500">*</span></label>
                     <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#ee4d2d]/20 focus:bg-white transition-all font-bold text-gray-900 outline-none" placeholder="0" />
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Giá khuyến mãi (đ)</label>
                     <input type="number" className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#ee4d2d]/20 focus:bg-white transition-all font-bold text-gray-900 outline-none" placeholder="0" />
                  </div>

                  <div className="md:col-span-2 space-y-4">
                     <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kích cỡ & Giá Tùy Chọn</label>
                        <button 
                           onClick={() => setFormData({...formData, variants: [...formData.variants, { name: '', price: '' }]})}
                           className="text-[#ee4d2d] hover:text-[#d73211] font-bold text-xs uppercase tracking-widest flex items-center gap-1"
                        >
                           <Plus className="w-4 h-4" /> Thêm size
                        </button>
                     </div>
                     {formData.variants.map((variant, index) => (
                        <div key={index} className="flex gap-4 items-center">
                           <input type="text" value={variant.name} onChange={e => {
                              const newVariants = [...formData.variants];
                              newVariants[index].name = e.target.value;
                              setFormData({...formData, variants: newVariants});
                           }} className="flex-1 bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#ee4d2d]/20 focus:bg-white transition-all font-bold text-gray-900 outline-none" placeholder="Tên (VD: Lớn, Nhỏ)..." />
                           <input type="number" value={variant.price} onChange={e => {
                              const newVariants = [...formData.variants];
                              newVariants[index].price = e.target.value;
                              setFormData({...formData, variants: newVariants});
                           }} className="flex-1 bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#ee4d2d]/20 focus:bg-white transition-all font-bold text-gray-900 outline-none" placeholder="Giá..." />
                           <button onClick={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants.splice(index, 1);
                              setFormData({...formData, variants: newVariants});
                           }} className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                              <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
                     ))}
                  </div>

                  <div className="md:col-span-2 space-y-4">
                     <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nhóm Tùy Chọn Khác</label>
                        <button 
                           onClick={() => setFormData({...formData, optionGroups: [...formData.optionGroups, { name: '', required: false, multiple: false, choices: [] }]})}
                           className="text-[#ee4d2d] hover:text-[#d73211] font-bold text-xs uppercase tracking-widest flex items-center gap-1"
                        >
                           <Plus className="w-4 h-4" /> Thêm nhóm tùy chọn
                        </button>
                     </div>
                     {formData.optionGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="bg-gray-50 rounded-2xl p-4 space-y-4">
                           <div className="flex gap-4 items-start">
                              <div className="flex-1 space-y-2">
                                 <input type="text" value={group.name} onChange={e => {
                                    const newGroups = [...formData.optionGroups];
                                    newGroups[groupIndex].name = e.target.value;
                                    setFormData({...formData, optionGroups: newGroups});
                                 }} className="w-full bg-white border-none rounded-xl p-3 focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all font-bold text-gray-900 outline-none" placeholder="Tên nhóm (VD: Thêm topping, Lượng đá...)" />
                                 <div className="flex items-center gap-4 px-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                       <input type="checkbox" checked={group.required} onChange={e => {
                                          const newGroups = [...formData.optionGroups];
                                          newGroups[groupIndex].required = e.target.checked;
                                          setFormData({...formData, optionGroups: newGroups});
                                       }} className="rounded text-[#ee4d2d] focus:ring-[#ee4d2d]" />
                                       <span className="text-xs font-bold text-gray-600">Bắt buộc chọn</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                       <input type="checkbox" checked={group.multiple} onChange={e => {
                                          const newGroups = [...formData.optionGroups];
                                          newGroups[groupIndex].multiple = e.target.checked;
                                          setFormData({...formData, optionGroups: newGroups});
                                       }} className="rounded text-[#ee4d2d] focus:ring-[#ee4d2d]" />
                                       <span className="text-xs font-bold text-gray-600">Chọn nhiều</span>
                                    </label>
                                 </div>
                              </div>
                              <button onClick={(e) => {
                                 const newGroups = [...formData.optionGroups];
                                 newGroups.splice(groupIndex, 1);
                                 setFormData({...formData, optionGroups: newGroups});
                              }} className="p-3 text-red-500 hover:bg-white rounded-xl transition-all">
                                 <Trash2 className="w-5 h-5" />
                              </button>
                           </div>
                           
                           <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                              {group.choices.map((choice, choiceIndex) => (
                                 <div key={choiceIndex} className="flex gap-2 items-center">
                                    <input type="text" value={choice.name} onChange={e => {
                                       const newGroups = [...formData.optionGroups];
                                       newGroups[groupIndex].choices[choiceIndex].name = e.target.value;
                                       setFormData({...formData, optionGroups: newGroups});
                                    }} className="flex-[2] bg-white border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all font-medium text-gray-900 outline-none" placeholder="Tên tùy chọn..." />
                                    <input type="number" value={choice.priceDelta} onChange={e => {
                                       const newGroups = [...formData.optionGroups];
                                       newGroups[groupIndex].choices[choiceIndex].priceDelta = e.target.value;
                                       setFormData({...formData, optionGroups: newGroups});
                                    }} className="flex-1 bg-white border-none rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all font-medium text-gray-900 outline-none" placeholder="Giá cộng thêm..." />
                                    <button onClick={(e) => {
                                       const newGroups = [...formData.optionGroups];
                                       newGroups[groupIndex].choices.splice(choiceIndex, 1);
                                       setFormData({...formData, optionGroups: newGroups});
                                    }} className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-all">
                                       <X className="w-4 h-4" />
                                    </button>
                                 </div>
                              ))}
                              <button 
                                 onClick={() => {
                                    const newGroups = [...formData.optionGroups];
                                    newGroups[groupIndex].choices.push({ name: '', priceDelta: '0' });
                                    setFormData({...formData, optionGroups: newGroups});
                                 }}
                                 className="text-gray-500 hover:text-gray-900 font-bold text-xs flex items-center gap-1 mt-2"
                              >
                                 <Plus className="w-3 h-3" /> Thêm lựa chọn
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Danh mục <span className="text-red-500">*</span></label>
                     <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#ee4d2d]/20 focus:bg-white transition-all font-bold text-gray-900 outline-none">
                        <option value="">Chọn danh mục...</option>
                        {Array.from(new Set(localProducts.map(p => p.category))).map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nhà hàng <span className="text-red-500">*</span></label>
                     <select value={formData.restaurant} onChange={e => setFormData({...formData, restaurant: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#ee4d2d]/20 focus:bg-white transition-all font-bold text-gray-900 outline-none">
                        <option value="">Chọn nhà hàng...</option>
                        {Array.from(new Set(localProducts.map(p => p.restaurant))).map(res => (
                          <option key={res} value={res}>{res}</option>
                        ))}
                     </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mô tả món ăn</label>
                     <textarea rows={3} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-[#ee4d2d]/20 focus:bg-white transition-all font-medium text-gray-900 outline-none resize-none" placeholder="Nhập mô tả..." />
                  </div>
                  
                  <div className="md:col-span-2 flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                     <div>
                        <h4 className="font-black text-gray-900">Trạng thái hiển thị</h4>
                        <p className="text-xs text-gray-500 font-medium mt-1">Ẩn/hiện sản phẩm này trên ứng dụng</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={formData.status} onChange={e => setFormData({...formData, status: e.target.checked})} />
                        <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#ee4d2d]"></div>
                     </label>
                  </div>
               </div>

               <div className="p-8 border-t border-gray-100 flex gap-4 sticky bottom-0 bg-white rounded-b-[32px] z-10">
                  <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-gray-900 font-black bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all uppercase tracking-widest text-xs">Hủy bỏ</button>
                  <button 
                     onClick={() => {
                        if (!formData.name || !formData.price || !formData.category || !formData.restaurant) {
                           alert('Vui lòng điền đầy đủ các trường bắt buộc!');
                           return;
                        }
                        
                        if (editingProduct) {
                           const updatedProduct = {
                               ...editingProduct,
                               name: formData.name,
                               price: Number(formData.price),
                               category: formData.category,
                               restaurant: formData.restaurant,
                               description: formData.desc,
                               isHidden: !formData.status,
                               image: formData.image || editingProduct.image,
                               variants: formData.variants.map(v => ({ name: v.name, price: Number(v.price) })),
                               optionGroups: formData.optionGroups.map(g => ({ ...g, choices: g.choices.map(c => ({ name: c.name, priceDelta: Number(c.priceDelta) })) }))
                           };
                           setLocalProducts(localProducts.map(p => p.id === editingProduct.id ? updatedProduct : p));
                        } else {
                           const newProduct = {
                              id: `p${Math.floor(Math.random() * 10000)}`,
                              name: formData.name,
                              price: Number(formData.price),
                              category: formData.category,
                              restaurant: formData.restaurant,
                              description: formData.desc,
                              isHidden: !formData.status,
                              image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200',
                              salePrice: null,
                              variants: formData.variants.map(v => ({ name: v.name, price: Number(v.price) })),
                              optionGroups: formData.optionGroups.map(g => ({ ...g, choices: g.choices.map(c => ({ name: c.name, priceDelta: Number(c.priceDelta) })) }))
                           };
                           setLocalProducts([newProduct as any, ...localProducts]);
                        }
                        setShowAddModal(false);
                     }}
                     className="flex-[2] py-4 bg-[#ee4d2d] flex items-center justify-center gap-2 text-white font-black rounded-2xl shadow-lg shadow-orange-100 hover:bg-[#d73211] transition-all uppercase tracking-widest text-xs"
                  >
                    <Save className="w-4 h-4" /> Lưu sản phẩm
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
