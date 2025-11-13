import React, { useContext } from "react";
import { TechContext } from "../context/TechContext.jsx";
import { useEffect } from "react";
export default function CategoryGrid({ onSelectCategory }) {
  const { categories, catLoading ,loadCategories } = useContext(TechContext);
  useEffect(() => {
      loadCategories();
    }, [loadCategories]);
  if (catLoading) {
    return (
      <section className="py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="py-16 text-center text-gray-500">
        <p>Chưa có danh mục nào để hiển thị.</p>
      </section>
    );
  }
  return (
    <section className="px-8 py-16 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-10">
        Danh mục sản phẩm
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((c) => (
          <div
            key={c.id}
            className="group cursor-pointer"
            onClick={() => onSelectCategory?.(c.id)}
          >
            <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
              <img
                src={
                  c.image ||
                  c.imageUrl ||
                  "https://via.placeholder.com/300x300?text=No+Image"
                }
                alt={c.name}
                className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <i className="fas fa-layer-group text-4xl mb-4"></i>
                <h3 className="text-xl font-semibold text-center">{c.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
