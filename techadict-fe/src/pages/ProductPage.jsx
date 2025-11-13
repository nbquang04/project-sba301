import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { TechContext } from "../context/TechContext.jsx";

const ProductPage = () => {
  const {
    products,
    categories,
    loadProducts,
    loadCategories,
    addToCart,
  } = useContext(TechContext);

  const [searchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange] = useState([0, 100000000]);
  const [sortBy, setSortBy] = useState("newest");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Read search params
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const searchFromUrl = searchParams.get("search");

    setSelectedCategory(categoryFromUrl || "");
    setSearchQuery(searchFromUrl?.toLowerCase() || "");
  }, [searchParams]);

  // Filter logic
  useEffect(() => {
    if (!products) return;

    setLoading(true);
    let filtered = [...products];

    // ⭐ FILTER CATEGORY — FIX CHUẨN
    if (selectedCategory) {
      const matchedCategory = categories.find(
        (c) => String(c.id) === String(selectedCategory)
      );

      if (matchedCategory) {
        const catName = matchedCategory.name.toLowerCase();
        filtered = filtered.filter(
          (p) => p.categoryName?.toLowerCase() === catName
        );
      }
    }

    // 🔎 FILTER SEARCH (name + brandName + categoryName)
    if (searchQuery) {
      filtered = filtered.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brandName?.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q)
        );
      });
    }

    // PRICE + SORT (giữ nguyên)
    filtered.sort((a, b) => {
      const aPrice = Math.min(...(a.variants?.map((v) => v.price) || [0]));
      const bPrice = Math.min(...(b.variants?.map((v) => v.price) || [0]));
      if (sortBy === "price-low") return aPrice - bPrice;
      if (sortBy === "price-high") return bPrice - aPrice;
      return 0;
    });

    setFilteredProducts(filtered);
    setLoading(false);
  }, [products, selectedCategory, searchQuery, sortBy]);

  const formatPrice = (price) =>
    price ? price.toLocaleString("vi-VN") + "₫" : "—";

  const getMainImage = (p) =>
    p.images?.[0] || p.variants?.[0]?.imageUrl || "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">

        {/* ===================== */}
        {/* ⭐ SIDEBAR FILTER ALWAYS VISIBLE ⭐ */}
        {/* ===================== */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h3>

            {/* Category */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Danh mục</h4>
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
                  <span>Tất cả</span>
                </label>

                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={String(cat.id)}
                      checked={String(selectedCategory) === String(cat.id)}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h4 className="font-medium mb-3">Sắp xếp</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-low">Giá tăng dần</option>
                <option value="price-high">Giá giảm dần</option>
              </select>
            </div>
          </div>
        </div>

        {/* ===================== */}
        {/* ⭐ PRODUCT COLLECTION ⭐ */}
        {/* ===================== */}
        <div className="flex-1">

          <h2 className="text-2xl font-bold mb-5">
            {searchQuery
              ? `Kết quả cho "${searchQuery}"`
              : selectedCategory
                ? `Danh mục: ${categories.find((c) => c.id == selectedCategory)?.name}`
                : "Tất cả sản phẩm"}
          </h2>

          {loading ? (
            <div className="text-center py-20 text-gray-500">
              Đang tải sản phẩm...
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div key={p.id} className="bg-white rounded-lg shadow">
                  <Link to={`/products/${p.id}`}>
                    <img src={getMainImage(p)} className="w-full h-64 object-cover" />
                  </Link>
                  <div className="p-4">
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-red-600 font-bold">
                      {formatPrice(Math.min(...(p.variants?.map(v => v.price) || [0])))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              Không tìm thấy sản phẩm.
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductPage;
