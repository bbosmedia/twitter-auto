# X Multi-Account Dashboard MVP

## Build Plan (plan.md)

---

## 1. Project Overview

Build a secure, scalable full-stack application that allows users to manage multiple X (Twitter) accounts from a single dashboard.

**Core Capabilities:**

* Connect multiple X accounts via OAuth 2.0 PKCE
* Post immediately or schedule posts to one or multiple accounts
* Background job processing for reliable publishing
* Multi-user authentication with role-based access
* Team-ready architecture for future SaaS expansion

---

## 2. Tech Stack (2026 Latest)

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Runtime | **Bun** | latest | Package manager + runtime |
| Framework | **Next.js** | 16.2.x | App Router, proxy.ts (NOT middleware.ts) |
| React | **React** | 19.x | Server Components by default |
| UI Library | **HeroUI** | 3.2.x | Built on React Aria + Tailwind CSS v4 |
| Styling | **Tailwind CSS** | 4.x | CSS variables, OKLCH colors |
| Forms | **React Hook Form** | 7.x | + Zod 4 for validation |
| Data Fetching | **TanStack Query** | 5.x | Server state management |
| Auth | **Better Auth** | 1.6.x | Email/password + OAuth + sessions |
| ORM | **Drizzle ORM** | 1.0.0-rc.x | Type-safe PostgreSQL queries |
| Database | **PostgreSQL** | 16+ | Via Neon (serverless) or Docker |
| Queue | **BullMQ** | latest | Redis Streams-based job processing |
| Cache/Queue | **Redis** | 7+ | Upstash (serverless) or Docker |
| Validation | **Zod** | 4.x | Runtime schema validation |
| Language | **TypeScript** | 5.x | Strict mode |

---

## 3. Architecture

```text
Browser (React 19 + HeroUI)
    ↓
Next.js App Router (RSC + Client Components)
    ↓
proxy.ts (route protection + rate limiting)
    ↓
API Routes / Server Actions
    ↓
Service Layer (business logic)
    ↓
Drizzle ORM → PostgreSQL

Background Jobs:
BullMQ Worker → Redis → Twitter Publishing Service
```

---

## 4. Folder Structure

