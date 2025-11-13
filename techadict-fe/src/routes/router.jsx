import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import TechProvider, { TechContext } from "../context/TechContext";
import { NotificationProvider } from "../context/NotificationContext";
import ScrollToTop from "../components/ScrollToTop";

import Layout from "../pages/Layout";
import Home from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import DetailProduct from "../pages/DetailProduct";
import AboutPage from "../pages/AboutPage";
import PrivacyPolicy from "../pages/PrivacyPolicy";

import AuthRoute from "./AuthRoute";
import AdminRoute from "./AdminRoute";

import Auth from "../pages/Auth/Auth";
import UserProfile from "../pages/user/UserProfile";
import ShopCartDetail from "../pages/user/ShopCartDetail";
import Payment from "../pages/user/Payment";
import QRPayment from "../pages/user/QRPayment";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import UserManagement from "../pages/Admin/UserManagement";
import ProductManagement from "../pages/Admin/ProductManagement";
import EditProduct from "../pages/Admin/EditProduct";
import AddNewProduct from "../pages/Admin/AddNewProduct";
import OrderManagement from "../pages/Admin/OrderManagement";
import Statistic from "../pages/Admin/Statistic";

import NotFound from "../pages/NotFound";
import Forbidden from "../pages/Forbidden";
import CategoryManagement from "../pages/Admin/CategoryManagement";
import BrandManagement from "../pages/Admin/BrandManagement";

// ✅ Redirect động sau khi login
const HomeRedirect = () => {
  const { user, authChecked, isAuthenticated } = useContext(TechContext);
  if (!authChecked) return null;

  // ✅ Nếu chưa đăng nhập → về trang login
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // ✅ Nếu là admin → dashboard
  if (user?.roles?.some((r) => r.name === "ADMIN" || r === "ADMIN")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // ✅ Còn lại → trang Home người dùng
  return <Navigate to="/home" replace />;
};


// ==============================
// 🧭 ROUTER CHÍNH
// ==============================
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <NotificationProvider>
        <TechProvider>
          <ScrollToTop />
          <Outlet />
        </TechProvider>
      </NotificationProvider>
    ),
    children: [
      // ========================== PUBLIC ROUTES ==========================
      {
        element: <Layout />,
        children: [
          { index: true, element: <HomeRedirect /> },
          { path: "home", element: <Home /> },
          { path: "about", element: <AboutPage /> },
          { path: "privacy", element: <PrivacyPolicy /> },
          { path: "products", element: <ProductPage /> },
          { path: "products/:id", element: <DetailProduct /> },
          { path: "*", element: <NotFound /> },
        ],
      },

      // ========================== AUTH ROUTE ==========================
      {
        path: "auth",
        element: (
          <AuthRoute>
            <Auth />
          </AuthRoute>
        ),
      },

      // ========================== USER ROUTES ==========================
      { path: "profile", element: <UserProfile /> },
      { path: "cart", element: <ShopCartDetail /> },
      { path: "payment", element: <Payment /> },
      { path: "payment/bank", element: <QRPayment /> },

      // ========================== ADMIN ROUTES ==========================
      {
        path: "admin",
        element: <AdminRoute />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "users", element: <UserManagement /> },
          { path: "products", element: <ProductManagement /> },
          { path: "categories", element: <CategoryManagement /> },
          { path: "brands", element: <BrandManagement /> },
          { path: "editProduct", element: <EditProduct /> },
          { path: "addProduct", element: <AddNewProduct /> },
          { path: "orders", element: <OrderManagement /> },
          { path: "*", element: <NotFound /> },
        ],
      },

      // ========================== ERRORS ==========================
      { path: "403", element: <Forbidden /> },
    ],
  },
]);

export default router;
