import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Store AI-extracted insights from a URL
export const create = mutation({
  args: {
    userId: v.string(),
    sourceUrl: v.optional(v.string()),
    type: v.string(),
    brandingStrategies: v.optional(v.array(v.object({
      value: v.string(),
    }))),
    seoKeywords: v.optional(v.array(v.object({
      value: v.string(),
    }))),
    aeoGeoOptimizationTactics: v.optional(v.array(v.object({
      value: v.string(),
    }))),
    uiUxPatterns: v.optional(v.array(v.object({
      value: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    const insightId = await ctx.db.insert("insights", {
      ...args,
      createdAt: Date.now(),
    });
    return insightId;
  },
});

// Get insights for a user
export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("insights")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get a single insight
export const get = query({
  args: { id: v.id("insights") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Delete an insight
export const remove = mutation({
  args: { id: v.id("insights") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
