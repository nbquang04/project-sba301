import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TechContext } from "../../context/TechContext";
import { useNotification } from "../../context/NotificationContext.jsx";
import "remixicon/fonts/remixicon.css";

export default function UserInfo() {
  const navigate = useNavigate();
  const { user, isAuthenticated, handleLogout } = useContext(TechContext);
  const { showSuccess, showError } = useNotification();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // 🧠 Khi mount: kiểm tra user đăng nhập
  useEffect(() => {
    if (user && isAuthenticated) {
      setUserData(user);
    } else {
      setUserData(null);
    }
    setLoading(false);
  }, [user, isAuthenticated]);

  // 🔹 Hiển thị giá trị có fallback
  const getValue = (value) => (!value || value === "" ? "Chưa có thông tin" : value);

  // 🔹 Đăng xuất (dùng context)
  const onLogout = async () => {
    try {
      await handleLogout(); // ✅ gọi từ context
    } catch (err) {
      console.error("❌ Logout error:", err);
      showError("Lỗi khi đăng xuất. Vui lòng thử lại!");
    }
  };

  // 🕓 Loading
  if (loading) {
    return (
      <div className="max-w-3xl animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ❌ Nếu chưa đăng nhập
  if (!isAuthenticated || !userData) {
    return (
      <div className="w-full flex flex-col items-center justify-center text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <i className="ri-user-line text-5xl text-gray-400"></i>
        </div>

        <p className="text-gray-700 text-lg font-medium mb-4">
          Bạn chưa đăng nhập
        </p>

        <button
          onClick={() => navigate("/auth")}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold shadow transition-transform transform hover:scale-105"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  // ✅ Nếu đã đăng nhập
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Thông tin tài khoản</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center text-center md:w-1/3">
          <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-3">
            <i className="ri-user-3-line text-4xl text-blue-600"></i>
          </div>
          <p className="text-sm text-gray-500">{userData.id}</p>
        </div>

        {/* Thông tin chi tiết */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField label="Họ" value={getValue(userData.firstName)} />
          <InfoField label="Tên" value={getValue(userData.lastName)} />
          <InfoField label="Email" value={getValue(userData.email)} />
          <InfoField label="Số điện thoại" value={getValue(userData.phone)} />
          <InfoField
            label="Vai trò"
            value={
              Array.isArray(userData.roles)
                ? userData.roles.join(", ")
                : getValue(userData.roles)
            }
          />
        </div>
      </div>

      {/* Nút đăng xuất */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={onLogout}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <i className="ri-logout-box-r-line text-lg"></i>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

// 🔹 Component con hiển thị từng trường
function InfoField({ label, value }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow transition-all">
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <p className="text-gray-900 font-semibold">{value}</p>
    </div>
  );
}
