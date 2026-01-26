import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes (marketing pages)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/privacy(.*)',
  '/terms(.*)',
  '/api/webhooks(.*)',
  '/api/health',
]);

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

export default clerkMiddleware(async (auth, request) => {
  // Protect console routes
  if (isProtectedRoute(request)) {
    await auth.protect();
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
