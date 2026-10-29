import { NextRequest, NextResponse } from 'next/server';
import { biteship } from '@/lib/biteship';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'search';
        const q = searchParams.get('q') || searchParams.get('search') || '';

        if (type === 'search' || type === 'destination') {
            if (!q || q.length < 3) {
                return NextResponse.json({ value: [] });
            }

            const data = await biteship.searchAreas(q);
            
            const mappedData = data.areas.map((item: any) => ({
                id: item.id, // Biteship area_id
                name: `${item.administrative_division_level_3_name}, ${item.administrative_division_level_2_name}, ${item.administrative_division_level_1_name}`,
                postal_code: item.postal_code
            }));

            return NextResponse.json({ value: mappedData });
        } else {
            // For other types (provinsi, kabupaten) which were RajaOngkir specific, 
            // we return empty or handle if needed. 
            // In the new Biteship flow, we mostly use direct search.
            return NextResponse.json({ value: [] });
        }
    } catch (error: any) {
        console.error('[Wilayah API] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Terjadi kesalahan server' },
            { status: 500 }
        );
    }
}
