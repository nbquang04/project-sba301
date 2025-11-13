import React, { useContext, useEffect } from "react";
import { TechContext } from "../context/TechContext.jsx";
import { useNavigate } from "react-router-dom";

export default function FeaturedProducts() {
  const navigate = useNavigate();
  const { products, loadProducts, prodLoading } = useContext(TechContext);

  // ✅ Gọi API khi component mount (nếu chưa có dữ liệu)
  useEffect(() => {
    if (products.length === 0) loadProducts();
  }, []);

  // ✅ Lọc sản phẩm nổi bật
  const featuredProducts = products.filter((p) => p.featured === true).slice(0, 6);

  // ✅ Trạng thái đang tải
  if (prodLoading) {
    return (
      <section className="px-8 py-16 flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
      </section>
    );
  }

  // ✅ Nếu không có sản phẩm nổi bật
  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="px-8 py-16 text-center text-gray-500 bg-gray-50">
        <p>Hiện chưa có sản phẩm nổi bật để hiển thị.</p>
      </section>
    );
  }

  return (
    <section className="px-8 py-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
        🌟 Sản phẩm nổi bật
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {featuredProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/products/${p.id}`)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
          >
            <img
              src={
                p.images?.[0] ||
                "https://via.placeholder.com/280x280?text=No+Image"
              }
              alt={p.name}
              className="w-full h-64 object-cover"
            />

            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-800">
                {p.name}
              </h3>

              {/* ⭐ Hiển thị rating (nếu backend có) */}
              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, j) => (
                  <i
                    key={j}
                    className={`fas fa-star text-sm ${
                      j < (p.rating || 4) ? "text-yellow-400" : "text-gray-300"
                    }`}
                  ></i>
                ))}
                <span className="text-gray-500 text-sm ml-2">
                  ({p.rating || 4}.0)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-blue-600 font-bold text-xl">
                  {p.variants?.[0]?.price
                    ? p.variants[0].price.toLocaleString("vi-VN") + "₫"
                    : p.origin_price
                    ? p.origin_price.toLocaleString("vi-VN") + "₫"
                    : "Đang cập nhật"}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn click vào card
                    alert(`🛒 Đã thêm ${p.name} vào giỏ hàng`);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
