import api from "./index";

// ============================
// 👤 USER SERVICE 
// ============================

// 1. Lấy tất cả user
export const getAllUsers = async () => {
  try {
    const res = await api.get("/users");
    return res.data?.result || [];
  } catch (err) {
    console.error("❌ [getAllUsers] failed:", err.response?.data || err.message);
    throw err;
  }
};

// 2. Lấy user theo ID
export const getUserById = async (id) => {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data?.result;
  } catch (err) {
    console.error(`❌ [getUserById(${id})] failed:`, err.response?.data || err.message);
    throw err;
  }
};

// 3. Lấy user hiện tại
export const getMyInfo = async () => {
  try {
    const res = await api.get("/users/me");
    return res.data?.result;
  } catch (err) {
    console.error("❌ [getMyInfo] failed:", err.response?.data || err.message);
    throw err;
  }
};

// 4. Tạo user mới
export const createUser = async (data) => {
  try {
    const payload = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email,
      password: data.password,
      phone: data.phone || "",
      roles: data.roles || [],
    };

    const res = await api.post("/users", payload);
    return res.data?.result;
  } catch (err) {
    console.error("❌ [createUser] failed:", err.response?.data || err.message);
    throw err;
  }
};

// ❗ GIỮ NGUYÊN updateUser — KHÔNG ĐỤNG VÀO
export const updateUser = async (id, data) => {
  try {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      phone: data.phone,
      roles: data.roles || [],
    };

    const res = await api.put(`/users/${id}`, payload);
    return res.data?.result;
  } catch (err) {
    console.error(`❌ [updateUser(${id})] failed:`, err.response?.data || err.message);
    throw err;
  }
};

// ================================
// 🔥 SERVICE MỚI 1: Update Profile
// ================================
export const updateUserProfile = async (id, data) => {
  try {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      roles: data.roles || [],
    };

    const res = await api.put(`/users/${id}`, payload);
    return res.data?.result;
  } catch (err) {
    console.error(`❌ [updateUserProfile(${id})] failed:`, err.response?.data || err.message);
    throw err;
  }
};

// =================================
// 🔥 SERVICE MỚI 2: Change Password
// =================================
export const changeUserPassword = async (id, data) => {
  try {
    const payload = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };

    const res = await api.put(`/users/${id}/password`, payload);
    return res.data?.result;
  } catch (err) {
    console.error(`❌ [changeUserPassword(${id})] failed:`, err.response?.data || err.message);
    throw err;
  }
};

// 6. Delete user
export const deleteUser = async (id) => {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data?.result;
  } catch (err) {
    console.error(`❌ [deleteUser(${id})] failed:`, err.response?.data || err.message);
    throw err;
  }
};
