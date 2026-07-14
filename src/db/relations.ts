import { relations } from "drizzle-orm";
import {
  twitterAccounts,
  posts,
  postAccounts,
  media,
  templates,
  hashtags,
  auditLogs,
  notifications,
} from "./schema";

export const postsRelations = relations(posts, ({ many }) => ({
  postAccounts: many(postAccounts),
  media: many(media),
}));

export const postAccountsRelations = relations(postAccounts, ({ one }) => ({
  post: one(posts, {
    fields: [postAccounts.postId],
    references: [posts.id],
  }),
  twitterAccount: one(twitterAccounts, {
    fields: [postAccounts.twitterAccountId],
    references: [twitterAccounts.id],
  }),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  post: one(posts, {
    fields: [media.postId],
    references: [posts.id],
  }),
}));

export const twitterAccountsRelations = relations(
  twitterAccounts,
  ({ many }) => ({
    postAccounts: many(postAccounts),
  })
);

export const templatesRelations = relations(templates, ({ one }) => ({
  user: one(posts, {
    fields: [templates.userId],
    references: [posts.userId],
  }),
}));

export const hashtagsRelations = relations(hashtags, ({ one }) => ({
  user: one(posts, {
    fields: [hashtags.userId],
    references: [posts.userId],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(posts, {
    fields: [auditLogs.userId],
    references: [posts.userId],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(posts, {
    fields: [notifications.userId],
    references: [posts.userId],
  }),
}));
