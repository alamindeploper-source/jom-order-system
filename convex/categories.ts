import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_display_order")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    nameEn: v.string(),
    displayOrder: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", {
      ...args,
      isActive: true,
    });
  },
});

export const seedCategories = mutation({
  args: {},
  handler: async (ctx) => {
    const existingCategories = await ctx.db.query("categories").collect();
    if (existingCategories.length > 0) {
      return "Categories already exist";
    }

    const categories = [
      { name: "সকালের নাস্তা", nameEn: "Morning Breakfast", displayOrder: 1 },
      { name: "বিকেলের নাস্তা", nameEn: "Evening Snacks", displayOrder: 2 },
      { name: "দুপুর/রাতের খাবার", nameEn: "Lunch/Dinner", displayOrder: 3 },
      { name: "চা / কফি", nameEn: "Tea / Coffee", displayOrder: 4 },
      { name: "বিভিন্ন ধরনের মিষ্টি", nameEn: "Various Sweets", displayOrder: 5 },
    ];

    for (const category of categories) {
      await ctx.db.insert("categories", {
        ...category,
        isActive: true,
      });
    }

    return "Categories seeded successfully";
  },
});
