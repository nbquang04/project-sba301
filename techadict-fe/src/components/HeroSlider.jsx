import React, { useEffect, useState } from "react";

export default function HeroSlider() {
  const slides = [
    {
      title: "iPhone 15 Pro Max",
      subtitle: "Siêu sale công nghệ",
      discount: "Giảm đến 30%",
      image:
        "https://halostore.vn/store/wp-content/uploads/2023/09/iphone-15-pro-max-finish-select-202309-6-7inch-naturaltitanium.jpeg",
    },
    {
      title: "MacBook Air M3",
      subtitle: "Hiệu năng vượt trội",
      discount: "Ưu đãi đặc biệt",
      image:
        "https://bizweb.dktcdn.net/100/533/247/files/banner-ngang-danh-mu-c-macbook-air-b0bbf3c3-1f4e-4932-83d1-c396bd028af4.png?v=1753248229497",
    },
    {
      title: "Samsung Galaxy Tab S9",
      subtitle: "Tablet cao cấp",
      discount: "Khuyến mãi hot",
      image:
        "https://didongviet.vn/dchannel/wp-content/uploads/2023/08/tren-tay-samsung-galaxy-tab-s9-1-didongviet-1.jpg",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-96 overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div key={i} className="w-full h-full flex-shrink-0 relative">
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${s.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
              <div className="absolute inset-0 flex items-center px-8 text-white max-w-lg">
                <div>
                  <h2 className="text-4xl font-bold mb-4">{s.title}</h2>
                  <p className="text-xl mb-2">{s.subtitle}</p>
                  <p className="text-2xl font-bold text-yellow-400 mb-6">{s.discount}</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded font-semibold">
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === i ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
