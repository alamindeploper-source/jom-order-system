import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from "react";
import { CategoryGrid } from "./CategoryGrid";
import { MenuItems } from "./MenuItems";
import { Cart } from "./Cart";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export function RestaurantApp() {
  const categories = useQuery(api.categories.list);
  const seedCategories = useMutation(api.categories.seedCategories);
  const seedMenuItems = useMutation(api.menuItems.seedMenuItems);
  
  const [selectedCategory, setSelectedCategory] = useState<Id<"categories"> | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  
  const MINIMUM_ORDER_AMOUNT = 300;

  useEffect(() => {
    const initializeData = async () => {
      try {
        await seedCategories();
        await seedMenuItems();
      } catch (error) {
        console.log("Data already initialized");
      }
    };
    initializeData();
  }, [seedCategories, seedMenuItems]);

  if (!categories) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading delicious menu...</p>
        </div>
      </div>
    );
  }

  const addToCart = (item: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    toast.success(`${item.name} added to cart!`);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item._id !== itemId));
    toast.success("Item removed from cart");
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
    toast.success("Cart cleared");
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Professional Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 rounded-2xl md:rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative text-center py-12 md:py-16 text-white px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-4xl md:text-6xl mb-4 md:mb-6">🍽️</div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              জম জম হোটেল এন্ড রেস্টুরেন্ট
            </h1>
            <p className="text-base sm:text-lg md:text-2xl lg:text-3xl mb-6 md:mb-8 font-light opacity-95">Authentic Bengali Cuisine</p>
            
            {/* Professional Feature Tags */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-sm md:text-base">
              <span className="bg-white/25 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-full border border-white/30 font-medium">
                🌟 Premium Quality
              </span>
              <span className="bg-white/25 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-full border border-white/30 font-medium">
                😋 Traditional Taste
              </span>
              <span className="bg-white/25 backdrop-blur-sm px-4 py-2 md:px-6 md:py-3 rounded-full border border-white/30 font-medium">
                🚚 Fast Delivery
              </span>
            </div>
            
            {/* Call to Action */}
            <div className="mt-6 md:mt-8">
              <p className="text-white/90 text-sm md:text-base font-medium">
                📱 Browse our menu and order your favorite dishes
              </p>
              <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg p-3 inline-block">
                <p className="text-white font-semibold text-sm">
                  💰 Minimum Order: {MINIMUM_ORDER_AMOUNT} TK
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Summary Bar */}
      {cart.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sticky top-20 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 rounded-full p-2">
                <span className="text-orange-600 font-bold text-sm">{getTotalItems()}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Cart Total: {getTotalAmount()} TK</p>
                <p className="text-sm text-gray-600">
                  {getTotalAmount() >= MINIMUM_ORDER_AMOUNT 
                    ? "✅ Ready to order!" 
                    : `❌ Need ${MINIMUM_ORDER_AMOUNT - getTotalAmount()} TK more`
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium shadow-lg"
            >
              View Cart 🛒
            </button>
          </div>
        </div>
      )}

      {/* Professional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Location Card */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="text-center">
            <div className="text-3xl md:text-4xl mb-3 md:mb-4">📍</div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">আমাদের অবস্থান</h3>
            <p className="text-sm md:text-base text-gray-700 font-medium leading-relaxed">
              বিজয় চত্ত্বরের পূর্বদিকে রংপুর রোড<br/>
              ডিমলা, নিলফামারি
            </p>
            <div className="mt-3 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
              🕒 Daily Open
            </div>
          </div>
        </div>
        
        {/* Special Offers Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="text-center">
            <div className="text-3xl md:text-4xl mb-3 md:mb-4">🎉</div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">বিশেষ অফার</h3>
            <p className="text-sm md:text-base text-gray-700 font-medium">
              অনলাইন অর্ডারে বিশেষ ছাড়
            </p>
            <div className="mt-3 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              💰 Best Price
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section Header */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
        <div className="text-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
            {!selectedCategory ? "🍽️ আমাদের মেনু ক্যাটেগরি" : "🍛 মেনু আইটেম"}
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            {!selectedCategory 
              ? "আপনার পছন্দের ক্যাটেগরি নির্বাচন করুন" 
              : "আপনার পছন্দের খাবার অর্ডার করুন"
            }
          </p>
        </div>
        
        {/* Categories or Menu Items */}
        {!selectedCategory ? (
          <CategoryGrid 
            categories={categories} 
            onCategorySelect={setSelectedCategory}
          />
        ) : (
          <MenuItems 
            categoryId={selectedCategory}
            onBack={() => setSelectedCategory(null)}
            onAddToCart={addToCart}
            cart={cart}
          />
        )}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <Cart
          cart={cart}
          onClose={() => setShowCart(false)}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
          totalAmount={getTotalAmount()}
          minimumAmount={MINIMUM_ORDER_AMOUNT}
        />
      )}
    </div>
  );
}
