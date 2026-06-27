import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const promotersTable = pgTable("promoters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  referralCode: text("referral_code").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ticketsTable = pgTable("tickets", {
  id: serial("id").primaryKey(),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  tier: text("tier").notNull(),
  capacityTaken: integer("capacity_taken").notNull(), // 1, 2, or 4
  status: text("status").notNull().default("pending"), // 'pending', 'paid', 'canceled'
  promoterId: integer("promoter_id").references(() => promotersTable.id),
  // Attendee details
  buyerName: text("buyer_name").notNull().default(""),
  buyerEmail: text("buyer_email").notNull().default(""),
  // QR code & check-in
  qrToken: text("qr_token").unique(),
  checkedIn: boolean("checked_in").notNull().default(false),
  checkedInAt: timestamp("checked_in_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Types inferred directly from Drizzle table definitions
export type Promoter = InferSelectModel<typeof promotersTable>;
export type NewPromoter = InferInsertModel<typeof promotersTable>;

export type Ticket = InferSelectModel<typeof ticketsTable>;
export type NewTicket = InferInsertModel<typeof ticketsTable>;