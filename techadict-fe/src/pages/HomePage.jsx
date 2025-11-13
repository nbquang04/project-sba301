import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import HeroSlider from "../components/HeroSlider.jsx";
import CategoryGrid from "../components/CategoryGrid.jsx";
import FlashSale from "../components/FlashSale.jsx";
import FeaturedProducts from "../components/FeaturedProducts.jsx";
import Partners from "../components/Partners.jsx";
import Newsletter from "../components/Newsletter.jsx";
import { TechContext } from "../context/TechContext.jsx";

const Home = () => {
  const navigate = useNavigate();

  const {
    categories,
    products,
    catLoading,
    prodLoading,
  } = useContext(TechContext);

  // ✅ Loading toàn trang
  if (catLoading || prodLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-500"></div>
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // ✅ Điều hướng khi chọn category
  const handleCategorySelect = (categoryId) => {
    navigate(categoryId ? `/products?category=${categoryId}` : "/products");
  };

  return (
    <main className="flex flex-col">
      <HeroSlider />

      <section className="py-10 bg-white">
        <CategoryGrid onSelectCategory={handleCategorySelect} />
      </section>

      <FlashSale />

      <FeaturedProducts products={products.slice(0, 8)} />

      <Partners />

      <Newsletter />
    </main>
  );
};

export default Home;
