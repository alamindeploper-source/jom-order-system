import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface MenuItemsProps {
  categoryId: Id<"categories">;
  onBack: () => void;
  onAddToCart: (item: any) => void;
  cart: CartItem[];
}

export function MenuItems({ categoryId, onBack, onAddToCart, cart }: MenuItemsProps) {
  const menuItems = useQuery(api.menuItems.listByCategory, { categoryId });
  const categories = useQuery(api.categories.list);
  
  const currentCategory = categories?.find(cat => cat._id === categoryId);

  if (!menuItems || !currentCategory) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white hover:text-orange-200 font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-200 hover:bg-white/30 w-fit"
          >
            <span className="text-xl">←</span>
            <span>Back to Categories</span>
          </button>
          <div className="text-center md:text-right">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">{currentCategory.name}</h2>
            <p className="text-orange-100 text-lg">{currentCategory.nameEn}</p>
            <div className="mt-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 inline-block">
              <span className="text-white text-sm font-medium">
                {menuItems.length} items available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:scale-[1.02]"
          >
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-2">{item.nameEn}</p>
                  {item.description && (
                    <p className="text-xs md:text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="text-right ml-4">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl shadow-lg">
                    <span className="text-xl md:text-2xl font-bold">৳{item.price}</span>
                  </div>
                </div>
              </div>
              
              {/* Cart Status & Add Button */}
              <div className="space-y-3">
                {/* Show if item is in cart */}
                {cart.find(cartItem => cartItem._id === item._id) && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                    <span className="text-green-700 font-medium text-sm">
                      ✅ In Cart ({cart.find(cartItem => cartItem._id === item._id)?.quantity}x)
                    </span>
                  </div>
                )}
                
                <button
                  onClick={() => onAddToCart(item)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 md:py-4 px-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] group-hover:from-orange-600 group-hover:to-red-600"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>🛒</span>
                    <span>Add to Cart</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {menuItems.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-gray-500 text-xl">No items available in this category</p>
          <p className="text-gray-400 text-sm mt-2">Please check back later</p>
        </div>
      )}
      
      {/* Professional Tips */}
      {menuItems.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">💡 Ordering Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
              <div className="flex items-center justify-center space-x-2">
                <span>🛒</span>
                <span>Add multiple items to your cart</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>💰</span>
                <span>Minimum order: 300 TK</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>🚚</span>
                <span>Free delivery in local area</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
