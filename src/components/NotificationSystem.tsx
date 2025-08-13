import { useEffect, useState, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: 'new_order' | 'order_update';
  title: string;
  message: string;
  timestamp: number;
  orderId?: string;
  read: boolean;
}

interface NotificationSystemProps {
  onNewOrder?: (orderId: string) => void;
}

export function NotificationSystem({ onNewOrder }: NotificationSystemProps) {
  const orders = useQuery(api.orders.list);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevOrdersRef = useRef<any[]>([]);

  // Create notification sound
  useEffect(() => {
    const audio = new Audio();
    // Create a simple notification sound using Web Audio API
    const createNotificationSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    audioRef.current = { play: createNotificationSound } as any;
  }, []);

  // Monitor for new orders
  useEffect(() => {
    if (!orders || orders.length === 0) {
      prevOrdersRef.current = [];
      return;
    }

    const currentOrders = orders || [];
    const prevOrders = prevOrdersRef.current;

    // Check for new orders
    if (prevOrders.length > 0 && currentOrders.length > prevOrders.length) {
      const newOrders = currentOrders.slice(0, currentOrders.length - prevOrders.length);
      
      newOrders.forEach((order) => {
        const newNotification: Notification = {
          id: `order_${order._id}_${Date.now()}`,
          type: 'new_order',
          title: '🔔 নতুন অর্ডার এসেছে!',
          message: `${order.customerName} একটি নতুন অর্ডার দিয়েছেন। মোট: ৳${order.totalAmount}`,
          timestamp: Date.now(),
          orderId: order._id,
          read: false,
        };

        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep last 10 notifications
        
        // Play notification sound
        try {
          if (audioRef.current?.play) {
            audioRef.current.play();
          }
        } catch (error) {
          console.log('Could not play notification sound:', error);
        }

        // Show toast notification
        toast.success(
          `🔔 নতুন অর্ডার! ${order.customerName} - ৳${order.totalAmount}`,
          {
            duration: 5000,
            action: {
              label: 'দেখুন',
              onClick: () => onNewOrder?.(order._id),
            },
          }
        );
      });
    }

    prevOrdersRef.current = currentOrders;
  }, [orders, onNewOrder]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('bn-BD', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors duration-200 bg-white rounded-full shadow-lg hover:shadow-xl border border-gray-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">🔔 নোটিফিকেশন</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  সব পড়া হয়েছে
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <div className="text-4xl mb-2">🔕</div>
                <p>কোন নোটিফিকেশন নেই</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                    !notification.read ? 'bg-orange-50 border-l-4 border-l-orange-500' : ''
                  }`}
                  onClick={() => {
                    markAsRead(notification.id);
                    if (notification.orderId && onNewOrder) {
                      onNewOrder(notification.orderId);
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {notification.type === 'new_order' ? (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          🛒
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          📝
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                সর্বশেষ {notifications.length} টি নোটিফিকেশন দেখানো হচ্ছে
              </p>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}
