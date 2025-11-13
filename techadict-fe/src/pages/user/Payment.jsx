import { useState, useEffect, useContext } from "react";
import {
  CreditCard,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { TechContext } from "../../context/TechContext";

export default function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user, addresses, loadAddresses, handleCreateOrder } =
    useContext(TechContext);

  // ✅ Dữ liệu giỏ hàng từ trang Cart
  const selectedItems = state?.selectedItems || [];
  const total = state?.total || 0;

  // 🚨 Nếu vào trực tiếp mà không có dữ liệu giỏ hàng → quay lại
  useEffect(() => {
    if (!selectedItems || selectedItems.length === 0) {
      navigate("/cart");
    }
  }, [selectedItems, navigate]);

  // 🧭 Load địa chỉ người dùng khi đăng nhập
  useEffect(() => {
    if (user?.id) loadAddresses();
  }, [user, loadAddresses]);

  // 🧠 Trạng thái địa chỉ
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [manualAddress, setManualAddress] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    detail: "",
    ward: "",
    district: "",
    city: "",
  });

  // 💳 Phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Lấy địa chỉ đang chọn
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  // 🧩 Cập nhật địa chỉ thủ công
  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualAddress((prev) => ({ ...prev, [name]: value }));
  };

  // 🧾 Tạo đơn hàng
  const handlePlaceOrder = async () => {
    if (!user?.id) {
      alert("⚠️ Vui lòng đăng nhập trước khi đặt hàng!");
      navigate("/auth");
      return;
    }

    // ✅ Chuẩn bị dữ liệu đơn hàng
    const orderData = {
      userId: user.id,
      items: selectedItems.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    // ✅ Nếu chọn địa chỉ có sẵn
    if (useSavedAddress && selectedAddress) {
      orderData.addressId = selectedAddress.id;
    }
    // ✅ Nếu nhập địa chỉ mới thủ công
    else if (!useSavedAddress) {
      const { fullName, phone, detail, ward, district, city } = manualAddress;

      if (!fullName || !phone || !detail) {
        alert("⚠️ Vui lòng nhập đầy đủ thông tin giao hàng!");
        return;
      }

      orderData.shippingInfo = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        detail: detail.trim(),
        ward: ward.trim() || "",
        district: district.trim() || "",
        city: city.trim() || "",
      };
    } else {
      alert("⚠️ Vui lòng chọn hoặc nhập địa chỉ giao hàng!");
      return;
    }

    try {
      // 🧠 Gọi API tạo đơn hàng qua context
      const createdOrder = await handleCreateOrder(orderData);

      if (paymentMethod === "bank") {
        navigate("/payment/qr", {
          state: {
            orderId: createdOrder?.id,
            total: createdOrder?.totalAmount || total,
            orderItems: selectedItems,
            paymentMethod: "BANK",
          },
        });
      } else {
        alert("✅ Đặt hàng thành công (Thanh toán COD)");
        navigate("/profile");
      }
    } catch (err) {
      console.error("❌ Lỗi khi tạo đơn hàng:", err);
      alert("Không thể đặt hàng. Vui lòng thử lại!");
    }
  };


  // ✅ UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" /> Quay lại giỏ hàng
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ================= LEFT: FORM ================= */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 space-y-6">
            {/* 🔹 Địa chỉ giao hàng */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-red-500" /> Địa chỉ giao hàng
              </h2>

              <div className="flex items-center gap-4 mb-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={useSavedAddress}
                    onChange={() => setUseSavedAddress(true)}
                  />
                  <span>Dùng địa chỉ đã lưu</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={!useSavedAddress}
                    onChange={() => setUseSavedAddress(false)}
                  />
                  <span>Nhập địa chỉ mới</span>
                </label>
              </div>

              {/* ===== Địa chỉ có sẵn ===== */}
              {useSavedAddress ? (
                addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`block border p-4 rounded-lg cursor-pointer ${selectedAddressId === addr.id
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <input
                          type="radio"
                          name="savedAddress"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mr-2"
                        />
                        <span className="font-semibold text-gray-800">
                          {addr.fullName} • {addr.phone}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">
                          {addr.detail}, {addr.ward}, {addr.district},{" "}
                          {addr.city}
                        </p>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Bạn chưa có địa chỉ nào được lưu.
                  </p>
                )
              ) : (
                // ===== Form nhập địa chỉ mới =====
                <div className="space-y-3 mt-2">
                  <div>
                    <label className="text-sm text-gray-600">Họ tên</label>
                    <input
                      type="text"
                      name="fullName"
                      value={manualAddress.fullName}
                      onChange={handleManualChange}
                      placeholder="Nguyễn Văn A"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Số điện thoại</label>
                    <input
                      type="text"
                      name="phone"
                      value={manualAddress.phone}
                      onChange={handleManualChange}
                      placeholder="090xxxxxxx"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Chi tiết địa chỉ</label>
                    <input
                      type="text"
                      name="detail"
                      value={manualAddress.detail}
                      onChange={handleManualChange}
                      placeholder="Số nhà, tên đường"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      name="ward"
                      value={manualAddress.ward}
                      onChange={handleManualChange}
                      placeholder="Phường"
                      className="border rounded-lg px-3 py-2"
                    />
                    <input
                      type="text"
                      name="district"
                      value={manualAddress.district}
                      onChange={handleManualChange}
                      placeholder="Quận"
                      className="border rounded-lg px-3 py-2"
                    />
                    <input
                      type="text"
                      name="city"
                      value={manualAddress.city}
                      onChange={handleManualChange}
                      placeholder="Thành phố"
                      className="border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 💳 Phương thức thanh toán */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-red-500" /> Phương thức thanh toán
              </h2>

              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <span className="ml-3">💰 Thanh toán khi nhận hàng (COD)</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={() => setPaymentMethod("bank")}
                  />
                  <span className="ml-3">🏧 Chuyển khoản VietQR</span>
                </label>
              </div>
            </div>

            {/* 🔘 Nút hoàn tất */}
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-900 mt-6"
            >
              Hoàn tất đơn hàng
            </button>
          </div>

          {/* ================= RIGHT: SUMMARY ================= */}
          <div className="bg-white rounded-xl shadow-md p-6 h-fit">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <ShieldCheck className="w-5 h-5 text-red-500 mr-2" /> Tóm tắt đơn hàng
            </h3>

            <div className="space-y-3">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span>{item.name || item.productName} × {item.quantity}</span>
                  <span>
                    {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              ))}

              <div className="flex justify-between text-sm border-t pt-3 mt-3">
                <span>Phí vận chuyển</span>
                <span>30,000 ₫</span>
              </div>

              <div className="flex justify-between items-center border-t pt-3 mt-3">
                <span className="font-semibold text-lg">Tổng cộng</span>
                <span className="font-bold text-xl text-red-600">
                  {total.toLocaleString("vi-VN")} ₫
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