```text
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth route group (no layout shared with dashboard)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (dashboard)/              # Protected dashboard route group
│   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   ├── page.tsx              # Dashboard home
│   │   ├── accounts/page.tsx     # X account management
│   │   ├── compose/page.tsx      # Post composer
│   │   ├── queue/page.tsx        # Post queue
│   │   ├── drafts/page.tsx       # Saved drafts
│   │   ├── templates/page.tsx    # Post templates
│   │   ├── settings/page.tsx     # User settings
│   │   └── profile/page.tsx      # User profile
│   ├── api/                      # API Route Handlers
│   │   ├── auth/[...all]/route.ts  # Better Auth handler
│   │   ├── accounts/route.ts
│   │   ├── accounts/[id]/route.ts
│   │   ├── posts/route.ts
│   │   ├── posts/[id]/route.ts
│   │   ├── queue/route.ts
│   │   └── twitter/callback/route.ts  # OAuth callback
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css
├── components/                   # Shared UI components
│   ├── ui/                       # Atomic design primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── toast.tsx
│   │   └── spinner.tsx
│   ├── layout/                   # Layout components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── nav.tsx
│   │   └── footer.tsx
│   └── shared/                   # Feature-agnostic shared components
│       ├── account-selector.tsx
│       ├── char-counter.tsx
│       ├── emoji-picker.tsx
│       └── post-preview.tsx
├── features/                     # Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   └── forgot-password-form.tsx
│   │   └── schemas.ts           # Zod schemas for auth
│   ├── accounts/
│   │   ├── components/
│   │   │   ├── account-card.tsx
│   │   │   ├── connect-button.tsx
│   │   │   └── account-list.tsx
│   │   └── schemas.ts
│   ├── posts/
│   │   ├── components/
│   │   │   ├── post-composer.tsx
│   │   │   ├── post-card.tsx
│   │   │   ├── post-list.tsx
│   │   │   └── schedule-picker.tsx
│   │   └── schemas.ts
│   ├── queue/
│   │   ├── components/
│   │   │   ├── queue-list.tsx
│   │   │   ├── queue-item.tsx
│   │   │   └── retry-button.tsx
│   │   └── schemas.ts
│   └── settings/
│       ├── components/
│       │   ├── profile-form.tsx
│       │   └── preferences-form.tsx
│       └── schemas.ts
├── hooks/                        # Custom React hooks
│   ├── use-session.ts
│   ├── use-accounts.ts
│   ├── use-posts.ts
│   └── use-queue.ts
├── lib/                          # Core utilities and config
│   ├── auth.ts                   # Better Auth server config
│   ├── auth-client.ts            # Better Auth client config
│   ├── db.ts                     # Drizzle DB connection
│   ├── redis.ts                  # Redis connection (BullMQ)
│   ├── rate-limit.ts             # Upstash rate limiter
│   └── crypto.ts                 # Encryption utilities
├── db/                           # Database schema + migrations
│   ├── schema.ts                 # Drizzle schema definitions
│   ├── relations.ts              # Drizzle relations
│   └── migrations/               # Generated migrations
├── services/                     # Business logic layer
│   ├── twitter/
│   │   ├── auth.ts               # OAuth 2.0 PKCE flow
│   │   ├── publish.ts            # Tweet publishing
│   │   └── media.ts              # Media upload
│   ├── post/
│   │   ├── create.ts
│   │   ├── update.ts
│   │   ├── delete.ts
│   │   └── schedule.ts
│   └── notification/
│       └── send.ts
├── jobs/                         # BullMQ workers
│   ├── queues.ts                 # Queue definitions
│   ├── workers/
│   │   ├── publish-post.worker.ts
│   │   ├── retry-failed.worker.ts
│   │   └── cleanup.worker.ts
│   └── index.ts                  # Worker entry point
├── types/                        # Shared TypeScript types
│   ├── index.ts
│   ├── post.ts
│   ├── account.ts
│   └── api.ts
├── providers/                    # React context providers
│   ├── query-provider.tsx        # TanStack Query
│   ├── auth-provider.tsx         # Auth state
│   └── theme-provider.tsx        # Dark mode
└── utils/                        # Pure utility functions
    ├── format.ts
    ├── date.ts
    └── cn.ts                     # className merge utility
```

---

## 5. Database Schema (Drizzle ORM)

### users (managed by Better Auth)

```ts
// Automatically created by Better Auth
// Tables: user, session, account, verification
```

### twitterAccounts

```ts
id: uuid (PK, default random)
userId: varchar (FK → user.id, not null)
xUserId: varchar (not null, unique per user)
username: varchar (not null)
displayName: varchar
avatar: varchar
accessToken: text (encrypted, not null)
refreshToken: text (encrypted, not null)
expiresAt: timestamp (not null)
isActive: boolean (default true)
createdAt: timestamp (default now)
updatedAt: timestamp (default now)
```

### posts

```ts
id: uuid (PK, default random)
userId: varchar (FK → user.id, not null)
content: text (not null, max 280)
status: enum (draft | scheduled | publishing | published | failed)
scheduledAt: timestamp (nullable)
publishedAt: timestamp (nullable)
error: text (nullable)
createdAt: timestamp (default now)
updatedAt: timestamp (default now)
```

### postAccounts

```ts
id: uuid (PK, default random)
postId: uuid (FK → posts.id, not null)
twitterAccountId: uuid (FK → twitterAccounts.id, not null)
status: enum (pending | publishing | published | failed)
tweetId: varchar (nullable, X tweet ID after publish)
error: text (nullable)
createdAt: timestamp (default now)
```

### media

