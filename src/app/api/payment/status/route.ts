import { NextRequest, NextResponse } from 'next/server';
import { getTransactionStatus } from '@/lib/midtrans';

/**
 * GET /api/payment/status?orderId=PL-xxx
 * Polling endpoint for frontend to check QRIS payment status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ error: 'orderId wajib diisi' }, { status: 400 });
    }

    const status = await getTransactionStatus(orderId);

    return NextResponse.json({
      success: true,
      data: {
        orderId: status.order_id,
        transactionStatus: status.transaction_status,
        paymentType: status.payment_type,
        grossAmount: status.gross_amount,
        settlementTime: status.settlement_time || null,
        expiryTime: status.expiry_time || null,
      },
    });
  } catch (error: any) {
    console.error('[Payment Status] Error:', error);
    // If transaction not found, return pending status
    return NextResponse.json({
      success: true,
      data: {
        transactionStatus: 'pending',
      },
    });
  }
}
