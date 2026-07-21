INSERT INTO categories (id, name, item_count, image_url, position) VALUES
    ('tables',  'Столы',    86,  'https://picsum.photos/seed/rently-tables-cover/640/480',  1),
    ('chairs',  'Стулья',   124, 'https://picsum.photos/seed/rently-chairs-cover/640/480',  2),
    ('dishes',  'Посуда',   210, 'https://picsum.photos/seed/rently-dishes-cover/640/480',  3),
    ('textile', 'Текстиль', 97,  'https://picsum.photos/seed/rently-textile-cover/640/480', 4),
    ('decor',   'Декор',    156, 'https://picsum.photos/seed/rently-decor-cover/640/480',   5),
    ('candles', 'Свечи',    48,  'https://picsum.photos/seed/rently-candles-cover/640/480', 6),
    ('other',   'Другое',   32,  'https://picsum.photos/seed/rently-other-cover/640/480',   7);

INSERT INTO subcategories (id, category_id, name, item_count, position) VALUES
    ('plates',  'dishes', 'Тарелки',                 64, 1),
    ('glasses', 'dishes', 'Бокалы и стаканы',         52, 2),
    ('cutlery', 'dishes', 'Столовые приборы',         38, 3),
    ('serving', 'dishes', 'Сервировочные блюда',      29, 4),
    ('tea',     'dishes', 'Чайные и кофейные пары',   18, 5),
    ('access',  'dishes', 'Аксессуары',                9, 6);

INSERT INTO products (id, category_id, subcategory_id, name, article, stock, price_day, damage_cost, image_url, description) VALUES
    ('p1',  'dishes', 'plates',  'Тарелка обеденная Nordic White, 27 см',     'DS-1042', 38, 500, 4950,  'https://picsum.photos/seed/plate-nordic-main/800/800', 'Обеденная тарелка для сервировки банкетов и торжеств.'),
    ('p2',  'dishes', 'plates',  'Тарелка закусочная Nordic White, 20 см',    'DS-1043', 52, 330, 3300,  'https://picsum.photos/seed/plate-nordic-side/800/800', 'Закусочная тарелка, дополняет основную сервировку.'),
    ('p3',  'dishes', 'glasses', 'Бокал для вина Bordeaux, 350 мл',           'DS-2101', 6,  250, 2500,  'https://picsum.photos/seed/glass-wine-bordo/800/800', 'Бокал для красного вина классической формы.'),
    ('p4',  'dishes', 'glasses', 'Стакан хайбол Prime, 320 мл',               'DS-2102', 0,  190, 1650,  'https://picsum.photos/seed/glass-highball-x/800/800', 'Универсальный стакан для безалкогольных напитков и коктейлей.'),
    ('p5',  'dishes', 'cutlery', 'Набор столовых приборов Rustic, 3 предмета','DS-3010', 74, 390, 4400,  'https://picsum.photos/seed/cutlery-rustic-set/800/800', 'Нож, вилка и ложка в едином наборе.'),
    ('p6',  'dishes', 'serving', 'Блюдо сервировочное овальное Terra, 40 см', 'DS-4005', 14, 830, 9900,  'https://picsum.photos/seed/serving-terra-oval/800/800', 'Крупное блюдо для подачи горячих и холодных закусок.'),
    ('p7',  'dishes', 'tea',     'Чайная пара Porcelain Blanc',               'DS-5002', 22, 600, 7150,  'https://picsum.photos/seed/tea-blanc-pair/800/800', 'Чашка с блюдцем из тонкого фарфора.'),
    ('p8',  'dishes', 'serving', 'Салатник керамический Terra, 24 см',        'DS-4009', 31, 520, 5500,  'https://picsum.photos/seed/salad-terra-bowl/800/800', 'Салатник для подачи закусок и гарниров.'),
    ('p9',  'dishes', 'access',  'Ваза для фруктов Nordic, высокая',          'DS-6001', 9,  990, 12100, 'https://picsum.photos/seed/vase-fruit-tall/800/800', 'Высокая ваза для фруктовой композиции на столе.'),
    ('p10', 'dishes', 'glasses', 'Бокал для шампанского Flute, 200 мл',       'DS-2110', 41, 220, 2200,  'https://picsum.photos/seed/flute-glass-champ/800/800', 'Узкий бокал для игристых вин.'),
    ('p11', 'dishes', 'plates',  'Тарелка десертная Nordic White, 17 см',     'DS-1044', 60, 280, 2750,  'https://picsum.photos/seed/plate-dessert-w/800/800', 'Small-plate для десертов и канапе.'),
    ('p12', 'dishes', 'tea',     'Кофейная пара Espresso Noir',               'DS-5008', 17, 550, 6050,  'https://picsum.photos/seed/coffee-noir-pair/800/800', 'Чашка для эспрессо с блюдцем, тёмная керамика.');

INSERT INTO product_images (product_id, position, image_url)
SELECT p.id, s.pos, 'https://picsum.photos/seed/' || p.seed || s.suffix || '/1000/860'
FROM (VALUES
    ('p1',  'plate-nordic-main'),
    ('p2',  'plate-nordic-side'),
    ('p3',  'glass-wine-bordo'),
    ('p4',  'glass-highball-x'),
    ('p5',  'cutlery-rustic-set'),
    ('p6',  'serving-terra-oval'),
    ('p7',  'tea-blanc-pair'),
    ('p8',  'salad-terra-bowl'),
    ('p9',  'vase-fruit-tall'),
    ('p10', 'flute-glass-champ'),
    ('p11', 'plate-dessert-w'),
    ('p12', 'coffee-noir-pair')
) AS p(id, seed)
CROSS JOIN (VALUES (1, ''), (2, '-b'), (3, '-c'), (4, '-d'), (5, '-e')) AS s(pos, suffix);
