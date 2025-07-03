import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Create route matchers for student and teacher routes
//If a page starts with /user/... → it's a student page, If a page starts with /teacher/... → it's a teacher page
const isStudentRoute = createRouteMatcher(["/user/(.*)"]);
const isTeacherRoute = createRouteMatcher(["/teacher/(.*)"]);

// Middleware to check user role and redirect accordingly
export default clerkMiddleware(async (auth, req) =>{
    //gets the logged-in user's data (like role or ID).
    const {sessionClaims} = await auth();
    //try to see if the user is a student or teacher, if can't find it, default to student.
    const userRole = 
    (sessionClaims?.metadata as {userType: "student" | "teacher"})
    ?.userType || "student";

    //req contains the request object like URL
    if(isStudentRoute(req)){
        if(userRole !== "student"){
            const url = new URL("/teacher/courses", req.url);
            return NextResponse.redirect(url);
    }
}

    if(isTeacherRoute(req)){
        if(userRole !== "teacher"){
            const url = new URL("/user/courses", req.url);
            return NextResponse.redirect(url);
        }
    }
});

// This config is used to specify which routes the middleware should run on
export const config ={
    matcher: [
         // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    ],
    };