import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { TechContext } from "../context/TechContext";
import Auth from "../pages/Auth/Auth";

const AuthRoute = () => {
  const { isAuthenticated, authChecked, user } = useContext(TechContext);

  // ⏳ 1️⃣ Đợi kiểm tra token hoàn tất (tránh flicker)
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Đang kiểm tra phiên đăng nhập...
      </div>
    );
  }

  // 🧩 2️⃣ Nếu user chưa load xong (đề phòng null)
  if (isAuthenticated && !user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Đang tải thông tin người dùng...
      </div>
    );
  }

  // ✅ 3️⃣ Nếu đã đăng nhập → redirect về đúng dashboard theo role
  if (isAuthenticated && user) {
    const isAdmin = user?.roles?.some((r) => r.name === "ADMIN" || r === "ADMIN");
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  // 🧾 4️⃣ Nếu chưa đăng nhập → hiển thị trang login/register
  return <Auth />;
};

export default AuthRoute;
