import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas for easy validation
export const insertPromoterSchema = createInsertSchema(promotersTable);
export const selectPromoterSchema = createSelectSchema(promotersTable);

export const insertTicketSchema = createInsertSchema(ticketsTable);
export const selectTicketSchema = createSelectSchema(ticketsTable);

export type Promoter = z.infer<typeof selectPromoterSchema>;
export type Ticket = z.infer<typeof selectTicketSchema>;