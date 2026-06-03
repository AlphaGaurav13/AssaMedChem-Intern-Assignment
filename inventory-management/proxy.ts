export { auth as proxy } from "@/lib/auth";

export const config = {
  matcher: ["/admin/:path*", "/quotation/:path*", "/order/:path*", "/login", "/signup"],
};