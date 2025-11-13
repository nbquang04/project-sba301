import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Loader2, Pencil, Trash2, Plus, X } from "lucide-react";
import SideBarAdmin from "../../components/SideBarAdmin";
import { TechContext } from "../../context/TechContext";
import { useNotification } from "../../context/NotificationContext.jsx";

// ✅ Schema xác thực
const categorySchema = yup.object({
  name: yup.string().required("Nhập tên danh mục"),
  description: yup.string().required("Nhập mô tả danh mục"),
  image: yup.string().url("Link ảnh không hợp lệ").required("Nhập link ảnh"),
});

export default function CategoryManagement() {
  const {
    categories,
    catLoading,
    loadCategories,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  } = useContext(TechContext);
  const { showSuccess, showError } = useNotification();

  const [editing, setEditing] = useState(null); // ID đang chỉnh sửa
  const [loadingAction, setLoadingAction] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
    },
  });

  // ✅ Load dữ liệu khi vào trang
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // ✅ Submit form (thêm mới / cập nhật)
  const onSubmit = async (data) => {
    setLoadingAction(true);
    try {
      if (editing) {
        await handleUpdateCategory(editing, data);
        showSuccess("📝 Cập nhật danh mục thành công!");
      } else {
        await handleCreateCategory(data);
        showSuccess("✅ Thêm danh mục thành công!");
      }
      reset();
      setEditing(null);
    } catch (err) {
      console.error("❌ Lỗi khi lưu danh mục:", err);
      showError("Không thể lưu danh mục!");
    } finally {
      setLoadingAction(false);
    }
  };

  // ✅ Sửa danh mục
  const handleEdit = (category) => {
    setEditing(category.id);
    reset({
      name: category.name,
      description: category.description,
      image: category.image,
    });
  };

  // ✅ Xóa danh mục
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await handleDeleteCategory(id);
      showSuccess("🗑️ Xóa danh mục thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi xóa danh mục:", err);
      showError("Không thể xóa danh mục!");
    }
  };

  // ✅ Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditing(null);
    reset();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBarAdmin />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
        </div>

        {/* 🔹 Form thêm / sửa danh mục */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow rounded-lg p-6 mb-8 space-y-4"
        >
          <h2 className="text-lg font-semibold mb-2">
            {editing ? "✏️ Cập nhật danh mục" : "➕ Thêm danh mục mới"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">Tên danh mục *</label>
              <input
                {...register("name")}
                placeholder="Nhập tên danh mục..."
                className="w-full border rounded px-3 py-2"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Link ảnh *</label>
              <input
                {...register("image")}
                placeholder="Dán link ảnh danh mục..."
                className="w-full border rounded px-3 py-2"
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.image.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Mô tả *</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full border rounded px-3 py-2"
              placeholder="Nhập mô tả danh mục..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            {editing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                <X size={16} /> Hủy
              </button>
            )}
            <button
              type="submit"
              disabled={loadingAction}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {loadingAction ? (
                <Loader2 className="animate-spin" size={18} />
              ) : editing ? (
                "Cập nhật"
              ) : (
                "Thêm mới"
              )}
            </button>
          </div>
        </form>

        {/* 🔹 Bảng danh mục */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Danh sách danh mục</h2>

          {catLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin text-gray-500" size={24} />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-gray-500">Chưa có danh mục nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3 text-left border">Hình ảnh</th>
                    <th className="p-3 text-left border">Tên danh mục</th>
                    <th className="p-3 text-left border">Mô tả</th>
                    <th className="p-3 text-center border w-32">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3 border">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </td>
                      <td className="p-3 border font-medium">{cat.name}</td>
                      <td className="p-3 border text-gray-600">
                        {cat.description}
                      </td>
                      <td className="p-3 border text-center space-x-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="inline-flex items-center text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
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
