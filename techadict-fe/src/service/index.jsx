import axios from "axios";

const instance = axios.create({
  baseURL:
    (typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.VITE_API_BASE) ||
    "http://localhost:8080/techadict",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ============================
// 📨 Request interceptor
// ============================
instance.interceptors.request.use(
  (config) => {
    // 🔐 Gắn Authorization header nếu có token
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================
// 🚨 Response interceptor
// ============================
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      console.warn("❌ Token expired or invalid — redirecting to /auth");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/auth";
    } else if (!response) {
      console.error("⚠️ Network error or server not reachable");
    } else if (response.data?.message) {
      console.error("🚨 API Error:", response.data.message);
    }

    return Promise.reject(error);
  }
);

export default instance;
