CREATE TABLE admin_users (
    id            BIGSERIAL PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE,
    name          TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dev seed account — email admin@ddl.ru / password admin12345.
-- Change or remove this before any real deployment.
INSERT INTO admin_users (email, name, password_hash) VALUES
    ('admin@ddl.ru', 'Администратор', '$2a$10$LcEDE8DBbrLnZj6Dp9nwUODyWw.qRCtjTXqPucUVdEfBkAdSJNJ7i');
