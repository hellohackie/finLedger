import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  decimal,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transactions table for financial ledger
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  platform: varchar("platform").notNull(), // e.g., "Groww", "Kite", "PhonePe"
  category: varchar("category").notNull(), // e.g., "Stocks", "Mutual Funds", "Gold", "UPI"
  type: varchar("type").notNull(), // "buy", "sell", "transfer"
  assetName: varchar("asset_name").notNull(), // e.g., "RELIANCE", "SBI Bluechip Fund"
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  quantity: decimal("quantity", { precision: 15, scale: 4 }),
  date: timestamp("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Portfolio summary table (computed values)
export const portfolioSummary = pgTable("portfolio_summary", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  category: varchar("category").notNull(),
  totalValue: decimal("total_value", { precision: 15, scale: 2 }).notNull(),
  totalQuantity: decimal("total_quantity", { precision: 15, scale: 4 }),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  date: z.string().or(z.date()),
});

export const updateTransactionSchema = createInsertSchema(transactions).omit({
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type UpdateTransaction = z.infer<typeof updateTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type PortfolioSummary = typeof portfolioSummary.$inferSelect;
