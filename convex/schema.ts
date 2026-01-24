import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profiles synced from Clerk
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    plan: v.string(), // free, pro, enterprise
    creditsRemaining: v.number(),
    stripeCustomerId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // Video generation jobs
  videos: defineTable({
    userId: v.string(),
    listingUrl: v.string(),
    videoType: v.string(),
    status: v.string(), // pending, scraping, generating, rendering, complete, failed
    progress: v.number(),

    // Scraped property data
    propertyData: v.optional(v.object({
      address: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      price: v.number(),
      bedrooms: v.number(),
      bathrooms: v.number(),
      sqft: v.number(),
      lotSize: v.optional(v.string()),
      yearBuilt: v.optional(v.number()),
      propertyType: v.string(),
      description: v.string(),
      features: v.array(v.string()),
      images: v.array(v.string()),
      neighborhood: v.optional(v.string()),
    })),

    // Generated content
    script: v.optional(v.string()),
    scenes: v.optional(v.array(v.object({
      start: v.number(),
      end: v.number(),
      text: v.string(),
      visual: v.string(),
    }))),
    voiceoverUrl: v.optional(v.string()),

    // Output
    videoUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    duration: v.optional(v.number()),

    // Branding
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

    // Metadata
    error: v.optional(v.string()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_status", ["userId", "status"]),

  // Scraped property cache
  scrapes: defineTable({
    url: v.string(),
    urlHash: v.string(),
    propertyData: v.any(),
    scrapedAt: v.number(),
    expiresAt: v.number(),
  }).index("by_url_hash", ["urlHash"]),

  // AI-extracted insights (for the example data structure you showed)
  insights: defineTable({
    userId: v.string(),
    sourceUrl: v.optional(v.string()),
    type: v.string(), // branding, seo, uiux, aeo

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

    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Usage tracking for billing
  usage: defineTable({
    userId: v.string(),
    action: v.string(), // scrape, generate, render, voiceover
    creditsUsed: v.number(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "createdAt"]),

  // Stripe subscriptions
  subscriptions: defineTable({
    userId: v.string(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    status: v.string(), // active, canceled, past_due
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_stripe_id", ["stripeSubscriptionId"]),

  // Agent branding profiles
  agentProfiles: defineTable({
    userId: v.string(),
    name: v.string(),
    title: v.string(),
    photo: v.optional(v.string()),
    brokerageName: v.string(),
    logoUrl: v.optional(v.string()),
    phone: v.string(),
    email: v.string(),
    website: v.optional(v.string()),
    socialHandles: v.optional(v.object({
      instagram: v.optional(v.string()),
      tiktok: v.optional(v.string()),
      youtube: v.optional(v.string()),
      linkedin: v.optional(v.string()),
    })),
    primaryColor: v.string(),
    secondaryColor: v.optional(v.string()),
    fontFamily: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
});
