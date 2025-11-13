import api from "./index";
import { endpoint } from "./endpoints.jsx";

// ============================
// 🏠 ADDRESS SERVICE (cho Payment.jsx)
// ============================

// ✅ 1. Lấy danh sách địa chỉ theo userId
export const getAddressesByUser = async (userId) => {
  try {
    const res = await api.get(`${endpoint.ADDRESSES}/user/${userId}`);
    return res.data?.result || [];
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách địa chỉ:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ 2. Lấy chi tiết 1 địa chỉ
export const getAddressById = async (id) => {
  try {
    const res = await api.get(`${endpoint.ADDRESSES}/${id}`);
    return res.data?.result;
  } catch (err) {
    console.error("❌ Lỗi khi lấy địa chỉ:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ 3. Tạo địa chỉ mới
export const createAddress = async (data) => {
  try {
    const res = await api.post(endpoint.ADDRESSES, data);
    return res.data?.result;
  } catch (err) {
    console.error("❌ Lỗi khi tạo địa chỉ:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ 4. Cập nhật địa chỉ
export const updateAddress = async (id, data) => {
  try {
    const res = await api.put(`${endpoint.ADDRESSES}/${id}`, data);
    return res.data?.result;
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật địa chỉ:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ 5. Xóa địa chỉ
export const deleteAddress = async (id) => {
  try {
    const res = await api.delete(`${endpoint.ADDRESSES}/${id}`);
    return res.data?.result;
  } catch (err) {
    console.error("❌ Lỗi khi xóa địa chỉ:", err.response?.data || err.message);
    throw err;
  }
};
