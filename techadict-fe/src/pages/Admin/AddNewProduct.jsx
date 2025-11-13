import { useState, useContext, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SideBarAdmin from "../../components/SideBarAdmin";
import { Loader2, X, Plus } from "lucide-react";
import { TechContext } from "../../context/TechContext";
import { createProduct } from "../../service/products";
import { useNotification } from "../../context/NotificationContext.jsx";

// ✅ Validation schema
const productSchema = yup.object({
  name: yup.string().required("Nhập tên sản phẩm"),
  description: yup.string().required("Nhập mô tả"),
  origin_price: yup.number().positive().required("Nhập giá gốc"),
  featured: yup.boolean(),
  categoryId: yup.string().required("Chọn danh mục"),
  brandId: yup.string().required("Chọn thương hiệu"),
  images: yup
    .array()
    .of(yup.string().url("Link ảnh không hợp lệ"))
    .min(1, "Cần ít nhất 1 ảnh sản phẩm"),
  variants: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required("Tên biến thể"),
        color: yup.string().required("Màu sắc"),
        storage: yup.string().required("Dung lượng / phiên bản"),
        price: yup.number().positive().required("Giá bán"),
        quantity: yup.number().min(0).required("Tồn kho"),
        imageUrl: yup
          .string()
          .url("Link ảnh biến thể không hợp lệ")
          .required("Ảnh biến thể"),
      })
    )
    .min(1, "Cần ít nhất 1 biến thể"),
});

export default function AddProduct() {
  const { loadProducts, categories, loadCategories, brands, loadBrands } =
    useContext(TechContext);
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);

  // ✅ Load categories & brands khi mount
  useEffect(() => {
    loadCategories();
    loadBrands();
  }, [loadCategories, loadBrands]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      origin_price: "",
      featured: false,
      categoryId: "",
      brandId: "",
      images: [""],
      variants: [
        {
          name: "",
          color: "",
          storage: "",
          price: 0,
          quantity: 0,
          imageUrl: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });
  const values = watch();

  // ✅ Tính tổng tồn kho từ variants
  const totalQuantity = (values.variants || []).reduce(
    (sum, v) => sum + (Number(v.quantity) || 0),
    0
  );

  useEffect(() => setValue("quantity", totalQuantity), [totalQuantity, setValue]);

  // ✅ Thêm ảnh
  const addImageField = () => setValue("images", [...values.images, ""]);
  const removeImageField = (idx) =>
    setValue("images", values.images.filter((_, i) => i !== idx));

  // ✅ Gửi dữ liệu thật lên backend
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        description: data.description,
        origin_price: data.origin_price,
        quantity: totalQuantity, // ✅ tổng auto
        featured: data.featured,
        categoryId: data.categoryId,
        brandId: data.brandId,
        images: data.images.filter((link) => link.trim() !== ""),
        variants: data.variants,
      };

      const res = await createProduct(payload);
      if (res) {
        showSuccess("✅ Thêm sản phẩm thành công!");
        await loadProducts();
        reset();
      } else {
        showError("❌ Không thể thêm sản phẩm!");
      }
    } catch (err) {
      console.error("❌ Lỗi khi thêm sản phẩm:", err);
      showError("Lỗi khi gửi dữ liệu sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBarAdmin />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Thêm sản phẩm mới</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow rounded-lg p-6 space-y-6"
        >
          {/* 🔹 Thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">Tên sản phẩm *</label>
              <input {...register("name")} className="w-full border rounded px-3 py-2" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block mb-1 font-medium">Giá gốc *</label>
              <input
                type="number"
                {...register("origin_price")}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Tổng số lượng (tự tính)</label>
              <input
                type="number"
                value={totalQuantity}
                readOnly
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Danh mục *</label>
              <select {...register("categoryId")} className="w-full border rounded px-3 py-2">
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Thương hiệu *</label>
              <select {...register("brandId")} className="w-full border rounded px-3 py-2">
                <option value="">-- Chọn thương hiệu --</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" {...register("featured")} />
              <label className="font-medium">Sản phẩm nổi bật</label>
            </div>
          </div>

          {/* 🔹 Mô tả */}
          <div>
            <label className="block mb-1 font-medium">Mô tả *</label>
            <textarea {...register("description")} rows={4} className="w-full border rounded px-3 py-2" />
          </div>

          {/* 🔹 Ảnh sản phẩm */}
          <div>
            <label className="block mb-2 font-medium">Ảnh sản phẩm *</label>
            {values.images.map((link, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  {...register(`images.${idx}`)}
                  placeholder="Dán link ảnh sản phẩm..."
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => removeImageField(idx)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-800"
            >
              <Plus size={14} /> Thêm link ảnh
            </button>
          </div>

          {/* 🔹 Biến thể */}
          <div className="border-t pt-4">
            <div className="flex justify-between mb-3">
              <h3 className="text-lg font-semibold">Biến thể sản phẩm</h3>
              <button
                type="button"
                onClick={() =>
                  append({ name: "", color: "", storage: "", price: 0, quantity: 0, imageUrl: "" })
                }
                className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
              >
                <Plus size={14} /> Thêm biến thể
              </button>
            </div>

            {fields.map((field, idx) => (
              <div key={field.id} className="border rounded p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm">Tên biến thể *</label>
                  <input
                    {...register(`variants.${idx}.name`)}
                    placeholder="VD: 256GB - Silver"
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm">Màu *</label>
                  <input
                    {...register(`variants.${idx}.color`)}
                    placeholder="VD: Silver"
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm">Dung lượng *</label>
                  <input
                    {...register(`variants.${idx}.storage`)}
                    placeholder="VD: 256GB"
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm">Giá bán *</label>
                  <input
                    type="number"
                    {...register(`variants.${idx}.price`)}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm">Tồn kho *</label>
                  <input
                    type="number"
                    {...register(`variants.${idx}.quantity`)}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm">Link ảnh *</label>
                  <input
                    {...register(`variants.${idx}.imageUrl`)}
                    placeholder="Dán link ảnh biến thể..."
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div className="col-span-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <X size={14} /> Xóa biến thể
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 🔹 Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Lưu sản phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
