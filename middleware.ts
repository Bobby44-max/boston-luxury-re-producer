import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define protected routes (console/OS)
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/studio(.*)',
  '/videos(.*)',
  '/settings(.*)',
  '/api/generate(.*)',
  '/api/scrape(.*)',
  '/api/avatar(.*)',
  '/api/render(.*)',
]);

export default clerkMiddleware((auth, request) => {
  // Protect console routes - Clerk handles redirect automatically
  if (isProtectedRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
