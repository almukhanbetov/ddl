-- Deletes only the exact rows this migration's up.sql inserts — never a
-- blanket "everything in this category_id", since real data may have been
-- added to these categories after this migration ran.

DELETE FROM product_images WHERE product_id IN (
    't1', 't2', 't3', 't4', 't5', 't6',
    'c1', 'c2', 'c3', 'c4', 'c5', 'c6',
    'x1', 'x2', 'x3', 'x4', 'x5', 'x6',
    'd1', 'd2', 'd3', 'd4', 'd5', 'd6',
    'n1', 'n2', 'n3', 'n4',
    'o1', 'o2', 'o3', 'o4'
);

DELETE FROM products WHERE id IN (
    't1', 't2', 't3', 't4', 't5', 't6',
    'c1', 'c2', 'c3', 'c4', 'c5', 'c6',
    'x1', 'x2', 'x3', 'x4', 'x5', 'x6',
    'd1', 'd2', 'd3', 'd4', 'd5', 'd6',
    'n1', 'n2', 'n3', 'n4',
    'o1', 'o2', 'o3', 'o4'
);

DELETE FROM subcategories WHERE (category_id, id) IN (
    ('tables',  'round'), ('tables',  'rect'),  ('tables',  'coffee'),
    ('chairs',  'chiavari'), ('chairs',  'folding'), ('chairs',  'lounge'),
    ('textile', 'tablecloth'), ('textile', 'napkins'), ('textile', 'covers'),
    ('decor',   'arch'), ('decor',   'vases'), ('decor',   'lighting'),
    ('candles', 'candlesticks'), ('candles', 'wax'),
    ('other',   'equipment'), ('other',   'misc')
);

UPDATE categories SET item_count = 86  WHERE id = 'tables';
UPDATE categories SET item_count = 124 WHERE id = 'chairs';
UPDATE categories SET item_count = 97  WHERE id = 'textile';
UPDATE categories SET item_count = 156 WHERE id = 'decor';
UPDATE categories SET item_count = 48  WHERE id = 'candles';
UPDATE categories SET item_count = 32  WHERE id = 'other';
