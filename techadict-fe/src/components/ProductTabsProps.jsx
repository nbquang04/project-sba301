import { useState } from "react";
import "remixicon/fonts/remixicon.css"; // ✅ Icon hiển thị

export default function ProductTabs({ product = {}, reviews = [], onWriteReview }) {
  const [activeTab, setActiveTab] = useState("description");

  // ⚙️ Mô tả theo từng loại sản phẩm công nghệ
  const getCategoryDescription = () => {
    const category = (product.category || "").toLowerCase();

    switch (category) {
      case "smartphone":
      case "điện thoại":
        return {
          title: "Điện thoại thông minh 📱",
          description:
            product.description ||
            "Thiết kế tinh tế, hiệu năng mạnh mẽ và camera chất lượng cao — đáp ứng mọi nhu cầu làm việc, giải trí và sáng tạo.",
          additionalInfo: [
            "Trang bị chip xử lý mới nhất cho hiệu suất vượt trội.",
            "Màn hình AMOLED / Super Retina sắc nét và mượt mà.",
            "Hỗ trợ sạc nhanh, pin dung lượng cao và kết nối 5G.",
          ],
          careInstructions: [
            "Tránh để máy rơi, va đập hoặc ngâm nước.",
            "Sử dụng sạc chính hãng để bảo vệ pin.",
            "Thường xuyên cập nhật phần mềm để tăng tính bảo mật.",
          ],
          specifications: {
            material: "Khung kim loại, kính cường lực Gorilla Glass",
            weight: "~180g",
            warranty: "12 tháng chính hãng",
            sizes: "6.1 – 6.8 inch (tùy model)",
          },
        };

      case "laptop":
      case "máy tính xách tay":
        return {
          title: "Laptop / Ultrabook 💻",
          description:
            product.description ||
            "Hiệu năng cao, thiết kế mỏng nhẹ và thời lượng pin ấn tượng — phù hợp cho học tập, làm việc và sáng tạo nội dung.",
          additionalInfo: [
            "Sử dụng CPU Intel Core / AMD Ryzen thế hệ mới.",
            "Trang bị SSD tốc độ cao và RAM DDR5.",
            "Màn hình Full HD / 2K / 4K hỗ trợ dải màu rộng.",
          ],
          careInstructions: [
            "Không để chất lỏng hoặc bụi bẩn bám vào bàn phím.",
            "Thường xuyên vệ sinh quạt tản nhiệt.",
            "Tránh gập màn hình quá góc 130°.",
          ],
          specifications: {
            material: "Vỏ nhôm nguyên khối / nhựa cao cấp",
            weight: "~1.2–2kg",
            warranty: "24 tháng chính hãng",
            sizes: "13 – 16 inch",
          },
        };

      case "headphone":
      case "tai nghe":
        return {
          title: "Tai nghe & Âm thanh 🎧",
          description:
            product.description ||
            "Mang đến trải nghiệm âm thanh sống động, chân thực và thoải mái cho mọi nhu cầu nghe nhạc, học tập hoặc làm việc.",
          additionalInfo: [
            "Chống ồn chủ động (ANC) và kết nối Bluetooth 5.3 ổn định.",
            "Pin lên tới 30 giờ nghe liên tục.",
            "Tương thích iOS, Android, Laptop, PC.",
          ],
          careInstructions: [
            "Tránh để tai nghe ẩm ướt hoặc rơi mạnh.",
            "Sạc định kỳ, không để pin cạn kiệt lâu ngày.",
            "Làm sạch tai nghe bằng khăn mềm khô.",
          ],
          specifications: {
            material: "Nhựa ABS + đệm mút cao cấp",
            weight: "~200g",
            warranty: "12 tháng",
            sizes: "On-ear / In-ear / Over-ear",
          },
        };

      default:
        return {
          title: "Sản phẩm công nghệ chính hãng ⚡",
          description:
            product.description ||
            "Thiết bị công nghệ được phân phối chính hãng, đảm bảo chất lượng và chế độ bảo hành đầy đủ.",
          additionalInfo: [
            "Hàng mới 100% – nhập chính ngạch.",
            "Bảo hành 12–24 tháng tùy dòng sản phẩm.",
            "Hỗ trợ trả góp 0% và giao hàng toàn quốc.",
          ],
          careInstructions: [
            "Bảo quản ở nơi khô ráo, tránh nhiệt độ cao.",
            "Sử dụng phụ kiện đi kèm chính hãng.",
            "Liên hệ trung tâm bảo hành khi cần hỗ trợ kỹ thuật.",
          ],
          specifications: {
            material: "Tùy theo loại sản phẩm (kim loại, nhựa, kính)",
            weight: "Khác nhau tùy model",
            warranty: "12–24 tháng",
            sizes: "Tùy sản phẩm",
          },
        };
    }
  };

  const categoryInfo = getCategoryDescription();

  const tabs = [
    { id: "description", label: "Mô tả sản phẩm", icon: "ri-information-line" },
    { id: "specifications", label: "Thông số kỹ thuật", icon: "ri-settings-3-line" },
    { id: "shipping", label: "Vận chuyển", icon: "ri-truck-line" },
  ];

  // 💫 Giao diện hiển thị
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <i className={`${tab.icon} w-4 h-4 flex items-center justify-center mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab nội dung */}
      <div className="p-6">
        {activeTab === "description" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">{categoryInfo.title}</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {categoryInfo.description}
                </p>
                {categoryInfo.additionalInfo.map((info, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-3">
                    {info}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">🧩 Hướng dẫn sử dụng & bảo quản:</h4>
              <ul className="space-y-2 text-gray-700">
                {categoryInfo.careInstructions.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <i className="ri-arrow-right-s-line text-blue-600 w-5 h-5 mr-2 mt-0.5"></i>
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "specifications" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông số kỹ thuật</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <SpecRow label="Mã sản phẩm" value={product.id || "Đang cập nhật"} />
                <SpecRow label="Danh mục" value={product.category || "Sản phẩm công nghệ"} />
                <SpecRow
                  label="Chất liệu"
                  value={categoryInfo.specifications.material}
                />
              </div>
              <div className="space-y-3">
                <SpecRow
                  label="Bảo hành"
                  value={categoryInfo.specifications.warranty}
                />
                <SpecRow
                  label="Kích thước / Màn hình"
                  value={categoryInfo.specifications.sizes}
                />
                <SpecRow
                  label="Khối lượng"
                  value={categoryInfo.specifications.weight}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "shipping" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Vận chuyển & bảo hành</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <ShippingItem
                  icon="ri-truck-line"
                  title="Giao hàng nhanh"
                  desc="Giao trong 2–4h nội thành, 1–3 ngày toàn quốc"
                  color="blue"
                />
                <ShippingItem
                  icon="ri-shield-check-line"
                  title="Bảo hành chính hãng"
                  desc="Trung tâm ủy quyền – miễn phí kiểm tra & sửa chữa"
                  color="green"
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">Chính sách đổi trả</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Đổi mới trong 7 ngày nếu lỗi nhà sản xuất</li>
                  <li>• Hỗ trợ 1 đổi 1 cho sản phẩm lỗi nặng</li>
                  <li>• Hotline: 1900 6868 (8:00–21:00 mỗi ngày)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* 🔹 Component phụ gọn gàng hơn */
function SpecRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ShippingItem({ icon, title, desc, color }) {
  const colorClass =
    color === "blue" ? "text-blue-600 bg-blue-100" : "text-green-600 bg-green-100";
  return (
    <div className="flex items-start space-x-3">
      <div className={`rounded-full p-2 flex-shrink-0 ${colorClass}`}>
        <i className={`${icon} w-5 h-5 flex items-center justify-center`}></i>
      </div>
      <div>
        <h4 className="font-medium mb-1">{title}</h4>
        <p className="text-gray-600 text-sm">{desc}</p>
      </div>
    </div>
  );
}
