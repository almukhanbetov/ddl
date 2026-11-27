import type { DeliveryZone } from './api';

/**
 * Delivery cost by zone, as in backend/internal/delivery (OutsideAlmatyCost).
 * The cart only shows it; the API works the cost out itself for the order.
 */
export const DELIVERY_COST: Record<DeliveryZone, number> = {
  almaty: 0,
  almaty_region: 30_000,
  other_region: 30_000,
};

/** Cost for the chosen method and zone; null while no zone is picked. */
export function deliveryCost(method: 'delivery' | 'pickup', zone: DeliveryZone | ''): number | null {
  if (method === 'pickup') return 0;
  return zone === '' ? null : DELIVERY_COST[zone];
}
