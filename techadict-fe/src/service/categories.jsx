import api from "./index";
import { endpoint } from "./endpoints";

// ==============================
// 🧩 CATEGORY SERVICE (chuẩn theo backend)
// ==============================

/**
 * ✅ Lấy tất cả danh mục
 * GET /categories
 */
export const fetchAllCategories = async () => {
  try {
    const res = await api.get(endpoint.CATEGORY);
    return res.data?.result || [];
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách danh mục:", err);
    throw err;
  }
};

/**
 * ✅ Lấy chi tiết danh mục theo ID
 * GET /categories/{id}
 */
export const fetchCategoryById = async (id) => {
  try {
    const res = await api.get(`${endpoint.CATEGORY}/${id}`);
    return res.data?.result || null;
  } catch (err) {
    console.error(`❌ Lỗi khi lấy chi tiết danh mục (${id}):`, err);
    throw err;
  }
};

/**
 * ✅ Tạo danh mục mới
 * POST /categories
 */
export const createCategory = async (data) => {
  try {
    const res = await api.post(endpoint.CATEGORY, data);
    return res.data?.result;
  } catch (err) {
    console.error("❌ Lỗi khi tạo danh mục:", err);
    throw err;
  }
};

/**
 * ✅ Cập nhật danh mục
 * PUT /categories/{id}
 */
export const updateCategory = async (id, data) => {
  try {
    const res = await api.put(`${endpoint.CATEGORY}/${id}`, data);
    return res.data?.result;
  } catch (err) {
    console.error(`❌ Lỗi khi cập nhật danh mục (${id}):`, err);
    throw err;
  }
};

/**
 * ✅ Xóa danh mục theo ID
 * DELETE /categories/{id}
 */
export const deleteCategory = async (id) => {
  try {
    const res = await api.delete(`${endpoint.CATEGORY}/${id}`);
    return res.data?.result || "Category deleted successfully!";
  } catch (err) {
    console.error(`❌ Lỗi khi xóa danh mục (${id}):`, err);
    throw err;
  }
};
