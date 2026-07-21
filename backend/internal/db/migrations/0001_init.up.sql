CREATE TABLE categories (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    item_count  INTEGER NOT NULL DEFAULT 0,
    image_url   TEXT NOT NULL,
    position    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE subcategories (
    id          TEXT NOT NULL,
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    item_count  INTEGER NOT NULL DEFAULT 0,
    position    INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (category_id, id)
);

CREATE TABLE products (
    id             TEXT PRIMARY KEY,
    category_id    TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    subcategory_id TEXT NOT NULL,
    name           TEXT NOT NULL,
    article        TEXT NOT NULL UNIQUE,
    stock          INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    price_day      NUMERIC(10, 2) NOT NULL CHECK (price_day >= 0),
    damage_cost    NUMERIC(10, 2) NOT NULL CHECK (damage_cost >= 0),
    image_url      TEXT NOT NULL,
    description    TEXT NOT NULL DEFAULT '',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    FOREIGN KEY (category_id, subcategory_id) REFERENCES subcategories(category_id, id) ON DELETE RESTRICT
);

CREATE TABLE product_images (
    id         BIGSERIAL PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    position   INTEGER NOT NULL,
    image_url  TEXT NOT NULL,
    UNIQUE (product_id, position)
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_subcategory ON products(category_id, subcategory_id);
CREATE INDEX idx_product_images_product ON product_images(product_id);

CREATE TABLE phone_verifications (
    id         BIGSERIAL PRIMARY KEY,
    phone      TEXT NOT NULL,
    code       TEXT NOT NULL,
    channel    TEXT NOT NULL CHECK (channel IN ('telegram', 'whatsapp', 'sms')),
    token      UUID,
    verified   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_phone_verifications_phone ON phone_verifications(phone, created_at DESC);

CREATE TABLE orders (
    id                BIGSERIAL PRIMARY KEY,
    public_id         UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    rental_start       DATE NOT NULL,
    rental_end         DATE NOT NULL,
    rental_days        INTEGER NOT NULL CHECK (rental_days > 0),
    delivery_method    TEXT NOT NULL CHECK (delivery_method IN ('delivery', 'pickup')),
    address            TEXT,
    contact_name       TEXT NOT NULL,
    contact_phone      TEXT NOT NULL,
    phone_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    comment            TEXT NOT NULL DEFAULT '',
    items_total        NUMERIC(10, 2) NOT NULL,
    delivery_cost      NUMERIC(10, 2) NOT NULL,
    total              NUMERIC(10, 2) NOT NULL,
    status             TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'cancelled')),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (rental_end > rental_start),
    CHECK (delivery_method = 'pickup' OR address IS NOT NULL)
);

CREATE TABLE order_items (
    id           BIGSERIAL PRIMARY KEY,
    order_id     BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id   TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_name TEXT NOT NULL,
    qty          INTEGER NOT NULL CHECK (qty > 0),
    price_day    NUMERIC(10, 2) NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
