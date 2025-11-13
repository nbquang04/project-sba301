import React, { useContext, useState } from "react";
import {
  LayoutDashboardIcon,
  UsersIcon,
  PackageIcon,
  LockIcon,
  BarChart3Icon,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { TechContext } from "../context/TechContext";

const SideBarAdmin = () => {
  const { handleLogout, user } = useContext(TechContext); // ✅ gọi đúng tên từ context
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const adminName =
    user?.firstName || user?.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : "Admin";

  // ✅ Logout có confirm
  const onLogoutConfirm = async () => {
    try {
      await handleLogout(); // ✅ gọi hàm handleLogout() trong context
      navigate("/auth"); // 🔁 quay lại trang đăng nhập
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg rounded-lg p-6 space-y-6 h-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-gray-800">
            Welcome, {adminName}!
          </h2>
          <p className="text-sm text-gray-500">Admin Panel</p>
        </div>

        <nav className="flex flex-col gap-3 text-gray-700">
          <Link
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            to="/admin/dashboard"
          >
            <LayoutDashboardIcon className="w-5 h-5" /> Dashboard
          </Link>

          <Link
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            to="/admin/users"
          >
            <UsersIcon className="w-5 h-5" /> Users
          </Link>

          <Link
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            to="/admin/products"
          >
            <PackageIcon className="w-5 h-5" /> Products
          </Link>

          <Link
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            to="/admin/categories"
          >
            <PackageIcon className="w-5 h-5" /> Categories
          </Link>

          <Link
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            to="/admin/brands"
          >
            <PackageIcon className="w-5 h-5" /> Brands
          </Link>

          <Link
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            to="/admin/orders"
          >
            <LockIcon className="w-5 h-5" /> Orders
          </Link>

          {/* ✅ Logout button */}
          <button
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 w-full text-left"
            onClick={() => setShowConfirm(true)}
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </nav>
      </aside>

      {/* ✅ Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={onLogoutConfirm}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBarAdmin;
