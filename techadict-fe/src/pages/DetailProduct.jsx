import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TechContext } from "../context/TechContext.jsx";
import { useNotification } from "../context/NotificationContext.jsx";
import ProductGallery from "../components/ProductGallery";
import ProductInfo from "../components/ProductInfo";
import ProductTabs from "../components/ProductTabsProps";
import RelatedProducts from "../components/RelatedProduct";
import ProductReviews from "../components/ProductReviews";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    getProductDetail,
    products,
    handleAddToCart,
    loadCart,
    user,
  } = useContext(TechContext);

  const { showError, showWarning, showInfo } = useNotification();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // ================================
  // 🔥 Load product detail
  // ================================
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getProductDetail(id);
        if (!data) throw new Error("Không tìm thấy sản phẩm");

        setProduct(data);

        // Chọn biến thể đầu tiên mặc định
        setSelectedSize(data.variants?.[0]?.storage || data.variants?.[0]?.size || "");
        setSelectedColor(data.variants?.[0]?.color || "");

        // Sản phẩm liên quan
        const related = products.filter(
          (p) =>
            p.id !== id &&
            (p.categoryName === data.categoryName)
        );
        setRelatedProducts(related.slice(0, 4));

        // Demo reviews
        setReviews([
          {
            id: 1,
            user: "Nguyễn Văn A",
            rating: 5,
            comment: "Sản phẩm chất lượng, giao hàng nhanh!",
            date: "2025-11-01",
          },
        ]);
      } catch (err) {
        console.error("❌ Lỗi khi lấy chi tiết sản phẩm:", err);
        showError("Không thể tải thông tin sản phẩm. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id, getProductDetail, products, showError]);

  // ================================
  // 🧩 Lấy variant đang chọn
  // ================================
  const selectedVariant =
    product?.variants?.find(
      (v) =>
        (v.storage?.toString() === selectedSize ||
          v.size === selectedSize) &&
        v.color === selectedColor
    ) || product?.variants?.[0];

  const currentPrice = selectedVariant?.price || product?.origin_price || 0;

  const images = [
    ...(product?.images || []),
    ...(product?.variants?.flatMap((v) => (v.imageUrl ? [v.imageUrl] : [])) ||
      []),
  ];

  // ================================
  // 🛒 Add to cart
  // ================================
  const handleAdd = async () => {
    if (!user) {
      showWarning("⚠️ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/auth");
      return;
    }

    if (!selectedVariant?.id) {
      showError("Không xác định được phiên bản sản phẩm.");
      return;
    }

    try {
      await handleAddToCart(selectedVariant.id, quantity);
      await loadCart();
    } catch (err) {
      console.error("❌ Add cart error:", err);
      showError("Không thể thêm vào giỏ hàng!");
    }
  };

  // ================================
  // 💳 Buy now
  // ================================
  const handleBuyNow = async () => {
    if (!user) {
      showWarning("⚠️ Bạn cần đăng nhập để mua hàng!");
      navigate("/auth");
      return;
    }

    await handleAdd();
    showInfo("🛍️ Đang chuyển đến giỏ hàng...");
    setTimeout(() => navigate("/cart"), 600);
  };

  // ================================
  // LOADING SCREEN
  // ================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-16 w-16 border-b-4 border-red-600 rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Không tìm thấy sản phẩm.</p>
      </div>
    );
  }

  // ================================
  // RENDER UI
  // ================================
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <ProductGallery images={images} name={product.name} />

          <ProductInfo
            product={{
              ...product,
              brandName: product.brandName,      // ⬅️ SỬA QUAN TRỌNG
              price: currentPrice,
              sizes: [...new Set(product.variants.map((v) => v.storage || v.size))],
              colors: [...new Set(product.variants.map((v) => v.color))],
            }}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            quantity={quantity}
            onSizeChange={setSelectedSize}
            onColorChange={setSelectedColor}
            onQuantityChange={setQuantity}
            onAddToCart={handleAdd}
            onBuyNow={handleBuyNow}
            selectedVariant={selectedVariant}
          />
        </div>

        <ProductTabs product={product} reviews={reviews} />
        <ProductReviews product={product} reviews={reviews} />

        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </div>
  );
}
