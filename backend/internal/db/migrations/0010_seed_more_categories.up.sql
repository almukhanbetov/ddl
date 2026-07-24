INSERT INTO subcategories (id, category_id, name, item_count, position) VALUES
    ('round',        'tables',  'Круглые столы',                  2, 1),
    ('rect',         'tables',  'Прямоугольные столы',            2, 2),
    ('coffee',       'tables',  'Кофейные и приставные столики',  2, 3),

    ('chiavari',     'chairs',  'Стулья Кьявари',                 2, 1),
    ('folding',      'chairs',  'Складные стулья',                2, 2),
    ('lounge',       'chairs',  'Лаунж-кресла',                   2, 3),

    ('tablecloth',   'textile', 'Скатерти',                       2, 1),
    ('napkins',      'textile', 'Салфетки и раннеры',             2, 2),
    ('covers',       'textile', 'Чехлы на стулья',                2, 3),

    ('arch',         'decor',   'Арки и фотозоны',                2, 1),
    ('vases',        'decor',   'Вазы и композиции',              2, 2),
    ('lighting',     'decor',   'Гирлянды и освещение',           2, 3),

    ('candlesticks', 'candles', 'Подсвечники',                    2, 1),
    ('wax',          'candles', 'Свечи',                          2, 2),

    ('equipment',    'other',   'Оборудование',                   2, 1),
    ('misc',         'other',   'Разное',                         2, 2);

