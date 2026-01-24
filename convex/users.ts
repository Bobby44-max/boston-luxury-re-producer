import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update user from Clerk webhook
export const upsert = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
      });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      plan: "free",
      creditsRemaining: 10, // Free tier starts with 10 credits
      createdAt: Date.now(),
    });
  },
});

// Get user by Clerk ID
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Update user plan
export const updatePlan = mutation({
  args: {
    clerkId: v.string(),
    plan: v.string(),
    creditsRemaining: v.number(),
    stripeCustomerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      plan: args.plan,
      creditsRemaining: args.creditsRemaining,
      stripeCustomerId: args.stripeCustomerId,
    });
  },
});

// Deduct credits
export const useCredits = mutation({
  args: {
    clerkId: v.string(),
    amount: v.number(),
    action: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) throw new Error("User not found");
    if (user.creditsRemaining < args.amount) {
      throw new Error("Insufficient credits");
    }

    await ctx.db.patch(user._id, {
      creditsRemaining: user.creditsRemaining - args.amount,
    });

    // Log usage
    await ctx.db.insert("usage", {
      userId: args.clerkId,
      action: args.action,
      creditsUsed: args.amount,
      createdAt: Date.now(),
    });

    return user.creditsRemaining - args.amount;
  },
});

// Add credits (for purchases)
export const addCredits = mutation({
  args: {
    clerkId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      creditsRemaining: user.creditsRemaining + args.amount,
    });

    return user.creditsRemaining + args.amount;
  },
});
