import React, { useContext, useMemo, useState, useEffect } from 'react';
import SideBarAdmin from '../../components/SideBarAdmin';
import MonthlyRevenueChart from "../../components/Chart";
import { TechContext } from '../../context/TechContext';
import { BarChart3, TrendingUp, Users, ShoppingBag } from 'lucide-react';

const Statistic = () => {
  const { setOrder, setUser } = useContext(TechContext);
  const [timeRange, setTimeRange] = useState('all'); // all, year, month, week

  // ✅ Mock data (thay thế API)
  const mockOrders = [
    {
      id: "ORD-001",
      user_id: "USER-001",
      created_at: "2024-10-15",
      status: "completed",
      total: 3500000,
      items: [
        { product_id: "PROD-1-A", quantity: 2, price: 1500000 },
        { product_id: "PROD-2-B", quantity: 1, price: 500000 }
      ]
    },
    {
      id: "ORD-002",
      user_id: "USER-002",
      created_at: "2024-10-20",
      status: "processing",
      total: 2200000,
      items: [
        { product_id: "PROD-2-B", quantity: 2, price: 1100000 },
      ]
    },
    {
      id: "ORD-003",
      user_id: "USER-003",
      created_at: "2024-11-03",
      status: "pending",
      total: 1800000,
      items: [
        { product_id: "PROD-3-C", quantity: 3, price: 600000 },
      ]
    },
    {
      id: "ORD-004",
      user_id: "USER-002",
      created_at: "2024-11-07",
      status: "completed",
      total: 4200000,
      items: [
        { product_id: "PROD-1-A", quantity: 1, price: 1500000 },
        { product_id: "PROD-4-D", quantity: 2, price: 1350000 },
      ]
    }
  ];

  const mockUsers = [
    { id: "USER-001", name: "Nguyen Van A", created_at: "2024-10-01" },
    { id: "USER-002", name: "Tran Thi B", created_at: "2024-10-10" },
    { id: "USER-003", name: "Le Van C", created_at: "2024-11-01" },
    { id: "USER-004", name: "Pham Thi D", created_at: "2024-11-05" },
  ];

  const mockProducts = [
    { id: "PROD-1", name: "Tai nghe Bluetooth" },
    { id: "PROD-2", name: "Chuột không dây" },
    { id: "PROD-3", name: "Bàn phím cơ" },
    { id: "PROD-4", name: "Loa mini" },
  ];

  useEffect(() => {
    setOrder(mockOrders);
    setUser(mockUsers);
  }, []);

  const orders = mockOrders;
  const usersRaw = mockUsers;
  const productsRoot = mockProducts;

  const stats = useMemo(() => {
    if (!orders?.length) return null;

    const now = new Date();
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      switch (timeRange) {
        case 'week':
          return now - orderDate <= 7 * 24 * 60 * 60 * 1000;
        case 'month':
          return now - orderDate <= 30 * 24 * 60 * 60 * 1000;
        case 'year':
          return orderDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });

    // Tổng doanh thu
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Đơn hàng theo trạng thái
    const ordersByStatus = filteredOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Tính top sản phẩm
    const productSales = {};
    filteredOrders.forEach(order => {
      order.items?.forEach(item => {
        const baseId = item.product_id.split('-')[0];
        productSales[baseId] = (productSales[baseId] || 0) + item.quantity;
      });
    });

    const topProducts = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, quantity]) => {
        const product = productsRoot.find(p => p.id === id);
        return {
          name: product?.name || 'Unknown Product',
          quantity,
          revenue: filteredOrders.reduce((sum, order) => {
            const item = order.items?.find(i => i.product_id.startsWith(id));
            return sum + (item ? item.price * item.quantity : 0);
          }, 0)
        };
      });

    const uniqueCustomers = new Set(filteredOrders.map(o => o.user_id)).size;
    const averageOrderValue = totalRevenue / filteredOrders.length;

    return {
      totalRevenue,
      ordersByStatus,
      topProducts,
      uniqueCustomers,
      averageOrderValue,
      totalOrders: filteredOrders.length
    };
  }, [orders, timeRange, productsRoot]);

  const chartData = useMemo(() => {
    if (!orders?.length) return [];
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleString('en-US', { month: 'short' });
    }).reverse();

    return months.map(month => {
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate.toLocaleString('en-US', { month: 'short' }) === month;
      });

      const monthUsers = usersRaw.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate.toLocaleString('en-US', { month: 'short' }) === month;
      });

      return {
        month,
        sales: monthOrders.reduce((sum, order) => sum + (order.total || 0), 0),
        orders: monthOrders.length,
        users: monthUsers.length
      };
    });
  }, [orders, usersRaw]);

  return (
    <div className="flex">
      <SideBarAdmin />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Thống kê kinh doanh</h1>
          <div className="mt-4 flex gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="all">Tất cả thời gian</option>
              <option value="year">Năm nay</option>
              <option value="month">Tháng này</option>
              <option value="week">Tuần này</option>
            </select>
          </div>
        </div>

        {stats && (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng doanh thu</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()} VND</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <ShoppingBag className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Khách hàng</p>
                    <p className="text-xl font-bold text-gray-900">{stats.uniqueCustomers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Giá trị đơn trung bình</p>
                    <p className="text-xl font-bold text-gray-900">{Math.round(stats.averageOrderValue).toLocaleString()} VND</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart + Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Biểu đồ doanh thu</h2>
                <MonthlyRevenueChart data={chartData} />
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Trạng thái đơn hàng</h2>
                <div className="space-y-3">
                  {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                    <div key={status} className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          status === 'completed' ? 'bg-green-500' :
                          status === 'processing' ? 'bg-yellow-500' :
                          status === 'pending' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`} />
                        <span className="capitalize">{status}</span>
                      </div>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Top 5 sản phẩm bán chạy</h2>
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm">
                    <th className="py-2">Sản phẩm</th>
                    <th className="py-2">Số lượng</th>
                    <th className="py-2">Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topProducts.map((p, i) => (
                    <tr key={i} className="border-t">
                      <td className="py-2">{p.name}</td>
                      <td className="py-2">{p.quantity}</td>
                      <td className="py-2">{p.revenue.toLocaleString()} VND</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Statistic;