```ts
id: uuid (PK, default random)
postId: uuid (FK → posts.id, not null)
url: varchar (not null)
type: enum (image | video | gif)
size: integer (bytes)
createdAt: timestamp (default now)
```

### templates

```ts
id: uuid (PK, default random)
userId: varchar (FK → user.id, not null)
name: varchar (not null)
content: text (not null)
category: varchar (nullable)
createdAt: timestamp (default now)
updatedAt: timestamp (default now)
```

### hashtags

```ts
id: uuid (PK, default random)
userId: varchar (FK → user.id, not null)
tag: varchar (not null)
usageCount: integer (default 0)
createdAt: timestamp (default now)
```

### auditLogs

```ts
id: uuid (PK, default random)
userId: varchar (FK → user.id, not null)
action: varchar (not null)
metadata: jsonb (nullable)
ipAddress: varchar (nullable)
createdAt: timestamp (default now)
```

### notifications

```ts
id: uuid (PK, default random)
userId: varchar (FK → user.id, not null)
title: varchar (not null)
message: text (not null)
type: enum (info | success | warning | error)
isRead: boolean (default false)
createdAt: timestamp (default now)
```

---

## 6. Security Implementation

### 6.1 Authentication (Better Auth)

```ts
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [nextCookies()], // MUST be last plugin
});
```

### 6.2 Route Protection (proxy.ts — Next.js 16)

```ts
// proxy.ts (NOT middleware.ts — renamed in Next.js 16)
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Full session validation for protected routes
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const signInUrl = new URL("/login", request.url);
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

### 6.3 Rate Limiting

```ts
// src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
});

// Stricter limit for auth endpoints
export const authRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  analytics: true,
});
```

### 6.4 Input Validation (Zod)

```ts
// src/features/auth/schemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const postSchema = z.object({
  content: z.string().min(1, "Post cannot be empty").max(280, "Post exceeds 280 characters"),
  accountIds: z.array(z.string().uuid()).min(1, "Select at least one account"),
  scheduledAt: z.string().datetime().optional(),
});
```

### 6.5 Token Encryption

```ts
// src/lib/crypto.ts
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex"); // 32 bytes

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, tagHex, dataHex] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const data = Buffer.from(dataHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(tag);
  return decipher.update(data) + decipher.final("utf8");
}
```

### 6.6 Security Headers (next.config.ts)

```ts
// next.config.ts
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

---

## 7. Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# Better Auth
BETTER_AUTH_SECRET=<generate with: openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000

# OAuth - App Login
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# X/Twitter API v2
X_CLIENT_ID=
X_CLIENT_SECRET=
X_REDIRECT_URI=http://localhost:3000/api/twitter/callback

# Redis (Upstash or local)
REDIS_URL=http://127.0.0.1:6379
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Encryption
ENCRYPTION_KEY=<64 hex chars = 32 bytes>

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 8. Step-by-Step Build Guide

### Phase 1: Project Setup (Day 1)

**Step 1.1 — Initialize with Bun**

```bash
# Create project (if not already created)
bunx create-next-app@latest twitter-auto --typescript --tailwind --app --src-dir

# Install core dependencies
bun add better-auth drizzle-orm @upstash/ratelimit @upstash/redis
bun add bullmq ioredis
bun add @heroui/react react-aria-components
bun add react-hook-form @hookform/resolvers zod
bun add @tanstack/react-query
bun add date-fns lucide-react clsx tailwind-merge

# Dev dependencies
bun add -D drizzle-kit @types/pg
bun add -D prettier eslint-config-prettier
```

**Step 1.2 — Configure path aliases**

