import { biteship } from './biteship';

/**
 * Synchronizes a single order's status with the latest shipment status from Biteship.
 * Updates local database and returns the updated order structure.
 */
export async function syncOrderWithBiteship(order: any, supabase: any): Promise<any> {
  if (!order || !order.biteship_order_id) {
    return order;
  }

  // If order is already in a terminal state, no need to sync anymore
  if (['completed', 'cancelled', 'expired'].includes(order.status)) {
    return order;
  }

  try {
    console.log(`[Biteship Sync] Fetching shipment status from Biteship for Order ID: ${order.biteship_order_id} (Local Order: #${order.order_number})`);
    const shipment = await biteship.getOrder(order.biteship_order_id);
    
    if (!shipment) {
      console.warn(`[Biteship Sync] No shipment details found for Biteship Order ID: ${order.biteship_order_id}`);
      return order;
    }

    const currentBiteshipStatus = shipment.status; // e.g., 'confirmed', 'picked', 'delivered', 'cancelled'
    const waybillId = shipment.courier?.waybill_id || shipment.waybill_id;
    const biteshipTrackingId = shipment.courier?.tracking_id || shipment.tracking_id;
    const history = shipment.courier?.history || [];

    // Map Biteship status to our internal order status
    let mappedStatus = order.status;
    switch (currentBiteshipStatus) {
      case 'picked':
      case 'in_transit':
      case 'dropping_off':
        mappedStatus = 'shipped';
        break;
      case 'delivered':
        mappedStatus = 'completed'; // Correctly map 'delivered' to our terminal 'completed' status
        break;
      case 'cancelled':
      case 'rejected':
        mappedStatus = 'cancelled';
        break;
      case 'confirmed':
      case 'allocated':
      case 'picking_up':
        mappedStatus = 'processing';
        break;
    }

    const updates: any = {};
    let hasChanges = false;

    if (mappedStatus !== order.status) {
      console.log(`[Biteship Sync] Updating status from '${order.status}' to '${mappedStatus}'`);
      updates.status = mappedStatus;
      hasChanges = true;
    }
    if (currentBiteshipStatus !== order.tracking_status) {
      console.log(`[Biteship Sync] Updating tracking_status from '${order.tracking_status}' to '${currentBiteshipStatus}'`);
      updates.tracking_status = currentBiteshipStatus;
      hasChanges = true;
    }
    if (waybillId && waybillId !== order.waybill_id) {
      console.log(`[Biteship Sync] Updating waybill_id from '${order.waybill_id}' to '${waybillId}'`);
      updates.waybill_id = waybillId;
      hasChanges = true;
    }
    if (biteshipTrackingId && biteshipTrackingId !== order.biteship_tracking_id) {
      console.log(`[Biteship Sync] Updating biteship_tracking_id from '${order.biteship_tracking_id}' to '${biteshipTrackingId}'`);
      updates.biteship_tracking_id = biteshipTrackingId;
      hasChanges = true;
    }
    if (history && history.length > 0 && JSON.stringify(history) !== JSON.stringify(order.tracking_history)) {
      console.log(`[Biteship Sync] Updating tracking history`);
      updates.tracking_history = history;
      hasChanges = true;
    }

    if (hasChanges) {
      updates.updated_at = new Date().toISOString();
      const { data: updatedOrder, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', order.id)
        .select()
        .single();

      if (error) {
        console.error(`[Biteship Sync] Database update error for order #${order.order_number}:`, error);
      } else if (updatedOrder) {
        console.log(`[Biteship Sync] Successfully updated order #${order.order_number} in DB.`);
        // Preserve order_items in returned object
        return { ...updatedOrder, order_items: order.order_items };
      }
    }
  } catch (error: any) {
    console.error(`[Biteship Sync] Error during order sync for #${order.order_number}:`, error.message || error);
  }

  return order;
}
