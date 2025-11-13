import { useState, useEffect } from "react";
import "remixicon/fonts/remixicon.css"; // ✅ icon support

export default function ProductInfo({
  product,
  selectedSize,
  selectedColor,
  quantity,
  onSizeChange,
  onColorChange,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  selectedVariant,
}) {
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [productStats, setProductStats] = useState({
    averageRating: 4.8,
    reviewCount: 128,
    soldCount: 240,
  });

  // 🧠 Giả lập fetch thống kê sản phẩm
  useEffect(() => {
    const timeout = setTimeout(() => {
      setProductStats({
        averageRating: 4.8,
        reviewCount: 128,
        soldCount: 240,
      });
    }, 200);
    return () => clearTimeout(timeout);
  }, [product.id]);

  // 🧩 Handler bọc ngoài để đảm bảo truyền đúng variantId + quantity
  const handleAddToCartClick = () => {
    if (!selectedVariant?.id) return;
    onAddToCart(selectedVariant.id, quantity);
  };

  const handleBuyNowClick = () => {
    if (!selectedVariant?.id) return;
    onBuyNow(selectedVariant.id, quantity);
  };

  // 💫 UI hiển thị chi tiết sản phẩm
  return (
    <div className="space-y-6">
      {/* 🏷️ Tên sản phẩm + đánh giá */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {product.name}
        </h1>

        {/* ⭐ Rating + Đã bán + Tồn kho */}
        <div className="flex items-center flex-wrap gap-3 mb-4 text-sm text-gray-600">
          {/* ⭐ Rating */}
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => {
              const filled =
                star <= Math.floor(productStats.averageRating)
                  ? "ri-star-fill"
                  : star === Math.ceil(productStats.averageRating) &&
                    productStats.averageRating % 1 > 0
                  ? "ri-star-half-fill"
                  : "ri-star-line";
              return (
                <i
                  key={star}
                  className={`${filled} text-yellow-400 text-lg`}
                ></i>
              );
            })}
            <span className="ml-2">
              {productStats.averageRating > 0
                ? `${productStats.averageRating} (${productStats.reviewCount} đánh giá)`
                : "Chưa có đánh giá"}
            </span>
          </div>

          <span>• Đã bán {productStats.soldCount}</span>

          <span>
            {selectedVariant
              ? selectedVariant.quantity > 0
                ? `• Còn lại ${selectedVariant.quantity} sản phẩm`
                : "• Hết hàng"
              : "• Vui lòng chọn phiên bản"}
          </span>
        </div>
      </div>

      {/* 💰 Giá sản phẩm */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-baseline space-x-3 mb-1">
          <span className="text-3xl font-bold text-red-600">
            {(selectedVariant?.price ?? product.price).toLocaleString("vi-VN")}₫
          </span>
          {product.originalPrice &&
            product.originalPrice > (selectedVariant?.price ?? product.price) && (
              <span className="text-lg text-gray-500 line-through">
                {product.originalPrice.toLocaleString("vi-VN")}₫
              </span>
            )}
        </div>
        {product.originalPrice &&
          product.originalPrice > (selectedVariant?.price ?? product.price) && (
            <p className="text-sm text-gray-600">
              Tiết kiệm{" "}
              {(
                product.originalPrice - (selectedVariant?.price ?? product.price)
              ).toLocaleString("vi-VN")}
              ₫
            </p>
          )}

        {selectedVariant?.name && (
          <p className="text-sm text-gray-500 mt-1">
            Phiên bản:{" "}
            <span className="font-medium">{selectedVariant.name}</span>
          </p>
        )}
      </div>

      {/* 🎨 Màu sắc */}
      {product.colors?.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Màu sắc:{" "}
            <span className="font-normal">{selectedColor || "Chưa chọn"}</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className={`border rounded-lg px-3 py-2 text-sm transition-all ${
                  selectedColor === color
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🪻 Kích cỡ / Loại */}
      {product.sizes?.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">
              Loại / Kích cỡ:{" "}
              <span className="font-normal">{selectedSize || "Chưa chọn"}</span>
            </h3>
            <button
              onClick={() => setShowSizeGuide(!showSizeGuide)}
              className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Bảng size
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`py-2 px-3 border rounded-lg text-sm transition-all whitespace-nowrap cursor-pointer ${
                  selectedSize === size
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* 📏 Modal bảng size */}
          {showSizeGuide && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowSizeGuide(false)}
            >
              <div
                className="bg-white rounded-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Bảng kích cỡ</h3>
                  <button onClick={() => setShowSizeGuide(false)}>
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>
                <div className="space-y-2">
                  {product.sizes.map((s) => (
                    <div
                      key={s}
                      className="flex justify-between border-b py-2 text-sm"
                    >
                      <span>Loại {s}</span>
                      <span className="text-gray-600">
                        Phù hợp nhiều dịp khác nhau
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 📦 Số lượng */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Số lượng:</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-50 transition-colors"
            >
              <i className="ri-subtract-line text-lg"></i>
            </button>
            <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => {
                const max = selectedVariant?.quantity || 1;
                onQuantityChange(Math.min(quantity + 1, max));
              }}
              disabled={
                !selectedVariant ||
                selectedVariant?.quantity === 0 ||
                quantity >= (selectedVariant?.quantity || 1)
              }
              className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="ri-add-line text-lg"></i>
            </button>
          </div>

          <span className="text-sm text-gray-600">
            {selectedVariant
              ? selectedVariant.quantity > 0
                ? `Còn lại ${selectedVariant.quantity} sản phẩm`
                : "Hết hàng"
              : "Vui lòng chọn phiên bản"}
          </span>
        </div>
      </div>

      {/* 🛒 Buttons */}
      <div className="space-y-3">
        <div className="flex space-x-3">
          <button
            onClick={handleAddToCartClick}
            disabled={!selectedVariant || selectedVariant?.stock === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-xl font-medium transition-all"
          >
            <i className="ri-shopping-cart-line mr-2"></i>Thêm vào giỏ
          </button>
          <button
            onClick={handleBuyNowClick}
            disabled={!selectedVariant || selectedVariant?.stock === 0}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-xl font-medium transition-all"
          >
            Mua ngay
          </button>
        </div>
      </div>

      {/* 🌸 Đặc điểm nổi bật */}
      {product.features?.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="font-medium text-gray-900 mb-3">Đặc điểm nổi bật:</h4>
          <ul className="space-y-2">
            {product.features.map((feature, i) => (
              <li key={i} className="flex items-center text-sm text-gray-700">
                <i className="ri-check-line text-green-600 mr-2"></i>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
