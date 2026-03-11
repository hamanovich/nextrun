import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("emailVerified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("createdAt", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    updatedAt: timestamp("updatedAt", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    stripeCredits: integer("stripeCredits").default(5).notNull(),
    stripeCustomerId: text("stripeCustomerId"),
    stripeCheckoutSessionId: text("stripeCheckoutSessionId"),
  },
  (table) => [index("users_stripeCustomerId_idx").on(table.stripeCustomerId)],
);

export const sessions = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    updatedAt: timestamp("updatedAt", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("sessions_userId_idx").on(table.userId),
    index("sessions_token_idx").on(table.token),
  ],
);

export const accounts = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt", {
      withTimezone: true,
      mode: "date",
    }),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", {
      withTimezone: true,
      mode: "date",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    updatedAt: timestamp("updatedAt", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => [
    index("accounts_userId_idx").on(table.userId),
    index("accounts_providerId_accountId_idx").on(
      table.providerId,
      table.accountId,
    ),
  ],
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true, mode: "date" }),
  updatedAt: timestamp("updatedAt", { withTimezone: true, mode: "date" }),
});
