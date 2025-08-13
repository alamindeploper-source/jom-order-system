import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { NotificationSystem } from "./NotificationSystem";

export function AdminPanel() {
  const orders = useQuery(api.orders.list);
  const updateOrderStatus = useMutation(api.orders.updateStatus);
  const [selectedTab, setSelectedTab] = useState<"orders" | "menu" | "analytics">("orders");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleNewOrderNotification = (orderId: string) => {
    setSelectedTab("orders");
    setSelectedOrderId(orderId);
    // Scroll to the specific order
    setTimeout(() => {
      const orderElement = document.getElementById(`order-${orderId}`);
      if (orderElement) {
        orderElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        orderElement.classList.add('animate-pulse', 'ring-4', 'ring-orange-400');
        setTimeout(() => {
          orderElement.classList.remove('animate-pulse', 'ring-4', 'ring-orange-400');
        }, 3000);
      }
    }, 100);
  };

  const handleStatusUpdate = async (orderId: any, status: any) => {
    try {
      await updateOrderStatus({ orderId, status });
      toast.success("✅ Order status updated successfully");
    } catch (error) {
      toast.error("❌ Failed to update order status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "processing": return "bg-blue-100 text-blue-800 border-blue-300";
      case "completed": return "bg-green-100 text-green-800 border-green-300";
      case "cancelled": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return "⏳";
      case "processing": return "👨‍🍳";
      case "completed": return "✅";
      case "cancelled": return "❌";
      default: return "📋";
    }
  };

  if (!orders) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter(order => order.status === "pending").length;
  const processingOrders = orders.filter(order => order.status === "processing").length;
  const completedOrders = orders.filter(order => order.status === "completed").length;
  const totalRevenue = orders
    .filter(order => order.status === "completed")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="space-y-8">
      {/* Enhanced Header with Notifications */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl shadow-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">⚙️ Admin Dashboard</h2>
            <p className="text-purple-100 text-lg">Manage your restaurant operations</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Real-time Notification System */}
            <NotificationSystem onNewOrder={handleNewOrderNotification} />
            <div className="text-right">
              <p className="text-purple-200 text-sm">Total Orders</p>
              <p className="text-3xl font-bold">{orders.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Orders</p>
              <p className="text-3xl font-bold">{pendingOrders}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Processing</p>
              <p className="text-3xl font-bold">{processingOrders}</p>
            </div>
            <div className="text-4xl">👨‍🍳</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed</p>
              <p className="text-3xl font-bold">{completedOrders}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-pink-400 to-red-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Revenue</p>
              <p className="text-2xl font-bold">৳{totalRevenue}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100">
        <div className="p-8">
          {/* Enhanced Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedTab("orders")}
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                selectedTab === "orders"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📋 Orders ({orders.length})
            </button>
            <button
              onClick={() => setSelectedTab("analytics")}
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                selectedTab === "analytics"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📊 Analytics
            </button>
            <button
              onClick={() => setSelectedTab("menu")}
              className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                selectedTab === "menu"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🍽️ Menu Management
            </button>
          </div>

          {/* Orders Tab */}
          {selectedTab === "orders" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                  <span>📋</span>
                  <span>Order Management</span>
                </h3>
                <div className="text-sm text-gray-600">
                  Total: {orders.length} orders
                </div>
              </div>
              
              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-500 text-xl">No orders yet</p>
                  <p className="text-gray-400 text-sm mt-2">Orders will appear here when customers place them</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Pending Orders Section */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">⏳</span>
                          <h4 className="text-lg font-bold">Pending Orders</h4>
                        </div>
                        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-bold">
                          {pendingOrders}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {orders.filter(order => order.status === "pending").length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-4xl mb-2">📝</div>
                          <p>No pending orders</p>
                        </div>
                      ) : (
                        orders.filter(order => order.status === "pending").map((order) => (
                          <div 
                            key={order._id} 
                            id={`order-${order._id}`}
                            className={`border-2 border-yellow-200 rounded-xl p-4 bg-gradient-to-r from-yellow-50 to-orange-50 hover:shadow-lg transition-all duration-300 ${
                              selectedOrderId === order._id ? 'ring-4 ring-orange-400 animate-pulse' : ''
                            }`}
                          >
                            <div className="space-y-4">
                              {/* Customer Information Header */}
                              <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-yellow-300">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg">👤</span>
                                    <div>
                                      <h5 className="font-bold text-gray-800 text-sm">{order.customerName}</h5>
                                      <p className="text-xs text-gray-600">📱 {order.customerPhone}</p>
                                      {order.customerEmail && (
                                        <p className="text-xs text-gray-600">📧 {order.customerEmail}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-lg font-bold text-orange-600">৳{order.totalAmount}</span>
                                    <p className="text-xs text-gray-500">
                                      🕒 {new Date(order.orderDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded border border-blue-200">
                                  <span className="font-medium">📍 Delivery:</span> {order.customerLocation}
                                </div>
                              </div>

                              {/* Order Items Details */}
                              <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-yellow-300">
                                <div className="flex items-center space-x-1 mb-2">
                                  <span className="text-sm">🍽️</span>
                                  <h6 className="font-semibold text-gray-800 text-sm">Order Items ({order.items.length})</h6>
                                </div>
                                
                                <div className="space-y-2">
                                  {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-1 px-2 bg-orange-50 rounded border border-orange-200">
                                      <div className="flex-1">
                                        <span className="text-xs font-medium text-gray-800">{item.menuItemName}</span>
                                        <div className="text-xs text-gray-600">
                                          ৳{item.price} × {item.quantity} = ৳{item.price * item.quantity}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-xs font-bold text-orange-600">×{item.quantity}</span>
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {/* Total Summary */}
                                  <div className="border-t-2 border-orange-300 pt-2 mt-2">
                                    <div className="flex justify-between items-center bg-orange-100 p-2 rounded">
                                      <span className="font-bold text-sm text-gray-800">💰 Total Amount:</span>
                                      <span className="text-lg font-bold text-orange-600">৳{order.totalAmount}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleStatusUpdate(order._id, "processing")}
                                  className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                  👨‍🍳 Start Processing
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(order._id, "cancelled")}
                                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                  ❌ Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  {/* Processing Orders Section */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">👨‍🍳</span>
                          <h4 className="text-lg font-bold">Processing Orders</h4>
                        </div>
                        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-bold">
                          {processingOrders}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {orders.filter(order => order.status === "processing").length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-4xl mb-2">👨‍🍳</div>
                          <p>No processing orders</p>
                        </div>
                      ) : (
                        orders.filter(order => order.status === "processing").map((order) => (
                          <div 
                            key={order._id} 
                            id={`order-${order._id}`}
                            className={`border-2 border-blue-200 rounded-xl p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:shadow-lg transition-all duration-300 ${
                              selectedOrderId === order._id ? 'ring-4 ring-orange-400 animate-pulse' : ''
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">👤</span>
                                  <div>
                                    <h5 className="font-bold text-gray-800">{order.customerName}</h5>
                                    <p className="text-xs text-gray-600">📱 {order.customerPhone}</p>
                                  </div>
                                </div>
                                <span className="text-lg font-bold text-blue-600">৳{order.totalAmount}</span>
                              </div>
                              
                              <div className="text-xs text-gray-600">
                                📍 {order.customerLocation}
                              </div>
                              
                              <div className="text-xs text-gray-500">
                                🕒 {new Date(order.orderDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleStatusUpdate(order._id, "completed")}
                                  className="flex-1 px-3 py-2 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors"
                                >
                                  ✅ Complete
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(order._id, "cancelled")}
                                  className="px-3 py-2 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors"
                                >
                                  ❌
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  {/* Completed Orders Section */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">✅</span>
                          <h4 className="text-lg font-bold">Completed Orders</h4>
                        </div>
                        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-bold">
                          {completedOrders}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {orders.filter(order => order.status === "completed").length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <div className="text-4xl mb-2">✅</div>
                          <p>No completed orders</p>
                        </div>
                      ) : (
                        orders.filter(order => order.status === "completed").map((order) => (
                          <div 
                            key={order._id} 
                            id={`order-${order._id}`}
                            className={`border-2 border-green-200 rounded-xl p-4 bg-gradient-to-r from-green-50 to-teal-50 hover:shadow-lg transition-all duration-300 ${
                              selectedOrderId === order._id ? 'ring-4 ring-orange-400 animate-pulse' : ''
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">👤</span>
                                  <div>
                                    <h5 className="font-bold text-gray-800">{order.customerName}</h5>
                                    <p className="text-xs text-gray-600">📱 {order.customerPhone}</p>
                                  </div>
                                </div>
                                <span className="text-lg font-bold text-green-600">৳{order.totalAmount}</span>
                              </div>
                              
                              <div className="text-xs text-gray-600">
                                📍 {order.customerLocation}
                              </div>
                              
                              <div className="text-xs text-gray-500">
                                🕒 {new Date(order.orderDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              
                              <div className="flex items-center justify-center py-2">
                                <span className="text-green-600 font-medium text-sm">✅ Order Completed</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              )}
            </div>
          )}

          {/* Analytics Tab */}
          {selectedTab === "analytics" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                <span>📊</span>
                <span>Business Analytics</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                  <h4 className="text-lg font-bold text-blue-800 mb-4">📈 Order Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Total Orders:</span>
                      <span className="font-bold text-blue-800">{orders.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Pending:</span>
                      <span className="font-bold text-yellow-600">{pendingOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Processing:</span>
                      <span className="font-bold text-blue-600">{processingOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Completed:</span>
                      <span className="font-bold text-green-600">{completedOrders}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <h4 className="text-lg font-bold text-green-800 mb-4">💰 Revenue Overview</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-green-700">Total Revenue:</span>
                      <span className="font-bold text-green-800">৳{totalRevenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Avg. Order Value:</span>
                      <span className="font-bold text-green-800">
                        ৳{completedOrders > 0 ? Math.round(totalRevenue / completedOrders) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Success Rate:</span>
                      <span className="font-bold text-green-800">
                        {orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Menu Management Tab */}
          {selectedTab === "menu" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                <span>🍽️</span>
                <span>Menu Management</span>
              </h3>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
                <div className="text-center">
                  <div className="text-6xl mb-4">🚧</div>
                  <h4 className="text-xl font-bold text-orange-800 mb-4">Coming Soon!</h4>
                  <p className="text-orange-700 mb-6">Menu management features are under development.</p>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <p className="text-sm text-gray-600 font-medium mb-4">
                      🎯 Planned Features:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span>✅</span>
                        <span>Add new menu items</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>✅</span>
                        <span>Edit existing items</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>✅</span>
                        <span>Manage categories</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>✅</span>
                        <span>Upload item images</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>✅</span>
                        <span>Set availability status</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>✅</span>
                        <span>Bulk price updates</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
