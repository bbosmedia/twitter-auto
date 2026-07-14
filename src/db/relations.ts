import { relations } from "drizzle-orm";
import {
  user,
  session,
  account,
  twitterAccounts,
  posts,
  postAccounts,
  media,
  templates,
  notifications,
} from "./schema";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  twitterAccounts: many(twitterAccounts),
  posts: many(posts),
  templates: many(templates),
  notifications: many(notifications),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

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

export const templatesRelations = relations(templates, ({}) => ({}));

export const notificationsRelations = relations(notifications, ({}) => ({}));
