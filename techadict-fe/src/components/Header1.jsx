import React, { useContext, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { TechContext } from "../context/TechContext";
import "remixicon/fonts/remixicon.css";

export default function Header1() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, cart, loadProducts } = useContext(TechContext);

  const [searchText, setSearchText] = useState("");

  // 🔹 Tổng số sản phẩm trong giỏ hàng
  const cartCount = useMemo(() => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Enter → search
  const handleSearchKey = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // ⭐ SEARCH: Khi text rỗng → reset ALL PRODUCTS
  const handleSearch = async () => {
    const query = searchText.trim();

    // Nếu ô search rỗng → reset về /products và load full
    if (!query) {
      await loadProducts();
      navigate("/products");
      return;
    }

    // Load lại sản phẩm trước khi search
    await loadProducts();

    // Điều hướng đến trang sản phẩm với search param
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  // Cart
  const handleCartClick = () => {
    if (!isAuthenticated) navigate("/auth");
    else navigate("/cart");
  };

  // User
  const handleUserClick = () => {
    if (!isAuthenticated) navigate("/auth");
    else navigate("/profile");
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="px-8 py-4 flex items-center justify-between">

        {/* LOGO */}
        <div
          className="text-2xl font-bold text-blue-600 cursor-pointer flex items-center"
          onClick={() => navigate("/home")}
        >
          <i className="ri-store-2-line mr-2"></i>
          TechStore
        </div>

        {/* SEARCH BAR */}
        <div className="flex-1 max-w-2xl mx-8 relative">
          <input
            type="text"
            placeholder="Tìm sản phẩm, thương hiệu, danh mục..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleSearchKey}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base"></i>

          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-700"
          >
            Tìm
          </button>
        </div>

        {/* USER + CART */}
        <div className="flex items-center space-x-6">
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

          <button
            onClick={handleUserClick}
            className="cursor-pointer hover:scale-110 transition-transform"
          >
            <i className="ri-user-3-line text-2xl text-gray-700"></i>
          </button>
        </div>
      </div>

      {/* NAV */}
      <nav className="bg-gray-50 px-8 py-3">
        <div className="flex items-center space-x-8 text-sm font-medium">
          <Link to="/home" className="no-underline text-gray-700 hover:text-blue-600">Trang chủ</Link>
          <Link to="/products" className="no-underline text-gray-700 hover:text-blue-600">Sản phẩm</Link>
          <Link to="/promotions" className="no-underline text-red-600 hover:text-red-700">Khuyến mãi</Link>
          <Link to="/about" className="no-underline text-gray-700 hover:text-blue-600">About</Link>
        </div>
      </nav>
    </header>
  );
}
