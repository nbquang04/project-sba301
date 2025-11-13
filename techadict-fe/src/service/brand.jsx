// 📦 src/service/brands.js
import api from "./index";
import { endpoint } from "./endpoints";

// ============================
// 🏷️ BRAND SERVICE
// ============================

/**
 * ✅ Lấy tất cả thương hiệu
 * GET /brands
 */
export const fetchAllBrands = async () => {
  try {
    const res = await api.get(endpoint.BRAND);
    return res.data?.result || [];
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách thương hiệu:", err);
    throw err;
  }
};

/**
 * ✅ Lấy chi tiết thương hiệu theo ID
 * GET /brands/{id}
 */
export const fetchBrandById = async (id) => {
  try {
    const res = await api.get(`${endpoint.BRAND}/${id}`);
    return res.data?.result || null;
  } catch (err) {
    console.error(`❌ Lỗi khi lấy thương hiệu ID=${id}:`, err);
    throw err;
  }
};

/**
 * ✅ Tạo thương hiệu mới
 * POST /brands
 */
export const createBrand = async (data) => {
  try {
    const res = await api.post(endpoint.BRAND, data);
    return res.data?.result || null;
  } catch (err) {
    console.error("❌ Lỗi khi tạo thương hiệu:", err);
    throw err;
  }
};

/**
 * ✅ Cập nhật thương hiệu
 * PUT /brands/{id}
 */
export const updateBrand = async (id, data) => {
  try {
    const res = await api.put(`${endpoint.BRAND}/${id}`, data);
    return res.data?.result || null;
  } catch (err) {
    console.error(`❌ Lỗi khi cập nhật thương hiệu ID=${id}:`, err);
    throw err;
  }
};

/**
 * ✅ Xóa thương hiệu
 * DELETE /brands/{id}
 */
export const deleteBrand = async (id) => {
  try {
    const res = await api.delete(`${endpoint.BRAND}/${id}`);
    return res.data?.result || "Brand deleted successfully!";
  } catch (err) {
    console.error(`❌ Lỗi khi xóa thương hiệu ID=${id}:`, err);
    throw err;
  }
};
