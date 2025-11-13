import React, { useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import {
  Clock,
  Truck,
  CheckSquare,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import { TechContext } from "../../context/TechContext";

export default function OrderHistory() {
  const {
    user,
    orders,
    loadOrders,
    orderLoading,
    loadAddressDetail, 
  } = useContext(TechContext);

  const [ordersWithAddress, setOrdersWithAddress] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ===============================
  // 🧾 Lấy danh sách đơn + địa chỉ
  // ===============================
  useEffect(() => {
    const fetchOrdersWithAddresses = async () => {
      if (!user?.id) return;
      try {
        await loadOrders(); // load danh sách đơn từ backend
      } catch (err) {
        console.error("❌ Lỗi khi load orders:", err);
      }
    };
    fetchOrdersWithAddresses();
  }, [user, loadOrders]);

  // Sau khi orders thay đổi → lấy địa chỉ chi tiết cho từng đơn
  useEffect(() => {
    const enrichOrders = async () => {
      const enriched = await Promise.all(
        (orders || []).map(async (o) => {
          if (!o.addressId) return o;
          try {
            const address = await loadAddressDetail(o.addressId);
            return { ...o, address };
          } catch {
            return o;
          }
        })
      );

      // 🔹 Sắp xếp đơn hàng mới nhất lên đầu
      const sorted = enriched.sort((a, b) => {
        // Ưu tiên dùng createdAt nếu có
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        // Fallback: lấy timestamp trong ID
        const aTime = a.id?.split("-")[1] || "";
        const bTime = b.id?.split("-")[1] || "";
        return bTime.localeCompare(aTime);
      });

      setOrdersWithAddress(sorted);
    };
    if (orders?.length > 0) enrichOrders();
  }, [orders, loadAddressDetail]);

  // ===============================
  // 🧩 Helper functions
  // ===============================
  const formatCurrency = (v) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Number(v) || 0);

  const normalize = (s) => (s || "").toLowerCase();

  const getStatusInfo = (status) => {
    switch (normalize(status)) {
      case "pending":
        return {
          text: "Chờ xác nhận",
          color: "bg-yellow-100 text-yellow-800 border-yellow-400",
          icon: <Clock className="w-4 h-4 text-yellow-600" />,
        };
      case "delivering":
        return {
          text: "Đang giao hàng",
          color: "bg-sky-100 text-sky-800 border-sky-400",
          icon: <Truck className="w-4 h-4 text-sky-600" />,
        };
      case "done":
      case "completed":
        return {
          text: "Hoàn tất",
          color: "bg-green-100 text-green-800 border-green-400",
          icon: <CheckSquare className="w-4 h-4 text-green-600" />,
        };
      case "canceled":
        return {
          text: "Đã hủy",
          color: "bg-red-100 text-red-800 border-red-400",
          icon: <XCircle className="w-4 h-4 text-red-600" />,
        };
      default:
        return {
          text: "Không xác định",
          color: "bg-gray-100 text-gray-800 border-gray-400",
          icon: <Clock className="w-4 h-4 text-gray-600" />,
        };
    }
  };

  // ===============================
  // ⚙️ UI logic
  // ===============================
  if (orderLoading) {
    return (
      <div className="flex justify-center items-center h-60 text-gray-600">
        <ShieldCheck className="w-5 h-5 mr-2 animate-spin" />
        Đang tải danh sách đơn hàng...
      </div>
    );
  }

  if (!ordersWithAddress || ordersWithAddress.length === 0)
    return (
      <div className="text-center text-gray-500 py-10">
        <i className="ri-shopping-bag-line text-4xl text-gray-400"></i>
        <p>Bạn chưa có đơn hàng nào.</p>
      </div>
    );

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Lịch sử đơn hàng
      </h2>

      {ordersWithAddress.map((order) => {
        const st = getStatusInfo(order.status);
        const total = order.totalAmount || 0;
        const a = order.address;

        const addressText = a
          ? `${a.detail || ""}, ${a.ward || ""}, ${a.district || ""}, ${
              a.city || ""
            }`
          : "Không có thông tin địa chỉ";

        return (
          <div
            key={order.id}
            onClick={() => {
              setSelectedOrder(order);
              setIsModalOpen(true);
            }}
            className="border border-gray-200 bg-white rounded-lg p-5 mb-4 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {st.icon}
                  <span
                    className={`px-2 py-1 text-xs rounded-full border font-medium ${st.color}`}
                  >
                    {st.text}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Mã đơn: {order.id}
                </h3>
                <p className="text-sm text-gray-500">
                  Giao đến: {addressText}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  Thanh toán:{" "}
                  {order.payment?.method === "BANK"
                    ? "Chuyển khoản VietQR"
                    : "COD (khi nhận hàng)"}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg text-red-600">
                  {formatCurrency(total)}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* ================= MODAL CHI TIẾT ================= */}
      {isModalOpen &&
        selectedOrder &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden">
              <div className="bg-red-600 text-white p-4 flex justify-between items-center">
                <h3 className="font-semibold text-lg">
                  Chi tiết đơn hàng #{selectedOrder.id}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white text-xl hover:text-gray-200"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
                {/* Trạng thái */}
                <div className="flex items-center gap-2">
                  {getStatusInfo(selectedOrder.status).icon}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusInfo(selectedOrder.status).color}`}
                  >
                    {getStatusInfo(selectedOrder.status).text}
                  </span>
                </div>

                {/* Địa chỉ */}
                <p>
                  <b>Địa chỉ giao hàng:</b>{" "}
                  {selectedOrder.address
                    ? `${selectedOrder.address.detail || ""}, ${
                        selectedOrder.address.ward || ""
                      }, ${selectedOrder.address.district || ""}, ${
                        selectedOrder.address.city || ""
                      }`
                    : "Không có thông tin địa chỉ"}
                </p>

                {/* Thanh toán */}
                <p>
                  <b>Phương thức thanh toán:</b>{" "}
                  {selectedOrder.payment?.method === "BANK"
                    ? "Chuyển khoản VietQR"
                    : "COD (khi nhận hàng)"}
                </p>

                {/* Tổng tiền */}
                <p>
                  <b>Tổng tiền:</b> {formatCurrency(selectedOrder.totalAmount)}
                </p>

                {/* Sản phẩm */}
                <h4 className="font-semibold mt-4 mb-2">Sản phẩm:</h4>
                <ul className="space-y-2">
                  {selectedOrder.items?.map((it, idx) => (
                    <li
                      key={idx}
                      className="border-b pb-2 text-sm flex justify-between"
                    >
                      <span>
                        • {it.variantName || it.variantId} × {it.quantity}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(it.subtotal || it.price * it.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
