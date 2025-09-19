import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cases = pgTable("cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  company: text("company").notNull(),
  country: text("country").notNull(),
  industry: text("industry").notNull(),
  solution_name: text("solution_name").notNull(),
  description: text("description").notNull(),
  key_metrics: jsonb("key_metrics").notNull(), // Array of {label: string, value: string, type: string}
  learning_points: jsonb("learning_points").notNull(), // Array of strings
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  full_text: text("full_text").notNull(), // For AI context
});

export const chat_messages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  message: text("message").notNull(),
  response: text("response").notNull(),
  timestamp: integer("timestamp").notNull(),
});

export const insertCaseSchema = createInsertSchema(cases).omit({
  id: true,
});

export const insertChatMessageSchema = createInsertSchema(chat_messages).omit({
  id: true,
});

export type InsertCase = z.infer<typeof insertCaseSchema>;
export type Case = typeof cases.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chat_messages.$inferSelect;
