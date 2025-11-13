import React, { useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TechContext } from "../context/TechContext";
import "remixicon/fonts/remixicon.css"; // ✅ icon set

export default function Header1() {
  const navigate = useNavigate();
  const { user, isAuthenticated, cart } = useContext(TechContext);

  // 🔹 Tính tổng số sản phẩm trong giỏ hàng
  const cartCount = useMemo(() => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // 🛒 Khi ấn giỏ hàng
  const handleCartClick = () => {
    if (!isAuthenticated) navigate("/auth");
    else navigate("/cart");
  };

  // 👤 Khi ấn icon người dùng
  const handleUserClick = () => {
    if (!isAuthenticated) navigate("/auth");
    else navigate("/profile");
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="px-8 py-4 flex items-center justify-between">
        {/* 🏪 Logo */}
        <div
          className="text-2xl font-bold text-blue-600 cursor-pointer flex items-center"
          onClick={() => navigate("/home")}
        >
          <i className="ri-store-2-line mr-2"></i>
          TechStore
        </div>

        {/* 🔍 Ô tìm kiếm */}
        <div className="flex-1 max-w-2xl mx-8 relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base"></i>
        </div>

        {/* 👤🛒 Icon user và cart */}
        <div className="flex items-center space-x-6">
          {/* 🛒 Giỏ hàng */}
          <button
            className="relative cursor-pointer hover:scale-110 transition-transform"
            onClick={handleCartClick}
          >
            <i className="ri-shopping-cart-line text-2xl text-gray-700"></i>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* 👤 User */}
          <button
            onClick={handleUserClick}
            className="cursor-pointer hover:scale-110 transition-transform"
          >
            <i className="ri-user-3-line text-2xl text-gray-700"></i>
          </button>
        </div>
      </div>

      {/* 🧭 Menu điều hướng */}
      <nav className="bg-gray-50 px-8 py-3">
        <div className="flex items-center space-x-8 text-sm font-medium">
          <Link
            to="/home"
            className="no-underline text-gray-700 hover:text-blue-600 transition-colors"
          >
            Trang chủ
          </Link>
          <Link
            to="/products"
            className="no-underline text-gray-700 hover:text-blue-600 transition-colors"
          >
            Sản phẩm
          </Link>
          <Link
            to="/promotions"
            className="no-underline text-red-600 hover:text-red-700 transition-colors"
          >
            Khuyến mãi
          </Link>
          <Link
            to="/about"
            className="no-underline text-gray-700 hover:text-blue-600 transition-colors"
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
