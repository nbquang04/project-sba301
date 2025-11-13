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

  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // ✅ Load product detail
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getProductDetail(id);
        if (!data) throw new Error("Không tìm thấy sản phẩm");

        setProduct(data);
        setSelectedSize(data.variants?.[0]?.storage || "Default");
        setSelectedColor(data.variants?.[0]?.color || "Default");

        // Sản phẩm liên quan cùng category
        const related = products.filter(
          (p) =>
            p.id !== id &&
            (p.categoryId === data.categoryId ||
              p.category?.id === data.category?.id)
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

  // === Helper: lấy variant được chọn ===
  const getSelectedVariant = () => {
    if (!product?.variants) return null;
    return (
      product.variants.find(
        (v) =>
          v.storage?.toString() === selectedSize && v.color === selectedColor
      ) || product.variants[0]
    );
  };

  const selectedVariant = getSelectedVariant();
  const currentPrice = selectedVariant?.price || product?.origin_price || 0;
  const images = [
    ...(product?.images || []),
    ...(product?.variants?.flatMap((v) =>
      v.imageUrl ? [v.imageUrl] : []
    ) || []),
  ];

  // === 🛒 Thêm vào giỏ hàng ===
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
      await loadCart(); // 🔁 reload giỏ sau khi thêm
    } catch (err) {
      console.error("❌ Lỗi khi thêm vào giỏ:", err);
      showError("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!");
    }
  };

  // === 💳 Mua ngay ===
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

  // === Loading & Error UI ===
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-red-500"></div>
        <p className="ml-4 text-gray-600 font-medium">
          Đang tải chi tiết sản phẩm...
        </p>
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

  // === Render ===
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* === Chi tiết sản phẩm === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <ProductGallery images={images} name={product.name} />
          <ProductInfo
            product={{
              ...product,
              price: currentPrice,
              discount: 0,
              rating: 4.8,
              reviewCount: reviews.length,
              sold: 200,
              sizes: [
                ...new Set(product.variants?.map((v) => v.storage || v.size)),
              ],
              colors: [...new Set(product.variants?.map((v) => v.color))],
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

        {/* === Tabs & Reviews === */}
        <ProductTabs product={product} reviews={reviews} />
        <ProductReviews product={product} reviews={reviews} />

        {/* === Sản phẩm liên quan === */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </div>
  );
}