INSERT INTO products (id, category_id, subcategory_id, name, article, stock, price_day, damage_cost, image_url, description) VALUES
    ('t1', 'tables',  'round',     'Стол круглый банкетный, диаметр 180 см',       'TB-1001', 12, 4500, 55000, 'https://picsum.photos/seed/table-round-180/800/800',    'Банкетный стол на 8-10 персон для крупных мероприятий.'),
    ('t2', 'tables',  'round',     'Стол круглый фуршетный, диаметр 90 см',        'TB-1002', 20, 2800, 32000, 'https://picsum.photos/seed/table-round-90/800/800',     'Компактный фуршетный стол для коктейльных зон.'),
    ('t3', 'tables',  'rect',      'Стол прямоугольный банкетный 180x80 см',       'TB-2001', 18, 3800, 45000, 'https://picsum.photos/seed/table-rect-180/800/800',     'Классический банкетный стол для рассадки гостей.'),
    ('t4', 'tables',  'rect',      'Стол прямоугольный фуршетный 120x60 см',       'TB-2002', 24, 2400, 28000, 'https://picsum.photos/seed/table-rect-120/800/800',     'Фуршетный стол для закусок и напитков.'),
    ('t5', 'tables',  'coffee',    'Кофейный столик Nordic, круглый',              'TB-3001', 10, 2200, 25000, 'https://picsum.photos/seed/table-coffee-nordic/800/800','Низкий столик для лаунж-зоны и фотозон.'),
    ('t6', 'tables',  'coffee',    'Приставной столик Loft металлический',         'TB-3002', 8,  1900, 21000, 'https://picsum.photos/seed/table-side-loft/800/800',    'Компактный приставной столик в индустриальном стиле.'),

    ('c1', 'chairs',  'chiavari',  'Стул Кьявари золотой',                         'CH-1001', 150, 700, 9500,  'https://picsum.photos/seed/chair-chiavari-gold/800/800','Классический банкетный стул Кьявари, золотая рама.'),
    ('c2', 'chairs',  'chiavari',  'Стул Кьявари прозрачный Chameleon',            'CH-1002', 90,  750, 10500, 'https://picsum.photos/seed/chair-chiavari-clear/800/800','Прозрачный поликарбонатный стул для современных свадеб.'),
    ('c3', 'chairs',  'folding',   'Стул складной Simple White',                   'CH-2001', 200, 350, 4500,  'https://picsum.photos/seed/chair-folding-white/800/800','Лёгкий складной стул для банкетов и конференций.'),
    ('c4', 'chairs',  'folding',   'Стул складной Simple Black',                   'CH-2002', 180, 350, 4500,  'https://picsum.photos/seed/chair-folding-black/800/800','Лёгкий складной стул, чёрный вариант.'),
    ('c5', 'chairs',  'lounge',    'Кресло лаунж Rattan',                          'CH-3001', 16,  3200, 38000, 'https://picsum.photos/seed/chair-lounge-rattan/800/800','Плетёное кресло для лаунж-зоны на открытом воздухе.'),
    ('c6', 'chairs',  'lounge',    'Кресло лаунж Velvet Emerald',                  'CH-3002', 10,  3800, 42000, 'https://picsum.photos/seed/chair-lounge-velvet/800/800','Бархатное кресло насыщенного изумрудного цвета.'),

    ('x1', 'textile', 'tablecloth','Скатерть круглая Ivory, 320 см',               'TX-1001', 22, 1500, 18000, 'https://picsum.photos/seed/textile-cloth-ivory/800/800','Скатерть на круглый банкетный стол, цвет айвори.'),
    ('x2', 'textile', 'tablecloth','Скатерть прямоугольная Emerald, 3х1.5 м',      'TX-1002', 16, 1800, 21000, 'https://picsum.photos/seed/textile-cloth-emerald/800/800','Скатерть насыщенного изумрудного цвета на банкетный стол.'),
    ('x3', 'textile', 'napkins',   'Салфетка тканевая Satin, комплект 10 шт',      'TX-2001', 40, 900,  8500,  'https://picsum.photos/seed/textile-napkin-satin/800/800','Атласные салфетки для сервировки, комплект из 10 штук.'),
    ('x4', 'textile', 'napkins',   'Раннер столовый Linen, 3 м',                   'TX-2002', 25, 700,  6500,  'https://picsum.photos/seed/textile-runner-linen/800/800','Льняной раннер для декоративной сервировки стола.'),
    ('x5', 'textile', 'covers',    'Чехол на стул White Spandex',                  'TX-3001', 180, 300, 3500,  'https://picsum.photos/seed/textile-cover-white/800/800','Универсальный чехол на банкетный стул, белый спандекс.'),
    ('x6', 'textile', 'covers',    'Чехол на стул с бантом Gold',                  'TX-3002', 150, 350, 4000,  'https://picsum.photos/seed/textile-cover-gold/800/800', 'Чехол на стул с золотым бантом-акцентом.'),

    ('d1', 'decor',   'arch',      'Арка круглая металлическая, 2.2 м',            'DC-1001', 6,  8500, 95000, 'https://picsum.photos/seed/decor-arch-round/800/800',     'Круглая металлическая арка для церемонии и фотозоны.'),
    ('d2', 'decor',   'arch',      'Фотозона деревянная Rustic',                   'DC-1002', 4,  9500, 110000,'https://picsum.photos/seed/decor-photozone-rustic/800/800','Деревянная фотозона в рустикальном стиле.'),
    ('d3', 'decor',   'vases',     'Ваза напольная Nordic, высокая',               'DC-2001', 14, 1600, 19000, 'https://picsum.photos/seed/decor-vase-floor/800/800',     'Высокая напольная ваза для цветочных композиций.'),
    ('d4', 'decor',   'vases',     'Композиция цветочная искусственная Premium',   'DC-2002', 10, 2100, 24000, 'https://picsum.photos/seed/decor-flower-premium/800/800', 'Премиальная композиция из искусственных цветов.'),
    ('d5', 'decor',   'lighting',  'Гирлянда тёплый свет, 10 м',                   'DC-3001', 30, 800,  7500,  'https://picsum.photos/seed/decor-string-lights/800/800',  'Светодиодная гирлянда тёплого свечения, 10 метров.'),
    ('d6', 'decor',   'lighting',  'Неоновая вывеска LOVE',                        'DC-3002', 3,  6500, 75000, 'https://picsum.photos/seed/decor-neon-love/800/800',      'Неоновая вывеска для свадебной фотозоны.'),

    ('n1', 'candles', 'candlesticks','Подсвечник латунный высокий, 40 см',         'CN-1001', 24, 650,  7200,  'https://picsum.photos/seed/candle-holder-brass/800/800',  'Высокий латунный подсвечник для торжественной сервировки.'),
    ('n2', 'candles', 'candlesticks','Подсвечник стеклянный набор 3 шт',           'CN-1002', 18, 550,  6000,  'https://picsum.photos/seed/candle-holder-glass/800/800',  'Набор из трёх стеклянных подсвечников разной высоты.'),
    ('n3', 'candles', 'wax',        'Свеча столбовая белая, 30 см',                'CN-2001', 60, 250,  1800,  'https://picsum.photos/seed/candle-pillar-white/800/800',  'Классическая столбовая свеча белого цвета.'),
    ('n4', 'candles', 'wax',        'Свеча ароматическая в стакане',               'CN-2002', 45, 300,  2200,  'https://picsum.photos/seed/candle-scented-jar/800/800',   'Ароматическая свеча в стеклянном стакане.'),

    ('o1', 'other',   'equipment', 'Обогреватель уличный газовый',                 'OT-1001', 5,  4500, 55000, 'https://picsum.photos/seed/other-heater-outdoor/800/800', 'Газовый уличный обогреватель для мероприятий на открытом воздухе.'),
    ('o2', 'other',   'equipment', 'Генератор дыма для первого танца',             'OT-1002', 3,  3200, 38000, 'https://picsum.photos/seed/other-smoke-machine/800/800',  'Генератор лёгкого дыма для эффектного первого танца.'),
    ('o3', 'other',   'misc',      'Стойка для регистрации гостей',                'OT-2001', 4,  2800, 32000, 'https://picsum.photos/seed/other-welcome-stand/800/800',  'Стойка для welcome-зоны и регистрации гостей.'),
    ('o4', 'other',   'misc',      'Мольберт деревянный для плана рассадки',       'OT-2002', 8,  1200, 14000, 'https://picsum.photos/seed/other-easel-wood/800/800',     'Деревянный мольберт для плана рассадки или welcome-таблички.');

