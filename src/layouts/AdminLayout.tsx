import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Utensils, 
  ListTree, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  LogOut,
  ChevronRight,
  DollarSign,
  Clock,
  Store
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard, path: '/admin' },
    { id: 'orders', label: 'Đơn hàng', icon: ShoppingBag, path: '/admin/orders' },
    { id: 'products', label: 'Sản phẩm', icon: Utensils, path: '/admin/products' },
    { id: 'categories', label: 'Danh mục', icon: ListTree, path: '/admin/categories' },
    { id: 'restaurants', label: 'Nhà hàng', icon: Store, path: '/admin/restaurants' },
    { id: 'drivers', label: 'Tài xế', icon: Users, path: '/admin/drivers' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-[200px] bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link to="/" className="text-[#ee4d2d] text-2xl font-black italic">SFood Admin</Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                location.pathname === item.path 
                ? 'bg-[#ee4d2d] text-white shadow-lg shadow-orange-100' 
                : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
             <div className="flex items-center gap-3 mb-1">
                <img referrerPolicy="no-referrer" src={user?.avatar} className="w-8 h-8 rounded-full" alt="" />
                <div className="overflow-hidden">
                   <p className="text-sm font-black text-gray-900 truncate">{user?.name}</p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase">Administrator</p>
                </div>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10 flex justify-between items-center">
           <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{title}</h1>
              <p className="text-gray-400 font-medium mt-1">Chào mừng bạn quay lại hệ thống quản trị.</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="bg-white p-2 text-gray-400 rounded-xl border border-gray-100 relative">
                 <ShoppingBag className="w-5 h-5" />
                 <span className="absolute top-0 right-0 w-2 h-2 bg-[#ee4d2d] rounded-full border-2 border-white"></span>
              </div>
           </div>
        </header>

        {children}
      </main>
    </div>
  );
}

// Stats Card Component
export function StatsCard({ title, value, change, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-4">
         <div className={`p-3 rounded-2xl ${color}`}>
            <Icon className="w-6 h-6" />
         </div>
         <span className={`text-[10px] font-black uppercase tracking-widest ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {change} tháng này
         </span>
      </div>
      <h3 className="text-gray-400 font-bold text-sm mb-1 uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-black text-gray-900">{value}</p>
    </div>
  );
}
