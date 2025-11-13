import { useState, useEffect, useContext } from "react";
import SideBarAdmin from "../../components/SideBarAdmin";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TechContext } from "../../context/TechContext";
import { Loader2, AlertCircle, Save, X, Plus, Trash2 } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";

export default function EditProduct() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    getProductDetail,
    handleUpdateProduct,
    loadCategories,
    loadBrands,
    categories,
    brands,
  } = useContext(TechContext);
  const { showSuccess, showError, showInfo } = useNotification();

  const productId = searchParams.get("id");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);
  const [variants, setVariants] = useState([]);

  // 🧠 Load dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadCategories();
        await loadBrands();

        if (productId) {
          const data = await getProductDetail(productId);
          if (!data) throw new Error("Không tìm thấy sản phẩm");

          setFormData({
            id: data.id,
            name: data.name,
            description: data.description,
            origin_price: data.origin_price,
            featured: data.featured || false,
            categoryId: data.categoryId || "",
            brandId: data.brandId || "",
            images: data.images || [],
          });

          setVariants(data.variants || []);
        } else {
          throw new Error("Thiếu ID sản phẩm");
        }
      } catch (err) {
        showError(err.message || "Không thể tải sản phẩm");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId, loadCategories, loadBrands, getProductDetail, navigate, showError]);

  // 🔹 Cập nhật dữ liệu input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🔹 Xử lý ảnh (link online)
  const handleImageChange = (idx, value) => {
    const updated = [...formData.images];
    updated[idx] = value;
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (idx) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  // 🔹 Biến thể
  const handleVariantChange = (i, field, value) => {
    setVariants((prev) => prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v)));
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { name: "", color: "", storage: "", price: 0, quantity: 0, imageUrl: "" },
    ]);
  };

  const removeVariant = (i) => setVariants((prev) => prev.filter((_, idx) => idx !== i));

  // ✅ Submit thật về backend
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        origin_price: Number(formData.origin_price),
        featured: formData.featured,
        categoryId: formData.categoryId,
        brandId: formData.brandId,
        images: formData.images.filter((i) => i.trim() !== ""),
        variants: variants.map((v) => ({
          name: v.name,
          color: v.color,
          storage: v.storage,
          price: Number(v.price),
          quantity: Number(v.quantity),
          imageUrl: v.imageUrl,
        })),
      };

      await handleUpdateProduct(formData.id, payload);
      showSuccess("✅ Cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
      showError("Không thể cập nhật sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <SideBarAdmin />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideBarAdmin />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Chỉnh sửa sản phẩm</h2>
            <button
              onClick={() => navigate("/admin/products")}
              className="text-gray-600 hover:text-gray-800"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-6">
            {/* Thông tin cơ bản */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên sản phẩm *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Mô tả *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Danh mục *</label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Thương hiệu *</label>
                    <select
                      name="brandId"
                      value={formData.brandId}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">-- Chọn thương hiệu --</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  <label className="font-medium">Sản phẩm nổi bật</label>
                </div>
              </div>

              {/* Ảnh sản phẩm */}
              <div>
                <label className="block text-sm font-medium mb-1">Ảnh sản phẩm *</label>
                {formData.images.map((link, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => handleImageChange(idx, e.target.value)}
                      placeholder="Dán link ảnh..."
                      className="flex-1 border rounded px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageField(idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-800"
                >
                  <Plus size={14} /> Thêm ảnh
                </button>
              </div>
            </div>

            {/* Biến thể */}
            <div className="border-t pt-4">
              <div className="flex justify-between mb-3">
                <h3 className="text-lg font-semibold">Danh sách biến thể</h3>
                <button
                  type="button"
                  onClick={addVariant}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                >
                  <Plus size={16} /> Thêm biến thể
                </button>
              </div>

              {variants.length === 0 ? (
                <p className="text-gray-500 border-2 border-dashed py-6 text-center rounded-lg">
                  Chưa có biến thể nào
                </p>
              ) : (
                <div className="space-y-3">
                  {variants.map((v, i) => (
                    <div key={i} className="border p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        value={v.name}
                        onChange={(e) => handleVariantChange(i, "name", e.target.value)}
                        placeholder="Tên biến thể"
                        className="border rounded px-2 py-1"
                      />
                      <input
                        value={v.color}
                        onChange={(e) => handleVariantChange(i, "color", e.target.value)}
                        placeholder="Màu sắc"
                        className="border rounded px-2 py-1"
                      />
                      <input
                        value={v.storage}
                        onChange={(e) => handleVariantChange(i, "storage", e.target.value)}
                        placeholder="Dung lượng"
                        className="border rounded px-2 py-1"
                      />
                      <input
                        type="number"
                        value={v.price}
                        onChange={(e) => handleVariantChange(i, "price", e.target.value)}
                        placeholder="Giá bán"
                        className="border rounded px-2 py-1"
                      />
                      <input
                        type="number"
                        value={v.quantity}
                        onChange={(e) => handleVariantChange(i, "quantity", e.target.value)}
                        placeholder="Tồn kho"
                        className="border rounded px-2 py-1"
                      />
                      <input
                        value={v.imageUrl}
                        onChange={(e) => handleVariantChange(i, "imageUrl", e.target.value)}
                        placeholder="Link ảnh biến thể"
                        className="border rounded px-2 py-1"
                      />
                      <div className="col-span-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeVariant(i)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Xóa biến thể
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Nút lưu */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={16} />}
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
