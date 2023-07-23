import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
   const requestHeaders = new Headers(request.headers);
   requestHeaders.set("x-hello-from-middleware1", "hello");
  return NextResponse.redirect(new URL("/home", request.url));
}

