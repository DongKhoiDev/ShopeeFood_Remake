import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Flame, Gift, Tag } from 'lucide-react';
import { CATEGORIES } from '../constants';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const mainLinks = [
    { name: 'Trang chủ', icon: Home, path: '/' },
    { name: 'Flash Sale', icon: Flame, path: '/flash-sale' }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-200 p-4 shrink-0 h-[calc(100vh-64px)] sticky top-16">
      <div className="space-y-1 mb-6">
        {mainLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <div 
              key={link.name} 
              onClick={() => navigate(link.path)}
              className={`flex items-center p-2 rounded-lg cursor-pointer transition-all ${isActive ? 'bg-[#ee4d2d]/10 text-[#ee4d2d] font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <link.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-[#ee4d2d]' : 'text-gray-400'}`} />
              <span className="text-sm">{link.name}</span>
            </div>
          );
        })}
      </div>

      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Danh mục</div>
      <div className="space-y-1">
        {CATEGORIES.map((cat) => (
          <div 
            key={cat.id} 
            onClick={() => navigate(`/category/${cat.id}`)}
            className={`flex items-center p-2 text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-all ${location.pathname === `/category/${cat.id}` ? 'bg-gray-50 text-[#ee4d2d] font-bold' : ''}`}
          >
            <div className={`w-2 h-2 rounded-full mr-3 ${cat.iconColor.replace('text-', 'bg-')}`}></div>
            <span className="text-sm">{cat.name}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
