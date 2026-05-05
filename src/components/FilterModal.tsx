import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown, Check, Star, Clock, MapPin, SlidersHorizontal } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export default function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [selectedSort, setSelectedSort] = useState('Gần nhất');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState('all');

  const combinations = [
    { name: 'Đánh giá 4.5+', icon: Star },
    { name: 'Giao nhanh <30p', icon: Clock },
    { name: 'Gần tôi', icon: MapPin },
    { name: 'Ưu đãi Partner', icon: SlidersHorizontal },
  ];

  const priceOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Dưới 50k', value: 'under50' },
    { label: '50k - 100k', value: '50-100' },
    { label: 'Trên 100k', value: 'above100' },
  ];

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const handleApply = () => {
    onApply({
      sort: selectedSort,
      filters: activeFilters,
      price: priceRange
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-[500px] bg-white md:rounded-[40px] rounded-t-[40px] z-[70] flex flex-col max-h-[90vh] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900 tracking-tight italic">BỘ LỌC TÌM KIẾM</h3>
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
              {/* Sort Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Sắp xếp theo</h4>
                  <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded">Mặc định</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['Gần nhất', 'Đánh giá', 'Bán chạy', 'Giá giảm dần'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedSort(type)}
                      className={`p-4 rounded-2xl border text-xs font-black uppercase tracking-tight transition-all flex items-center justify-between ${
                        selectedSort === type 
                        ? 'border-[#ee4d2d] bg-orange-50 text-[#ee4d2d]' 
                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      {type}
                      {selectedSort === type && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </section>

              {/* Price Range Section */}
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Khoảng giá</h4>
                <div className="flex flex-wrap gap-3">
                  {priceOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPriceRange(opt.value)}
                      className={`px-6 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                        priceRange === opt.value 
                        ? 'border-gray-900 bg-gray-900 text-white shadow-lg' 
                        : 'border-gray-100 bg-white text-gray-400 hover:border-orange-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </section>

              {/* Fast Tags Section */}
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Tiện ích chọn nhanh</h4>
                <div className="space-y-3">
                  {combinations.map((comb) => (
                    <button
                      key={comb.name}
                      onClick={() => toggleFilter(comb.name)}
                      className={`w-full p-4 rounded-3xl border flex items-center gap-4 transition-all ${
                        activeFilters.includes(comb.name)
                        ? 'border-orange-200 bg-orange-50/50'
                        : 'border-gray-100 hover:border-orange-100'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                        activeFilters.includes(comb.name) ? 'bg-[#ee4d2d] text-white' : 'bg-gray-50 text-gray-400'
                      }`}>
                        <comb.icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-widest ${
                        activeFilters.includes(comb.name) ? 'text-[#ee4d2d]' : 'text-gray-600'
                      }`}>{comb.name}</span>
                      <div className={`ml-auto w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        activeFilters.includes(comb.name) ? 'border-[#ee4d2d] bg-[#ee4d2d]' : 'border-gray-200'
                      }`}>
                        {activeFilters.includes(comb.name) && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 flex gap-4">
              <button 
                onClick={() => {
                  setActiveFilters([]);
                  setSelectedSort('Gần nhất');
                  setPriceRange('all');
                }}
                className="flex-1 bg-white border border-gray-200 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-100 transition-all text-gray-500"
              >
                Xóa tất cả
              </button>
              <button 
                onClick={handleApply}
                className="flex-[2] bg-[#ee4d2d] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl shadow-orange-100"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
