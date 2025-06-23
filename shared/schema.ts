import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const dinosaurs = pgTable("dinosaurs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  koreanName: text("korean_name").notNull(),
  personality: text("personality").notNull(),
  description: text("description").notNull(),
  period: text("period").notNull(),
  traits: json("traits").$type<string[]>().notNull(),
  matchingScore: json("matching_score").$type<Record<string, number>>().notNull(),
  imageUrl: text("image_url").notNull(),
  personalityType: text("personality_type").notNull(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answers: json("answers").$type<Array<{text: string, type: string}>>().notNull(),
  order: integer("order").notNull(),
});

export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  answers: json("answers").$type<Array<{questionId: number, answerIndex: number, type: string}>>().notNull(),
  matchedDinosaurId: integer("matched_dinosaur_id").references(() => dinosaurs.id),
  createdAt: text("created_at").notNull(),
});

export const insertDinosaurSchema = createInsertSchema(dinosaurs).omit({
  id: true,
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
});

export const insertQuizResultSchema = createInsertSchema(quizResults).omit({
  id: true,
});

export type Dinosaur = typeof dinosaurs.$inferSelect;
export type InsertDinosaur = z.infer<typeof insertDinosaurSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
