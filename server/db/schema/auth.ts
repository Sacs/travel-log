import { relations } from 'drizzle-orm';
import { index, int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: int({ mode: 'boolean' })
    .default(false)
    .notNull(),
  image: text(),
  createdAt: int().notNull(),
  updatedAt: int().notNull(),
});

export const session = sqliteTable(
  'session',
  {
    id: int().primaryKey({ autoIncrement: true }),
    expiresAt: int().notNull(),
    token: text('token').notNull().unique(),
    createdAt: int().notNull(),
    updatedAt: int().notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  table => [index('session_userId_idx').on(table.userId)],
);

export const account = sqliteTable('account', {
  id: int().primaryKey({ autoIncrement: true }),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: text().notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: int(),
  refreshTokenExpiresAt: int(),
  scope: text(),
  password: text(),
  createdAt: int().notNull(),
  updatedAt: int().notNull(),
});

export const verification = sqliteTable('verification', {
  id: int().primaryKey({ autoIncrement: true }),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: int().notNull(),
  createdAt: int(),
  updatedAt: int(),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
