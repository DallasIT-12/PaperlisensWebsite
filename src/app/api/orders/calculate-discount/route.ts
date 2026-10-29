import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { items, shippingCost } = await request.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Items required' }, { status: 400 });
    }

    // 1. Calculate flat 10% discount pool = Σ (price * 0.1) * qty
    let marginPool = 0;
    items.forEach(item => {
      marginPool += Math.round(item.price * 0.1) * item.quantity;
    });

    // 2. shipping_discount = Math.min(marginPool, shippingCost)
    const shippingDiscount = Math.min(marginPool, shippingCost || 0);

    // 3. excess = marginPool - shipping_discount
    const excess = marginPool - shippingDiscount;

    // 4. product_discount = excess (to show as voucher)
    const productDiscount = excess > 0 ? excess : 0;

    const totalDiscount = shippingDiscount + productDiscount;
    const finalShipping = Math.max(0, (shippingCost || 0) - shippingDiscount);

    return NextResponse.json({
      success: true,
      margin_pool: marginPool,
      shipping_discount: shippingDiscount,
      final_shipping: finalShipping,
      product_discount: productDiscount,
      total_discount: totalDiscount,
      message: shippingDiscount >= (shippingCost || 0) ? 'Gratis Ongkir!' : 'Ongkir Disubsidi'
    });
  } catch (error: any) {
    console.error('[Calculate Discount] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
