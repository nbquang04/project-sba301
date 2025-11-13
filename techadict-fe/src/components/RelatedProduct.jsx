import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css"; // ✅ để hiển thị icon nếu có dùng

export default function RelatedProducts({ products = [] }) {
  const [productRatings, setProductRatings] = useState({});

  const formatPrice = (price) => price.toLocaleString("vi-VN") + "đ";

  const getLowestPrice = (variants) =>
    variants?.length ? Math.min(...variants.map((v) => v.price)) : 0;
  const getHighestPrice = (variants) =>
    variants?.length ? Math.max(...variants.map((v) => v.price)) : 0;
  const getMainImage = (product) =>
    product.images?.[0] ||
    product.variants?.[0]?.images?.[0] ||
    "https://via.placeholder.com/300x300?text=No+Image";

  // 🧠 Giả lập rating (không gọi API)
  useEffect(() => {
    const fakeRatings = {};
    products.forEach((p) => {
      fakeRatings[p.id] = {
        averageRating: (Math.random() * 2 + 3).toFixed(1), // 3.0–5.0
        reviewCount: Math.floor(Math.random() * 80 + 20), // 20–100 reviews
      };
    });
    setProductRatings(fakeRatings);
  }, [products]);

  if (!products.length) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Sản phẩm liên quan</h2>
        <Link
          to="/products"
          className="text-red-600 hover:text-red-700 font-medium flex items-center"
        >
          Xem tất cả
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>

      {/* 🔹 Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const lowest = getLowestPrice(product.variants);
          const highest = getHighestPrice(product.variants);
          const hasDiscount = highest > lowest;
          const discountPercent = hasDiscount
            ? Math.round(((highest - lowest) / highest) * 100)
            : 0;

          const rating = productRatings[product.id] || {
            averageRating: 0,
            reviewCount: 0,
          };

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <Link to={`/products/${product.id}`}>
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={getMainImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* 🔻 Discount */}
                  {hasDiscount && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                        -{discountPercent}%
                      </span>
                    </div>
                  )}

                  {/* ❤️ Favorite + 🛒 Add to Cart */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors">
                      <i className="ri-heart-line text-gray-600 hover:text-red-500 transition-colors w-4 h-4"></i>
                    </button>
                  </div>
                  <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </Link>

              {/* 📝 Info */}
              <div className="p-4">
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* ⭐ Rating */}
                <div className="flex items-center space-x-1 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-3 h-3 ${
                          star <= Math.floor(rating.averageRating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        } fill-current`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {rating.averageRating > 0
                      ? `${rating.averageRating} (${rating.reviewCount})`
                      : "Chưa có đánh giá"}
                  </span>
                </div>

                {/* 💰 Giá */}
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-red-600">
                    {formatPrice(lowest)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(highest)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
