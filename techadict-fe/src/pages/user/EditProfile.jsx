import { useContext, useEffect, useState } from "react";
import { TechContext } from "../../context/TechContext.jsx";
import { useNotification } from "../../context/NotificationContext.jsx";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// ==========================
// Yup validation schema
// ==========================
const NAME_REGEX = /^[\p{L}][\p{L}\s'.-]{0,48}[\p{L}]$/u;

const profileSchema = yup.object({
  name: yup
    .string()
    .trim()
    .matches(NAME_REGEX, "Tên chỉ gồm chữ và khoảng trắng (2–50 ký tự)")
    .min(2, "Tên tối thiểu 2 ký tự")
    .max(50, "Tên tối đa 50 ký tự")
    .required("Vui lòng nhập họ và tên"),
  phone: yup
    .string()
    .matches(/^(\+?\d{9,15})$/, "Số điện thoại không hợp lệ")
    .required("Vui lòng nhập số điện thoại"),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Nhập mật khẩu hiện tại"),
  newPassword: yup
    .string()
    .min(6, "Mật khẩu mới ít nhất 6 ký tự")
    .required("Nhập mật khẩu mới")
    .notOneOf([yup.ref("currentPassword")], "Mật khẩu mới phải khác mật khẩu hiện tại"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Xác nhận mật khẩu không khớp")
    .required("Xác nhận mật khẩu mới"),
});

export default function EditProfile({ formData, setFormData }) {
  const { user, handleUpdateUser } = useContext(TechContext);
  const { showError, showSuccess } = useNotification();

  const [activeTab, setActiveTab] = useState("profile");
  const [show, setShow] = useState({ current: false, new: false, confirm: false });

  // ==========================
  // Form HỒ SƠ
  // ==========================
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: submittingProfile },
  } = useForm({
    resolver: yupResolver(profileSchema),
    mode: "onTouched",
    defaultValues: {
      name:
        formData?.name ||
        (user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : ""),
      email: user?.email || "",
      phone: formData?.phone || user?.phone || "",
    },
  });

  // ==========================
  // Form PASSWORD
  // ==========================
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: submittingPassword },
  } = useForm({
    resolver: yupResolver(passwordSchema),
    mode: "onTouched",
  });

  // ==========================
  // Đồng bộ dữ liệu vào form
  // ==========================
  useEffect(() => {
    const fullName =
      formData?.name ||
      (user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "");

    resetProfile({
      name: fullName,
      email: user?.email || "",
      phone: formData?.phone || user?.phone || "",
    });
  }, [user, formData, resetProfile]);

  // ==========================
  // Submit Hồ sơ
  // ==========================
  const onSubmitProfile = async (data) => {
    try {
      if (!user) return showError("Không tìm thấy người dùng!");

      const nameParts = data.name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      const payload = {
        id: user.id,
        firstName,
        lastName,
        phone: data.phone,
        roles: user.roles,
      };

      await handleUpdateUser(payload);

      setFormData &&
        setFormData({
          ...formData,
          name: data.name,
          phone: data.phone,
        });

      showSuccess("✅ Hồ sơ đã được cập nhật!");
    } catch (err) {
      console.error("Error updating profile:", err);
      showError("❌ Có lỗi khi cập nhật hồ sơ!");
    }
  };

  // ==========================
  // Submit Đổi mật khẩu
  // ==========================
  const onSubmitPassword = async (data) => {
    try {
      if (!user) return showError("Không tìm thấy người dùng!");

      const payload = {
        id: user.id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      };

      await handleUpdateUser(payload);

      showSuccess("✅ Mật khẩu đã được thay đổi!");
      resetPassword();
    } catch (err) {
      console.error("Error updating password:", err);
      showError("❌ Có lỗi khi đổi mật khẩu!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Chỉnh sửa hồ sơ</h2>
      <div className="flex gap-8">
        
        {/* ================= TAB MENU ================= */}
        <div className="w-48 border-r pr-4">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-4 py-2 mb-2 rounded-lg ${
              activeTab === "profile"
                ? "bg-red-100 text-red-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            Hồ sơ
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("password")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activeTab === "password"
                ? "bg-red-100 text-red-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            Đổi mật khẩu
          </button>
        </div>

        {/* ================= FORM HỒ SƠ ================= */}
        {activeTab === "profile" && (
          <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Họ và tên */}
              <div>
                <label className="block text-sm font-medium mb-2">Họ và tên *</label>
                <input
                  type="text"
                  {...registerProfile("name")}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                {profileErrors.name && (
                  <p className="text-sm text-red-600 mt-1">{profileErrors.name.message}</p>
                )}
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-100"
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-medium mb-2">Số điện thoại *</label>
                <input
                  type="tel"
                  {...registerProfile("phone")}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
                {profileErrors.phone && (
                  <p className="text-sm text-red-600 mt-1">{profileErrors.phone.message}</p>
                )}
              </div>

            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submittingProfile}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
              >
                {submittingProfile ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        )}

        {/* ================= FORM ĐỔI MẬT KHẨU ================= */}
        {activeTab === "password" && (
          <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {[ 
                { key: "currentPassword", label: "Mật khẩu hiện tại", show: "current" },
                { key: "newPassword", label: "Mật khẩu mới", show: "new" },
                { key: "confirmPassword", label: "Xác nhận mật khẩu mới", show: "confirm" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium mb-2">{f.label}</label>
                  <div className="relative">
                    <input
                      type={show[f.show] ? "text" : "password"}
                      {...registerPassword(f.key)}
                      className="w-full px-3 py-2 border rounded-lg text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShow((p) => ({ ...p, [f.show]: !p[f.show] }))}
                      className="absolute inset-y-0 right-2 flex items-center"
                    >
                      <i className={`ri-${show[f.show] ? "eye-off" : "eye"}-line text-gray-500`} />
                    </button>
                  </div>
                  {passwordErrors[f.key] && (
                    <p className="text-sm text-red-600 mt-1">{passwordErrors[f.key].message}</p>
                  )}
                </div>
              ))}

            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submittingPassword}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60"
              >
                {submittingPassword ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
