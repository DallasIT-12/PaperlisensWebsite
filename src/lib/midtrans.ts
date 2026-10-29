/**
 * Midtrans Snap API - Server-side integration
 * Uses direct HTTP calls (no SDK dependency needed)
 */

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || '';
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true' || process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true';

const BASE_URL = IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/v1'
  : 'https://app.sandbox.midtrans.com/snap/v1';

const CORE_API_URL = IS_PRODUCTION
  ? 'https://api.midtrans.com/v2'
  : 'https://api.sandbox.midtrans.com/v2';

export const SNAP_JS_URL = IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/snap.js'
  : 'https://app.sandbox.midtrans.com/snap/snap.js';

function getAuthHeader() {
  const key = (MIDTRANS_SERVER_KEY || '').trim();
  
  // FORCE LOG AS ERROR TO ENSURE VISIBILITY
  console.error('[Midtrans Debug Check]', {
    isProductionVar: process.env.MIDTRANS_IS_PRODUCTION,
    isProductionCalculated: IS_PRODUCTION,
    keyPrefix: key.substring(0, 11),
    keyLength: key.length,
    targetEndpoint: BASE_URL
  });

  return 'Basic ' + Buffer.from(key + ':').toString('base64');
}

export interface MidtransItemDetail {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface MidtransCustomerDetail {
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
  billing_address?: {
    address: string;
    city: string;
    postal_code?: string;
  };
  shipping_address?: {
    first_name: string;
    address: string;
    city: string;
    postal_code?: string;
    phone: string;
  };
}

export interface CreateTransactionParams {
  orderId: string;
  grossAmount: number;
  items: MidtransItemDetail[];
  customer: MidtransCustomerDetail;
  enabledPayments?: string[];
}

/**
 * Create a Snap transaction and get the token + redirect URL
 */
export async function createSnapTransaction(params: CreateTransactionParams) {
  const { orderId, grossAmount, items, customer, enabledPayments } = params;

  const authHeader = getAuthHeader();

  const payload = {
    transaction_details: {
      order_id: orderId,
      gross_amount: grossAmount,
    },
    item_details: items.map(item => ({
      id: item.id,
      name: item.name.substring(0, 50),
      price: item.price,
      quantity: item.quantity,
    })),
    customer_details: {
      first_name: customer.first_name,
      last_name: customer.last_name || '',
      email: customer.email,
      phone: customer.phone,
      billing_address: customer.billing_address,
      shipping_address: customer.shipping_address,
    },
    enabled_payments: enabledPayments || [
      "credit_card", "cimb_clicks", "bca_klikbca", "bca_klikpay", "bri_epay", 
      "echannel", "permata_va", "bca_va", "bni_va", "bri_va", "cimb_va", 
      "other_va", "gopay", "indomaret", "alfamart", "danamon_online", "akulaku", 
      "shopeepay", "kredivo", "uob_ezpay", "other_qris"
    ],
    credit_card: {
      secure: true,
    },
    expiry: {
      unit: "minutes",
      duration: 30
    }
  };

  const response = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('[Midtrans] Create transaction error:', response.status, errorData);
    throw new Error(`Midtrans error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return {
    token: data.token as string,
    redirect_url: data.redirect_url as string,
  };
}

/**
 * Verify transaction status from Midtrans Core API
 */
export async function getTransactionStatus(orderIdOrTransactionId: string) {
  const response = await fetch(`${CORE_API_URL}/${orderIdOrTransactionId}/status`, {
    method: 'GET',
    headers: {
      'Authorization': getAuthHeader(),
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Midtrans status error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

/**
 * Verify the signature of a Midtrans webhook notification
 */
export function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string
): string {
  const crypto = require('crypto');
  const input = orderId + statusCode + grossAmount + MIDTRANS_SERVER_KEY.trim();
  return crypto.createHash('sha512').update(input).digest('hex');
}

/**
 * Map Midtrans transaction status to our order status
 */
export function mapTransactionStatus(transactionStatus: string, fraudStatus?: string): {
  orderStatus: string;
  paymentStatus: string;
} {
  switch (transactionStatus) {
    case 'capture':
      if (fraudStatus === 'accept') {
        return { orderStatus: 'paid', paymentStatus: 'paid' };
      }
      return { orderStatus: 'pending_payment', paymentStatus: 'unpaid' };

    case 'settlement':
      return { orderStatus: 'paid', paymentStatus: 'paid' };

    case 'pending':
      return { orderStatus: 'pending_payment', paymentStatus: 'unpaid' };

    case 'deny':
    case 'cancel':
      return { orderStatus: 'cancelled', paymentStatus: 'failed' };

    case 'expire':
      return { orderStatus: 'expired', paymentStatus: 'expired' };

    case 'refund':
    case 'partial_refund':
      return { orderStatus: 'cancelled', paymentStatus: 'refunded' };

    default:
      return { orderStatus: 'pending_payment', paymentStatus: 'unpaid' };
  }
}
