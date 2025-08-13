import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("menuItems")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .filter((q) => q.eq(q.field("isAvailable"), true))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("menuItems") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    nameEn: v.string(),
    price: v.number(),
    categoryId: v.id("categories"),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("menuItems", {
      ...args,
      isAvailable: true,
    });
  },
});

export const seedMenuItems = mutation({
  args: {},
  handler: async (ctx) => {
    const existingItems = await ctx.db.query("menuItems").collect();
    if (existingItems.length > 0) {
      return "Menu items already exist";
    }

    const categories = await ctx.db.query("categories").collect();
    const categoryMap = Object.fromEntries(
      categories.map(cat => [cat.nameEn, cat._id])
    );

    const menuItems = [
      // Morning Breakfast
      { name: "পরোটা", nameEn: "Paratha", price: 10, category: "Morning Breakfast" },
      { name: "শাহী পরোটা", nameEn: "Shahi Paratha", price: 20, category: "Morning Breakfast" },
      { name: "খিচুড়ি", nameEn: "Khichuri", price: 50, category: "Morning Breakfast" },
      { name: "সাদা ভাত", nameEn: "Plain Rice", price: 20, category: "Morning Breakfast" },
      { name: "সিলা/কলিজা", nameEn: "Liver", price: 60, category: "Morning Breakfast" },
      { name: "বুটের ডাল", nameEn: "Chickpea Dal", price: 10, category: "Morning Breakfast" },
      { name: "ভাজি", nameEn: "Vegetable Fry", price: 15, category: "Morning Breakfast" },
      { name: "খাসির লটপটি", nameEn: "Mutton Lotpoti", price: 160, category: "Morning Breakfast" },
      { name: "রোল", nameEn: "Roll", price: 30, category: "Morning Breakfast" },
      { name: "সেন্ডউইচ", nameEn: "Sandwich", price: 30, category: "Morning Breakfast" },
      { name: "সিংড়া", nameEn: "Singara", price: 10, category: "Morning Breakfast" },
      { name: "সামুচা", nameEn: "Samosa", price: 10, category: "Morning Breakfast" },

      // Evening Snacks
      { name: "শাহী পরোটা", nameEn: "Shahi Paratha", price: 20, category: "Evening Snacks" },
      { name: "প্যাচ পরোটা", nameEn: "Patch Paratha", price: 30, category: "Evening Snacks" },
      { name: "টিস্যু পরোটা", nameEn: "Tissue Paratha", price: 30, category: "Evening Snacks" },
      { name: "আলু পরোটা", nameEn: "Aloo Paratha", price: 40, category: "Evening Snacks" },
      { name: "ডিম মোগলাই", nameEn: "Egg Moglai", price: 60, category: "Evening Snacks" },
      { name: "খাসির মোগলাই", nameEn: "Mutton Moglai", price: 80, category: "Evening Snacks" },
      { name: "বাটার নান", nameEn: "Butter Naan", price: 30, category: "Evening Snacks" },
      { name: "গ্রিল চিকেন শেয়ারার", nameEn: "Grilled Chicken Sharer", price: 120, category: "Evening Snacks" },
      { name: "ফুল গ্রিল", nameEn: "Full Grill", price: 480, category: "Evening Snacks" },
      { name: "চিকেন চাপ", nameEn: "Chicken Chap", price: 130, category: "Evening Snacks" },
      { name: "খাসির হালিম", nameEn: "Mutton Haleem", price: 60, category: "Evening Snacks" },

      // Lunch/Dinner
      { name: "সাদা ভাত", nameEn: "Plain Rice", price: 20, category: "Lunch/Dinner" },
      { name: "চিকেন বিরিয়ানি", nameEn: "Chicken Biryani", price: 170, category: "Lunch/Dinner" },
      { name: "ছোট মাছ", nameEn: "Small Fish", price: 120, category: "Lunch/Dinner" },
      { name: "গচি মাছ", nameEn: "Gochi Fish", price: 180, category: "Lunch/Dinner" },
      { name: "রুই মাছ", nameEn: "Rohu Fish", price: 80, category: "Lunch/Dinner" },
      { name: "চিংড়ি মাছ", nameEn: "Prawn", price: 220, category: "Lunch/Dinner" },
      { name: "হাঁসের মাংস", nameEn: "Duck Meat", price: 160, category: "Lunch/Dinner" },
      { name: "হাঁসের কালো ভুনা", nameEn: "Duck Black Bhuna", price: 200, category: "Lunch/Dinner" },
      { name: "করলা ভাজি", nameEn: "Bitter Gourd Fry", price: 20, category: "Lunch/Dinner" },
      { name: "বেগুন ভাজি", nameEn: "Eggplant Fry", price: 10, category: "Lunch/Dinner" },
      { name: "মিশ্র সবজি", nameEn: "Mixed Vegetables", price: 20, category: "Lunch/Dinner" },
      { name: "ডাল", nameEn: "Dal", price: 10, category: "Lunch/Dinner" },
      { name: "আলু ভর্তা", nameEn: "Mashed Potato", price: 10, category: "Lunch/Dinner" },
      { name: "মাছ ভাজা", nameEn: "Fried Fish", price: 10, category: "Lunch/Dinner" },
      { name: "বাদাম ভাজা", nameEn: "Fried Nuts", price: 10, category: "Lunch/Dinner" },
      { name: "কালোজিরা", nameEn: "Black Cumin", price: 10, category: "Lunch/Dinner" },
      { name: "কচু শাখ ভর্তা", nameEn: "Mashed Taro Stems", price: 10, category: "Lunch/Dinner" },
      { name: "শাক ভাজি", nameEn: "Leafy Vegetable Fry", price: 10, category: "Lunch/Dinner" },
      { name: "আলু ভাজি", nameEn: "Potato Fry", price: 10, category: "Lunch/Dinner" },
      { name: "ডিম ভাজি", nameEn: "Egg Fry", price: 25, category: "Lunch/Dinner" },

      // Tea / Coffee
      { name: "স্পেশাল খেজুর চা", nameEn: "Special Date Tea", price: 20, category: "Tea / Coffee" },
      { name: "দুধ চা", nameEn: "Milk Tea", price: 10, category: "Tea / Coffee" },
      { name: "লাল চা", nameEn: "Red Tea", price: 10, category: "Tea / Coffee" },
      { name: "হ্যান্ড কফি", nameEn: "Hand Coffee", price: 50, category: "Tea / Coffee" },

      // Various Sweets
      { name: "বিভিন্ন ধরনের মিষ্টি", nameEn: "Various Sweets", price: 450, category: "Various Sweets", description: "৩০০-৬০০ টাকা" },
      { name: "খুরমা", nameEn: "Khurma", price: 120, category: "Various Sweets" },
      { name: "নিমকি", nameEn: "Nimki", price: 220, category: "Various Sweets" },
      { name: "জিলাপি", nameEn: "Jilapi", price: 150, category: "Various Sweets" },
    ];

    for (const item of menuItems) {
      const categoryId = categoryMap[item.category];
      if (categoryId) {
        await ctx.db.insert("menuItems", {
          name: item.name,
          nameEn: item.nameEn,
          price: item.price,
          categoryId,
          description: item.description,
          isAvailable: true,
        });
      }
    }

    return "Menu items seeded successfully";
  },
});
