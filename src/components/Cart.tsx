import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartProps {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  totalAmount: number;
  minimumAmount: number;
}

export function Cart({
  cart,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  totalAmount,
  minimumAmount
}: CartProps) {
  const createOrder = useMutation(api.orders.create);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    notes: ""
  });

  const canPlaceOrder = totalAmount >= minimumAmount;
  const remainingAmount = minimumAmount - totalAmount;

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder) {
      toast.error(`Minimum order amount is ${minimumAmount} TK`);
      return;
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsPlacingOrder(true);
    try {
      await createOrder({
        items: cart.map(item => ({
          menuItemId: item._id as any,
          menuItemName: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerLocation: customerInfo.address,
        totalAmount
      });

      toast.success("Order placed successfully! We'll contact you soon.");
      onClearCart();
      onClose();
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error("Order creation failed:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-2xl h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 sm:p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">🛒 Your Cart</h2>
              <p className="text-orange-100 mt-1 text-sm sm:text-base">{cart.length} items selected</p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            >
              <span className="text-white text-lg sm:text-xl">✕</span>
            </button>
          </div>
        </div>

        {/* Cart Items - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {cart.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-4">🛒</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 text-sm sm:text-base">Add some delicious items to get started!</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{item.name}</h4>
                      <p className="text-orange-600 font-bold text-sm sm:text-base">{item.price} TK each</p>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end space-x-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-white rounded-lg border border-gray-300">
                        <button
                          onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                          className="px-2 sm:px-3 py-1 text-gray-600 hover:text-orange-600 transition-colors text-sm sm:text-base"
                        >
                          −
                        </button>
                        <span className="px-2 sm:px-3 py-1 font-semibold text-sm sm:text-base">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                          className="px-2 sm:px-3 py-1 text-gray-600 hover:text-orange-600 transition-colors text-sm sm:text-base"
                        >
                          +
                        </button>
                      </div>
                      
                      {/* Item Total */}
                      <div className="text-right min-w-[60px] sm:min-w-[80px]">
                        <p className="font-bold text-gray-800 text-sm sm:text-base">{item.price * item.quantity} TK</p>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveItem(item._id)}
                        className="text-red-500 hover:text-red-700 p-1 transition-colors text-sm sm:text-base"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary & Customer Info - Fixed Bottom Section */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50 flex-shrink-0">
            {/* Order Summary */}
            <div className="bg-white rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800 text-sm sm:text-base">Total Amount:</span>
                <span className="text-xl sm:text-2xl font-bold text-orange-600">{totalAmount} TK</span>
              </div>
              
              {!canPlaceOrder && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3 mt-2 sm:mt-3">
                  <p className="text-red-700 font-medium text-xs sm:text-sm">
                    ❌ Need {remainingAmount} TK more to reach minimum order ({minimumAmount} TK)
                  </p>
                </div>
              )}
              
              {canPlaceOrder && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 mt-2 sm:mt-3">
                  <p className="text-green-700 font-medium text-xs sm:text-sm">
                    ✅ Ready to place order!
                  </p>
                </div>
              )}
            </div>

            {/* Customer Information Form */}
            <div className="bg-white rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">📋 Customer Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm sm:text-base"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm sm:text-base"
                />
              </div>
              <textarea
                placeholder="Delivery Address *"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none mt-2 sm:mt-3 text-sm sm:text-base"
                rows={2}
              />
              <textarea
                placeholder="Special Instructions (Optional)"
                value={customerInfo.notes}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none mt-2 sm:mt-3 text-sm sm:text-base"
                rows={2}
              />
            </div>

            {/* Action Buttons - Always Visible */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={onClearCart}
                className="w-full sm:flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 sm:py-3 rounded-xl font-semibold transition-colors text-sm sm:text-base"
              >
                Clear Cart
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={!canPlaceOrder || isPlacingOrder}
                className={`w-full sm:flex-1 py-3 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                  canPlaceOrder && !isPlacingOrder
                    ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isPlacingOrder ? "Placing Order..." : `Place Order (${totalAmount} TK)`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
