import React, { useContext, useEffect, useState } from "react";
import { TechContext } from "../context/TechContext.jsx";
import { useNavigate } from "react-router-dom";

export default function FlashSale() {
  const navigate = useNavigate();
  const { products, loadProducts, prodLoading } = useContext(TechContext);

  // ✅ Countdown giả lập (ví dụ 12:30:45)
  const [time, setTime] = useState({ h: 12, m: 30, s: 45 });

  // Giảm dần thời gian mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((t) => {
        if (t.s > 0) return { ...t, s: t.s - 1 };
        if (t.m > 0) return { h: t.h, m: t.m - 1, s: 59 };
        if (t.h > 0) return { h: t.h - 1, m: 59, s: 59 };
        return { h: 0, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Lấy dữ liệu từ backend khi component mount
  useEffect(() => {
    if (products.length === 0) loadProducts();
  }, []);

  // ✅ Chọn ra 5 sản phẩm flash sale (ví dụ top đầu)
  const flashProducts = products.slice(0, 5);

  // ✅ Loading state
  if (prodLoading) {
    return (
      <section className="px-8 py-16 bg-red-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-red-500"></div>
      </section>
    );
  }

  // ✅ Không có sản phẩm
  if (flashProducts.length === 0) {
    return (
      <section className="px-8 py-16 bg-red-50 text-center text-gray-500">
        <p>Hiện chưa có sản phẩm Flash Sale.</p>
      </section>
    );
  }

  return (
    <section className="px-8 py-16 bg-red-50">
      {/* Header Flash Sale */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <h2 className="text-3xl font-bold text-red-600 mr-6">🔥 Flash Sale</h2>
          <div className="flex items-center space-x-4 text-red-600">
            {["Giờ", "Phút", "Giây"].map((label, i) => (
              <div key={label} className="text-center">
                <div className="bg-red-600 text-white px-3 py-2 rounded font-bold text-lg">
                  {String([time.h, time.m, time.s][i]).padStart(2, "0")}
                </div>
                <div className="text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm Flash Sale */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {flashProducts.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/products/${p.id}`)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="relative">
              <img
                src={
                  p.images?.[0] ||
                  "https://via.placeholder.com/250x250?text=No+Image"
                }
                alt={p.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                -{p.discount || 15}%
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                {p.name}
              </h3>
              <div className="space-y-1">
                {p.origin_price && (
                  <div className="text-gray-400 line-through text-sm">
                    {p.origin_price.toLocaleString("vi-VN")}₫
                  </div>
                )}
                <div className="text-red-600 font-bold text-lg">
                  {p.variants?.[0]?.price
                    ? p.variants[0].price.toLocaleString("vi-VN") + "₫"
                    : p.origin_price
                    ? p.origin_price.toLocaleString("vi-VN") + "₫"
                    : "Đang cập nhật"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
