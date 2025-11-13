import { useState, useEffect } from "react";
import "remixicon/fonts/remixicon.css";

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

  // fake stats fetch
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

  // handlers
  const handleAddToCartClick = () => {
    if (!selectedVariant?.id) return;
    onAddToCart(selectedVariant.id, quantity);
  };

  const handleBuyNowClick = () => {
    if (!selectedVariant?.id) return;
    onBuyNow(selectedVariant.id, quantity);
  };

  return (
    <div className="space-y-6">

      {/* PRODUCT NAME */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>

        {/* BRAND NAME */}
        {product.brandName && (
          <p className="text-sm text-gray-700 mb-3 flex items-center gap-1">
            <i className="ri-price-tag-3-line text-blue-600"></i>
            <span>Thương hiệu:</span>
            <span className="font-semibold text-blue-600">{product.brandName}</span>
          </p>
        )}

        {/* RATING */}
        <div className="flex items-center flex-wrap gap-3 mb-4 text-sm text-gray-600">
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
                <i key={star} className={`${filled} text-yellow-400 text-lg`} />
              );
            })}
            <span className="ml-2">
              {productStats.averageRating} ({productStats.reviewCount} đánh giá)
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

      {/* PRICE */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-baseline space-x-3 mb-1">
          <span className="text-3xl font-bold text-red-600">
            {(selectedVariant?.price ?? product.price).toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>

      {/* COLORS */}
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
                className={`border rounded-lg px-3 py-2 text-sm ${
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

      {/* SIZES */}
      {product.sizes?.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">
              Loại / Kích cỡ:{" "}
              <span className="font-normal">{selectedSize || "Chưa chọn"}</span>
            </h3>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`py-2 px-3 border rounded-lg text-sm ${
                  selectedSize === size
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* QUANTITY */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Số lượng:</h3>

        <div className="flex items-center space-x-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-50"
            >
              <i className="ri-subtract-line text-lg" />
            </button>

            <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
              {quantity}
            </span>

            <button
              onClick={() => {
                const max = selectedVariant?.quantity || 1;
                onQuantityChange(Math.min(quantity + 1, max));
              }}
              disabled={quantity >= (selectedVariant?.quantity || 1)}
              className="p-2 hover:bg-gray-50 disabled:opacity-50"
            >
              <i className="ri-add-line text-lg" />
            </button>
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex space-x-3">
        <button
          onClick={handleAddToCartClick}
          disabled={!selectedVariant}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
        >
          <i className="ri-shopping-cart-line mr-2" /> Thêm vào giỏ
        </button>

        <button
          onClick={handleBuyNowClick}
          disabled={!selectedVariant}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
        >
          Mua ngay
        </button>
      </div>

    </div>
  );
}
  