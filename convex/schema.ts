import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  categories: defineTable({
    name: v.string(),
    nameEn: v.string(),
    displayOrder: v.number(),
    isActive: v.boolean(),
  }).index("by_display_order", ["displayOrder"]),

  menuItems: defineTable({
    name: v.string(),
    nameEn: v.string(),
    price: v.number(),
    categoryId: v.id("categories"),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    isAvailable: v.boolean(),
  }).index("by_category", ["categoryId"]),

  orders: defineTable({
    customerName: v.string(),
    customerPhone: v.string(),
    customerEmail: v.optional(v.string()),
    customerLocation: v.string(),
    items: v.array(v.object({
      menuItemId: v.id("menuItems"),
      menuItemName: v.string(),
      price: v.number(),
      quantity: v.number(),
    })),
    totalAmount: v.number(),
    status: v.union(v.literal("pending"), v.literal("processing"), v.literal("completed"), v.literal("cancelled")),
    orderDate: v.number(),
  }).index("by_status", ["status"])
    .index("by_date", ["orderDate"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
