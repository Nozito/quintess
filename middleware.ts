import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

const CLIENT_PATHS = ["/dashboard", "/demande", "/profil"];
const ADMIN_PATHS = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("quintess-session")?.value;

  const isAdminPath = ADMIN_PATHS.some((p) => pathname.startsWith(p));
  const isClientPath = CLIENT_PATHS.some((p) => pathname.startsWith(p));

  if (isAdminPath || isClientPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/connexion", request.url));
    }
    try {
      const session = await verifySession(token);
      if (isAdminPath && session.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      const response = NextResponse.redirect(new URL("/connexion", request.url));
      response.cookies.delete("quintess-session");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/demande/:path*",
    "/profil/:path*",
    "/admin/:path*",
  ],
};
