import api from "./index";

// ============================
// 🔐 AUTH SERVICE
// ============================

// ✅ Đăng nhập
export const login = async (email, password) => {
  try {
    const res = await api.post("/auth/token", { email, password });
    const result = res.data?.result;

    if (result?.token) {
      localStorage.setItem("accessToken", result.token);
      localStorage.setItem("email", email);
    }

    return result; // { token, authenticated }
  } catch (err) {
    console.error("❌ Login failed:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Đăng ký (chuẩn UserRequest.java)
export const register = async (data) => {
  try {
    // Tách họ & tên
    const nameParts = data.fullName?.trim().split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const payload = {
      firstName,
      lastName,
      email: data.email,
      password: data.password,
      phone: data.phone || null,
      // roles không gửi => backend tự gán ROLE_USER
    };

    const res = await api.post("/auth/register", payload);
    return res.data?.result; // { authenticated }
  } catch (err) {
    console.error("❌ Register failed:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Kiểm tra token hợp lệ
export const introspectToken = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return { valid: false };

  try {
    const res = await api.post("/auth/introspect", { token });
    return res.data?.result; // { valid: true/false }
  } catch (err) {
    console.error("❌ Introspect failed:", err.response?.data || err.message);
    return { valid: false };
  }
};

// ✅ Đăng xuất
export const logout = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    localStorage.removeItem("email");
    return { success: true, message: "No token, already logged out" };
  }

  try {
    await api.post("/auth/logout", { token });
    return { success: true };
  } catch (err) {
    console.warn("⚠️ Logout API failed:", err.response?.data || err.message);
    return { success: false, message: "API logout failed" };
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("email");
  }
};

// ✅ Lấy token hiện tại
export const getToken = () => localStorage.getItem("accessToken");
