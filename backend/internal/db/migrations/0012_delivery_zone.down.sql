-- The old schema can't express zones or "not determined yet", so set them
-- aside; re-applying the up migration restores them from this table.
CREATE TABLE orders_delivery_zone_backup AS
SELECT id AS order_id, delivery_zone, delivery_cost IS NULL AS pending
FROM orders
WHERE delivery_zone IS NOT NULL;

ALTER TABLE orders
    DROP CONSTRAINT orders_pending_cost_outside_almaty,
    DROP CONSTRAINT orders_almaty_delivery_free,
    DROP CONSTRAINT orders_zone_only_for_delivery,
    DROP COLUMN delivery_zone;

-- Totals stay as they are: a pending order's total never included delivery.
UPDATE orders SET delivery_cost = 0 WHERE delivery_cost IS NULL;
ALTER TABLE orders ALTER COLUMN delivery_cost SET NOT NULL;
