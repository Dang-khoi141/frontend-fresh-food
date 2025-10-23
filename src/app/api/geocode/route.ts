import { NextRequest, NextResponse } from "next/server";

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.trim();

  if (!query || query.length < 3) {
    return NextResponse.json({ error: "Query too short" }, { status: 400 });
  }

  const cached = cache.get(query);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5&countrycodes=vn`,
      {
        headers: {
          "User-Agent": "FreshFoodApp/1.0 (contact@yourapp.com)",
          "Accept-Language": "vi",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Nominatim API error: ${res.status}`);
    }

    const data = await res.json();

    cache.set(query, { data, timestamp: Date.now() });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Geocoding error:", error);
    return NextResponse.json(
      { error: "Failed to fetch geocoding data" },
      { status: 500 }
    );
  }
}
