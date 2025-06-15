import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  originalInput: text("original_input").notNull(),
  transformedPrompt: text("transformed_prompt").notNull(),
  frameworks: jsonb("frameworks").notNull(), // Array of applied frameworks
  parameters: jsonb("parameters").notNull(), // User-selected parameters
  useCase: text("use_case").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  template: text("template").notNull(),
  frameworks: jsonb("frameworks").notNull(),
  description: text("description").notNull(),
});

export const insertPromptSchema = createInsertSchema(prompts).omit({
  id: true,
  createdAt: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
});

export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Prompt = typeof prompts.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;
