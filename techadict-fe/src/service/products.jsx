import api from "./index";
import { endpoint } from "./endpoints"; // ✅ import danh sách endpoint

// ==============================
// 🧩 PRODUCT SERVICE
// ==============================

/**
 * ✅ Lấy tất cả sản phẩm
 * @returns {Promise<Array>} danh sách ProductResponse
 */
export const fetchAllProducts = async () => {
  try {
    const res = await api.get(endpoint.PRODUCT);
    return res.data?.result || [];
  } catch (err) {
    console.error("❌ Lỗi khi fetchAllProducts:", err);
    throw err;
  }
};

/**
 * ✅ Lấy chi tiết sản phẩm theo ID
 * @param {string} id
 * @returns {Promise<Object>} ProductResponse
 */
export const fetchProductById = async (id) => {
  try {
    const res = await api.get(`${endpoint.PRODUCT}/${id}`);
    return res.data?.result || null;
  } catch (err) {
    console.error(`❌ Lỗi khi fetchProductById(${id}):`, err);
    throw err;
  }
};

/**
 * ✅ Tạo sản phẩm mới
 * @param {Object} data ProductRequest
 * @returns {Promise<Object>} ProductResponse (kèm code & message)
 */
export const createProduct = async (data) => {
  try {
    const res = await api.post(endpoint.PRODUCT, data);
    // ⚡️ Quan trọng: trả về toàn bộ dữ liệu (có code, message, result)
    return res.data;
  } catch (err) {
    console.error("❌ Lỗi khi createProduct:", err.response?.data || err.message);
    throw err;
  }
};

/**
 * ✅ Cập nhật sản phẩm theo ID
 * @param {string} id
 * @param {Object} data ProductRequest
 * @returns {Promise<Object>} ProductResponse
 */
export const updateProduct = async (id, data) => {
  try {
    const res = await api.put(`${endpoint.PRODUCT}/${id}`, data);
    return res.data?.result;
  } catch (err) {
    console.error(`❌ Lỗi khi updateProduct(${id}):`, err);
    throw err;
  }
};

/**
 * ✅ Xóa sản phẩm theo ID
 * @param {string} id
 * @returns {Promise<string>} message
 */
export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`${endpoint.PRODUCT}/${id}`);
    return res.data?.result;
  } catch (err) {
    console.error(`❌ Lỗi khi deleteProduct(${id}):`, err);
    throw err;
  }
};
