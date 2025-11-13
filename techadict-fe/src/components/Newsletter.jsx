import React from "react";

export default function Newsletter() {
  return (
    <section className="px-8 py-16">
      <div className="grid grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-bold mb-4">Đăng ký nhận tin</h3>
          <p className="text-gray-600 mb-6">
            Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button className="bg-blue-600 text-white px-6 rounded-r-lg hover:bg-blue-700">
              Đăng ký
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {[
            ["Giao hàng nhanh", "Miễn phí nội thành"],
            ["Bảo hành 12 tháng", "Chính hãng 100%"],
            ["Đổi trả 7 ngày", "Không cần lý do"],
            ["Hỗ trợ 24/7", "Tư vấn tận tình"],
          ].map(([title, desc], i) => (
            <div key={i}>
              <h4 className="font-semibold text-lg">{title}</h4>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
