import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const submitQuizSchema = z.object({
  sessionId: z.string(),
  answers: z.array(z.object({
    questionId: z.number(),
    answerIndex: z.number(),
    type: z.string()
  }))
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all dinosaurs
  app.get("/api/dinosaurs", async (req, res) => {
    try {
      const dinosaurs = await storage.getAllDinosaurs();
      res.json(dinosaurs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dinosaurs" });
    }
  });

  // Get specific dinosaur
  app.get("/api/dinosaurs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const dinosaur = await storage.getDinosaur(id);
      if (!dinosaur) {
        return res.status(404).json({ message: "Dinosaur not found" });
      }
      res.json(dinosaur);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dinosaur" });
    }
  });

  // Get all quiz questions
  app.get("/api/quiz/questions", async (req, res) => {
    try {
      const questions = await storage.getAllQuizQuestions();
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz questions" });
    }
  });

  // Submit quiz and get matched dinosaur
  app.post("/api/quiz/submit", async (req, res) => {
    try {
      const { sessionId, answers } = submitQuizSchema.parse(req.body);
      
      // Calculate matching scores
      const dinosaurs = await storage.getAllDinosaurs();
      const typeScores: Record<string, number> = {};
      
      // Count occurrences of each personality type from answers
      answers.forEach(answer => {
        typeScores[answer.type] = (typeScores[answer.type] || 0) + 1;
      });

      // Find best matching dinosaur
      let bestMatch = dinosaurs[0];
      let bestScore = 0;

      dinosaurs.forEach(dinosaur => {
        let score = 0;
        Object.entries(typeScores).forEach(([type, count]) => {
          const matchingScore = dinosaur.matchingScore[type] || 0;
          score += matchingScore * count;
        });
        
        if (score > bestScore) {
          bestScore = score;
          bestMatch = dinosaur;
        }
      });

      // Save quiz result
      await storage.createQuizResult({
        sessionId,
        answers,
        matchedDinosaurId: bestMatch.id,
        createdAt: new Date().toISOString()
      });

      res.json({
        matchedDinosaur: bestMatch,
        matchingScore: bestScore
      });
    } catch (error) {
      console.error("Quiz submission error:", error);
      res.status(500).json({ message: "Failed to process quiz submission" });
    }
  });

  // Get quiz result
  app.get("/api/quiz/result/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const result = await storage.getQuizResult(sessionId);
      
      if (!result) {
        return res.status(404).json({ message: "Quiz result not found" });
      }

      const matchedDinosaur = result.matchedDinosaurId 
        ? await storage.getDinosaur(result.matchedDinosaurId)
        : null;

      res.json({
        ...result,
        matchedDinosaur
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz result" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
