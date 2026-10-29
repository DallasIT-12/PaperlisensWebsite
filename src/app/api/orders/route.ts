import { NextRequest, NextResponse } from 'next/server';
import { generateOrderId } from '../../../lib/payment';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const {
      customerDetails,
      items,
      paymentMethod,
      totalAmount,
      notes
    } = data;

    // Generate unique order number
    const orderNumber = generateOrderId();

    // Map product IDs to names for WhatsApp message
    const productMapping = {
      '1': 'Cup A Premium - Paper Cup 8oz Putih',
      '2': 'Cup B Standard - Paper Cup 12oz Coklat', 
      '3': 'Cup C Large - Paper Cup 16oz Premium',
      '4': 'Cup D Extra Large - Paper Cup 22oz Jumbo',
      '5': 'Cup Toast - Food Container Persegi Kecil',
      '6': 'Cup Toast Es - Food Container dengan Tutup',
      '7': 'Cup A Mini - Paper Cup 4oz untuk Espresso',
      '8': 'Cup Toast Es Premium - Leak Proof Container'
    };

    // Format items for WhatsApp message
    const itemsList = items.map((item: any) => {
      const productName = productMapping[item.id as keyof typeof productMapping] || item.name;
      return `• ${productName}\n  Qty: ${item.quantity} x Rp${item.price.toLocaleString('id-ID')} = Rp${(item.price * item.quantity).toLocaleString('id-ID')}`;
    }).join('\n');

    // Create WhatsApp message
    const waMessage = encodeURIComponent(`*PESANAN BARU - ${orderNumber}*

*Detail Pelanggan:*
Nama: ${customerDetails.first_name}
Telepon: ${customerDetails.phone}
${customerDetails.email ? `Email: ${customerDetails.email}` : ''}
Alamat: ${customerDetails.billing_address.address}, ${customerDetails.billing_address.city}
${customerDetails.billing_address.postal_code ? `Kode Pos: ${customerDetails.billing_address.postal_code}` : ''}

*Detail Pesanan:*
${itemsList}

*Subtotal: Rp${(totalAmount - 15000).toLocaleString('id-ID')}*
*Ongkir: Rp15.000*
*TOTAL: Rp${totalAmount.toLocaleString('id-ID')}*

*Metode Pembayaran:* ${paymentMethod === 'cod' ? 'Bayar di Tempat (COD)' : paymentMethod === 'transfer' ? 'Transfer Bank' : 'E-Wallet'}

${notes ? `*Catatan:* ${notes}` : ''}

Terima kasih sudah berbelanja di Paperlisens! 🙏`);

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/6281260001487?text=${waMessage}`;

    return NextResponse.json({
      success: true,
      data: {
        orderNumber,
        whatsappUrl,
        message: 'Order berhasil dibuat. Silakan lanjutkan ke WhatsApp untuk konfirmasi.'
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Database-free implementation - redirect to WhatsApp for order management
  return NextResponse.json({
    success: false,
    message: 'Order management dilakukan melalui WhatsApp. Hubungi 081260001487',
    whatsappUrl: 'https://wa.me/6281260001487?text=Halo, saya ingin menanyakan status pesanan.'
  }, { status: 200 });
}