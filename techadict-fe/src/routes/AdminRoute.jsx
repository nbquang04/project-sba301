import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { TechContext } from "../context/TechContext";

const AdminRoute = () => {
  const { isAuthenticated, user, authChecked } = useContext(TechContext);
  const location = useLocation();

  // ⏳ Chờ xác thực token xong (tránh hiển thị sớm)
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Đang xác thực quyền truy cập...
      </div>
    );
  }

  // ❌ Nếu chưa đăng nhập → chuyển về trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // ⏳ Nếu user chưa load xong → chờ
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Đang tải thông tin người dùng...
      </div>
    );
  }

  // ⚠️ Nếu không có quyền ADMIN → 403
  const isAdmin = user?.roles?.some((r) => r.name === "ADMIN" || r === "ADMIN");
  if (!isAdmin) {
    return <Navigate to="/403" replace />;
  }

  // ✅ Nếu là admin → render route con
  return <Outlet />;
};

export default AdminRoute;
