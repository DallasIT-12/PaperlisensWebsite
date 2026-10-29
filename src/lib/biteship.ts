/**
 * Biteship API Client Library
 * Handles rates, tracking, and order creation.
 */

const BITESHIP_API_KEY = process.env.BITESHIP_API_KEY || '';
const BITESHIP_BASE_URL = 'https://api.biteship.com/v1';

export interface BiteshipItem {
  name: string;
  description?: string;
  value: number;
  quantity: number;
  weight: number; // in grams
  height?: number; // in cm
  width?: number; // in cm
  length?: number; // in cm
}

export interface BiteshipRateRequest {
  origin_postal_code?: number;
  origin_latitude?: number;
  origin_longitude?: number;
  destination_postal_code?: number;
  destination_latitude?: number;
  destination_longitude?: number;
  destination_area_id?: string;
  couriers: string; // comma separated: 'jne,jnt,sicepat'
  items: BiteshipItem[];
}

export interface BiteshipPricing {
  courier_name: string;
  courier_code: string;
  courier_service_name: string;
  courier_service_code: string;
  price: number;
  description: string;
  duration: string;
  shipment_duration_range: string;
  shipment_duration_unit: string;
  service_type: string;
  shipping_fee_discount: number;
  shipping_fee_surcharge: number;
}

export interface BiteshipRateResponse {
  success: boolean;
  object: string;
  message: string;
  code: number;
  pricing: BiteshipPricing[];
}

export interface BiteshipArea {
  id: string;
  name: string;
  country_name: string;
  country_code: string;
  administrative_division_level_1_name: string;
  administrative_division_level_1_type: string;
  administrative_division_level_2_name: string;
  administrative_division_level_2_type: string;
  administrative_division_level_3_name: string;
  administrative_division_level_3_type: string;
  postal_code: number;
}

export interface BiteshipAreaResponse {
  success: boolean;
  object: string;
  message: string;
  code: number;
  areas: BiteshipArea[];
}

export interface BiteshipCreateOrderRequest {
  shipper_contact_name: string;
  shipper_contact_phone: string;
  shipper_contact_email?: string;
  origin_contact_name: string;
  origin_contact_phone: string;
  origin_address: string;
  origin_note?: string;
  origin_postal_code: number;
  destination_contact_name: string;
  destination_contact_phone: string;
  destination_contact_email?: string;
  destination_address: string;
  destination_note?: string;
  destination_postal_code: number;
  destination_area_id?: string;
  courier_company: string;
  courier_type: string;
  delivery_type: 'now' | 'scheduled';
  delivery_date?: string; // yyyy-mm-dd
  delivery_time?: string; // hh:mm
  items: BiteshipItem[];
}

export interface BiteshipOrderResponse {
  success: boolean;
  message: string;
  code: number;
  id: string;
  object: string;
  status: string;
  tracking_id: string;
  waybill_id: string | null;
  courier: {
    company: string;
    type: string;
    shipment_fee: number;
    tracking_id?: string;
    waybill_id?: string | null;
    history?: any[];
    name?: string;
    phone?: string;
  };
  shipper: {
    name: string;
    phone: string;
    email: string;
  };
  origin: {
    name: string;
    phone: string;
    address: string;
    postal_code: number;
  };
  destination: {
    name: string;
    phone: string;
    address: string;
    postal_code: number;
  };
  items: BiteshipItem[];
}

