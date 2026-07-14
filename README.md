# Pulse — X Multi-Account Post Scheduler

Professional full-stack X (Twitter) post scheduler. Multi-account OAuth, compose / schedule / drafts / templates, BullMQ workers, encrypted tokens. **No subscription** — the entire product is included.

## Stack

| Layer | Tech |
|-------|------|
| Runtime | Bun / Node |
| App | Next.js 16 (App Router + `proxy.ts`) |
| UI | React 19, Tailwind CSS v4, HeroUI |
| Auth | Better Auth (Google + X only) |
| DB | PostgreSQL + Drizzle ORM |
| Jobs | BullMQ + Redis |
| Validation | Zod + React Hook Form |

## Quick start

```bash
# 1. Infrastructure
docker compose up -d

# 2. Environment
cp .env.example .env.local
# Set BETTER_AUTH_SECRET, ENCRYPTION_KEY (64 hex chars), and optional X/Google keys

# 3. Install & migrate
bun install
bun run db:generate
bun run db:migrate

# 4. App + worker (two terminals)
bun run dev
bun run worker
```

Open [http://localhost:3000](http://localhost:3000).

### Generate secrets

```bash
# BETTER_AUTH_SECRET
openssl rand -base64 32

# ENCRYPTION_KEY (64 hex chars)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## X developer setup

1. Create an app at [developer.x.com](https://developer.x.com/en/portal/dashboard)
2. Enable **OAuth 2.0** with PKCE
3. Callback URLs:
   - App login: `http://localhost:3000/api/auth/callback/twitter`
   - Account connect: `http://localhost:3000/api/twitter/callback`
4. Scopes: `tweet.read tweet.write users.read offline.access`
5. Set `X_CLIENT_ID`, `X_CLIENT_SECRET`, `X_REDIRECT_URI` in `.env.local`

> Posting requires a paid X API tier that allows write access.

## Features

- Google + X (Twitter) social sign-in only (no email/password)
- Light premium dashboard
- Connect multiple X accounts (separate PKCE flow)
- Compose → Post now / Schedule / Save draft
- Queue with retry for failed publishes
- Templates
- AES-256-GCM encryption for OAuth tokens
- Background publish worker + 1-minute scheduler tick

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Next.js dev server |
| `bun run worker` | BullMQ workers |
| `bun run db:generate` | Generate migrations |
| `bun run db:migrate` | Apply migrations |
| `bun run db:studio` | Drizzle Studio |
| `bun run build` | Production build |

## Architecture

```
Browser → Next.js App Router → API routes → Services → Drizzle → PostgreSQL
                                      ↘ BullMQ → Redis → Workers → X API v2
```

## License

Private / use as you like for your product.
