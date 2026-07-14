import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "scheduled",
  "publishing",
  "published",
  "failed",
]);

export const postAccountStatusEnum = pgEnum("post_account_status", [
  "pending",
  "publishing",
  "published",
  "failed",
]);

export const mediaTypeEnum = pgEnum("media_type", ["image", "video", "gif"]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "info",
  "success",
  "warning",
  "error",
]);

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

export const postAccounts = pgTable("post_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id").notNull(),
  twitterAccountId: uuid("twitter_account_id").notNull(),
  status: postAccountStatusEnum("status").default("pending").notNull(),
  tweetId: varchar("tweet_id", { length: 255 }),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const media = pgTable("media", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id").notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  type: mediaTypeEnum("type").notNull(),
  size: integer("size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const templates = pgTable("templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const hashtags = pgTable("hashtags", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  tag: varchar("tag", { length: 100 }).notNull(),
  usageCount: integer("usage_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  metadata: jsonb("metadata"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").default("info").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
