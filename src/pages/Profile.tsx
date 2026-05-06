import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Phone, MapPin, Lock, LogOut, CheckCircle2, ShieldAlert, ReceiptText, Search, RotateCcw, LayoutDashboard, Settings, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import toast, { Toaster } from 'react-hot-toast';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function Profile() {
  const navigate = useNavigate();
  const { user, token, logout, updateProfileData } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [orders, setOrders] = useState<any[]>([]);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');

      const q = query(collection(db, 'orders'), where('userId', '==', user.id));
      const unsub = onSnapshot(q, (snap) => {
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort by createdAt descending
        data.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
        setOrders(data);
      });
      return () => unsub();
    }
  }, [user]);

  const stats = useMemo(() => {
    const completedOrders = orders.filter(o => o.status === 'COMPLETED');
    const totalSpent = completedOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const totalOrders = orders.length;
    
    let tier = 'Đồng';
    let nextTier = 1000000;
    if (totalSpent >= 10000000) { tier = 'Kim Cương'; nextTier = 0; }
    else if (totalSpent >= 5000000) { tier = 'Vàng'; nextTier = 10000000; }
    else if (totalSpent >= 1000000) { tier = 'Bạc'; nextTier = 5000000; }

    return { totalSpent, totalOrders, tier, nextTier };
  }, [orders]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileData(name, phone, address);
      toast.success("Cập nhật thông tin thành công!");
    } catch (e) {
      toast.error("Có lỗi xảy ra khi cập nhật!");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp!");
    }
    if (newPassword.length < 6) {
      return toast.error("Mật khẩu phải từ 6 ký tự!");
    }
    try {
      const { updatePassword } = await import('firebase/auth');
      const { auth } = await import('../firebase');
      if (auth.currentUser) {
         await updatePassword(auth.currentUser, newPassword);
         toast.success("Đổi mật khẩu thành công!");
         setOldPassword('');
         setNewPassword('');
         setConfirmPassword('');
      } else {
         toast.error("Vui lòng đăng nhập lại để đổi mật khẩu!");
      }
    } catch (e: any) {
      if (e.code === 'auth/requires-recent-login') {
         toast.error("Vui lòng đăng xuất và đăng nhập lại để thực hiện đổi mật khẩu.");
      } else {
         toast.error("Có lỗi xảy ra khi đổi mật khẩu!");
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản vĩnh viễn?")) return;
    try {
      const { auth, db } = await import('../firebase');
      const { deleteUser } = await import('firebase/auth');
      const { deleteDoc, doc } = await import('firebase/firestore');
      
      if (auth.currentUser) {
        await deleteDoc(doc(db, 'users', auth.currentUser.uid));
        await deleteUser(auth.currentUser);
        toast.success("Đã xóa tài khoản.");
        logout();
        navigate('/');
      } else {
        toast.error("Không tìm thấy thông tin đăng nhập!");
      }
    } catch (e: any) {
      if (e.code === 'auth/requires-recent-login') {
         toast.error("Vui lòng đăng xuất và đăng nhập lại để thực hiện tính năng này.");
      } else {
         toast.error("Không thể xóa tài khoản!");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24 font-sans selection:bg-[#ee4d2d]/20 selection:text-[#ee4d2d]">
      <Toaster position="top-center" />
      <Navbar />

      <main className="max-w-2xl mx-auto py-8 px-4 md:px-0">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-black tracking-tight text-gray-900">Hồ sơ cá nhân</h2>
        </div>

        <div className="flex bg-white rounded-2xl p-1 shadow-sm mb-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'overview' ? 'bg-[#ee4d2d] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Tổng quan
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-[#ee4d2d] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Settings className="w-4 h-4" /> Cài đặt tài khoản
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-3">
                  <ReceiptText className="w-6 h-6 text-[#ee4d2d]" />
                </div>
                <p className="text-gray-500 text-sm font-bold mb-1">Tổng đơn hàng</p>
                <p className="text-2xl font-black text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
                  <span className="text-green-500 font-black text-xl">₫</span>
                </div>
                <p className="text-gray-500 text-sm font-bold mb-1">Đã chi tiêu</p>
                <p className="text-2xl font-black text-gray-900">{stats.totalSpent.toLocaleString()}đ</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-20 rounded-bl-full"></div>
                <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center mb-3 relative z-10">
                  <User className="w-6 h-6 text-yellow-500" />
                </div>
                <p className="text-gray-500 text-sm font-bold mb-1 relative z-10">Hạng thành viên</p>
                <p className="text-2xl font-black text-gray-900 relative z-10">{stats.tier}</p>
                {stats.nextTier > 0 && (
                  <p className="text-[10px] text-gray-400 mt-2">Cần {((stats.nextTier - stats.totalSpent) > 0 ? (stats.nextTier - stats.totalSpent) : 0).toLocaleString()}đ để lên hạng</p>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#ee4d2d] rounded-full"></span>
                  Đơn hàng gần đây
                </h3>
              </div>
              
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ReceiptText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-bold">Bạn chưa có đơn hàng nào</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="border border-gray-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-md transition-shadow">
                      <img src={order.restaurantImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200'} alt={order.restaurantName} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                      <div className="flex-1">
                        <h4 className="font-black text-gray-900 line-clamp-1">{order.restaurantName}</h4>
                        <p className="text-xs text-gray-500 mb-2">{order.date || new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                        <div className="flex flex-wrap gap-1">
                          {order.items?.map((item: any, idx: number) => (
                            <span key={idx} className="text-[10px] bg-gray-50 px-2 py-1 rounded-md text-gray-600 border border-gray-100">{item.quantity}x {item.name}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-black text-[#ee4d2d]">{order.totalPrice?.toLocaleString()}đ</span>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${order.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : order.status === 'DELIVERING' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                          {order.status}
                        </span>
                        <button onClick={() => navigate(`/track/${order.id}`)} className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1">Chi tiết <ChevronRight className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Info */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#ee4d2d] rounded-full"></span>
                Thông tin chung
              </h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Họ và tên</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-11 pr-4 font-bold text-gray-900 focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-11 pr-4 font-bold text-gray-900 focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Địa chỉ giao hàng</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Nhập địa chỉ của bạn" className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-11 pr-4 font-bold text-gray-900 focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all" />
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full mt-4 bg-[#ee4d2d] text-white font-black py-4 rounded-xl shadow-lg shadow-orange-100 hover:bg-[#d73211] transition-all">Lưu thông tin</motion.button>
              </form>
            </section>

            {/* Password Security */}
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#ee4d2d] rounded-full"></span>
                Đổi mật khẩu
              </h3>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Mật khẩu mới</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-11 pr-4 font-bold text-gray-900 focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Xác nhận mật khẩu mới</label>
                  <div className="relative">
                    <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-11 pr-4 font-bold text-gray-900 focus:ring-2 focus:ring-[#ee4d2d]/20 transition-all" />
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full mt-4 bg-gray-900 text-white font-black py-4 rounded-xl shadow-lg shadow-gray-200 hover:bg-black transition-all">Cập nhật mật khẩu</motion.button>
              </form>
            </section>

            {/* Danger Zone */}
             <section className="bg-red-50 p-6 md:p-8 rounded-3xl shadow-sm border border-red-100">
               <h3 className="text-lg font-black text-red-600 mb-6 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                Khu vực nguy hiểm
              </h3>
              <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Xóa tài khoản vĩnh viễn</p>
                  <p className="text-xs text-red-500 font-medium">Hành động này không thể hoàn tác.</p>
                </div>
                <motion.button 
                   whileHover={{ scale: 1.05 }} 
                   whileTap={{ scale: 0.95 }}
                   onClick={handleDeleteAccount}
                   className="px-6 py-2.5 bg-white text-red-600 font-black text-sm rounded-lg border border-red-200 hover:bg-red-600 hover:text-white transition-colors"
                 >
                   Xóa tài khoản
                </motion.button>
              </div>
             </section>

            {/* Logout */}
            <motion.button 
               whileHover={{ scale: 1.01 }} 
               whileTap={{ scale: 0.99 }}
               onClick={handleLogout}
               className="w-full bg-white text-[#ee4d2d] border border-orange-100 font-black py-4 rounded-2xl shadow-sm hover:bg-orange-50 transition-all flex items-center justify-center gap-3 text-lg"
             >
              Đăng xuất
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
