import api from "./index";
import { endpoint } from "./endpoints.jsx";

// ============================
// 🧾 ORDER SERVICE
// ============================

// ✅ 1. Tạo đơn hàng mới
export const createOrder = async (data) => {
  try {
    const res = await api.post(endpoint.ORDERS, data);
    return res.data?.result;
  } catch (err) {
    console.error("❌ Lỗi khi tạo đơn hàng:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ 2. Lấy tất cả đơn hàng (Admin)
export const getAllOrders = async () => {
  try {
    const res = await api.get(endpoint.ORDERS);
    return res.data?.result || [];
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách đơn hàng:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ 3. Lấy danh sách đơn hàng theo userId
export const getOrdersByUser = async (userId) => {
  try {
    const res = await api.get(`${endpoint.ORDERS}/user/${userId}`);
    return res.data?.result || [];
  } catch (err) {
    console.error("❌ Lỗi khi lấy đơn hàng theo user:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ 4. Lấy chi tiết 1 đơn hàng
export const getOrderById = async (orderId) => {
  try {
    const res = await api.get(`${endpoint.ORDERS}/${orderId}`);
    return res.data?.result;
  } catch (err) {
    console.error("❌ Lỗi khi lấy chi tiết đơn hàng:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ 5. Cập nhật trạng thái đơn hàng (Admin)
export const updateOrderStatus = async (orderId, status) => {
  try {
    const res = await api.put(`${endpoint.ORDERS}/${orderId}/status`, null, {
      params: { status },
    });
    return res.data?.result;
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật trạng thái đơn hàng:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ 6. Cập nhật trạng thái thanh toán
export const updatePaymentStatus = async (orderId, status) => {
  try {
    const res = await api.put(`${endpoint.ORDERS}/${orderId}/payment`, null, {
      params: { status },
    });
    return res.data?.result;
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật trạng thái thanh toán:", err.response?.data || err.message);
    throw err;
  }
};
