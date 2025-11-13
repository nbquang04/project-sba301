// 📦 src/pages/Cart/CartPage.jsx
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header1";
import { TechContext } from "../../context/TechContext.jsx";
import "remixicon/fonts/remixicon.css";

export default function CartPage() {
  const navigate = useNavigate();

  const {
    cart,
    cartLoading,
    user,
    handleUpdateCartItem,
    handleRemoveCartItem,
    loadCart,
  } = useContext(TechContext);

  const [selectedItems, setSelectedItems] = useState([]);

  // 🧠 Load giỏ hàng khi user thay đổi
  useEffect(() => {
    if (user?.id) loadCart();
  }, [user, loadCart]);

  // 🕐 Loading
  if (cartLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-red-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // 🛒 Giỏ hàng trống
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-gray-50 to-white px-4">
          <div className="w-28 h-28 flex items-center justify-center bg-red-100 rounded-full shadow-inner mb-6 animate-bounce">
            <i className="ri-shopping-cart-line text-6xl text-red-500"></i>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-3">
            Giỏ hàng của bạn đang trống
          </h3>
          <p className="text-gray-500 text-base max-w-sm text-center mb-8">
            Có vẻ như bạn chưa thêm gì vào giỏ hàng.  
            Hãy bắt đầu khám phá và tìm sản phẩm bạn yêu thích!
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition"
          >
            🛍️ Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  // 🧮 Tổng tiền
  const getTotal = () => {
    return cart.items
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  };
  const total = getTotal();

  // ✅ Handlers
  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleQuantityChange = async (variantId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await handleUpdateCartItem(variantId, newQuantity);
      await loadCart();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật số lượng:", err);
    }
  };

  const deleteItemFromCart = async (variantId) => {
    try {
      await handleRemoveCartItem(variantId);
      await loadCart();
      setSelectedItems((prev) => prev.filter((id) => id !== variantId));
    } catch (err) {
      console.error("❌ Lỗi khi xóa sản phẩm:", err);
    }
  };

  // 🧭 Chuyển sang trang Payment
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }

    // Lấy danh sách item được chọn
    const chosenItems = cart.items.filter((item) =>
      selectedItems.includes(item.id)
    );

    // Gửi dữ liệu sang trang thanh toán
    navigate("/payment", {
      state: {
        selectedItems: chosenItems,
        total: total + 30000, // tổng + ship
      },
    });
  };

  // ✅ UI hiển thị giỏ hàng (giữ nguyên)
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ===== DANH SÁCH SẢN PHẨM ===== */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
              <div className="px-8 py-6 bg-white border-b border-red-100 flex justify-between items-center">
                <h4 className="text-xl font-semibold text-gray-800">Giỏ hàng</h4>
                <span className="text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-full font-medium">
                  {selectedItems.length} / {cart.items.length} được chọn
                </span>
              </div>

              <div>
                {cart.items.map((item) => {
                  const isSelected = selectedItems.includes(item.id);
                  const fullName = `${item.variantName || ""}`.trim();
                  const displayName =
                    item.productName && item.variantName
                      ? `${item.productName} – ${item.variantName}`
                      : fullName || item.productName || "Sản phẩm không tên";

                  return (
                    <div
                      key={item.id}
                      className={`px-8 py-8 border-b border-red-100 transition-colors duration-200 ${
                        isSelected ? "bg-red-50" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center space-x-6">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          onChange={() => handleCheckboxChange(item.id)}
                          checked={isSelected}
                          className="w-5 h-5 accent-red-600 rounded"
                          style={{ transform: "scale(1.2)" }}
                        />

                        {/* Ảnh */}
                        <div
                          className="w-24 h-24 bg-red-50 rounded-xl overflow-hidden border border-red-200 cursor-pointer flex-shrink-0"
                          onClick={() => navigate(`/products/${item.productId}`)}
                        >
                          <img
                            src={item.imageUrl || "/noimage.png"}
                            alt={displayName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Thông tin */}
                        <div className="flex-1 min-w-0">
                          <h5
                            className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-red-600"
                            onClick={() => navigate(`/products/${item.productId}`)}
                          >
                            {displayName}
                          </h5>

                          {/* Giá & Số lượng */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.variantId,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
                              >
                                −
                              </button>

                              <span className="text-lg font-semibold text-gray-800 min-w-10 text-center">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.variantId,
                                    item.quantity + 1
                                  )
                                }
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition"
                              >
                                +
                              </button>
                            </div>

                            <div className="flex items-center space-x-6">
                              <div className="text-xl font-bold text-gray-800">
                                {(item.price || 0).toLocaleString("vi-VN")} ₫
                              </div>
                              <button
                                onClick={() => deleteItemFromCart(item.variantId)}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-red-300 bg-red-500 text-white hover:bg-red-600 transition"
                              >
                                <i className="ri-delete-bin-6-line"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ===== TÓM TẮT ===== */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                <div className="bg-red-500 px-8 py-6">
                  <h5 className="text-xl font-semibold text-white text-center mb-0">
                    Tóm tắt đơn hàng
                  </h5>
                </div>

                <div className="p-8">
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-gray-700">
                      <span>Tạm tính:</span>
                      <span className="font-semibold">
                        {total.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Phí vận chuyển:</span>
                      <span className="font-semibold">
                        {selectedItems.length > 0 ? "30,000 ₫" : "0 ₫"}
                      </span>
                    </div>
                    <div className="border-t border-red-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-800">
                          Tổng cộng:
                        </span>
                        <span className="text-2xl font-bold text-red-600">
                          {selectedItems.length > 0
                            ? (total + 30000).toLocaleString("vi-VN")
                            : "0"}{" "}
                          ₫
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                    className={`w-full py-4 px-6 rounded-xl text-base font-semibold transition-all duration-200 ${
                      selectedItems.length > 0
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {selectedItems.length > 0
                      ? "🚀 Thanh toán"
                      : "Chọn sản phẩm để thanh toán"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
