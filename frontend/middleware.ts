import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const cookies = request.cookies.getAll();
  if (
    cookies.length > 50 ||
    cookies.some((cookie) => cookie.value.length > 4096)
  ) {
    const response = NextResponse.next();
    // Manually delete each cookie by setting it with an expired date
    cookies.forEach((cookie) => {
      response.cookies.set(cookie.name, "", { expires: new Date(0) });
    });
    return response;
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
