import React from 'react';
import { Home, ReceiptText, Bell, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  const tabs = [
    { name: 'Trang chủ', icon: Home, path: '/' },
    { name: 'Đơn hàng', icon: ReceiptText, path: '/checkout' },
    { name: 'Thông báo', icon: Bell, path: '/notifications' },
    { name: 'Tôi', icon: User, path: '/profile' },
  ];

  return (
    <nav className="md:hidden bg-white/95 backdrop-blur-md fixed bottom-0 left-0 w-full flex justify-around items-center h-16 pb-safe z-50 border-t border-[#EEEEEE] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => (
        <NavLink 
          key={tab.name}
          to={tab.path}
          className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full text-[10px] font-bold transition-all duration-200 ${isActive ? 'text-[#EE4D2D] scale-105' : 'text-gray-400'}`}
        >
          <tab.icon className="w-6 h-6 mb-1" />
          {tab.name}
        </NavLink>
      ))}
    </nav>
  );
}