```json
// tsconfig.json — ensure paths are set
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Step 1.3 — Create folder structure**

```bash
mkdir -p src/{components/{ui,layout,shared}}
mkdir -p src/features/{auth,accounts,posts,queue,settings}/{components,schemas}
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/services/{twitter,post,notification}
mkdir -p src/jobs/workers
mkdir -p src/db/migrations
mkdir -p src/types
mkdir -p src/providers
mkdir -p src/utils
```

**Step 1.4 — Environment variables**

```bash
cp .env.example .env.local
# Fill in all values from Section 7
```

**Step 1.5 — Security headers in next.config.ts**

Update `next.config.ts` with security headers from Section 6.6.

---

### Phase 2: Database Layer (Day 2)

**Step 2.1 — Drizzle schema**

```ts
// src/db/schema.ts
import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";

// Enums
export const postStatusEnum = pgEnum("post_status", ["draft", "scheduled", "publishing", "published", "failed"]);
export const postAccountStatusEnum = pgEnum("post_account_status", ["pending", "publishing", "published", "failed"]);
export const mediaTypeEnum = pgEnum("media_type", ["image", "video", "gif"]);
export const notificationTypeEnum = pgEnum("notification_type", ["info", "success", "warning", "error"]);

// Twitter Accounts
export const twitterAccounts = pgTable("twitter_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  xUserId: varchar("x_user_id", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 255 }),
  avatar: varchar("avatar", { length: 500 }),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Posts
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  content: text("content").notNull(),
  status: postStatusEnum("status").default("draft").notNull(),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Post Accounts (junction table)
export const postAccounts = pgTable("post_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id").notNull(),
  twitterAccountId: uuid("twitter_account_id").notNull(),
  status: postAccountStatusEnum("status").default("pending").notNull(),
  tweetId: varchar("tweet_id", { length: 255 }),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Media
export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id").notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  type: mediaTypeEnum("type").notNull(),
  size: integer("size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Templates
export const templates = pgTable("templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Hashtags
export const hashtags = pgTable("hashtags", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  tag: varchar("tag", { length: 100 }).notNull(),
  usageCount: integer("usage_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Audit Logs
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  metadata: jsonb("metadata"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").default("info").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

**Step 2.2 — Drizzle relations**

```ts
// src/db/relations.ts
import { relations } from "drizzle-orm";
import {
  twitterAccounts, posts, postAccounts, media,
  templates, hashtags, auditLogs, notifications
} from "./schema";

export const postsRelations = relations(posts, ({ many }) => ({
  postAccounts: many(postAccounts),
  media: many(media),
}));

export const postAccountsRelations = relations(postAccounts, ({ one }) => ({
  post: one(posts, { fields: [postAccounts.postId], references: [posts.id] }),
  twitterAccount: one(twitterAccounts, { fields: [postAccounts.twitterAccountId], references: [twitterAccounts.id] }),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  post: one(posts, { fields: [media.postId], references: [posts.id] }),
}));

export const twitterAccountsRelations = relations(twitterAccounts, ({ many }) => ({
  postAccounts: many(postAccounts),
}));
```

**Step 2.3 — DB connection**

```ts
// src/lib/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";

export const db = drizzle(process.env.DATABASE_URL!, { schema });
```

**Step 2.4 — Generate and run migrations**

```bash
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

---

### Phase 3: Authentication (Day 3)

**Step 3.1 — Better Auth server config**

```ts
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [nextCookies()],
});
```

**Step 3.2 — Better Auth client config**

```ts
// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

export const { signIn, signOut, useSession } = authClient;
```

**Step 3.3 — API route handler**

```ts
// src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

**Step 3.4 — Auth forms (HeroUI components)**

```tsx
// src/features/auth/components/login-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Card, CardBody, CardHeader } from "@heroui/react";
import { signIn } from "@/lib/auth-client";
import { loginSchema } from "../schemas";
import type { z } from "zod";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setError(null);

    const result = await signIn.email({
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      setError(result.error.message);
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-sm text-default-500">Welcome back to X Dashboard</p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            {...register("email")}
            type="email"
            label="Email"
            placeholder="you@example.com"
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
          />
          <Input
            {...register("password")}
            type="password"
            label="Password"
            placeholder="••••••••"
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
          />
          {error && <p className="text-danger text-sm">{error}</p>}
          <Button type="submit" color="primary" isLoading={isLoading}>
            Sign In
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
```

**Step 3.5 — Session hook**

```ts
// src/hooks/use-session.ts
"use client";

import { useSession as useBetterAuthSession } from "@/lib/auth-client";

export function useSession() {
  const { data: session, isPending, error } = useBetterAuthSession();
  return { session, isPending, error, isAuthenticated: !!session };
}
```

---

### Phase 4: X/Twitter OAuth Integration (Day 4)

**Step 4.1 — OAuth 2.0 PKCE flow**

```ts
// src/services/twitter/auth.ts
import crypto from "crypto";
import { decrypt } from "@/lib/crypto";
import { db } from "@/lib/db";
import { twitterAccounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const X_AUTH_URL = "https://twitter.com/i/oauth2/authorize";
const X_TOKEN_URL = "https://api.x.com/2/oauth2/token";
const SCOPES = "tweet.read tweet.write users.read offline.access";

interface PKCEChallenge {
  verifier: string;
  challenge: string;
  state: string;
}

export function generatePKCEChallenge(): PKCEChallenge {
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  const state = crypto.randomBytes(16).toString("hex");
  return { verifier, challenge, state };
}

export function getAuthorizationUrl(verifier: string, challenge: string, state: string): string {
  const url = new URL(X_AUTH_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", process.env.X_CLIENT_ID!);
  url.searchParams.set("redirect_uri", process.env.X_REDIRECT_URI!);
  url.searchParams.set("scope", SCOPES);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

export async function exchangeCodeForTokens(code: string, verifier: string) {
  const credentials = Buffer.from(
    `${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(X_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.X_REDIRECT_URI!,
      code_verifier: verifier,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for tokens");
  }

  return response.json();
}

export async function refreshAccessToken(refreshToken: string) {
  const credentials = Buffer.from(
    `${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(X_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  return response.json();
}

export async function getValidAccessToken(accountId: string, userId: string) {
  const account = await db.query.twitterAccounts.findFirst({
    where: and(
      eq(twitterAccounts.id, accountId),
      eq(twitterAccounts.userId, userId)
    ),
  });

  if (!account) throw new Error("Twitter account not found");

  // Check if token is expired (with 5 min buffer)
  if (new Date(account.expiresAt) > new Date(Date.now() + 5 * 60 * 1000)) {
    return decrypt(account.accessToken);
  }

  // Refresh the token
  const refreshToken = decrypt(account.refreshToken);
  const tokens = await refreshAccessToken(refreshToken);

  // Update in database
  await db
    .update(twitterAccounts)
    .set({
      accessToken: tokens.access_token, // Encrypt before storing in real implementation
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      updatedAt: new Date(),
    })
    .where(eq(twitterAccounts.id, accountId));

  return tokens.access_token;
}
```

**Step 4.2 — OAuth callback route**

```ts
// src/app/api/twitter/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { exchangeCodeForTokens } from "@/services/twitter/auth";
import { db } from "@/lib/db";
import { twitterAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(new URL("/accounts?error=missing_params", request.url));
  }

  // Verify session
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, state);

    // Get user info from X
    const userResponse = await fetch("https://api.x.com/2/users/me", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const userData = await userResponse.json();

    // Upsert Twitter account
    await db
      .insert(twitterAccounts)
      .values({
        userId: session.user.id,
        xUserId: userData.data.id,
        username: userData.data.username,
        displayName: userData.data.name,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      })
      .onConflictDoUpdate({
        target: [twitterAccounts.xUserId, twitterAccounts.userId],
        set: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
          isActive: true,
          updatedAt: new Date(),
        },
      });

    return NextResponse.redirect(new URL("/accounts?success=connected", request.url));
  } catch (error) {
    console.error("Twitter OAuth error:", error);
    return NextResponse.redirect(new URL("/accounts?error=connection_failed", request.url));
  }
}
```

---

### Phase 5: Post Composer & Publishing (Day 5)

**Step 5.1 — Tweet publishing service**

```ts
// src/services/twitter/publish.ts
import { getValidAccessToken } from "./auth";
import { db } from "@/lib/db";
import { posts, postAccounts } from "@/db/schema";
import { eq } from "drizzle-orm";

const TWEET_URL = "https://api.x.com/2/tweets";

export async function publishTweet(
  postId: string,
  accountId: string,
  userId: string
): Promise<{ success: boolean; tweetId?: string; error?: string }> {
  try {
    // Get the post
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });
    if (!post) throw new Error("Post not found");

    // Get valid access token (handles refresh)
    const accessToken = await getValidAccessToken(accountId, userId);

    // Post to X
    const response = await fetch(TWEET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ text: post.content }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to post tweet");
    }

    // Update post_accounts status
    await db
      .update(postAccounts)
      .set({
        status: "published",
        tweetId: data.data.id,
      })
      .where(
        eq(postAccounts.postId, postId) && eq(postAccounts.twitterAccountId, accountId)
      );

    return { success: true, tweetId: data.data.id };
  } catch (error) {
    // Update post_accounts with error
    await db
      .update(postAccounts)
      .set({
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      })
      .where(
        eq(postAccounts.postId, postId) && eq(postAccounts.twitterAccountId, accountId)
      );

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
```

**Step 5.2 — Post composer component**

```tsx
// src/features/posts/components/post-composer.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Textarea, Card, CardBody, Chip } from "@heroui/react";
import { postSchema } from "../schemas";
import { AccountSelector } from "@/components/shared/account-selector";
import { SchedulePicker } from "./schedule-picker";
import { useAccounts } from "@/hooks/use-accounts";
import type { z } from "zod";

export function PostComposer() {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const { data: accounts } = useAccounts();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: { content: "", accountIds: [] },
  });

  const content = watch("content") || "";
  const charCount = content.length;

  const onSubmit = async (data: z.infer<typeof postSchema>) => {
    // POST to /api/posts
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        accountIds: selectedAccounts,
      }),
    });

    if (response.ok) {
      // Reset form, show success toast
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Textarea
            {...register("content")}
            placeholder="What's happening?"
            minRows={4}
            maxLength={280}
            isInvalid={!!errors.content}
            errorMessage={errors.content?.message}
          />

          <div className="flex justify-between items-center">
            <Chip variant="flat" color={charCount > 280 ? "danger" : "default"}>
              {charCount}/280
            </Chip>
          </div>

          <AccountSelector
            accounts={accounts || []}
            selected={selectedAccounts}
            onChange={setSelectedAccounts}
          />

          <SchedulePicker />

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="flat">Save Draft</Button>
            <Button type="submit" color="primary">Post Now</Button>
            <Button type="button" color="secondary">Schedule</Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
```

---

### Phase 6: Background Jobs (Day 6)

**Step 6.1 — Queue definitions**

```ts
// src/jobs/queues.ts
import { Queue } from "bullmq";
import { redis } from "@/lib/redis";

export const publishQueue = new Queue("publish-post", { connection: redis });
export const retryQueue = new Queue("retry-failed-post", { connection: redis });
export const cleanupQueue = new Queue("cleanup-jobs", { connection: redis });
```

**Step 6.2 — Redis connection**

```ts
// src/lib/redis.ts
import IORedis from "ioredis";

export const redis = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});
```

**Step 6.3 — Publish worker**

```ts
// src/jobs/workers/publish-post.worker.ts
import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { db } from "@/lib/db";
import { posts, postAccounts } from "@/db/schema";
import { eq, and, lte } from "drizzle-orm";
import { publishTweet } from "@/services/twitter/publish";

export const publishWorker = new Worker(
  "publish-post",
  async (job) => {
    const { postId } = job.data;

    // Get all pending post_accounts for this post
    const pendingAccounts = await db.query.postAccounts.findMany({
      where: and(
        eq(postAccounts.postId, postId),
        eq(postAccounts.status, "pending")
      ),
    });

    // Update post status to publishing
    await db.update(posts).set({ status: "publishing" }).where(eq(posts.id, postId));

    // Publish to each account
    for (const pa of pendingAccounts) {
      await db
        .update(postAccounts)
        .set({ status: "publishing" })
        .where(eq(postAccounts.id, pa.id));

      const result = await publishTweet(postId, pa.twitterAccountId, "user-id");

      if (result.success) {
        await db
          .update(postAccounts)
          .set({ status: "published", tweetId: result.tweetId })
          .where(eq(postAccounts.id, pa.id));
      } else {
        await db
          .update(postAccounts)
          .set({ status: "failed", error: result.error })
          .where(eq(postAccounts.id, pa.id));
      }
    }

    // Check if all accounts are done
    const allAccounts = await db.query.postAccounts.findMany({
      where: eq(postAccounts.postId, postId),
    });

    const allPublished = allAccounts.every((a) => a.status === "published");
    const anyFailed = allAccounts.some((a) => a.status === "failed");

    await db
      .update(posts)
      .set({
        status: allPublished ? "published" : anyFailed ? "failed" : "publishing",
        publishedAt: allPublished ? new Date() : null,
        error: anyFailed ? "Some accounts failed to publish" : null,
      })
      .where(eq(posts.id, postId));

    return { postId, allPublished, anyFailed };
  },
  {
    connection: redis,
    concurrency: 5,
  }
);
```

**Step 6.4 — Scheduler (cron-like)**

```ts
// src/jobs/workers/scheduler.worker.ts
import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { db } from "@/lib/db";
import { posts } from "@/db/schema";
import { eq, and, lte } from "drizzle-orm";
import { publishQueue } from "../queues";

export const schedulerWorker = new Worker(
  "scheduler",
  async () => {
    // Find posts that are scheduled and due
    const duePosts = await db.query.posts.findMany({
      where: and(
        eq(posts.status, "scheduled"),
        lte(posts.scheduledAt, new Date())
      ),
    });

    for (const post of duePosts) {
      // Add to publish queue
      await publishQueue.add("publish", { postId: post.id }, {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
      });

      // Update status
      await db.update(posts).set({ status: "publishing" }).where(eq(posts.id, post.id));
    }

    return { processed: duePosts.length };
  },
  {
    connection: redis,
  }
);

// Run every minute
import { QueueScheduler } from "bullmq";
const queueScheduler = new QueueScheduler("scheduler", { connection: redis });
```

---

### Phase 7: Dashboard UI (Days 7-8)

**Step 7.1 — Dashboard layout**

```tsx
// src/app/(dashboard)/layout.tsx
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

**Step 7.2 — Sidebar component**

```tsx
// src/components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import {
  LayoutDashboard,
  PenSquare,
  Clock,
  FileText,
  Settings,
  Twitter,
} from "lucide-react";
import { cn } from "@/utils/cn";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/compose", label: "Compose", icon: PenSquare },
  { href: "/queue", label: "Queue", icon: Clock },
  { href: "/drafts", label: "Drafts", icon: FileText },
  { href: "/accounts", label: "Accounts", icon: Twitter },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-divider bg-background flex flex-col">
      <div className="p-4 border-b border-divider">
        <h1 className="text-xl font-bold">X Dashboard</h1>
      </div>
      <nav className="flex-1 p-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? "flat" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                pathname === item.href && "bg-primary/10 text-primary"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

---

### Phase 8: Testing & Deployment (Days 9-10)

**Step 8.1 — Testing setup**

```bash
# Install test dependencies
bun add -D vitest @testing-library/react @testing-library/jest-dom
bun add -D @playwright/test
```

**Step 8.2 — Unit tests**

```ts
// src/__tests__/schemas.test.ts
import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema, postSchema } from "@/features/auth/schemas";

describe("loginSchema", () => {
  it("validates correct login data", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "Password1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "invalid",
      password: "Password1",
    });
    expect(result.success).toBe(false);
  });
});
```

**Step 8.3 — E2E tests**

```ts
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test("user can login", async ({ page }) => {
  await page.goto("/login");
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="password"]', "Password1");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/dashboard");
});
```

**Step 8.4 — Docker setup**

```dockerfile
# Dockerfile
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl

FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

**Step 8.5 — Docker Compose (local dev)**

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: twitter_auto
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## 9. API Routes Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET/POST | `/api/auth/[...all]` | Better Auth handler | Public |
| GET | `/api/accounts` | List connected X accounts | Yes |
| POST | `/api/accounts/connect` | Initiate X OAuth flow | Yes |
| DELETE | `/api/accounts/:id` | Disconnect X account | Yes |
| GET | `/api/posts` | List posts (filterable) | Yes |
| POST | `/api/posts` | Create new post | Yes |
| PATCH | `/api/posts/:id` | Update post | Yes |
| DELETE | `/api/posts/:id` | Delete post | Yes |
| GET | `/api/queue` | List queued posts | Yes |
| POST | `/api/queue/retry` | Retry failed post | Yes |
| GET | `/api/templates` | List templates | Yes |
| POST | `/api/templates` | Create template | Yes |
| GET | `/api/notifications` | List notifications | Yes |
| PATCH | `/api/notifications/:id/read` | Mark as read | Yes |

---

## 10. Development Commands

```bash
# Development
bun run dev              # Start dev server
bun run worker           # Start BullMQ worker (separate terminal)

# Database
bunx drizzle-kit generate  # Generate migration
bunx drizzle-kit migrate   # Run migration
bunx drizzle-kit studio    # Open Drizzle Studio

# Build
bun run build            # Production build
bun run start            # Start production server

# Testing
bun run test             # Unit tests
bun run test:e2e         # E2E tests

# Linting
bun run lint             # ESLint
bun run format           # Prettier

# Worker (must run alongside dev server)
bun run worker
```

---

## 11. Security Checklist

- [ ] HttpOnly cookies for session storage (Better Auth default)
- [ ] CSRF protection via SameSite cookies
- [ ] Rate limiting on auth endpoints (5 req/10 min)
- [ ] Rate limiting on API endpoints (10 req/10 sec)
- [ ] Zod validation on all inputs
- [ ] SQL injection protection (Drizzle ORM parameterized queries)
- [ ] OAuth tokens encrypted at rest (AES-256-GCM)
- [ ] Security headers (X-Frame-Options, HSTS, CSP)
- [ ] No NEXT_PUBLIC_ prefix on secrets
- [ ] Audit logging for sensitive actions
- [ ] proxy.ts for route protection (NOT middleware.ts)
- [ ] Server-side auth checks in every API route (not just proxy.ts)
- [ ] Input sanitization for post content
- [ ] HTTPS enforced in production

---

## 12. X API v2 Notes

- **Pricing**: Basic tier = $100/month (required for posting)
- **Auth**: OAuth 2.0 Authorization Code Flow with PKCE
- **Scopes needed**: `tweet.read tweet.write users.read offline.access`
- **Rate limits**: 200 tweets per 15 min (app-level), 50 per 15 min (user-level)
- **Media upload**: Uses v1.1 endpoint (`upload.twitter.com/1.1/media/upload.json`)
- **No native scheduling**: Must build own scheduling with BullMQ + Redis

---

## 13. Future Expansion

- Team collaboration with workspaces
- Approval workflows for scheduled posts
- AI writing assistant for content generation
- Analytics dashboard (engagement metrics)
- LinkedIn, Facebook, Threads, Instagram support
- White-label platform
- Subscription billing (Stripe)
- Public API with API keys
- Webhooks for external integrations
- Mobile application (React Native)
