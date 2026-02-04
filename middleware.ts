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
  // Protect console routes
  if (isProtectedRoute(request)) {
    // Check if it's an RSC/Fetch request (which Clerk redirects can break via CORS)
    const isRscRequest =
      request.headers.get('rsc') === '1' ||
      request.headers.get('accept')?.includes('text/x-component') ||
      request.headers.get('x-requested-with') === 'XMLHttpRequest';

    if (isRscRequest) {
      const { userId } = auth();
      if (!userId) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

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
