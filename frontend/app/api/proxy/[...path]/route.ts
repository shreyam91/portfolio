import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:4000/api/v1";

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
    const isGet = req.method === "GET" || req.method === "HEAD";
    const response = await fetch(url.toString(), {
      method: req.method,
      headers,
      body: !isGet ? await req.text() : undefined,
    });

    const data = await response.text();

    const responseHeaders = new Headers();
    responseHeaders.set(
      "Content-Type",
      response.headers.get("Content-Type") || "application/json"
    );

    const backendCacheControl = response.headers.get("Cache-Control");
    if (backendCacheControl) {
      responseHeaders.set("Cache-Control", backendCacheControl);
    } else if (isGet && response.ok) {
      responseHeaders.set(
        "Cache-Control",
        "public, s-maxage=60, stale-while-revalidate=300"
      );
    }

    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { message: "Internal Server Error (Proxy)", details: error.message },
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
