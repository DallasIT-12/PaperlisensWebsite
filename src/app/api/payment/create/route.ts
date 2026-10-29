import { NextRequest, NextResponse } from 'next/server';
import { createSnapTransaction } from '@/lib/midtrans';
import { createClient } from '@supabase/supabase-js';
import { generateOrderId } from '@/lib/payment';
import { biteship } from '@/lib/biteship';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      items, customer, shippingCost, shippingCourier, shippingService, shippingEtd, 
      userId, notes, paymentMethod, courierCode, courierServiceCode, destinationAreaId,
      shippingDiscount, productDiscount, originalShippingCost, adminFee
    } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Item pesanan tidak boleh kosong' }, { status: 400 });
    }
    if (!customer?.name || !customer?.phone) {
      return NextResponse.json({ error: 'Nama dan nomor telepon wajib diisi' }, { status: 400 });
    }
    if (!customer?.address || !customer?.city) {
      return NextResponse.json({ error: 'Alamat pengiriman wajib diisi' }, { status: 400 });
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const shipping = shippingCost || 0;
    const baseTotal = subtotal + shipping - (productDiscount || 0);
    let fee = 0;
    if (paymentMethod === 'qris') {
      fee = adminFee !== undefined ? adminFee : Math.round(baseTotal * 0.007);
    } else if (paymentMethod === 'bank_transfer') {
      fee = 4000;
    } else if (paymentMethod === 'credit_card') {
      fee = adminFee !== undefined ? adminFee : (Math.round(baseTotal * 0.029) + 2000);
    } else if (paymentMethod === 'cstore') {
      fee = 5000;
    } else if (paymentMethod === 'paylater') {
      fee = adminFee !== undefined ? adminFee : Math.round(baseTotal * 0.02);
    } else if (paymentMethod === 'direct_debit') {
      fee = 5000;
    }

    const total = baseTotal + fee;

    // Generate order ID
    const orderNumber = generateOrderId();
    const midtransOrderId = `PL-${orderNumber}`;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Shared order data
    const shippingAddress = {
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      district: customer.district || '',
      province: customer.province || '',
      postal_code: customer.postalCode || '',
    };

    // Helper: save order items
    const saveOrderItems = async (orderId: string) => {
      const orderItems = items.map((item: any) => ({
        order_id: orderId,
        product_id: String(item.productId || item.id),
        variant_id: item.variantId || null,
        product_name: item.name,
        variant_name: item.variantName || null,
        price: item.price,
        quantity: item.quantity,
        image: item.image || null,
        weight: item.weight || 200,
      }));
      const { error } = await supabase.from('order_items').insert(orderItems);
      if (error) console.error('[Payment] Order items save error:', error);
    };

    // ==========================================
    // COD Flow: skip Midtrans, save order directly
    // ==========================================
    if (paymentMethod === 'cod') {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: userId || null,
          guest_name: !userId ? customer.name : null,
          guest_email: !userId ? customer.email : null,
          guest_phone: !userId ? customer.phone : null,
          status: 'processing',
          payment_status: 'cod',
          payment_method: 'cod',
          midtrans_order_id: midtransOrderId,
          subtotal,
          shipping_cost: shipping,
          shipping_discount: shippingDiscount || 0,
          product_discount: productDiscount || 0,
          original_shipping_cost: originalShippingCost || 0,
          admin_fee: 0,
          total,
          shipping_address: shippingAddress,
          shipping_courier: shippingCourier || null,
          shipping_service: shippingService || null,
          shipping_etd: shippingEtd || null,
          courier_code: courierCode || null,
          courier_service_code: courierServiceCode || null,
          destination_area_id: destinationAreaId || null,
          notes: notes || null,
        })
        .select('*')
        .single();

      if (orderError) {
        console.error('[Payment] COD order save error:', orderError);
        return NextResponse.json({ error: 'Gagal menyimpan pesanan' }, { status: 500 });
      }

      await saveOrderItems(order.id);
      
      console.log(`[Payment] COD order created: ${orderNumber}`);

      return NextResponse.json({
        success: true,
        data: { orderId: order.id, orderNumber, midtransOrderId },
      });
    }

    // ==========================================
    // QRIS Flow: create Midtrans Snap transaction
    // ==========================================
    const midtransItems = items.map((item: any) => ({
      id: String(item.productId || item.id),
      name: (item.name || 'Produk').substring(0, 50),
      price: item.price,
      quantity: item.quantity,
    }));

    if (shipping > 0) {
      midtransItems.push({
        id: 'SHIPPING',
        name: `Ongkir ${shippingCourier || ''} ${shippingService || ''}`.trim().substring(0, 50),
        price: shipping,
        quantity: 1,
      });
    }

    if (productDiscount > 0) {
      midtransItems.push({
        id: 'DISCOUNT',
        name: 'Diskon Produk',
        price: -productDiscount,
        quantity: 1,
      });
    }

    if (fee > 0) {
      let feeName = 'Biaya Admin';
      if (paymentMethod === 'qris') {
        feeName = 'Biaya Admin QRIS (0.7%)';
      } else if (paymentMethod === 'bank_transfer') {
        feeName = 'Biaya Admin Transfer Bank';
      } else if (paymentMethod === 'credit_card') {
        feeName = 'Biaya Admin Kartu Kredit (2.9% + Rp2.000)';
      } else if (paymentMethod === 'cstore') {
        feeName = 'Biaya Admin Gerai Minimarket';
      } else if (paymentMethod === 'paylater') {
        feeName = 'Biaya Admin PayLater (2.0%)';
      } else if (paymentMethod === 'direct_debit') {
        feeName = 'Biaya Admin Internet Banking';
      }

      midtransItems.push({
        id: 'ADMIN_FEE',
        name: feeName,
        price: fee,
        quantity: 1,
      });
    }

    let enabledPayments: string[] | undefined = undefined;
    if (paymentMethod === 'qris') {
      enabledPayments = ["gopay", "shopeepay", "other_qris"];
    } else if (paymentMethod === 'bank_transfer') {
      enabledPayments = ["bca_va", "bni_va", "bri_va", "permata_va", "cimb_va", "other_va", "echannel"];
    } else if (paymentMethod === 'credit_card') {
      enabledPayments = ["credit_card"];
    } else if (paymentMethod === 'cstore') {
      enabledPayments = ["alfamart", "indomaret"];
    } else if (paymentMethod === 'paylater') {
      enabledPayments = ["akulaku", "kredivo"];
    } else if (paymentMethod === 'direct_debit') {
      enabledPayments = ["bca_klikpay", "bca_klikbca", "cimb_clicks", "danamon_online", "bri_epay"];
    }

    const snapResult = await createSnapTransaction({
      orderId: midtransOrderId,
      grossAmount: total,
      items: midtransItems,
      customer: {
        first_name: customer.name,
        email: customer.email || `${customer.phone}@guest.paperlisens.com`,
        phone: customer.phone,
        shipping_address: {
          first_name: customer.name,
          address: customer.address,
          city: customer.city,
          postal_code: customer.postalCode || '',
          phone: customer.phone,
        },
      },
      enabledPayments,
    });

    // 1. Create order in DB (status: pending_payment)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: userId || null,
        guest_name: !userId ? customer.name : null,
        guest_email: !userId ? customer.email : null,
        guest_phone: !userId ? customer.phone : null,
        status: 'pending_payment',
        payment_status: 'pending',
        payment_method: paymentMethod || 'qris',
        midtrans_order_id: midtransOrderId,
        subtotal,
        shipping_cost: shipping,
        shipping_discount: shippingDiscount || 0,
        product_discount: productDiscount || 0,
        original_shipping_cost: originalShippingCost || 0,
        admin_fee: fee,
        total,
        shipping_address: shippingAddress,
        shipping_courier: shippingCourier || null,
        shipping_service: shippingService || null,
        shipping_etd: shippingEtd || null,
        courier_code: courierCode || null,
        courier_service_code: courierServiceCode || null,
        destination_area_id: destinationAreaId || null,
        notes: notes || null,
      })
      .select('*')
      .single();

    if (orderError) {
      console.error('[Payment] Order save error:', orderError);
      return NextResponse.json({ error: 'Gagal menyimpan pesanan' }, { status: 500 });
    }

    await saveOrderItems(order.id);

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber,
        midtransOrderId,
        snapToken: snapResult.token,
        redirectUrl: snapResult.redirect_url,
      },
    });
  } catch (error: any) {
    console.error('[Payment] Create error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal membuat pembayaran' },
      { status: 500 }
    );
  }
}
