import { useState, useMemo, useContext, useEffect } from "react";
import SideBarAdmin from "../../components/SideBarAdmin";
import { Check, Loader2 } from "lucide-react";
import { TechContext } from "../../context/TechContext.jsx";

const toNumber = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const normalizeStatus = (s) => String(s || "pending").toLowerCase();

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "delivering",
  "completed",
  "canceled",
];

export default function OrderHistory() {
  // 🧠 Lấy dữ liệu thật từ context
  const {
    adminOrder,
    setAdminOrder,
    loadAllOrders,
    handleAdminUpdateOrderStatus,
    orderLoading,
  } = useContext(TechContext);

  const [statusFilter, setStatusFilter] = useState("all");

  // 🧩 Khi mount → load tất cả đơn hàng
  useEffect(() => {
    loadAllOrders();
  }, [loadAllOrders]);

  // 🧮 Lọc đơn hàng theo trạng thái
  const visibleOrders = useMemo(() => {
    let arr = Array.isArray(adminOrder) ? [...adminOrder] : [];
    if (statusFilter !== "all")
      arr = arr.filter((o) => normalizeStatus(o.status) === statusFilter);
    // 🔄 Sắp xếp đơn mới nhất lên đầu
    return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [adminOrder, statusFilter]);

  // ⚙️ Cập nhật trạng thái đơn
  const handleChangeStatus = async (orderId, newStatus) => {
    if (
      !window.confirm(
        `Xác nhận chuyển trạng thái đơn hàng #${orderId} → "${newStatus}"?`
      )
    )
      return;

    try {
      await handleAdminUpdateOrderStatus(orderId, newStatus);
      setAdminOrder((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
      alert(`✅ Đã cập nhật đơn hàng #${orderId} sang "${newStatus}"`);
    } catch (err) {
      console.error("❌ Lỗi cập nhật trạng thái:", err);
      alert("Không thể cập nhật trạng thái, vui lòng thử lại!");
    }
  };

  return (
    <div className="flex">
      <SideBarAdmin />
      <div className="flex-1 max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          Quản lý đơn hàng
        </h1>

        {/* Tabs trạng thái */}
        <div className="flex flex-wrap gap-2 mb-4">
          {["all", ...ORDER_STATUSES].map((key) => {
            const selected = statusFilter === key;
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={[
                  "px-3 py-1.5 rounded-full text-sm border transition",
                  selected
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100",
                ].join(" ")}
              >
                {key === "all"
                  ? "Tất cả"
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Bảng đơn hàng */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Người dùng</th>
                <th className="px-4 py-3">Ngày đặt</th>
                <th className="px-4 py-3">Tổng tiền</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-center">Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {orderLoading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    <Loader2 className="inline w-5 h-5 animate-spin mr-2" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : visibleOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    Không có đơn hàng phù hợp.
                  </td>
                </tr>
              ) : (
                visibleOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border font-mono">{order.id}</td>
                    <td className="px-4 py-3 border">
                      {order.user?.email || order.userId || "Không rõ"}
                    </td>
                    <td className="px-4 py-3 border">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("vi-VN")
                        : "--"}
                    </td>
                    <td className="px-4 py-3 border font-medium">
                      {toNumber(order.totalAmount).toLocaleString("vi-VN")} ₫
                    </td>
                    <td className="px-4 py-3 border">
                      <select
                        className="border rounded-lg px-2 py-1 w-full text-sm capitalize"
                        value={normalizeStatus(order.status)}
                        onChange={(e) =>
                          handleChangeStatus(order.id, e.target.value)
                        }
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 border text-center">
                      <Check className="w-4 h-4 inline text-green-600" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
