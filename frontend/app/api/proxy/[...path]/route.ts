import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export const dynamic = "force-dynamic";

async function functionProxy(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await context.params;
  const path = resolvedParams.path.join("/");
  const url = new URL(`${API_BASE_URL}/${path}`);
  url.search = req.nextUrl.search; // append query params

  const headers = new Headers(req.headers);
  headers.delete("host"); // Let fetch set the correct host

  try {
    const response = await fetch(url.toString(), {
      method: req.method,
      headers,
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? await req.text()
          : undefined,
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error (Proxy)" },
      { status: 500 },
    );
  }
}

export {
  functionProxy as GET,
  functionProxy as POST,
  functionProxy as PUT,
  functionProxy as PATCH,
  functionProxy as DELETE,
};
