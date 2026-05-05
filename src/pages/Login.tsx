import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, MessageSquareCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Đăng nhập Google thất bại.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
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
         toast.error(err.message || 'Đăng nhập thất bại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      <Toaster />
      {/* Left Side: Branding/Visual */}
      <div className="hidden md:flex md:w-1/2 bg-[#ee4d2d] items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="relative z-10 text-center max-w-sm">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
          >
             <span className="text-[#ee4d2d] text-4xl font-black italic">SF</span>
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black mb-4 tracking-tight"
          >
            Chào mừng trở lại!
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-orange-100 font-medium leading-relaxed"
          >
            Đăng nhập để tận hưởng hàng ngàn món ngon từ các cửa hàng yêu thích với ưu đãi mỗi ngày.
          </motion.p>
          <div className="mt-8 p-4 bg-white/10 rounded-2xl border border-white/20 text-xs font-medium space-y-2">
             <p>Thử nghiệm Admin: <span className="font-black text-white px-2 py-0.5 bg-black/20 rounded ml-1">admin@sfood.com</span></p>
             <p>Mật khẩu: <span className="font-black text-white px-2 py-0.5 bg-black/20 rounded ml-1">123456</span></p>
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-10 md:hidden">
             <Link to="/" className="text-[#ee4d2d] text-2xl font-black italic">ShopeeFood</Link>
          </div>

          <header className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Đăng nhập</h2>
            <p className="text-gray-400 font-medium">Bạn chưa có tài khoản? <Link to="/register" className="text-[#ee4d2d] font-bold hover:underline">Đăng ký ngay</Link></p>
            <div className="mt-4 md:hidden p-3 bg-red-50 rounded-xl border border-red-100 text-xs font-medium text-gray-700">
               <p className="mb-1"><strong>Tài khoản Admin:</strong> admin@sfood.com</p>
               <p><strong>Mật khẩu:</strong> 123456</p>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email của bạn</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee4d2d] transition-colors">
                   <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/10 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Mật khẩu</label>
                <button type="button" className="text-xs font-bold text-gray-400 hover:text-[#ee4d2d]">Quên mật khẩu?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ee4d2d] transition-colors">
                   <Lock className="w-5 h-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#ee4d2d]/10 focus:bg-white transition-all font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
               <input type="checkbox" id="remember" className="w-4 h-4 accent-[#ee4d2d] rounded" />
               <label htmlFor="remember" className="text-sm text-gray-500 font-medium cursor-pointer">Duy trì đăng nhập</label>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#ee4d2d] text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-100 hover:bg-[#d73211] transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50"
            >
              Đăng nhập
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>

          <div className="mt-10">
            <div className="relative mb-8 text-center pt-2">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
               <span className="relative bg-white px-4 text-xs font-black text-gray-300 uppercase tracking-widest">Hoặc đăng nhập bằng</span>
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
