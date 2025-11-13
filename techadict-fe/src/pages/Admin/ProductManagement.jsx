import React, { useContext, useState, useEffect, useMemo } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { PackageIcon, Loader2, AlertCircle, Trash2, Edit } from "lucide-react";
import { TechContext } from "../../context/TechContext.jsx";
import { useNotification } from "../../context/NotificationContext.jsx";
import { Link } from "react-router-dom";
import SideBarAdmin from "../../components/SideBarAdmin";

// ✅ Confirm Dialog Component
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  type = "warning",
}) => {
  if (!isOpen) return null;

  const getButtonStyle = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white";
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertCircle
            className={`w-6 h-6 mr-3 ${
              type === "danger"
                ? "text-red-600"
                : type === "warning"
                ? "text-yellow-600"
                : "text-blue-600"
            }`}
          />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            {cancelText || "Hủy"}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg ${getButtonStyle()}`}
          >
            {confirmText || "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Product Management (Admin)
export default function ProductManagement() {
  const {
    products,
    loadProducts,
    prodLoading,
    handleDeleteProduct: deleteProductAPI,
    categories,
    loadCategories, // ✅ lấy categories từ context
  } = useContext(TechContext);

  const { showSuccess, showError } = useNotification();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });

  // 🔹 Load data khi mở trang
  useEffect(() => {
    loadProducts();
    loadCategories(); // ✅ load danh mục từ API
  }, [loadProducts, loadCategories]);

  // 🔍 Lọc sản phẩm theo danh mục và từ khóa
  const filteredProducts = useMemo(() => {
    let filtered = Array.isArray(products) ? [...products] : [];
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.categoryName === selectedCategory);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [products, selectedCategory, searchTerm]);

  // 💰 Lấy giá hiển thị (min - max theo variants)
  const getProductPrice = (product) => {
    const variants = product.variants || [];
    if (variants.length === 0)
      return `${Number(product.origin_price).toLocaleString("vi-VN")} ₫`;
    const prices = variants.map((v) => Number(v.price) || 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max
      ? `${min.toLocaleString("vi-VN")} ₫`
      : `${min.toLocaleString("vi-VN")} - ${max.toLocaleString("vi-VN")} ₫`;
  };

  // 📦 Tổng tồn kho
  const getTotalStock = (product) => {
    const variants = product.variants || [];
    if (variants.length > 0)
      return variants.reduce((sum, v) => sum + (v.quantity || 0), 0);
    return product.quantity || 0;
  };

  // ✅ Danh mục hiển thị (từ API)
  const categoryList = useMemo(() => {
    return [{ id: "All", name: "Tất cả" }, ...(categories || [])];
  }, [categories]);

  // 🗑️ Xóa sản phẩm thật qua API
  const handleDeleteProduct = (product) => {
    setConfirmDialog({
      isOpen: true,
      title: "Xác nhận xóa sản phẩm",
      message: `Bạn có chắc chắn muốn xóa "${product.name}"?`,
      confirmText: "Xóa",
      cancelText: "Hủy",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteProductAPI(product.id);
          showSuccess(`✅ Đã xóa "${product.name}" thành công!`);
          await loadProducts();
        } catch (err) {
          console.error("❌ Lỗi khi xóa sản phẩm:", err);
          showError("Không thể xóa sản phẩm!");
        } finally {
          setConfirmDialog({ isOpen: false });
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideBarAdmin />
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <PackageIcon className="w-7 h-7 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản lý sản phẩm
              </h1>
              <p className="text-sm text-gray-500">Kho sản phẩm hiện có</p>
            </div>
          </div>
          <Link to="/admin/addProduct">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
              <FaPlus /> Thêm sản phẩm
            </button>
          </Link>
        </div>

        {/* Filter + Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute top-3 left-3 text-gray-400" />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categoryList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    setSelectedCategory(cat.name === "Tất cả" ? "All" : cat.name)
                  }
                  className={`px-4 py-2 rounded-full border ${
                    selectedCategory === cat.name ||
                    (selectedCategory === "All" && cat.name === "Tất cả")
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {prodLoading ? (
          <div className="text-center py-12">
            <Loader2
              className="animate-spin text-blue-500 mx-auto mb-4"
              size={48}
            />
            <p className="text-gray-500">Đang tải sản phẩm...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow hover:shadow-lg border flex flex-col overflow-hidden"
              >
                <img
                  src={
                    product.images?.[0] ||
                    product.variants?.[0]?.imageUrl ||
                    "/placeholder-product.jpg"
                  }
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-1">
                    {product.description || "Không có mô tả."}
                  </p>

                  <div className="flex justify-between items-center mb-3">
                    <div className="text-lg font-bold text-blue-600">
                      {getProductPrice(product)}
                    </div>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        getTotalStock(product) > 0
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      Stock: {getTotalStock(product)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-400 mb-4">
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      {product.categoryName || "Chưa phân loại"}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      {product.brandName || "No Brand"}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Link
                      to={`/admin/editProduct?id=${product.id}`}
                      className="flex-1"
                    >
                      <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700">
                        <Edit size={16} /> Sửa
                      </button>
                    </Link>
                    <button
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                      onClick={() => handleDeleteProduct(product)}
                    >
                      <Trash2 size={16} /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <PackageIcon className="mx-auto mb-4 text-gray-400" size={64} />
            Không có sản phẩm nào
          </div>
        )}

        {/* Confirm Dialog */}
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          type={confirmDialog.type}
        />
      </div>
    </div>
  );
}
