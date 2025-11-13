import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { TechContext } from "../context/TechContext.jsx";

const ProductPage = () => {
  const { products, categories, addToCart } = useContext(TechContext);

  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [sortBy, setSortBy] = useState("newest");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // === 🧭 Load params from URL ===
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const searchFromUrl = searchParams.get("search");
    if (categoryFromUrl) setSelectedCategory(categoryFromUrl);
    if (searchFromUrl) setSearchQuery(searchFromUrl);
  }, [searchParams]);

  // === 🧩 Filter logic (client-side) ===
  useEffect(() => {
    if (!products || products.length === 0) {
      setFilteredProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let filtered = [...products];

    // ✅ Filter by category (supports categoryId, category.id, or categoryName)
    if (selectedCategory) {
      const matchedCategory = categories.find(
        (c) => String(c.id) === String(selectedCategory)
      );
      const matchedName = matchedCategory?.name?.toLowerCase();

      filtered = filtered.filter(
        (p) =>
          String(p.categoryId) === String(selectedCategory) ||
          String(p.category?.id) === String(selectedCategory) ||
          (matchedName &&
            p.categoryName?.toLowerCase() === matchedName)
      );
    }

    // ✅ Filter by search text
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // ✅ Filter by color
    if (selectedColors.length > 0) {
      filtered = filtered.filter((p) =>
        p.variants?.some((v) =>
          selectedColors.some((c) =>
            v.color?.toLowerCase().includes(c.toLowerCase())
          )
        )
      );
    }

    // ✅ Filter by price range
    filtered = filtered.filter((p) => {
      const prices = p.variants?.map((v) => v.price) || [];
      const minPrice = Math.min(...prices, p.origin_price || 0);
      return minPrice >= priceRange[0] && minPrice <= priceRange[1];
    });

    // ✅ Sort by criteria
    filtered.sort((a, b) => {
      const aPrice = Math.min(...(a.variants?.map((v) => v.price) || [0]));
      const bPrice = Math.min(...(b.variants?.map((v) => v.price) || [0]));
      if (sortBy === "price-low") return aPrice - bPrice;
      if (sortBy === "price-high") return bPrice - aPrice;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredProducts(filtered);
    setLoading(false);
  }, [products, selectedCategory, selectedColors, priceRange, sortBy, searchQuery, categories]);

  // === 🎨 Helper functions ===
  const handleColorToggle = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  const formatPrice = (price) =>
    price ? price.toLocaleString("vi-VN") + "₫" : "—";

  const getMainImage = (p) =>
    p.images?.[0] ||
    p.variants?.[0]?.imageUrl ||
    "https://via.placeholder.com/400x400?text=No+Image";

  const handleAddToCart = (product) => {
    const variant = product.variants?.[0];
    if (!variant) return;
    addToCart(
      {
        id: `${product.id}-${variant.id}`,
        name: product.name,
        price: variant.price,
        color: variant.color,
        image: variant.imageUrl,
      },
      1
    );
  };

  // === ⏳ Loading UI ===
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-gray-600 font-medium">Đang tải sản phẩm...</p>
      </div>
    );
  }

  // === 🛍️ UI ===
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h3>

            {/* 🗂 Danh mục */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-800 mb-3">Danh mục</h4>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={!selectedCategory}
                    onChange={() => setSelectedCategory("")}
                    className="mr-2"
                  />
                  <span className="text-gray-700 text-sm">Tất cả</span>
                </label>
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={String(cat.id)}
                      checked={String(selectedCategory) === String(cat.id)}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-gray-700 text-sm">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 🎨 Màu sắc */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-800 mb-3">Màu sắc</h4>
              <div className="grid grid-cols-5 gap-2">
                {["Đen", "Trắng", "Nâu", "Đỏ", "Xanh navy"].map((color) => (
                  <div
                    key={color}
                    onClick={() => handleColorToggle(color)}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                      selectedColors.includes(color)
                        ? "border-red-500 ring-2 ring-red-200"
                        : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor:
                        color === "Đen"
                          ? "#000"
                          : color === "Trắng"
                          ? "#fff"
                          : color === "Nâu"
                          ? "#8B4513"
                          : color === "Đỏ"
                          ? "#FF0000"
                          : "#000080",
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* ⚙️ Sắp xếp */}
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-3">Sắp xếp</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-low">Giá tăng dần</option>
                <option value="price-high">Giá giảm dần</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-5">
            {selectedCategory
              ? `Danh mục: ${
                  categories.find((c) => String(c.id) === String(selectedCategory))
                    ?.name || "Không rõ"
                }`
              : "Tất cả sản phẩm"}
          </h2>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <Link to={`/products/${p.id}`}>
                    <img
                      src={getMainImage(p)}
                      alt={p.name}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                  </Link>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {p.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-bold">
                        {formatPrice(
                          Math.min(...(p.variants?.map((v) => v.price) || [0]))
                        )}
                      </span>
                      <button
                        onClick={() => handleAddToCart(p)}
                        className="text-gray-400 hover:text-red-600 transition"
                      >
                        <i className="ri-shopping-cart-line text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              Không tìm thấy sản phẩm.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
