import React, { useState } from 'react';
import { ShoppingCart, Bell, Search, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-[#ee4d2d] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-[1200px] mx-auto px-4 py-3 md:px-12 flex justify-between items-center h-16">
        <Link to="/" className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">ShopeeFood</h1>
        </Link>

        <div className="hidden md:flex items-center bg-white/20 px-3 py-1.5 rounded-full text-xs border border-white/30 truncate max-w-[250px] mx-4">
          <span className="mr-2">📍</span>
          <span className="truncate">{user?.address || "72 Lê Thánh Tôn, Bến Nghé, Quận 1"}</span>
          <span className="ml-2 text-[10px]">▼</span>
        </div>

        <form 
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md mx-4 relative group"
        >
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm đồ ăn, quán ăn, trà sữa..."
            className="w-full bg-white rounded-l-md py-2 px-4 text-gray-800 text-sm outline-none placeholder-gray-400"
          />
          <button type="submit" className="bg-[#d73211] px-5 rounded-r-md flex items-center justify-center hover:bg-[#c12a0d] transition-colors">
            <Search className="w-4 h-4 text-white" />
          </button>
        </form>

        <div className="flex items-center gap-4 md:gap-6 text-sm">
          <button 
            onClick={() => navigate('/checkout')}
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            <span className="hidden md:inline font-bold">Giỏ hàng ({totalItems})</span>
            {totalItems > 0 && (
              <span className="md:hidden bg-white text-[#ee4d2d] text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full ml-1">{totalItems}</span>
            )}
          </button>
          
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 bg-white">
                  <img referrerPolicy="no-referrer" 
                    src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop"} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="hidden md:inline font-bold text-white">{user?.name}</span>
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 text-gray-800 z-50">
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 hover:text-[#ee4d2d] transition-colors font-bold text-sm"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Quản trị Admin
                    </Link>
                  )}
                  <Link 
                    to="/profile" 
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 hover:text-[#ee4d2d] transition-colors font-bold text-sm"
                  >
                    <User className="w-4 h-4" /> Hồ sơ của tôi
                  </Link>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button 
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-500 transition-colors font-bold text-sm"
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')}
                className="font-bold cursor-pointer hover:opacity-80 transition-opacity hidden md:block"
              >
                Đăng nhập
              </button>
              
              <button 
                onClick={() => navigate('/register')}
                className="bg-white text-[#ee4d2d] px-4 py-1.5 rounded-full font-black cursor-pointer hover:bg-opacity-90 transition-all hidden md:block"
              >
                Đăng ký
              </button>
            </>
          )}

          {!isAuthenticated && (
            <Link to="/login" className="flex items-center md:hidden">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 bg-white/20 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
