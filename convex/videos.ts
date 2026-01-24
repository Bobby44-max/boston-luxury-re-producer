import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new video generation job
export const createJob = mutation({
  args: {
    userId: v.string(),
    listingUrl: v.string(),
    videoType: v.string(),
    branding: v.optional(v.object({
      agentName: v.optional(v.string()),
      agentTitle: v.optional(v.string()),
      agentPhoto: v.optional(v.string()),
      brokerageName: v.optional(v.string()),
      logoUrl: v.optional(v.string()),
      phone: v.optional(v.string()),
      email: v.optional(v.string()),
      primaryColor: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const jobId = await ctx.db.insert("videos", {
      userId: args.userId,
      listingUrl: args.listingUrl,
      videoType: args.videoType,
      branding: args.branding,
      status: "pending",
      progress: 0,
      createdAt: Date.now(),
    });
    return jobId;
  },
});

// Update job status and progress
export const updateProgress = mutation({
  args: {
    id: v.id("videos"),
    status: v.optional(v.string()),
    progress: v.optional(v.number()),
    propertyData: v.optional(v.any()),
    script: v.optional(v.string()),
    scenes: v.optional(v.array(v.object({
      start: v.number(),
      end: v.number(),
      text: v.string(),
      visual: v.string(),
    }))),
    voiceoverUrl: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );
    await ctx.db.patch(id, cleanUpdates);
  },
});

// Mark job as complete
export const complete = mutation({
  args: {
    id: v.id("videos"),
    videoUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "complete",
      progress: 100,
      videoUrl: args.videoUrl,
      thumbnailUrl: args.thumbnailUrl,
      duration: args.duration,
      completedAt: Date.now(),
    });
  },
});

// Mark job as failed
export const setError = mutation({
  args: {
    id: v.id("videos"),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "failed",
      error: args.error,
    });
  },
});

// Get a single video job
export const get = query({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get all videos for a user
export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("videos")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get recent videos for a user
export const getRecent = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    return await ctx.db
      .query("videos")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);
  },
});

// Get pending/in-progress videos for a user
export const getActive = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const videos = await ctx.db
      .query("videos")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return videos.filter(v =>
      ["pending", "scraping", "generating", "rendering"].includes(v.status)
    );
  },
});

// Delete a video job
export const remove = mutation({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
