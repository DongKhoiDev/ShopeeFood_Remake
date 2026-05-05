import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, Phone, ArrowRight, CheckCircle2, MessageSquareCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Đăng ký Google thất bại.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      // Determine if action needed
      if (email.includes('admin') || email.includes('ADMIN')) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      if (err.message.includes('Vui lòng xác thực')) {
         toast.success(err.message, { icon: '📧', duration: 5000 });
         navigate('/verify-email?email=' + encodeURIComponent(email));
      } else {
         toast.error(err.message || 'Đăng ký thất bại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <Toaster />
      {/* Left Side: Branding (reversed color for Register) */}
      <div className="hidden md:flex md:w-1/2 bg-gray-50 items-center justify-center p-12 text-[#ee4d2d] relative overflow-hidden">
        <div className="relative z-10 text-center max-w-sm">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-[#ee4d2d] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
          >
             <span className="text-white text-4xl font-black italic">SF</span>
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black mb-6 text-gray-900 tracking-tight"
          >
            Tham gia cộng đồng <span className="text-[#ee4d2d]">ShopeeFood</span>
          </motion.h1>
          
          <div className="space-y-4 text-left">
             {[
               "Ưu đãi thành viên mới cực sốc",
               "Miễn phí giao hàng mỗi khung giờ vàng",
               "Quản lý đơn hàng và đánh giá dễ dàng",
               "Ưu đãi đặc quyền từ ShopeePay"
             ].map((text, i) => (
               <motion.div 
                 key={i}
                 initial={{ x: -20, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 transition={{ delay: 0.4 + i * 0.1 }}
                 className="flex items-center gap-3 text-gray-600 font-medium"
               >
                 <CheckCircle2 className="w-5 h-5 text-[#ee4d2d]" />
                 <span>{text}</span>
               </motion.div>
             ))}
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[#ee4d2d]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 font-sans">
        <div className="w-full max-w-md">
          <header className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Đăng ký tài khoản</h2>
            <p className="text-gray-400 font-medium">Bạn đã có tài khoản? <Link to="/login" className="text-[#ee4d2d] font-bold hover:underline">Đăng nhập</Link></p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Họ tên</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee4d2d] transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Họ tên"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/10 focus:bg-white transition-all text-sm font-medium"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee4d2d] transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input 
                    type="tel" 
                    placeholder="090..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/10 focus:bg-white transition-all text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee4d2d] transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/10 focus:bg-white transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mật khẩu</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee4d2d] transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nên có ít nhất 8 ký tự"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/10 focus:bg-white transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-start gap-2 px-1 mb-6">
                 <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 accent-[#ee4d2d] rounded" />
                 <label htmlFor="terms" className="text-xs text-gray-500 font-medium leading-relaxed">
                   Tôi đồng ý với <span className="text-[#ee4d2d] font-bold underline">Điều khoản dịch vụ</span> và <span className="text-[#ee4d2d] font-bold underline">Chính sách bảo mật</span> của ShopeeFood.
                 </label>
              </div>

              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full bg-[#ee4d2d] text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-100 hover:bg-[#d73211] transition-all flex items-center justify-center gap-3 text-lg z-10 relative disabled:opacity-50"
              >
                Tạo tài khoản
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </form>

          <div className="mt-10">
            <div className="relative mb-8 text-center pt-2">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
               <span className="relative bg-white px-4 text-xs font-black text-gray-300 uppercase tracking-widest">Hoặc đăng ký bằng</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <button 
                 type="button"
                 onClick={handleGoogleLogin}
                 disabled={loading}
                 className="flex items-center justify-center gap-3 border border-gray-100 rounded-2xl py-3 hover:bg-gray-50 transition-colors font-bold text-gray-700 text-sm disabled:opacity-50"
               >
                  <img referrerPolicy="no-referrer" src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                  Google
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
