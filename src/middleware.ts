import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
   if (
     request.nextUrl.pathname.startsWith("/") ||
     request.nextUrl.pathname.startsWith("/profile")
   ) {
     if (!token) {
       return NextResponse.redirect(new URL("/login", request.url));
     } else if (token) {
       try {
         await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET));
       } catch (err) {
         console.log(err);
         return NextResponse.redirect(new URL("/login", request.url));
       }
     }
   }

  //  if (
  //    request.nextUrl.pathname.startsWith("/login") ||
  //    request.nextUrl.pathname.startsWith("/register") && token
  //  ) {
  //    try {
  //      await jwtVerify(
  //        token?.value as string,
  //        new TextEncoder().encode(process.env.JWT_SECRET)
  //      );
  //      return NextResponse.redirect(new URL("/", request.url));
  //    } catch (err) {
  //      console.log(err);
  //    }
  //  }

   return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login"],
};