// pages/_middleware.js

import { NextResponse } from "next/server";
import { verifyToken } from "./hook/Hook";

export async function middleware(req) {
  const token = req.cookies.get("token"); // Get the token from the cookie
  // If there's no token, redirect to login
  if (!token) {
    const returnUrl = encodeURIComponent(req.url);
    return NextResponse.redirect(
      new URL(`/login?returnUrl=${returnUrl}`, req.nextUrl.origin)
    );
  }

  // Validate the token by making a request to your validation endpoint
  const isValid = verifyToken(token, "/auth/testToken");
  // Implement this function to make the HTTP request

  // Redirect to login if the token is invalid
  if (!isValid) {
    const returnUrl = encodeURIComponent(req.url);
    return NextResponse.redirect(
      new URL(`/login?returnUrl=${returnUrl}`, req.nextUrl.origin)
    );
  }

  // If the token is valid, proceed with the request
  return NextResponse.next();
}

// Middleware configuration to exclude certain paths
export const config = {
  matcher: ["/", "/home/:path*", "/products/:path*"], // Add paths you want the middleware to run on
};
