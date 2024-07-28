// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "./lib/constants";

export async function middleware(req: NextRequest) {
  const { data: session } = await supabase.auth.getUser();

  // Define public paths
  const publicPaths = ["/", "/sign-in", "/sign-up", "/about", "/buy"];

  // Check if the current path is in the public paths
  const isPublicPath = publicPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/agreements",
    "/list",
    "/notifications",
    "/reports",
    "/settings",
    "/support",
    "/tradings",
    "/approve",
    "/listing",
    "/approve/:path*",
    "/listing/:path*",
  ],
};
