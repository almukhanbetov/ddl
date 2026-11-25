CREATE TABLE admin_users (
    id            BIGSERIAL PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE,
    name          TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dev seed account. Its password is public (it was committed to the repository),
-- so the API refuses it when APP_ENV=production; see deploy/README.md.
INSERT INTO admin_users (email, name, password_hash) VALUES
    ('admin@ddl.ru', 'Администратор', '$2a$10$LcEDE8DBbrLnZj6Dp9nwUODyWw.qRCtjTXqPucUVdEfBkAdSJNJ7i');
