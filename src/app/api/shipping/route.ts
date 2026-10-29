import { NextRequest, NextResponse } from 'next/server';
import { biteship, BiteshipItem } from '@/lib/biteship';

const BITESHIP_ORIGIN_POSTAL_CODE = parseInt(process.env.BITESHIP_ORIGIN_POSTAL_CODE || '64129');

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const destinationAreaId = searchParams.get('destination'); // Biteship area_id
        const weight = parseInt(searchParams.get('weight') || '1000');
        const courierStr = searchParams.get('courier') || 'jne,jnt,sicepat,anteraja,ninja,lion,grab,gojek,paxel,idexpress';
        
        const couriers = courierStr.replace(/:/g, ',');

        if (!destinationAreaId) {
            return NextResponse.json({ error: 'Destination ID wajib diisi' }, { status: 400 });
        }

        const items: BiteshipItem[] = [
            {
                name: 'Cetak Kemasan',
                description: 'Produk Percetakan',
                value: 50000,
                quantity: 1,
                weight: weight,
                length: 10, width: 10, height: 10
            }
        ];

        const data = await biteship.getShippingRates({
            origin_postal_code: BITESHIP_ORIGIN_POSTAL_CODE,
            destination_area_id: destinationAreaId,
            couriers: couriers,
            items: items
        });

        const costs = data.pricing.map((p) => ({
            code: p.courier_code,
            name: p.courier_name,
            service: p.courier_service_name,
            service_code: p.courier_service_code,
            price: String(p.price),
            estimated: p.duration || p.shipment_duration_range
        }));

        return NextResponse.json({
            status: 200,
            data: {
                summary: {
                    courier: couriers.split(','),
                    destination: destinationAreaId,
                    weight: weight + 'g'
                },
                costs: costs
            }
        });
    } catch (error: any) {
        console.error('[Shipping API] GET Error:', error.message);
        // User requested to hide couriers on error (like empty balance)
        return NextResponse.json({
            status: 200,
            data: { costs: [] },
            error: error.message
        });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { destination_area_id, destination_postal_code, items, couriers } = body;

        if (!destination_area_id && !destination_postal_code) {
            return NextResponse.json({ error: 'Destination wajib diisi' }, { status: 400 });
        }

        // Use a broad list of couriers if none specified
        const courierList = couriers || 'jne,jnt,sicepat,anteraja,ninja,lion,grab,gojek,paxel,idexpress';

        const data = await biteship.getShippingRates({
            origin_postal_code: BITESHIP_ORIGIN_POSTAL_CODE,
            destination_area_id,
            destination_postal_code,
            couriers: courierList,
            items: items
        });

        const costs = data.pricing.map((p) => ({
            code: p.courier_code,
            name: p.courier_name,
            service: p.courier_service_name,
            service_code: p.courier_service_code,
            price: String(p.price),
            estimated: p.duration || p.shipment_duration_range
        }));

        return NextResponse.json({
            status: 200,
            data: {
                summary: {
                    courier: courierList.split(','),
                    destination: destination_area_id || destination_postal_code,
                    weight: items.reduce((sum: number, i: any) => sum + (i.weight * i.quantity), 0) + 'g'
                },
                costs: costs
            }
        });
    } catch (error: any) {
        console.error('[Shipping API] POST Error:', error.message);
        // User requested to hide couriers on error (like empty balance)
        return NextResponse.json({
            status: 200,
            data: { costs: [] },
            error: error.message
        });
    }
}
