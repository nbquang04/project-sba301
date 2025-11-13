import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

// 🏦 Hàm tạo link QR VietQR
const vietQRUrl = (
  amount,
  accountName = "NGUYEN BA QUANG",
  accountNo = "4222012004",
  bankCode = "MB"
) =>
  `https://img.vietqr.io/image/${bankCode}-${accountNo}-compact2.png?amount=${amount}&accountName=${encodeURIComponent(
    accountName
  )}`;

export default function QRPayment() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🧠 Giả lập dữ liệu order
  const [orderData, setOrderData] = useState({
    orderID: "ORDER-202511111234",
    name: "Nguyễn Bá Quảng",
    phone: "0901234567",
    address: "12 Nguyễn Văn Bảo, Q.Gò Vấp, TP.HCM",
    total: 720000,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // ⏳ Giả lập khi chưa có dữ liệu
  useEffect(() => {
    if (!location.state) {
      console.warn("⚠️ No location.state found — using demo order data");
    }
  }, [location.state]);

  const handleBackToPayment = () => navigate("/payment");

  const handleBankSuccess = () => {
    if (isProcessing) return;
    setIsProcessing(true);

    setTimeout(() => {
      alert(
        `✅ Cảm ơn bạn, ${orderData.name}! Đơn hàng ${orderData.orderID} đã được ghi nhận.`
      );
      navigate("/profile");
    }, 1500);
  };

  // 🕐 Loading giả lập
  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Đang tải thông tin thanh toán...
          </h1>
          <button
            onClick={() => navigate("/payment")}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const total = orderData.total;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 🔙 Back button */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={handleBackToPayment}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            Quay lại thanh toán
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thanh toán đơn hàng
          </h1>
          <p className="text-gray-600">
            Quét mã QR để hoàn tất thanh toán đơn hàng của bạn
          </p>
        </div>

        {/* Nội dung QR */}
        <div className="bg-white shadow-xl rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cột trái: QR */}
          <div className="flex flex-col items-center justify-center">
            <div className="bg-white p-3 rounded-xl shadow-md border-2 border-dashed border-gray-300">
              <img
                src={vietQRUrl(total)}
                alt="VietQR Payment"
                className="w-64 h-64 object-contain"
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Mã đơn hàng:{" "}
                <span className="font-mono font-semibold">
                  {orderData.orderID}
                </span>
              </p>
              <p className="text-lg font-bold text-red-600 mt-1">
                {total.toLocaleString()} VND
              </p>
            </div>
          </div>

          {/* Cột phải: hướng dẫn */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Hướng dẫn thanh toán:
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
              <li>
                Mở ứng dụng{" "}
                <span className="font-medium">Mobile Banking</span> của bạn.
              </li>
              <li>
                Chọn <span className="font-medium">“Quét mã QR”</span> và quét mã
                bên trái.
              </li>
              <li>
                Nhập đúng số tiền:{" "}
                <span className="font-semibold text-red-600">
                  {total.toLocaleString()} VND
                </span>
              </li>
              <li>
                Nội dung chuyển tiền:{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                  Thanh toan don hang {orderData.orderID}
                </span>
              </li>
              <li>Nhấn “Xác nhận” để hoàn tất thanh toán.</li>
            </ol>

            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-800 leading-relaxed">
                ⚠️ Vui lòng chuyển khoản đúng số tiền và nội dung để hệ thống tự
                động xác nhận nhanh chóng.
              </p>
            </div>

            <button
              onClick={handleBankSuccess}
              disabled={isProcessing}
              className={`mt-6 w-full px-6 py-3 rounded-lg font-semibold transition ${
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed text-gray-200"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {isProcessing
                ? "Đang xử lý..."
                : "Tôi đã chuyển khoản thành công"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
