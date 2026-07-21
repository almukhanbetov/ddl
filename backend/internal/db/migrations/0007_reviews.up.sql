CREATE TABLE reviews (
    id          BIGSERIAL PRIMARY KEY,
    author_name TEXT NOT NULL,
    review_text TEXT NOT NULL,
    photos      JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX reviews_created_at_idx ON reviews (created_at DESC);
