import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/geocode?q=NGAMPEL, KEDIRI, JAWA TIMUR
 * Geocodes an address via Nominatim, calculates estimated road distance from store.
 * Uses Haversine × 1.4 road factor (standard for urban areas).
 */

// Store: Jl. Kilisuci No.71, Setono Pande, Kec. Kota, Kota Kediri
const STORE_LAT = -7.8148;
const STORE_LNG = 112.0115;
const ROAD_FACTOR = 1.4; // urban road distance ≈ 1.4× straight-line

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (!q || q.length < 3) {
    return NextResponse.json({ lat: null, lng: null, roadDistanceKm: null });
  }

  try {
    // Clean up query: "NGAMPEL, KEDIRI, JAWA TIMUR" → "Ngampel, Kediri"
    // Remove province (last segment) for better Nominatim results, add "Indonesia"
    const parts = q.split(',').map(s => s.trim());
    let searchQuery = q;
    if (parts.length >= 3) {
      // Drop province, keep district + city
      searchQuery = parts.slice(0, 2).join(', ');
    }
    searchQuery += ', Indonesia';

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&countrycodes=id`,
      {
        headers: {
          'User-Agent': 'DallasPrinting/1.0 (dallas-printingid.com)',
          'Accept-Language': 'id',
        },
      }
    );

    const geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
      // Retry with full original query if cleaned version fails
      const retryRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ', Indonesia')}&format=json&limit=1&countrycodes=id`,
        {
          headers: {
            'User-Agent': 'DallasPrinting/1.0 (dallas-printingid.com)',
            'Accept-Language': 'id',
          },
        }
      );
      const retryData = await retryRes.json();

      if (!retryData || retryData.length === 0) {
        console.log('[Geocode] No results for:', q);
        return NextResponse.json({ lat: null, lng: null, roadDistanceKm: null });
      }

      const lat = parseFloat(retryData[0].lat);
      const lng = parseFloat(retryData[0].lon);
      const straight = haversine(STORE_LAT, STORE_LNG, lat, lng);
      const road = Math.round(straight * ROAD_FACTOR * 10) / 10;

      return NextResponse.json({ lat, lng, roadDistanceKm: road });
    }

    const lat = parseFloat(geoData[0].lat);
    const lng = parseFloat(geoData[0].lon);
    const straight = haversine(STORE_LAT, STORE_LNG, lat, lng);
    const road = Math.round(straight * ROAD_FACTOR * 10) / 10;

    console.log(`[Geocode] "${q}" → ${lat},${lng} | straight: ${straight.toFixed(1)}km → road: ${road}km`);

    return NextResponse.json({ lat, lng, roadDistanceKm: road });
  } catch (err) {
    console.error('[Geocode] Error:', err);
    return NextResponse.json({ lat: null, lng: null, roadDistanceKm: null });
  }
}
