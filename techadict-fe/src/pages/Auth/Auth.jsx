import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TechContext } from "../../context/TechContext";
import { useNotification } from "../../context/NotificationContext"; // ✅ Thêm dòng này
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const PW_MIN_MSG = "Mật khẩu tối thiểu 5 ký tự";

// ====================== 🔐 Yup Schemas ======================
const loginSchema = yup.object({
  email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
  password: yup.string().min(5, PW_MIN_MSG).required("Vui lòng nhập mật khẩu"),
});

const registerSchema = yup.object({
  fullName: yup.string().trim().min(3, "Tối thiểu 3 ký tự").required("Vui lòng nhập họ và tên"),
  email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
  password: yup.string().min(5, PW_MIN_MSG).required("Vui lòng nhập mật khẩu"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
  phone: yup.string().optional(),
});

export default function Auth() {
  const { handleLogin, handleRegister, isAuthenticated, authChecked } = useContext(TechContext);
  const { showSuccess, showError } = useNotification(); // ✅ Lấy các hàm thông báo
  const navigate = useNavigate();

  const [tab, setTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Redirect nếu đã đăng nhập
  useEffect(() => {
    if (authChecked && isAuthenticated) navigate("/", { replace: true });
  }, [authChecked, isAuthenticated, navigate]);

  // ✅ Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(tab === "login" ? loginSchema : registerSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    reset();
  }, [tab, reset]);

  // ====================== SUBMIT FORM ======================
  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      if (tab === "login") {
        await handleLogin(data.email, data.password);
        showSuccess("Đăng nhập thành công!"); // ✅ Thông báo toast
        setTimeout(() => navigate("/"), 1000);
      } else {
        const res = await handleRegister(data);
        if (res) {
          showSuccess("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục."); // ✅ Thông báo toast
          setTimeout(() => {
            setTab("login");
            reset({ email: data.email, password: "" });
          }, 1000);
        }
      }
    } catch (err) {
      console.error("❌ Auth error:", err);
      showError(
        tab === "login"
          ? "Sai email hoặc mật khẩu!"
          : "Không thể đăng ký. Email có thể đã tồn tại."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================== UI ==========================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
          {tab === "login" ? "Đăng nhập" : "Đăng ký tài khoản"}
        </h2>

        {/* Tab chuyển login/register */}
        <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              tab === "login" ? "bg-red-600 text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${
              tab === "register" ? "bg-red-600 text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* ===================== FORM ===================== */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {tab === "register" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                <input
                  type="text"
                  {...register("fullName")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập họ và tên"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại (tùy chọn)
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
              placeholder="Nhập email của bạn"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <i
                  className={`${
                    showPassword ? "ri-eye-off-line" : "ri-eye-line"
                  } text-gray-400 text-lg`}
                ></i>
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Xác nhận mật khẩu */}
          {tab === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <i
                    className={`${
                      showConfirmPassword ? "ri-eye-off-line" : "ri-eye-line"
                    } text-gray-400 text-lg`}
                  ></i>
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
          >
            {loading || isSubmitting
              ? tab === "login"
                ? "Đang đăng nhập..."
                : "Đang đăng ký..."
              : tab === "login"
              ? "Đăng nhập"
              : "Đăng ký tài khoản"}
          </button>
        </form>

        {/* Link quay lại */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-red-600">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
