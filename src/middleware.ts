// middleware.ts or middleware.js
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: "/api/:path*", // Apply only to API routes
};

export default function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");

  const allowedOrigins =
    process.env.NODE_ENV === "production"
      ? [`${process.env.FRONTEND_ORIGIN}`]
      : ["http://localhost:3000", "http://localhost:5173"];

  const isAllowedOrigin = origin && allowedOrigins.includes(origin);

  if (request.method === "OPTIONS") {
    const preflightHeaders: HeadersInit = {
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With, Accept",
      "Access-Control-Max-Age": "86400",
    };

    if (isAllowedOrigin) {
      preflightHeaders["Access-Control-Allow-Origin"] = origin!;
      preflightHeaders["Access-Control-Allow-Credentials"] = "true";
    } else {
    }

    return new Response(null, { status: 204, headers: preflightHeaders });
  }

  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin!);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept"
  );

  return response;
}
