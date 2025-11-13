import React, { useState, useEffect } from "react";
import {
  Trash2, RotateCcw, UserCheck, UserX,
  ArrowUpDown, ArrowUp, ArrowDown, AlertCircle, Shield
} from "lucide-react";
import SideBarAdmin from "../../components/SideBarAdmin";
import {
  getAllUsers,
  deleteUser,
  updateUser,
} from "../../service/users";

// =================== Helpers ===================
const getRoleBadge = (role) => {
  const r = role?.toLowerCase();
  switch (r) {
    case "admin": return "bg-red-100 text-red-600";
    case "user": return "bg-green-100 text-green-600";
    default: return "bg-gray-100 text-gray-600";
  }
};

const getStatusBadge = (status, role) => {
  if (role === "admin") return "bg-purple-100 text-purple-600";
  switch (status) {
    case "Active": return "bg-green-100 text-green-600";
    case "Disabled": return "bg-yellow-100 text-yellow-600";
    default: return "bg-gray-100 text-gray-600";
  }
};

// =================== Confirm Dialog ===================
const ConfirmDialog = ({
  isOpen, onClose, onConfirm, title, message,
  confirmText, cancelText, type = "warning",
}) => {
  if (!isOpen) return null;
  const color =
    type === "danger" ? "text-red-600" :
    type === "success" ? "text-green-600" :
    type === "warning" ? "text-yellow-600" : "text-blue-600";

  const btn =
    type === "danger" ? "bg-red-600 hover:bg-red-700 text-white" :
    type === "success" ? "bg-green-600 hover:bg-green-700 text-white" :
    type === "warning" ? "bg-yellow-600 hover:bg-yellow-700 text-white" :
    "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertCircle className={`w-6 h-6 mr-3 ${color}`} />
          <h3 className="text-lg font-semibold">{title}</h3>
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
            className={`px-4 py-2 rounded-lg ${btn}`}
          >
            {confirmText || "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
};

// =================== Main Component ===================
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false, title: "", message: "", confirmText: "", cancelText: "",
    type: "warning", onConfirm: null
  });
  const [loading, setLoading] = useState(false);

  // =================== Load Users ===================
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      const formatted = (data || []).map((u) => ({
        id: u.id,
        name: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
        email: u.email,
        phone: u.phone ?? "-",
        role: Array.isArray(u.roles)
          ? (u.roles[0]?.name || u.roles[0] || "user").toLowerCase()
          : "user",
        status: u.status ?? "Active",
        created_at: u.createdAt ?? u.created_at ?? "",
      }));
      setUsers(formatted);
      setFilteredUsers(formatted);
    } catch (err) {
      console.error("❌ Lỗi khi load users:", err);
      setMessage({ type: "error", text: "Không thể tải danh sách người dùng!" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // =================== Search ===================
  const handleSearch = (val) => {
    setSearch(val);
    const term = val.toLowerCase();
    if (!term) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (u) =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.phone.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    }
  };

  // =================== Sort ===================
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });

    const sorted = [...filteredUsers].sort((a, b) => {
      const aVal = String(a[key] ?? "").toLowerCase();
      const bVal = String(b[key] ?? "").toLowerCase();
      if (direction === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });
    setFilteredUsers(sorted);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={16} />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp size={16} />
    ) : (
      <ArrowDown size={16} />
    );
  };

  // =================== Actions ===================
  const handleDeleteUser = (user) => {
    if (user.role === "admin") {
      setMessage({ type: "error", text: "Không thể xóa tài khoản admin!" });
      return;
    }
    setConfirmDialog({
      isOpen: true,
      title: "Xác nhận xóa người dùng",
      message: `Bạn có chắc muốn xóa "${user.name}"?`,
      confirmText: "Xóa",
      cancelText: "Hủy",
      type: "danger",
      onConfirm: async () => {
        try {
          await deleteUser(user.id);
          setMessage({ type: "success", text: "Đã xóa người dùng!" });
          await loadUsers();
        } catch (err) {
          console.error("❌ Lỗi khi xóa user:", err);
          setMessage({ type: "error", text: "Không thể xóa người dùng!" });
        } finally {
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        }
      },
    });
  };

  const handleStatusChange = (user, newStatus) => {
    setConfirmDialog({
      isOpen: true,
      title: "Cập nhật trạng thái",
      message: `Xác nhận đổi trạng thái "${newStatus}" cho ${user.name}?`,
      confirmText: "Xác nhận",
      cancelText: "Hủy",
      type: "warning",
      onConfirm: async () => {
        try {
          await updateUser(user.id, { ...user, status: newStatus });
          setMessage({
            type: "success",
            text: `Đã cập nhật trạng thái người dùng thành ${newStatus}`,
          });
          await loadUsers();
        } catch (err) {
          console.error("❌ Lỗi khi cập nhật trạng thái:", err);
          setMessage({ type: "error", text: "Không thể cập nhật trạng thái!" });
        } finally {
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        }
      },
    });
  };

  // =================== Render ===================
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideBarAdmin />
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">User Management</h1>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl border ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            <div className="flex items-center">
              <AlertCircle size={20} className="mr-3" />
              <span>{message.text}</span>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, SĐT..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              {search && (
                <p className="text-sm text-gray-500 mt-1">
                  Tìm thấy {filteredUsers.length} kết quả
                </p>
              )}
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 cursor-pointer" onClick={() => handleSort("id")}>
                  <div className="flex items-center gap-2">
                    ID {getSortIcon("id")}
                  </div>
                </th>
                <th className="p-4 cursor-pointer" onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-2">
                    User {getSortIcon("name")}
                  </div>
                </th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Join Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    Không có người dùng nào
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-mono">{u.id}</td>
                    <td className="p-4">
                      <div className="font-medium">{u.name}</div>
                      <div className="text-gray-500 text-sm">{u.email}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${getRoleBadge(
                          u.role
                        )}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(
                          u.status,
                          u.role
                        )}`}
                      >
                        {u.role === "admin" ? "Admin" : u.status}
                      </span>
                    </td>
                    <td className="p-4">{u.phone}</td>
                    <td className="p-4">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-4 flex gap-2">
                      {u.role === "user" && (
                        <>
                          {u.status === "Active" ? (
                            <button
                              onClick={() => handleStatusChange(u, "Disabled")}
                              className="text-yellow-600 hover:text-yellow-800 p-2 rounded hover:bg-yellow-50"
                            >
                              <UserX size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(u, "Active")}
                              className="text-green-600 hover:text-green-800 p-2 rounded hover:bg-green-50"
                            >
                              <UserCheck size={16} />
                            </button>
                          )}
                        </>
                      )}
                      {u.role === "admin" && (
                        <div
                          className="text-purple-600 p-2"
                          title="Admin protected"
                        >
                          <Shield size={16} />
                        </div>
                      )}
                      {u.role !== "admin" && (
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <ConfirmDialog
          {...confirmDialog}
          onClose={() =>
            setConfirmDialog({ ...confirmDialog, isOpen: false })
          }
        />
      </div>
    </div>
  );
};

export default UserManagement;
