import React from "react";

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Về TECHADICT
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              TechAdict – Nơi hội tụ những sản phẩm công nghệ chính hãng, chất
              lượng cao từ các thương hiệu hàng đầu thế giới. Chúng tôi mang đến
              trải nghiệm mua sắm công nghệ hiện đại, tiện lợi và đáng tin cậy.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Company Story */}
        <div className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Hành Trình Của TechAdict
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  TechAdict được thành lập với sứ mệnh mang công nghệ hiện đại
                  đến gần hơn với người Việt Nam. Chúng tôi cung cấp các sản phẩm
                  chính hãng từ Apple, Samsung, Asus, Dell, Logitech, Anker và
                  nhiều thương hiệu nổi tiếng khác.
                </p>
                <p>
                  Không chỉ là nơi mua sắm thiết bị điện tử, TechAdict còn là
                  không gian công nghệ, nơi khách hàng có thể trải nghiệm, tìm
                  hiểu và khám phá những xu hướng mới nhất trong thế giới số.
                </p>
                <p>
                  Với triết lý “Công nghệ vì con người”, chúng tôi cam kết đem
                  đến dịch vụ tận tâm, sản phẩm chất lượng và trải nghiệm mua
                  sắm đáng tin cậy nhất.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <div className="text-6xl font-bold text-blue-600 mb-4">2022</div>
                <p className="text-lg text-gray-700 font-medium">
                  Năm thành lập
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Thành phố Hồ Chí Minh, Việt Nam
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Sứ Mệnh & Giá Trị Cốt Lõi
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-cpu-line text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Chất Lượng
              </h3>
              <p className="text-gray-600">
                Mọi sản phẩm đều được nhập khẩu chính hãng, kiểm định nghiêm
                ngặt để đảm bảo hiệu năng, độ bền và sự an tâm cho khách hàng.
              </p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-lightbulb-flash-line text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Đổi Mới</h3>
              <p className="text-gray-600">
                Không ngừng cập nhật xu hướng và công nghệ mới, mang đến các sản
                phẩm tiên tiến, thông minh, đáp ứng nhu cầu đa dạng của người
                dùng.
              </p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-customer-service-2-line text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Tận Tâm
              </h3>
              <p className="text-gray-600">
                Luôn lắng nghe và phục vụ khách hàng bằng tất cả sự nhiệt huyết,
                đảm bảo mọi trải nghiệm mua sắm đều dễ dàng và hài lòng.
              </p>
            </div>
          </div>
        </div>

        {/* Product Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Danh Mục Sản Phẩm
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="ri-smartphone-line text-xl text-blue-600"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Điện Thoại</h3>
              <p className="text-sm text-gray-600">
                Các dòng smartphone cao cấp từ Apple, Samsung, Xiaomi và nhiều
                thương hiệu khác.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="ri-macbook-line text-xl text-blue-600"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Laptop</h3>
              <p className="text-sm text-gray-600">
                Laptop học tập, làm việc, gaming từ Dell, Asus, Apple, Lenovo,
                MSI...
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="ri-tablet-line text-xl text-blue-600"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Tablet</h3>
              <p className="text-sm text-gray-600">
                Máy tính bảng đa dạng kích thước, phục vụ nhu cầu học tập và
                sáng tạo.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="ri-headphone-line text-xl text-blue-600"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Phụ Kiện</h3>
              <p className="text-sm text-gray-600">
                Tai nghe, chuột, bàn phím, sạc dự phòng và nhiều phụ kiện công
                nghệ khác.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Vì Sao Chọn TechAdict?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Sản Phẩm Chính Hãng
                  </h3>
                  <p className="text-gray-600">
                    Toàn bộ sản phẩm đều có nguồn gốc rõ ràng, được phân phối
                    trực tiếp từ nhà sản xuất.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Bảo Hành Toàn Quốc
                  </h3>
                  <p className="text-gray-600">
                    Chính sách bảo hành chính hãng lên đến 12–24 tháng, hỗ trợ
                    đổi mới nhanh chóng.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Giao Hàng Nhanh Chóng
                  </h3>
                  <p className="text-gray-600">
                    Hỗ trợ giao hàng toàn quốc với dịch vụ vận chuyển uy tín và
                    đảm bảo an toàn tuyệt đối.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Chính Sách Đổi Trả Linh Hoạt
                  </h3>
                  <p className="text-gray-600">
                    Hỗ trợ đổi trả trong vòng 15–30 ngày nếu sản phẩm gặp lỗi
                    hoặc không đúng mô tả.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Hỗ Trợ 24/7</h3>
                  <p className="text-gray-600">
                    Đội ngũ tư vấn luôn sẵn sàng hỗ trợ qua hotline, email và
                    chat trực tuyến.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <i className="ri-check-line text-white text-sm"></i>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Giá Cả Cạnh Tranh
                  </h3>
                  <p className="text-gray-600">
                    Cập nhật giá tốt nhất thị trường với nhiều ưu đãi và chương
                    trình giảm giá hấp dẫn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Thông Tin Liên Hệ
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-map-pin-line text-xl text-white"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Địa Chỉ</h3>
              <p className="text-gray-600">
                456 Nguyễn Văn Bảo, Gò Vấp<br />
                TP. Hồ Chí Minh, Việt Nam
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-phone-line text-xl text-white"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Điện Thoại</h3>
              <p className="text-gray-600">
                Hotline: 1900-8888<br />
                Zalo hỗ trợ: 0901-123-456
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-mail-line text-xl text-white"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">
                support@techadict.vn<br />
                sale@techadict.vn
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
