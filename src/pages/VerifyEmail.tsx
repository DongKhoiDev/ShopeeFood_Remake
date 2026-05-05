import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { checkEmailVerification } = useAuth();

  const handleCheck = async () => {
    setLoading(true);
    try {
      const isVerified = await checkEmailVerification();
      if (isVerified) {
        toast.success("Xác thực email thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        toast.error("Email chưa được xác thực. Vui lòng kiểm tra lại hòm thư.");
      }
    } catch (e: any) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Toaster />
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#ee4d2d]">
          <Mail className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Xác thực Email
        </h2>
        <p className="text-gray-500 font-medium mb-8">
          Chúng tôi đã gửi một đường link xác thực đến email <br />
          <span className="font-bold text-gray-900">{email}</span>
          <br />
          Vui lòng kiểm tra hộp thư đến (và thư rác) của bạn.
        </p>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheck}
            disabled={loading}
            className="w-full bg-[#ee4d2d] text-white font-black py-4 rounded-2xl shadow-lg hover:bg-[#d73211] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Tôi đã bấm vào link xác nhận
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          <button
            onClick={() => navigate("/login")}
            className="w-full py-4 text-gray-400 font-bold flex items-center justify-center gap-2 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
