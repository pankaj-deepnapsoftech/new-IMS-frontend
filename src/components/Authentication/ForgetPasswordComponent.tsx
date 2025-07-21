import { BiLockAlt, BiUser } from "react-icons/bi";
import { FaStarOfLife } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  useForgetPasswordMutation,
  useResetPasswordMutation,
} from "../../redux/api/api";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { TbPasswordMobilePhone } from "react-icons/tb";
import { MdEmail } from "react-icons/md";
import { colors } from "../../theme/colors";

interface ForgetPasswordComponentProps {
  email: string | undefined;
  setEmail: (email: string | undefined) => void;
  password: string | undefined;
  setPassword: (email: string | undefined) => void;
}

const ForgetPasswordComponent: React.FC<ForgetPasswordComponentProps> = ({
  email,
  setEmail,
}) => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState<string | undefined>();
  const [otp, setOtp] = useState<string | undefined>();
  const [gotOtp, setGotOtp] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  const [isForgetPasswordLoading, setIsForgetPasswordLoading] =
    useState<boolean>(false);
  const [isResetPasswordLoading, setIsResetPasswordLoading] =
    useState<boolean>(false);

  const [forgetPassword] = useForgetPasswordMutation();
  const [resetPassword] = useResetPasswordMutation();

  const forgetPasswordHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsForgetPasswordLoading(true);
      const data = await forgetPassword({
        email: email,
      }).unwrap();
      setGotOtp(true);
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setIsForgetPasswordLoading(false);
    }
  };

  const resetPasswordHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsResetPasswordLoading(true);
      const data = await resetPassword({
        email: email,
        otp: otp,
        password: newPassword,
      }).unwrap();
      toast.success(data.message);
      navigate(0);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
    } finally {
      setIsResetPasswordLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Reset Password Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={() => navigate(0)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"
            >
              <IoMdArrowBack size={24} className="text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
          </div>
          <p className="text-gray-600">
            {!gotOtp
              ? "Enter your email to receive a reset code"
              : "Enter the code sent to your email and new password"}
          </p>
        </div>

        {/* Email Form (Step 1) */}
        {!gotOtp && (
          <form onSubmit={forgetPasswordHandler} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaStarOfLife size={6} className="text-red-500" />
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <MdEmail size={20} />
                </div>
                <input
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                  type="email"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <button
              disabled={isForgetPasswordLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 
                ${
                  isForgetPasswordLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transform hover:scale-[1.02] active:scale-[0.98]"
                } shadow-lg hover:shadow-xl`}
            >
              {isForgetPasswordLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sending code...
                </div>
              ) : (
                "Send Reset Code"
              )}
            </button>
          </form>
        )}

        {/* OTP & Password Form (Step 2) */}
        {gotOtp && (
          <form onSubmit={resetPasswordHandler} className="space-y-6">
            {/* OTP Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaStarOfLife size={6} className="text-red-500" />
                Verification Code
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <TbPasswordMobilePhone size={20} />
                </div>
                <input
                  value={otp || ""}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaStarOfLife size={6} className="text-red-500" />
                New Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <BiLockAlt size={20} />
                </div>
                <input
                  value={newPassword || ""}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNewPassword ? (
                    <IoEyeOutline size={20} />
                  ) : (
                    <IoEyeOffOutline size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              disabled={isResetPasswordLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 
                ${
                  isResetPasswordLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transform hover:scale-[1.02] active:scale-[0.98]"
                } shadow-lg hover:shadow-xl`}
            >
              {isResetPasswordLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Updating password...
                </div>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgetPasswordComponent;
