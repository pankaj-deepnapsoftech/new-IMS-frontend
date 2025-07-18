import { BiLockAlt, BiUser } from "react-icons/bi";
import { FaStarOfLife } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { userExists } from "../../redux/reducers/authSlice";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { colors } from "../../theme/colors";

interface LoginComponentProps {
  email: string | undefined;
  password: string | undefined;
  setEmail: (email: string | undefined) => void;
  setPassword: (password: string | undefined) => void;
  setShowLoginComponent: (show: boolean) => void;
  setShowForgetPasswordComponent: (show: boolean) => void;
  setShowOTPVerificationComponent: (show: boolean) => void;
}

const LoginComponent: React.FC<LoginComponentProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  setShowLoginComponent,
  setShowForgetPasswordComponent,
  setShowOTPVerificationComponent,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies();

  const [login] = useLoginMutation();
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoginLoading(true);
      const data = await login({
        email: email,
        password: password,
      }).unwrap();
      // dispatch(userExists(data.user));

      console.log("data.user =", data.user);
      if (data.user.role) {
        dispatch(userExists(data.user));
      } else if (data?.user?.isSuper) {
        dispatch(userExists({ ...data.user, role: "admin" }));
      } else {
        dispatch(userExists({ ...data.user, role: "emp" }));
      }
      setCookie("access_token", data.token, { maxAge: 1000 * 60 * 60 * 24 });
      if (data?.user?.isSuper) {
        setCookie("role", "admin", { maxAge: 1000 * 60 * 60 * 24 });
      } else {
        setCookie("role", data?.user?.role?.role || "emp", {
          maxAge: 1000 * 60 * 60 * 24,
        });
      }
      setCookie("name", data.user.first_name, { maxAge: 1000 * 60 * 60 * 24 });
      setCookie("email", data.user.email, { maxAge: 1000 * 60 * 60 * 24 });
      toast.success(data.message);
      navigate("/");
    } catch (err: any) {
      toast.error(err?.message || err?.data?.message || "Something went wrong");
    } finally {
      setIsLoginLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Login Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={loginHandler} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FaStarOfLife size={6} className="text-red-500" />
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <BiUser size={20} />
              </div>
              <input
                value={email || ""}
                required
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 
                  focus:ring-2 focus:ring-${colors.primary[500]} focus:border-${colors.primary[500]} 
                  transition-all duration-200 hover:border-gray-400`}
                type="email"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FaStarOfLife size={6} className="text-red-500" />
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <BiLockAlt size={20} />
              </div>
              <input
                value={password || ""}
                required
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 
                  focus:ring-2 focus:ring-${colors.primary[500]} focus:border-${colors.primary[500]} 
                  transition-all duration-200 hover:border-gray-400`}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <IoEyeOutline size={20} />
                ) : (
                  <IoEyeOffOutline size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center justify-between text-sm">
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Create account
            </Link>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              onClick={() => {
                setShowForgetPasswordComponent(true);
                setShowLoginComponent(false);
                setShowOTPVerificationComponent(false);
              }}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            disabled={isLoginLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 
              ${
                isLoginLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transform hover:scale-[1.02] active:scale-[0.98]"
              } shadow-lg hover:shadow-xl`}
          >
            {isLoginLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
