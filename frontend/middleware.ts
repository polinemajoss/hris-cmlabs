import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value || request.headers.get("Authorization");

//   if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   return NextResponse.next();
// }

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/api/sign-in", request.url));
  }

  return NextResponse.next();
}

// Jalankan middleware hanya untuk rute ini
export const config = {
  matcher: ["/dashboard/:path*"],
};
