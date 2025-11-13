// 📦 src/context/TechContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  introspectToken,
  logout as apiLogout,
  getToken,
} from "../service/auth";
import { getMyInfo, updateUserProfile, changeUserPassword } from "../service/users";
import {
  fetchAllCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../service/categories";
import {
  fetchAllProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../service/products";
import {
  getCartByUser,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../service/cart";
import {
  createOrder,
  getOrdersByUser,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  getAllOrders,
} from "../service/order";
import {
  getAddressesByUser,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../service/address";
import {
  fetchAllBrands,
  fetchBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../service/brand";

import { useNotification } from "../context/NotificationContext";

export const TechContext = createContext();

const TechProvider = ({ children }) => {
  const { showSuccess, showError, showInfo } = useNotification();

  // ====================== 🔐 AUTH ======================
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        setAuthChecked(true);
        return;
      }
      try {
        const introspect = await introspectToken();
        if (introspect?.valid) {
          const profile = await getMyInfo();
          setUser(profile);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.warn("⚠️ Auth check failed:", err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const result = await apiLogin(email, password);
      if (result?.token) {
        const profile = await getMyInfo();
        setUser(profile);
        setIsAuthenticated(true);
      }
      return result;
    } catch (err) {
      console.error("❌ Login failed:", err);
      setIsAuthenticated(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRegister = useCallback(async (data) => {
    setIsLoading(true);
    try {
      const result = await apiRegister(data);
      return result;
    } catch (err) {
      console.error("❌ Register failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      const res = await apiLogout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      setAuthChecked(true);

      if (res?.success) showSuccess("Bạn đã đăng xuất thành công!");
      else showInfo("Đăng xuất cục bộ. Phiên API không phản hồi!");
    } catch (err) {
      console.error("❌ Logout failed:", err);
      showError("Đăng xuất thất bại. Vui lòng thử lại!");
    }
  }, [showSuccess, showError, showInfo]);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await getMyInfo();
      setUser(profile);
      return profile;
    } catch (err) {
      console.error("❌ Lỗi khi refresh user:", err);
    }
  }, []);
  const handleUpdateUser = useCallback(
    async (data) => {
      try {
        // 🔹 ĐỔI MẬT KHẨU
        if (data.currentPassword && data.newPassword) {
          await changeUserPassword(data.id, {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          });
          return "password-updated";
        }

        // 🔹 CẬP NHẬT HỒ SƠ
        await updateUserProfile(data.id, {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          roles: data.roles,
        });

        // reload user info
        const profile = await getMyInfo();
        setUser(profile);

        return "profile-updated";
      } catch (err) {
        console.error("❌ handleUpdateUser failed:", err);
        throw err;
      }
    },
    [setUser]
  );

  // ====================== 💐 CATEGORIES ======================
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [catLoading, setCatLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    setCatLoading(true);
    try {
      const data = await fetchAllCategories();
      setCategories(data ?? []);
    } catch (err) {
      console.error("❌ Lỗi khi load categories:", err);
      setCategories([]);
      showError("Không thể tải danh sách danh mục!");
    } finally {
      setCatLoading(false);
    }
  }, [showError]);
  const loadCategoryDetail = useCallback(
    async (id) => {
      if (!id) return;
      setCatLoading(true);
      try {
        const data = await fetchCategoryById(id);
        setSelectedCategory(data);
        return data;
      } catch (err) {
        console.error(`❌ Lỗi khi lấy chi tiết danh mục ${id}:`, err);
        showError("Không thể tải chi tiết danh mục!");
        setSelectedCategory(null);
      } finally {
        setCatLoading(false);
      }
    },
    [showError]
  );

  const handleCreateCategory = useCallback(
    async (data) => {
      try {
        setCatLoading(true);
        const result = await createCategory(data);
        showSuccess("✅ Đã tạo danh mục mới!");
        await loadCategories();
        return result;
      } catch (err) {
        console.error("❌ Lỗi khi tạo danh mục:", err);
        showError("Không thể tạo danh mục mới!");
        throw err;
      } finally {
        setCatLoading(false);
      }
    },
    [showSuccess, showError, loadCategories]
  );

  const handleUpdateCategory = useCallback(
    async (id, data) => {
      try {
        const result = await updateCategory(id, data);
        showInfo("📝 Đã cập nhật danh mục!");
        await loadCategories();
        return result;
      } catch (err) {
        console.error("❌ Lỗi khi cập nhật danh mục:", err);
        showError("Không thể cập nhật danh mục!");
        throw err;
      }
    },
    [showInfo, showError, loadCategories]
  );

  const handleDeleteCategory = useCallback(
    async (id) => {
      try {
        await deleteCategory(id);
        showInfo("🗑️ Đã xóa danh mục!");
        await loadCategories();
      } catch (err) {
        console.error("❌ Lỗi khi xóa danh mục:", err);
        showError("Không thể xóa danh mục!");
        throw err;
      }
    },
    [showInfo, showError, loadCategories]
  );

  // ====================== 🌸 PRODUCTS ======================
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [prodLoading, setProdLoading] = useState(false);

  const loadProducts = useCallback(async () => {
    setProdLoading(true);
    try {
      const data = await fetchAllProducts();
      setProducts(data ?? []);
      setFilteredProducts(data ?? []);
    } catch (err) {
      console.error("❌ Lỗi khi load products:", err);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setProdLoading(false);
    }
  }, []);

  const handleCreateProduct = useCallback(
    async (data) => {
      try {
        setProdLoading(true);
        const res = await createProduct(data);
        if (res?.code === 1000) {
          showSuccess("✅ Thêm sản phẩm thành công!");
          await loadProducts();
          return res?.result;
        } else {
          showError("❌ Không thể thêm sản phẩm!");
        }
      } catch (err) {
        console.error("❌ Lỗi khi tạo sản phẩm:", err);
        showError("Không thể thêm sản phẩm mới!");
        throw err;
      } finally {
        setProdLoading(false);
      }
    },
    [showSuccess, showError, loadProducts]
  );

  const handleUpdateProduct = useCallback(
    async (id, data) => {
      try {
        setProdLoading(true);
        const res = await updateProduct(id, data);
        showInfo("📝 Cập nhật sản phẩm thành công!");
        await loadProducts();
        return res;
      } catch (err) {
        console.error("❌ Lỗi khi cập nhật sản phẩm:", err);
        showError("Không thể cập nhật sản phẩm!");
        throw err;
      } finally {
        setProdLoading(false);
      }
    },
    [showInfo, showError, loadProducts]
  );

  const handleDeleteProduct = useCallback(
    async (id) => {
      if (!window.confirm("Xác nhận xóa sản phẩm này?")) return;
      try {
        await deleteProduct(id);
        showInfo("🗑️ Đã xóa sản phẩm!");
        await loadProducts();
      } catch (err) {
        console.error("❌ Lỗi khi xóa sản phẩm:", err);
        showError("Không thể xóa sản phẩm!");
        throw err;
      }
    },
    [showInfo, showError, loadProducts]
  );

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const getProductDetail = useCallback(async (id) => {
    if (!id) return null;
    setDetailLoading(true);
    try {
      const data = await fetchProductById(id);
      setSelectedProduct(data);
      return data;
    } catch (err) {
      console.error(`❌ Lỗi khi lấy chi tiết sản phẩm ${id}:`, err);
      setSelectedProduct(null);
      return null;
    } finally {
      setDetailLoading(false);
    }
  }, []);

  // ====================== 🏷️ BRANDS ======================
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandLoading, setBrandLoading] = useState(false);

  const loadBrands = useCallback(async () => {
    setBrandLoading(true);
    try {
      const data = await fetchAllBrands();
      setBrands(data ?? []);
    } catch (err) {
      console.error("❌ Lỗi khi load thương hiệu:", err);
      setBrands([]);
      showError("Không thể tải danh sách thương hiệu!");
    } finally {
      setBrandLoading(false);
    }
  }, [showError]);

  const loadBrandDetail = useCallback(async (id) => {
    if (!id) return;
    setBrandLoading(true);
    try {
      const data = await fetchBrandById(id);
      setSelectedBrand(data);
      return data;
    } catch (err) {
      console.error(`❌ Lỗi khi lấy chi tiết thương hiệu ${id}:`, err);
      showError("Không thể tải chi tiết thương hiệu!");
      setSelectedBrand(null);
    } finally {
      setBrandLoading(false);
    }
  }, [showError]);

  const handleCreateBrand = useCallback(
    async (data) => {
      try {
        setBrandLoading(true);
        const result = await createBrand(data);
        showSuccess("✅ Đã thêm thương hiệu mới!");
        await loadBrands();
        return result;
      } catch (err) {
        console.error("❌ Lỗi khi tạo thương hiệu:", err);
        showError("Không thể thêm thương hiệu mới!");
        throw err;
      } finally {
        setBrandLoading(false);
      }
    },
    [showSuccess, showError, loadBrands]
  );

  const handleUpdateBrand = useCallback(
    async (id, data) => {
      try {
        const result = await updateBrand(id, data);
        showInfo("📝 Đã cập nhật thương hiệu!");
        await loadBrands();
        return result;
      } catch (err) {
        console.error("❌ Lỗi khi cập nhật thương hiệu:", err);
        showError("Không thể cập nhật thương hiệu!");
        throw err;
      }
    },
    [showInfo, showError, loadBrands]
  );

  const handleDeleteBrand = useCallback(
    async (id) => {
      try {
        await deleteBrand(id);
        showInfo("🗑️ Đã xóa thương hiệu!");
        await loadBrands();
      } catch (err) {
        console.error("❌ Lỗi khi xóa thương hiệu:", err);
        showError("Không thể xóa thương hiệu!");
        throw err;
      }
    },
    [showInfo, showError, loadBrands]
  );

  // ====================== 🛒 CART ======================
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);

  const loadCart = useCallback(async () => {
    if (!user?.id) return;
    setCartLoading(true);
    try {
      const data = await getCartByUser(user.id);
      setCart(data);
    } catch (err) {
      console.error("❌ Lỗi khi load cart:", err);
      setCart(null);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) loadCart();
    else setCart(null);
  }, [user, loadCart]);

  const handleAddToCart = useCallback(
    async (variantId, quantity = 1) => {
      if (!user?.id) {
        showInfo("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
        return;
      }
      try {
        const updated = await addItemToCart(user.id, variantId, quantity);
        setCart(updated);
        showSuccess("🛒 Đã thêm sản phẩm vào giỏ!");
        return updated;
      } catch (err) {
        console.error("❌ Lỗi khi thêm vào giỏ:", err);
        showError("Không thể thêm sản phẩm. Vui lòng thử lại!");
        throw err;
      }
    },
    [user, showSuccess, showError, showInfo]
  );

  const handleUpdateCartItem = useCallback(
    async (variantId, quantity) => {
      if (!user?.id) return;
      try {
        const updated = await updateCartItem(user.id, variantId, quantity);
        setCart(updated);
        showInfo("📝 Đã cập nhật số lượng!");
        return updated;
      } catch (err) {
        console.error("❌ Lỗi khi cập nhật giỏ:", err);
        showError("Không thể cập nhật số lượng!");
        throw err;
      }
    },
    [user, showInfo, showError]
  );

  const handleRemoveCartItem = useCallback(
    async (variantId) => {
      if (!user?.id) return;
      try {
        const updated = await removeCartItem(user.id, variantId);
        setCart(updated?.result || updated);
        showInfo("🗑️ Đã xóa sản phẩm khỏi giỏ!");
        return updated?.result || updated;
      } catch (err) {
        console.error("❌ Lỗi khi xóa sản phẩm khỏi giỏ:", err);
        showError("Không thể xóa sản phẩm!");
        throw err;
      }
    },
    [user, showInfo, showError]
  );

  const handleClearCart = useCallback(async () => {
    if (!user?.id) return;
    try {
      const updated = await clearCart(user.id);
      setCart(updated);
      showInfo("🧹 Giỏ hàng đã được làm trống!");
      return updated;
    } catch (err) {
      console.error("❌ Lỗi khi xóa toàn bộ giỏ:", err);
      showError("Không thể làm trống giỏ hàng!");
      throw err;
    }
  }, [user, showInfo, showError]);

  // ====================== 🧾 ORDER ======================
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [adminOrder, setAdminOrder] = useState([]);

  const loadOrders = useCallback(async () => {
    if (!user?.id) return;
    setOrderLoading(true);
    try {
      const data = await getOrdersByUser(user.id);
      setOrders(data || []);
      return data;
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách đơn hàng:", err);
      setOrders([]);
    } finally {
      setOrderLoading(false);
    }
  }, [user]);

  const loadOrderDetail = useCallback(async (orderId) => {
    if (!orderId) return;
    setOrderLoading(true);
    try {
      const data = await getOrderById(orderId);
      setSelectedOrder(data);
      return data;
    } catch (err) {
      console.error(`❌ Lỗi khi lấy chi tiết đơn hàng ${orderId}:`, err);
      setSelectedOrder(null);
    } finally {
      setOrderLoading(false);
    }
  }, []);

  const handleCreateOrder = useCallback(
    async (orderData) => {
      if (!user?.id) {
        showInfo("Vui lòng đăng nhập để đặt hàng!");
        return;
      }
      try {
        setOrderLoading(true);
        const result = await createOrder(orderData);
        if (result) {
          showSuccess("✅ Đặt hàng thành công!");
          await loadOrders();
          if (orderData?.items && orderData.items.length > 0) {
            for (const item of orderData.items) {
              try {
                await handleRemoveCartItem(item.variantId);
              } catch (err) {
                console.warn(`⚠️ Không thể xoá ${item.variantId} khỏi giỏ:`, err);
              }
            }
          }
          return result;
        }
      } catch (err) {
        console.error("❌ Lỗi khi tạo đơn hàng:", err);
        showError("Không thể đặt hàng. Vui lòng thử lại!");
        throw err;
      } finally {
        setOrderLoading(false);
      }
    },
    [user, showSuccess, showError, showInfo, loadOrders, handleClearCart]
  );

  const handleUpdateOrderStatus = useCallback(
    async (orderId, status) => {
      try {
        const result = await updateOrderStatus(orderId, status);
        showInfo(`📝 Cập nhật trạng thái đơn hàng ${orderId}: ${status}`);
        await loadOrders();
        return result;
      } catch (err) {
        console.error("❌ Lỗi khi cập nhật trạng thái đơn hàng:", err);
        showError("Không thể cập nhật trạng thái đơn hàng!");
        throw err;
      }
    },
    [showInfo, showError, loadOrders]
  );

  const handleUpdatePaymentStatus = useCallback(
    async (orderId, status) => {
      try {
        const result = await updatePaymentStatus(orderId, status);
        showInfo(`💳 Thanh toán ${status} cho đơn hàng ${orderId}`);
        await loadOrders();
        return result;
      } catch (err) {
        console.error("❌ Lỗi khi cập nhật thanh toán:", err);
        showError("Không thể cập nhật thanh toán!");
        throw err;
      }
    },
    [showInfo, showError, loadOrders]
  );

  const loadAllOrders = useCallback(async () => {
    setOrderLoading(true);
    try {
      const data = await getAllOrders();
      setAdminOrder(data || []);
      return data;
    } catch (err) {
      console.error("❌ Lỗi khi tải tất cả đơn hàng:", err);
      showError("Không thể tải danh sách đơn hàng!");
      setAdminOrder([]);
    } finally {
      setOrderLoading(false);
    }
  }, [showError]);

  // ====================== 🏠 ADDRESS ======================
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);

  const loadAddresses = useCallback(async () => {
    if (!user?.id) return;
    setAddressLoading(true);
    try {
      const data = await getAddressesByUser(user.id);
      setAddresses(data || []);
      return data;
    } catch (err) {
      console.error("❌ Lỗi khi load địa chỉ:", err);
      setAddresses([]);
      showError("Không thể tải danh sách địa chỉ!");
    } finally {
      setAddressLoading(false);
    }
  }, [user, showError]);

  const loadAddressDetail = useCallback(async (addressId) => {
    if (!addressId) return;
    setAddressLoading(true);
    try {
      const data = await getAddressById(addressId);
      setSelectedAddress(data);
      return data;
    } catch (err) {
      console.error(`❌ Lỗi khi lấy chi tiết địa chỉ ${addressId}:`, err);
      setSelectedAddress(null);
      showError("Không thể tải chi tiết địa chỉ!");
    } finally {
      setAddressLoading(false);
    }
  }, [showError]);

  const handleCreateAddress = useCallback(
    async (addressData) => {
      if (!user?.id) {
        showInfo("Vui lòng đăng nhập để thêm địa chỉ!");
        return;
      }
      try {
        setAddressLoading(true);
        const data = await createAddress({ ...addressData, userId: user.id });
        showSuccess("✅ Đã thêm địa chỉ mới!");
        await loadAddresses();
        return data;
      } catch (err) {
        console.error("❌ Lỗi khi thêm địa chỉ:", err);
        showError("Không thể thêm địa chỉ mới!");
        throw err;
      } finally {
        setAddressLoading(false);
      }
    },
    [user, showInfo, showSuccess, showError, loadAddresses]
  );

  const handleUpdateAddress = useCallback(
    async (addressId, data) => {
      try {
        const result = await updateAddress(addressId, data);
        showInfo("📝 Đã cập nhật địa chỉ!");
        await loadAddresses();
        return result;
      } catch (err) {
        console.error("❌ Lỗi khi cập nhật địa chỉ:", err);
        showError("Không thể cập nhật địa chỉ!");
        throw err;
      }
    },
    [showInfo, showError, loadAddresses]
  );

  const handleDeleteAddress = useCallback(
    async (addressId) => {
      try {
        await deleteAddress(addressId);
        showInfo("🗑️ Đã xóa địa chỉ!");
        await loadAddresses();
      } catch (err) {
        console.error("❌ Lỗi khi xóa địa chỉ:", err);
        showError("Không thể xóa địa chỉ!");
        throw err;
      }
    },
    [showInfo, showError, loadAddresses]
  );
  useEffect(() => {
    // 🔁 Tự động load danh mục và sản phẩm khi app khởi chạy
    const initData = async () => {
      try {
        await Promise.all([loadCategories(), loadProducts()]);
      } catch (err) {
        console.error("⚠️ Lỗi khi load dữ liệu khởi tạo:", err);
      }
    };

    initData();
  }, [loadCategories, loadProducts]);
  // ====================== 🧩 EXPORT ======================
  return (
    <TechContext.Provider
      value={{
        // Auth
        isAuthenticated,
        authChecked,
        isLoading,
        user,
        setUser,
        handleLogin,
        handleRegister,
        handleLogout,
        refreshUser,
        setIsAuthenticated,
        handleUpdateUser,
        // Category
        categories,
        selectedCategory,
        catLoading,
        loadCategories,
        loadCategoryDetail,
        handleCreateCategory,
        handleUpdateCategory,
        handleDeleteCategory,

        // Brand
        brands,
        selectedBrand,
        brandLoading,
        loadBrands,
        loadBrandDetail,
        handleCreateBrand,
        handleUpdateBrand,
        handleDeleteBrand,

        // Product
        products,
        filteredProducts,
        loadProducts,
        prodLoading,
        selectedProduct,
        getProductDetail,
        detailLoading,
        handleCreateProduct,
        handleUpdateProduct,
        handleDeleteProduct,

        // Cart
        cart,
        cartLoading,
        loadCart,
        handleAddToCart,
        handleUpdateCartItem,
        handleRemoveCartItem,
        handleClearCart,

        // Order
        orders,
        selectedOrder,
        orderLoading,
        loadOrders,
        loadOrderDetail,
        handleCreateOrder,
        handleUpdateOrderStatus,
        handleUpdatePaymentStatus,
        adminOrder,
        loadAllOrders,

        // Address
        addresses,
        selectedAddress,
        addressLoading,
        loadAddresses,
        loadAddressDetail,
        handleCreateAddress,
        handleUpdateAddress,
        handleDeleteAddress,
      }}
    >
      {children}
    </TechContext.Provider>
  );
};

export default TechProvider;
