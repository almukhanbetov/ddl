DELETE FROM products WHERE category_id IN ('tables', 'chairs', 'textile', 'decor', 'candles', 'other');
DELETE FROM subcategories WHERE category_id IN ('tables', 'chairs', 'textile', 'decor', 'candles', 'other');

UPDATE categories SET item_count = 86  WHERE id = 'tables';
UPDATE categories SET item_count = 124 WHERE id = 'chairs';
UPDATE categories SET item_count = 97  WHERE id = 'textile';
UPDATE categories SET item_count = 156 WHERE id = 'decor';
UPDATE categories SET item_count = 48  WHERE id = 'candles';
UPDATE categories SET item_count = 32  WHERE id = 'other';
