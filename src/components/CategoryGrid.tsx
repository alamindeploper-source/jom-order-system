import { Id } from "../../convex/_generated/dataModel";

interface Category {
  _id: Id<"categories">;
  name: string;
  nameEn: string;
  displayOrder: number;
}

interface CategoryGridProps {
  categories: Category[];
  onCategorySelect: (categoryId: Id<"categories">) => void;
}

const categoryIcons = {
  "Morning Breakfast": "🌅",
  "Evening Snacks": "🍪",
  "Lunch/Dinner": "🍽️",
  "Tea / Coffee": "☕",
  "Various Sweets": "🍯"
};

const categoryColors = {
  "Morning Breakfast": "from-yellow-400 to-orange-500",
  "Evening Snacks": "from-purple-400 to-pink-500",
  "Lunch/Dinner": "from-green-400 to-blue-500",
  "Tea / Coffee": "from-amber-400 to-brown-500",
  "Various Sweets": "from-pink-400 to-red-500"
};

export function CategoryGrid({ categories, onCategorySelect }: CategoryGridProps) {
  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
          আমাদের মেনু ক্যাটাগরি
        </h2>
        <p className="text-gray-600 text-lg">Choose from our delicious categories</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {categories.map((category) => (
          <div
            key={category._id}
            onClick={() => onCategorySelect(category._id)}
            className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 border border-gray-100 overflow-hidden"
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[category.nameEn as keyof typeof categoryColors] || "from-orange-400 to-red-500"} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <div className="relative p-8 text-center">
              <div className="text-7xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {categoryIcons[category.nameEn as keyof typeof categoryIcons] || "🍴"}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-gray-600 text-sm md:text-base mb-6">{category.nameEn}</p>
              <div className="transform group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                <span className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg group-hover:shadow-xl">
                  View Menu
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
