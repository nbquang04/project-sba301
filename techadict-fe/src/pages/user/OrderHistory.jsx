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
    cancelOrder,
  } = useContext(TechContext);

  const [ordersWithAddress, setOrdersWithAddress] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ===============================
  // 🧾 LOAD ORDERS
  // ===============================
  useEffect(() => {
    if (user?.id) loadOrders();
  }, [user, loadOrders]);

  // ===============================
  // 🏠 GẮN ĐỊA CHỈ
  // ===============================
  useEffect(() => {
    const enrich = async () => {
      const enriched = await Promise.all(
        (orders || []).map(async (o) => {
          if (!o.addressId) return o;
          try {
            const addr = await loadAddressDetail(o.addressId);
            return { ...o, address: addr };
          } catch {
            return o;
          }
        })
      );

      enriched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrdersWithAddress(enriched);
    };

    if (orders?.length > 0) enrich();
  }, [orders, loadAddressDetail]);

  // ===============================
  // STATUS RENDER
  // ===============================
  const getStatusInfo = (status) => {
    switch (String(status).toLowerCase()) {
      case "pending":
        return {
          text: "Chờ xác nhận",
          badge: "bg-yellow-100 text-yellow-800 border-yellow-400",
          icon: <Clock className="w-4 h-4 text-yellow-600" />,
        };
      case "delivering":
        return {
          text: "Đang giao hàng",
          badge: "bg-sky-100 text-sky-800 border-sky-400",
          icon: <Truck className="w-4 h-4 text-sky-600" />,
        };
      case "done":
        return {
          text: "Hoàn tất",
          badge: "bg-green-100 text-green-800 border-green-400",
          icon: <CheckSquare className="w-4 h-4 text-green-600" />,
        };
      case "canceled":
        return {
          text: "Đã hủy",
          badge: "bg-red-100 text-red-800 border-red-400",
          icon: <XCircle className="w-4 h-4 text-red-600" />,
        };
      default:
        return {
          text: "Không xác định",
          badge: "bg-gray-100 text-gray-800 border-gray-400",
          icon: <Clock className="w-4 h-4 text-gray-600" />,
        };
    }
  };

  const formatCurrency = (v) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(v) || 0);

  // ===============================
  // LOADING
  // ===============================
  if (orderLoading)
    return (
      <div className="flex justify-center items-center h-60 text-gray-600">
        <ShieldCheck className="w-5 h-5 mr-2 animate-spin" />
        Đang tải danh sách đơn hàng...
      </div>
    );

  if (!ordersWithAddress.length)
    return (
      <div className="text-center text-gray-500 py-10">
        <i className="ri-shopping-bag-line text-4xl text-gray-400"></i>
        <p>Bạn chưa có đơn hàng nào.</p>
      </div>
    );

  // ===============================
  // MAIN UI
  // ===============================
  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h2>

      {ordersWithAddress.map((order) => {
        const st = getStatusInfo(order.status);

        return (
          <div
            key={order.id}
            className="border bg-white rounded-lg p-5 mb-4 hover:shadow-lg cursor-pointer"
            onClick={() => {
              setSelectedOrder(order);
              setIsModalOpen(true);
            }}
          >
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {st.icon}
                  <span
                    className={`px-2 py-1 text-xs border rounded-full ${st.badge}`}
                  >
                    {st.text}
                  </span>
                </div>

                <p className="font-semibold">Mã đơn: {order.id}</p>
                <p className="text-sm text-gray-500">
                  Tổng tiền: {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* ====================== MODAL ====================== */}
      {isModalOpen &&
        selectedOrder &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-white max-w-xl w-full rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-red-600 text-white p-4 flex justify-between">
                <h3 className="font-semibold">
                  Chi tiết đơn hàng #{selectedOrder.id}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-xl"
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center gap-2">
                  {getStatusInfo(selectedOrder.status).icon}
                  <span
                    className={`px-2 py-1 border text-xs rounded-full ${getStatusInfo(selectedOrder.status).badge}`}
                  >
                    {getStatusInfo(selectedOrder.status).text}
                  </span>
                </div>

                <p>
                  <b>Tổng tiền:</b>{" "}
                  {formatCurrency(selectedOrder.totalAmount)}
                </p>

                <h4 className="font-semibold">Sản phẩm:</h4>
                <ul className="space-y-2">
                  {selectedOrder.items.map((it, i) => (
                    <li key={i} className="flex justify-between border-b pb-1">
                      <span>
                        {it.variantName} × {it.quantity}
                      </span>
                      <b>{formatCurrency(it.subtotal)}</b>
                    </li>
                  ))}
                </ul>

                {/* ================== CANCEL BUTTON ================== */}
                {String(selectedOrder.status).toLowerCase() === "pending" && (
                  <button
                    onClick={async () => {
                      const ok = window.confirm(
                        "Bạn có chắc muốn hủy đơn hàng này?"
                      );
                      if (!ok) return;

                      const result = await cancelOrder(selectedOrder.id);

                      if (result.success) {
                        alert("Đã hủy đơn hàng thành công!");
                      } else {
                        alert(result.message);
                      }

                      setIsModalOpen(false);
                    }}
                    className="w-full bg-red-600 text-white py-2 rounded-lg mt-4 hover:bg-red-700"
                  >
                    Hủy đơn hàng
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
