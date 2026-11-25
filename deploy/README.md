# Deploying DDL to the VPS

One-time setup on the VPS (`ssh -p 22122 ddl@89.207.254.215`). After this,
every push to `main` builds new images, pushes them to Docker Hub, and
redeploys automatically via `.github/workflows/deploy.yml`.

## 1. Create the deploy directory and .env

Use the same path you put in the `VPS_PATH` GitHub secret.

```bash
mkdir -p ~/app && cd ~/app
```

Create `.env` here (copy `.env.production.example` from the repo and fill in
real values — generate secrets with `openssl rand -hex 32`, never reuse the
placeholders). This file is never touched by CI; it stays on the server.

## 2. Install Nginx and Certbot

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

## 3. Install the site config

Copy the contents of `deploy/nginx.conf` from the repo into
`/etc/nginx/sites-available/ddldecor.kz` on the server, then:

```bash
sudo ln -s /etc/nginx/sites-available/ddldecor.kz /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 4. Get the SSL certificate

```bash
sudo certbot --nginx -d ddldecor.kz -d www.ddldecor.kz
```

Certbot rewrites the site config to redirect HTTP → HTTPS and sets up
auto-renewal (a systemd timer, already installed with the package).

## 5. Open the firewall (if ufw is active)

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow 22122/tcp
```

## 6. First deploy

Push to `main`, or trigger the workflow manually from the Actions tab
(`workflow_dispatch`). The pipeline will:

1. Build the backend and frontend Docker images and push them to Docker Hub.
2. Copy `docker-compose.prod.yml` to `VPS_PATH/docker-compose.yml`.
3. SSH in, `docker compose pull` the new images, `docker compose up -d`.

Postgres migrations run automatically on backend startup (embedded in the
binary), so the database schema is created on first boot.

## Checking it worked

```bash
cd ~/app
docker compose ps
docker compose logs -f backend
curl -s https://ddldecor.kz/api/health
```

## Admin password (required after the first deploy)

Migration 0003 creates `admin@ddl.ru` with a password that is published in the
repository. In production the API refuses that password and any session of an
account that still has it, so nobody can sign in until it is replaced.

1. Check whether an account still has it (`t` means yes):

   ```bash
   docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<'SQL'
   SELECT id, email, created_at, md5(password_hash) = '8b1700aa0a0f76183dc383d5a3f4d86b' AS seed_password
   FROM admin_users ORDER BY id;
   SQL
   ```

2. Copy `deploy/set-admin-password.sh` to the server and run it next to
   `docker-compose.yml`: `bash set-admin-password.sh admin@ddl.ru`.
3. Replace `JWT_SECRET` in `.env` with the output of `openssl rand -hex 32` and
   run `docker compose --env-file .env up -d backend`. Sessions live for 7 days
   and a password change alone does not end them.
4. Review the accounts listed in step 1 and remove any you don't recognise.
