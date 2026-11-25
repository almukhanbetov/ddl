-- delivery_cost IS NULL means "to be confirmed by a manager" (0 means free).
-- Orders placed before this migration keep delivery_zone NULL and their saved sums.
ALTER TABLE orders
    ADD COLUMN delivery_zone TEXT
        CHECK (delivery_zone IN ('almaty', 'almaty_region', 'other_region')),
    ALTER COLUMN delivery_cost DROP NOT NULL;

-- Re-applying after a rollback: bring back what the down migration set aside.
DO $$
BEGIN
    IF to_regclass('orders_delivery_zone_backup') IS NOT NULL THEN
        UPDATE orders o
        SET delivery_zone = b.delivery_zone,
            delivery_cost = CASE WHEN b.pending AND o.delivery_cost = 0 THEN NULL ELSE o.delivery_cost END
        FROM orders_delivery_zone_backup b
        WHERE b.order_id = o.id;
        DROP TABLE orders_delivery_zone_backup;
    END IF;
END $$;

ALTER TABLE orders
    ADD CONSTRAINT orders_zone_only_for_delivery
        CHECK (delivery_zone IS NULL OR delivery_method = 'delivery'),
    ADD CONSTRAINT orders_almaty_delivery_free
        CHECK (delivery_zone IS DISTINCT FROM 'almaty' OR COALESCE(delivery_cost, -1) = 0),
    ADD CONSTRAINT orders_pending_cost_outside_almaty
        CHECK (delivery_cost IS NOT NULL OR COALESCE(delivery_zone IN ('almaty_region', 'other_region'), FALSE));