INSERT INTO product_images (product_id, position, image_url)
SELECT p.id, s.pos, 'https://picsum.photos/seed/' || p.seed || s.suffix || '/1000/860'
FROM (VALUES
    ('t1', 'table-round-180'), ('t2', 'table-round-90'), ('t3', 'table-rect-180'),
    ('t4', 'table-rect-120'), ('t5', 'table-coffee-nordic'), ('t6', 'table-side-loft'),
    ('c1', 'chair-chiavari-gold'), ('c2', 'chair-chiavari-clear'), ('c3', 'chair-folding-white'),
    ('c4', 'chair-folding-black'), ('c5', 'chair-lounge-rattan'), ('c6', 'chair-lounge-velvet'),
    ('x1', 'textile-cloth-ivory'), ('x2', 'textile-cloth-emerald'), ('x3', 'textile-napkin-satin'),
    ('x4', 'textile-runner-linen'), ('x5', 'textile-cover-white'), ('x6', 'textile-cover-gold'),
    ('d1', 'decor-arch-round'), ('d2', 'decor-photozone-rustic'), ('d3', 'decor-vase-floor'),
    ('d4', 'decor-flower-premium'), ('d5', 'decor-string-lights'), ('d6', 'decor-neon-love'),
    ('n1', 'candle-holder-brass'), ('n2', 'candle-holder-glass'), ('n3', 'candle-pillar-white'),
    ('n4', 'candle-scented-jar'),
    ('o1', 'other-heater-outdoor'), ('o2', 'other-smoke-machine'), ('o3', 'other-welcome-stand'),
    ('o4', 'other-easel-wood')
) AS p(id, seed)
CROSS JOIN (VALUES (1, ''), (2, '-b'), (3, '-c'), (4, '-d'), (5, '-e')) AS s(pos, suffix);

UPDATE categories SET item_count = 6 WHERE id IN ('tables', 'chairs', 'textile', 'decor');
UPDATE categories SET item_count = 4 WHERE id IN ('candles', 'other');
