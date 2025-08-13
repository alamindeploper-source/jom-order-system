import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { RestaurantApp } from "./components/RestaurantApp";
import { AdminPanel } from "./components/AdminPanel";
import { AdminLogin } from "./components/AdminLogin";
import { useState } from "react";

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <Toaster position="top-right" />
      <Content 
        showAdmin={showAdmin} 
        setShowAdmin={setShowAdmin}
        isAdminAuthenticated={isAdminAuthenticated}
        setIsAdminAuthenticated={setIsAdminAuthenticated}
      />
    </div>
  );
}

function Content({ 
  showAdmin, 
  setShowAdmin, 
  isAdminAuthenticated, 
  setIsAdminAuthenticated 
}: { 
  showAdmin: boolean; 
  setShowAdmin: (show: boolean) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const handleAdminToggle = () => {
    if (showAdmin) {
      setShowAdmin(false);
      setIsAdminAuthenticated(false);
    } else {
      setShowAdmin(true);
    }
  };

  return (
    <>
      <header className="bg-white shadow-xl border-b-4 border-gradient-to-r from-orange-500 to-red-500 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-3 sm:py-4 gap-3 sm:gap-0">
            <div className="flex items-center space-x-3 sm:space-x-4 text-center sm:text-left">
              <div className="text-3xl sm:text-4xl animate-pulse">🍽️</div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent leading-tight">
                  Jom Jom Hotel & Restaurant
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">জম জম Hotel and রেস্টুরেন্ট</p>
                <p className="text-xs text-gray-500 mt-1 max-w-xs sm:max-w-none">
                  📍 বিজয় চত্ত্বরের পূর্বদিকে রংপুর রোড, ডিমলা, নিলফামারি
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Authenticated>
                <button
                  onClick={handleAdminToggle}
                  className="px-3 py-2 md:px-6 md:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm md:text-base whitespace-nowrap"
                >
                  {showAdmin ? "📱 View Menu" : "⚙️ Admin Panel"}
                </button>
                <SignOutButton />
              </Authenticated>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Authenticated>
          {showAdmin ? (
            isAdminAuthenticated ? (
              <AdminPanel />
            ) : (
              <AdminLogin onAuthenticated={() => setIsAdminAuthenticated(true)} />
            )
          ) : (
            <RestaurantApp />
          )}
        </Authenticated>
        
        <Unauthenticated>
          <div className="max-w-md mx-auto px-4">
            <div className="text-center mb-8">
              <div className="text-5xl sm:text-6xl mb-4 animate-bounce">🍽️</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4 leading-tight">
                Welcome to Jom Jom Hotel & Restaurant
              </h2>
              <p className="text-gray-600 text-base sm:text-lg mb-4">আমাদের মেনু দেখতে এবং অর্ডার করতে সাইন ইন করুন</p>
              <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 shadow-sm">
                <p className="text-sm text-orange-800 font-medium">
                  📍 বিজয় চত্ত্বরের পূর্বদিকে রংপুর রোড, ডিমলা, নিলফামারি
                </p>
                <p className="text-xs text-orange-600 mt-2">
                  📞 অর্ডারের জন্য কল করুন | 🕒 প্রতিদিন খোলা
                </p>
              </div>
              
              {/* Features Section */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-2xl mb-2">🍛</div>
                  <p className="text-xs font-medium text-gray-700">Authentic Bengali</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <div className="text-2xl mb-2">🚚</div>
                  <p className="text-xs font-medium text-gray-700">Fast Delivery</p>
                </div>
              </div>
            </div>
            <SignInForm />
          </div>
        </Unauthenticated>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-orange-400">Jom Jom Hotel & Restaurant</h3>
              <p className="text-gray-300 text-sm sm:text-base">Authentic Bengali cuisine with fresh ingredients and traditional recipes.</p>
              <div className="flex justify-center sm:justify-start space-x-4 mt-4">
                <span className="text-2xl">🍛</span>
                <span className="text-2xl">🍜</span>
                <span className="text-2xl">🍚</span>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-orange-400">Location</h3>
              <p className="text-gray-300 text-sm sm:text-base">📍 বিজয় চত্ত্বরের পূর্বদিকে রংপুর রোড</p>
              <p className="text-gray-300 text-sm sm:text-base">ডিমলা, নিলফামারি</p>
              <div className="mt-3">
                <span className="inline-block bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  🕒 Daily Open
                </span>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-orange-400">Contact</h3>
              <p className="text-gray-300 text-sm sm:text-base">📞 Call for orders</p>
              <p className="text-gray-300 text-sm sm:text-base">🚚 Fast delivery available</p>
              <p className="text-gray-300 text-sm sm:text-base">💳 Cash & Mobile payment</p>
            </div>
          </div>
          
          {/* Developer Credit Section */}
          <div className="border-t border-gray-700 mt-8 pt-6">
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-4 mb-4 max-w-md mx-auto">
                <h4 className="text-white font-bold text-lg mb-2">👨‍💻 Developer</h4>
                <div className="text-white space-y-1">
                  <p className="font-semibold">Al-amin</p>
                  <p className="text-sm">📱 01725322834</p>
                  <p className="text-sm">📧 alamindeveloper@gmail.com</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">© 2025 Jom Jom Hotel & Restaurant.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
