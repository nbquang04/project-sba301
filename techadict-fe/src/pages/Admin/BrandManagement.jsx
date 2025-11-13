import { useEffect, useState, useContext } from "react";
import { Loader2, Edit, Trash2, Plus } from "lucide-react";
import SideBarAdmin from "../../components/SideBarAdmin";
import { TechContext } from "../../context/TechContext";
import { useNotification } from "../../context/NotificationContext.jsx";

export default function BrandManagement() {
  const {
    brands,
    brandLoading,
    loadBrands,
    handleCreateBrand,
    handleUpdateBrand,
    handleDeleteBrand,
  } = useContext(TechContext);

  const { showSuccess, showError } = useNotification();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    logoUrl: "",
  });

  // 🔹 Load brand khi component mount
  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  // ✅ Reset form
  const resetForm = () => {
    setFormData({ name: "", country: "", logoUrl: "" });
    setIsEditing(false);
    setEditingId(null);
  };

  // ✅ Xử lý nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Gửi form thêm / sửa
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await handleUpdateBrand(editingId, formData);
        showSuccess("📝 Đã cập nhật thương hiệu!");
      } else {
        await handleCreateBrand(formData);
        showSuccess("✅ Đã thêm thương hiệu mới!");
      }
      resetForm();
    } catch (err) {
      showError("❌ Lỗi khi lưu thương hiệu!");
    }
  };

  // ✅ Chỉnh sửa thương hiệu
  const handleEdit = (brand) => {
    setFormData({
      name: brand.name,
      country: brand.country,
      logoUrl: brand.logoUrl,
    });
    setIsEditing(true);
    setEditingId(brand.id);
  };

  // ✅ Xóa thương hiệu
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa thương hiệu này?")) return;
    try {
      await handleDeleteBrand(id);
      showSuccess("🗑️ Đã xóa thương hiệu!");
    } catch {
      showError("❌ Không thể xóa thương hiệu!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBarAdmin />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Quản lý thương hiệu</h1>

        {/* 🔹 Form thêm / sửa */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-medium">Tên thương hiệu *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Quốc gia</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Logo (URL)</label>
              <input
                type="text"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
            )}
            <button
              type="submit"
              disabled={brandLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              {brandLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : isEditing ? (
                <>
                  <Edit size={16} /> Cập nhật
                </>
              ) : (
                <>
                  <Plus size={16} /> Thêm mới
                </>
              )}
            </button>
          </div>
        </form>

        {/* 🔹 Danh sách thương hiệu */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Danh sách thương hiệu</h2>

          {brandLoading ? (
            <div className="text-center py-6 text-gray-500 flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" /> Đang tải dữ liệu...
            </div>
          ) : brands.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Chưa có thương hiệu nào.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">Logo</th>
                    <th className="px-4 py-2 border text-left">Tên</th>
                    <th className="px-4 py-2 border text-left">Quốc gia</th>
                    <th className="px-4 py-2 border text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border text-center">
                        {b.logoUrl ? (
                          <img
                            src={b.logoUrl}
                            alt={b.name}
                            className="w-12 h-12 object-contain mx-auto"
                          />
                        ) : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-2 border">{b.name}</td>
                      <td className="px-4 py-2 border">{b.country || "-"}</td>
                      <td className="px-4 py-2 border text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEdit(b)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <Edit size={14} /> Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
