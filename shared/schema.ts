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

export const trends = pgTable("trends", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(), // "customer_understanding", "automation", "strategic"
  title: text("title").notNull(),
  description: text("description").notNull(),
  key_points: jsonb("key_points").notNull(), // Array of strings
  examples: jsonb("examples").notNull(), // Array of examples/companies mentioned
  full_content: text("full_content").notNull(), // Complete section text for AI context
});

export const chat_messages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  message: text("message").notNull(),
  response: text("response").notNull(),
  context_type: text("context_type").default("general"), // "strategic", "practical", "finnish", "planning", "general"
  timestamp: integer("timestamp").notNull(),
});

export const insertCaseSchema = createInsertSchema(cases).omit({
  id: true,
});

export const insertTrendSchema = createInsertSchema(trends).omit({
  id: true,
});

export const insertChatMessageSchema = createInsertSchema(chat_messages).omit({
  id: true,
});

export type InsertCase = z.infer<typeof insertCaseSchema>;
export type Case = typeof cases.$inferSelect;
export type InsertTrend = z.infer<typeof insertTrendSchema>;
export type Trend = typeof trends.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chat_messages.$inferSelect;