export const biteship = {
  /**
   * Get shipping rates from Biteship
   */
  async getShippingRates(params: BiteshipRateRequest): Promise<BiteshipRateResponse> {
    if (!BITESHIP_API_KEY) throw new Error('BITESHIP_API_KEY is not configured');

    console.log('[Biteship] getShippingRates request:', JSON.stringify(params, null, 2));

    const response = await fetch(`${BITESHIP_BASE_URL}/rates/couriers`, {
      method: 'POST',
      headers: {
        'Authorization': BITESHIP_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    console.log('[Biteship] getShippingRates response status:', response.status);
    if (!response.ok) {
      console.error('[Biteship] getShippingRates ERROR response:', JSON.stringify(data, null, 2));
      throw new Error(data.error || data.message || `Biteship API error (${response.status}): ${JSON.stringify(data)}`);
    }
    console.log('[Biteship] getShippingRates success, pricing count:', data.pricing?.length || 0);
    return data;
  },

  /**
   * Search areas using Biteship Maps API
   */
  async searchAreas(query: string): Promise<BiteshipAreaResponse> {
    if (!BITESHIP_API_KEY) throw new Error('BITESHIP_API_KEY is not configured');

    const response = await fetch(`${BITESHIP_BASE_URL}/maps/areas?countries=ID&input=${encodeURIComponent(query)}&type=single`, {
      method: 'GET',
      headers: {
        'Authorization': BITESHIP_API_KEY,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to search areas from Biteship');
    }
    return data;
  },

  /**
   * Create an order in Biteship
   */
  async createOrder(params: BiteshipCreateOrderRequest): Promise<BiteshipOrderResponse> {
    if (!BITESHIP_API_KEY) throw new Error('BITESHIP_API_KEY is not configured');

    const response = await fetch(`${BITESHIP_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': BITESHIP_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('[Biteship] createOrder ERROR details:', JSON.stringify(data, null, 2));
      throw new Error(data.message || `Biteship Error (${response.status}): ${JSON.stringify(data)}`);
    }
    return data;
  },

  /**
   * Get order details from Biteship
   */
  async getOrder(orderId: string): Promise<BiteshipOrderResponse> {
    if (!BITESHIP_API_KEY) throw new Error('BITESHIP_API_KEY is not configured');

    const response = await fetch(`${BITESHIP_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': BITESHIP_API_KEY,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get order from Biteship');
    }
    return data;
  },

  /**
   * Cancel an order in Biteship
   */
  async cancelOrder(orderId: string, reason: string): Promise<{ success: boolean; message: string }> {
    if (!BITESHIP_API_KEY) throw new Error('BITESHIP_API_KEY is not configured');

    const response = await fetch(`${BITESHIP_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': BITESHIP_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to cancel order in Biteship');
    }
    return data;
  },

  /**
   * Get tracking details from Biteship
   */
  async getTracking(trackingId: string): Promise<any> {
    if (!BITESHIP_API_KEY) throw new Error('BITESHIP_API_KEY is not configured');

    const response = await fetch(`${BITESHIP_BASE_URL}/trackings/${trackingId}`, {
      method: 'GET',
      headers: {
        'Authorization': BITESHIP_API_KEY,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get tracking from Biteship');
    }
    return data;
  },

  /**
   * Get all supported couriers from Biteship
   */
  async getCouriers(): Promise<any> {
    if (!BITESHIP_API_KEY) throw new Error('BITESHIP_API_KEY is not configured');

    const response = await fetch(`${BITESHIP_BASE_URL}/couriers`, {
      method: 'GET',
      headers: {
        'Authorization': BITESHIP_API_KEY,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch couriers from Biteship');
    }
    return data;
  },

  /**
   * Helper to create a shipment for an order
   */
  async createShipment(order: any, items: any[]): Promise<BiteshipOrderResponse | null> {
    try {
      const biteshipItems: BiteshipItem[] = items.map(item => ({
        name: item.product_name || item.name,
        description: item.variant_name || item.variantName || 'Produk Percetakan',
        value: item.price,
        quantity: item.quantity,
        weight: item.weight || 200,
        length: 10, width: 10, height: 10
      }));

      const BITESHIP_SHIPPER_NAME = process.env.BITESHIP_SHIPPER_NAME || 'Paperlisens';
      const BITESHIP_SHIPPER_PHONE = process.env.BITESHIP_SHIPPER_PHONE || '081260001487';
      const BITESHIP_ORIGIN_ADDRESS = process.env.BITESHIP_ORIGIN_ADDRESS || 'Jl. Kilisuci No.71, Kediri';
      const BITESHIP_ORIGIN_POSTAL_CODE = parseInt(process.env.BITESHIP_ORIGIN_POSTAL_CODE || '64129');

      const addr = order.shipping_address;

      const shipment = await this.createOrder({
        shipper_contact_name: BITESHIP_SHIPPER_NAME,
        shipper_contact_phone: BITESHIP_SHIPPER_PHONE,
        origin_contact_name: BITESHIP_SHIPPER_NAME,
        origin_contact_phone: BITESHIP_SHIPPER_PHONE,
        origin_address: BITESHIP_ORIGIN_ADDRESS,
        origin_postal_code: BITESHIP_ORIGIN_POSTAL_CODE,
        destination_contact_name: addr.name,
        destination_contact_phone: addr.phone,
        destination_address: addr.address,
        destination_postal_code: parseInt(addr.postal_code) || 0,
        destination_area_id: order.destination_area_id,
        courier_company: order.courier_code,
        courier_type: order.courier_service_code,
        delivery_type: 'now',
        items: biteshipItems
      });

      return shipment;
    } catch (error) {
      console.error('[Biteship] createShipment error:', error);
      return null;
    }
  }
};
