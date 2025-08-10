import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/*---------------------------------- ROUTE MATCHERS ----------------------------------*/
/*
   Define matchers to detect whether the incoming request is for:
   - Student routes (start with /user/...)
   - Teacher routes (start with /teacher/...)
*/
const isStudentRoute = createRouteMatcher(["/user/(.*)"]);
const isTeacherRoute = createRouteMatcher(["/teacher/(.*)"]);

/*---------------------------------- MIDDLEWARE: ROLE CHECK ----------------------------------*/
/*
   This middleware:
   1. Retrieves the authenticated user's session claims from Clerk.
   2. Determines their role ("student" or "teacher"), defaulting to "student" if not set.
   3. Redirects them to the correct dashboard if they try to access the wrong route type.
*/
export default clerkMiddleware(async (auth, req) => {
  // 1. Retrieve session claims from Clerk
  const { sessionClaims } = await auth();

  // 2. Extract userType from metadata, defaulting to "student"
  const userRole =
    (sessionClaims?.metadata as { userType: "student" | "teacher" })?.userType ||
    "student";

  // 3. Redirect if user tries to access a student route but is a teacher
  if (isStudentRoute(req)) {
    if (userRole !== "student") {
      const url = new URL("/teacher/courses", req.url);
      return NextResponse.redirect(url);
    }
  }

  // 4. Redirect if user tries to access a teacher route but is a student
  if (isTeacherRoute(req)) {
    if (userRole !== "teacher") {
      const url = new URL("/user/courses", req.url);
      return NextResponse.redirect(url);
    }
  }
});

/*---------------------------------- CONFIG: ROUTE MATCHING ----------------------------------*/
/*
   Determines which routes the middleware will run on:
   - Excludes Next.js internals & most static files.
   - Runs for all API and TRPC routes.
*/
export const config = {
  matcher: [
    // Match all except _next, static files, or assets (unless in query string)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always match API and TRPC routes
    '/(api|trpc)(.*)',
  ],
};
