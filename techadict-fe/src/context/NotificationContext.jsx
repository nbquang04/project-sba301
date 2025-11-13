import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/Notification';

// ========================================
// 📢 Context khởi tạo
// ========================================
const NotificationContext = createContext();

// Hook tiện lợi để gọi ở mọi nơi
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// ========================================
// 📦 Provider bao quanh toàn app
// ========================================
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Hiển thị một thông báo bất kỳ
  const showNotification = useCallback((message, type = 'info', duration = 4000) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newNotification = { id, message, type, duration };
    setNotifications((prev) => [...prev, newNotification]);

    // Tự động gỡ bỏ sau thời gian hiển thị
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration + 500);

    return id;
  }, []);

  // Xóa thông báo thủ công (khi bấm nút đóng)
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Các shortcut method tiện dụng
  const showSuccess = useCallback((msg, dur) => showNotification(msg, 'success', dur), [showNotification]);
  const showError = useCallback((msg, dur) => showNotification(msg, 'error', dur), [showNotification]);
  const showWarning = useCallback((msg, dur) => showNotification(msg, 'warning', dur), [showNotification]);
  const showInfo = useCallback((msg, dur) => showNotification(msg, 'info', dur), [showNotification]);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeNotification,
      }}
    >
      {children}

      {/* Khu vực hiển thị thông báo */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col space-y-3 pointer-events-none">
        {notifications.map((n, index) => (
          <div
            key={n.id}
            className="pointer-events-auto transition-transform duration-300"
            style={{
              transform: `translateY(${index * 4}px)`,
              zIndex: 1000 - index,
            }}
          >
            <Notification
              message={n.message}
              type={n.type}
              duration={n.duration}
              onClose={() => removeNotification(n.id)}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
