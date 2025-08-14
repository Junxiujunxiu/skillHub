import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/*--------------------------------------------------
  ROUTE MATCHERS
  - Detect which section the request belongs to
  - Adjust patterns if you change route structures
---------------------------------------------------*/
const isStudentRoute = createRouteMatcher(["/user/(.*)"]);
const isTeacherRoute = createRouteMatcher(["/teacher/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // ------------------------------------------------
  // 1. Get session claims and userId from Clerk auth
  // ------------------------------------------------
  const { sessionClaims, userId } = await auth();

  // ------------------------------------------------
  // 2. If the user is signed out, skip role-based checks
  //    → Page will render normally (can show "please sign in" prompt)
  // ------------------------------------------------
  if (!sessionClaims) return NextResponse.next();

  // ------------------------------------------------
  // 3. Try to get the user role directly from session claims
  //    - publicMetadata is where we store custom fields like userType
  // ------------------------------------------------
  let userRole =
    (sessionClaims?.publicMetadata as { userType?: "student" | "teacher" })?.userType;

  // ------------------------------------------------
  // 4. If role is missing from claims, fetch the user object from Clerk
  //    - Handles cases where claims are stale or trimmed
  //    - Requires an extra API call
  // ------------------------------------------------
  if (!userRole && userId) {
    const client = await clerkClient(); // Get an instance of the Clerk client
    const user = await client.users.getUser(userId); // Fetch full user data
    userRole = (user.publicMetadata as { userType?: "student" | "teacher" })?.userType;
  }

  // ------------------------------------------------
  // 5. Default to "student" if role is still missing
  // ------------------------------------------------
  const role = (userRole || "student") as "student" | "teacher";

  // ------------------------------------------------
  // 6. Role-based redirects:
  //    - If hitting a student route but not a student → send to teacher dashboard
  //    - If hitting a teacher route but not a teacher → send to student dashboard
  // ------------------------------------------------
  if (isStudentRoute(req) && role !== "student") {
    return NextResponse.redirect(new URL("/teacher/courses", req.url));
  }
  if (isTeacherRoute(req) && role !== "teacher") {
    return NextResponse.redirect(new URL("/user/courses", req.url));
  }

  // ------------------------------------------------
  // 7. If no redirect conditions matched, continue to requested page
  // ------------------------------------------------
  return NextResponse.next();
});

/*--------------------------------------------------
  CONFIG: Where this middleware should run
  - Excludes static assets, Next.js internals, etc.
  - Includes API and TRPC routes
---------------------------------------------------*/
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
