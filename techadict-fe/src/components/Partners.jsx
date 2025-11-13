import React from "react";

const brands = ["Apple", "Samsung", "Xiaomi", "ASUS", "HP"];

export default function Partners() {
  return (
    <section className="px-8 py-16 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-8">Thương hiệu đối tác</h2>
      <div className="flex items-center justify-center space-x-12 text-gray-600 text-2xl">
        {brands.map((b, i) => (
          <div key={i} className="flex items-center">
            <i
              className={`${
                b === "Apple"
                  ? "fab fa-apple"
                  : b === "Samsung"
                  ? "fab fa-android"
                  : b === "ASUS"
                  ? "fas fa-laptop"
                  : b === "HP"
                  ? "fas fa-desktop"
                  : "fas fa-mobile-alt"
              } mr-2`}
            ></i>
            <span className="font-semibold">{b}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
