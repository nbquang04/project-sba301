import { useState, useContext, useEffect } from "react";
import Header from "../../components/Header1";
import UserInfo from "./UserInfo";
import EditProfile from "./EditProfile";
import OrderHistory from "./OrderHistory";
import { TechContext } from "../../context/TechContext";
import "remixicon/fonts/remixicon.css";
import { Navigate } from "react-router-dom";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");
  const { isAuthenticated, authChecked, user } = useContext(TechContext);

  // 🔹 Xử lý fullName + roles từ user context
  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "Khách vãng lai";

  const [formData, setFormData] = useState({
    id: user?.id || "USER-202511111100",
    fullName,
    email: user?.email || "Chưa đăng nhập",
    role: user?.roles?.join(", ") || "GUEST",
    status: isAuthenticated ? "Active" : "Chưa đăng nhập",
  });

  // 🔁 Cập nhật khi user thay đổi (sau login hoặc update)
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.email,
        role: user.roles?.join(", ") || "USER",
        status: "Active",
      });
    }
  }, [user]);

  // ⏳ Chờ kiểm tra login xong
  if (!authChecked) {
    return (
      <div className="p-6 text-center text-gray-600">
        Đang kiểm tra phiên đăng nhập...
      </div>
    );
  }

  // 🔒 (Tùy chọn) Redirect nếu chưa login
  // if (!isAuthenticated) return <Navigate to="/auth" replace />;

  // 🔹 Tabs hiển thị tùy theo trạng thái đăng nhập
  const tabs = [
    {
      key: "info",
      label: "Thông tin cá nhân",
      icon: <i className="ri-user-line text-lg"></i>,
    },
    ...(isAuthenticated
      ? [
          {
            key: "edit",
            label: "Chỉnh sửa hồ sơ",
            icon: <i className="ri-edit-line text-lg"></i>,
          },
          {
            key: "orders",
            label: "Lịch sử đơn hàng",
            icon: <i className="ri-shopping-bag-line text-lg"></i>,
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* 🔹 Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-6 sm:space-x-10 px-6 sm:px-8 pt-6 sm:pt-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-3 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.key
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 🔹 Content */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400 to-yellow-400 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 p-8 sm:p-12 bg-white rounded-2xl">
              {activeTab === "info" && <UserInfo user={formData} />}
              {activeTab === "edit" && isAuthenticated && (
                <EditProfile formData={formData} setFormData={setFormData} />
              )}
              {activeTab === "orders" && isAuthenticated && <OrderHistory />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
