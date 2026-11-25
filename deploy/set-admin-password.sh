#!/usr/bin/env bash
# Sets a new password for an existing admin. Run on the VPS in the directory
# with docker-compose.yml and .env:  bash set-admin-password.sh admin@example.com
# The password is read without echo and never appears in arguments or history.
set -euo pipefail

ADMIN_EMAIL=${1:?usage: set-admin-password.sh EMAIL}
read -rsp 'New password (12-72 bytes): ' ADMIN_PW; echo
read -rsp 'Repeat: ' ADMIN_PW2; echo
[ "$ADMIN_PW" = "$ADMIN_PW2" ] || { echo 'Passwords differ' >&2; exit 1; }
BYTES=$(printf %s "$ADMIN_PW" | wc -c)
[ "$BYTES" -ge 12 ] && [ "$BYTES" -le 72 ] || { echo 'Password must be 12-72 bytes' >&2; exit 1; }
export ADMIN_EMAIL ADMIN_PW

docker compose exec -T -e ADMIN_EMAIL -e ADMIN_PW postgres \
  sh -c 'psql -qtA -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<'SQL'
\getenv email ADMIN_EMAIL
\getenv pw ADMIN_PW
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
UPDATE admin_users SET password_hash = crypt(:'pw', gen_salt('bf', 12)) WHERE email = :'email' RETURNING 'updated ' || email;
SELECT count(*) = 1 AS found FROM admin_users WHERE email = :'email' \gset
\if :found
COMMIT;
\else
DO $$ BEGIN RAISE EXCEPTION 'No admin with this email'; END $$;
\endif
SQL
