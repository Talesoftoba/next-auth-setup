// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  () => NextResponse.next(),
  {
    callbacks: {
      authorized: ({ token }) => !!token, // allow only logged-in users
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"], // protect dashboard and subroutes
};