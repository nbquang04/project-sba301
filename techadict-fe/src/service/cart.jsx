// 📦 src/service/cart.js
import instance from "./index.jsx";
import { endpoint } from "./endpoints.jsx";

/**
 * 🛒 CART SERVICE
 * ------------------------------------------------------
 * Quản lý toàn bộ logic gọi API giỏ hàng (CartController)
 * Mỗi hàm đều trả về dữ liệu chuẩn `CartResponse`
 * ------------------------------------------------------
 * CartResponse:
 * {
 *   id: string,
 *   userId: string,
 *   userName: string,
 *   totalPrice: number,
 *   items: [
 *     {
 *       id: string,
 *       variantId: string,
 *       variantName: string,
 *       imageUrl: string,
 *       productId: string,      // 🆕 ID sản phẩm gốc
 *       productName: string,    // 🆕 Tên sản phẩm gốc
 *       price: number,          // Tổng tiền (price * quantity)
 *       quantity: number
 *     }
 *   ]
 * }
 */

/** ✅ Lấy giỏ hàng của người dùng (tự tạo nếu chưa có) */
export async function getCartByUser(userId) {
  try {
    const res = await instance.get(`${endpoint.CARTS}/${userId}`);
    return res.data?.result;
  } catch (err) {
    console.error("❌ [CartService] Lỗi khi lấy giỏ hàng:", err.response?.data || err.message);
    throw err;
  }
}

/** ✅ Thêm sản phẩm vào giỏ hàng */
export async function addItemToCart(userId, variantId, quantity = 1) {
  try {
    const res = await instance.post(`${endpoint.CARTS}/${userId}/add`, {
      variantId,
      quantity,
    });
    return res.data?.result;
  } catch (err) {
    console.error("❌ [CartService] Lỗi khi thêm sản phẩm vào giỏ:", err.response?.data || err.message);
    throw err;
  }
}

/** ✅ Cập nhật số lượng sản phẩm trong giỏ */
export async function updateCartItem(userId, variantId, quantity) {
  try {
    const res = await instance.put(`${endpoint.CARTS}/${userId}/update`, {
      variantId,
      quantity,
    });
    return res.data?.result;
  } catch (err) {
    console.error("❌ [CartService] Lỗi khi cập nhật số lượng:", err.response?.data || err.message);
    throw err;
  }
}

/** ✅ Xóa 1 sản phẩm khỏi giỏ hàng */
export async function removeCartItem(userId, variantId) {
  try {
    const res = await instance.delete(`${endpoint.CARTS}/${userId}/remove`, {
      data: { variantId },
    });
    return res.data?.result;
  } catch (err) {
    console.error("❌ [CartService] Lỗi khi xóa sản phẩm khỏi giỏ:", err.response?.data || err.message);
    throw err;
  }
}

/** ✅ Xóa toàn bộ giỏ hàng */
export async function clearCart(userId) {
  try {
    const res = await instance.delete(`${endpoint.CARTS}/${userId}/clear`);
    return res.data?.result;
  } catch (err) {
    console.error("❌ [CartService] Lỗi khi làm trống giỏ hàng:", err.response?.data || err.message);
    throw err;
  }
}
