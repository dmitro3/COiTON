import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Log the size of the cookie being set for debugging
          console.log(`Setting cookie: ${name}, size: ${value.length} bytes`);

          // Ensure the cookie value is minimal
          if (value.length > 4096) {
            // Example limit, adjust as needed
            console.error(`Cookie ${name} is too large: ${value.length} bytes`);
            return; // Don't set the cookie if it's too large
          }

          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}

export function middleware(request: NextRequest) {
  const headers = request.headers;
  let headerSize = 0;

  headers.forEach((value, key) => {
    headerSize += key.length + value.length;
    console.log(`Header: ${key}, Size: ${value.length}`);
  });

  console.log(`Total Header Size: ${headerSize} bytes`);

  if (headerSize > 8000) {
    // Example limit, adjust as needed
    return new NextResponse("Request Header Fields Too Large", { status: 431 });
  }

  return NextResponse.next();
}
