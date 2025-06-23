import type { Dinosaur } from "@shared/schema";

export interface AnswerData {
  questionId: number;
  answerIndex: number;
  type: string;
}

export function calculateBestMatch(answers: AnswerData[], dinosaurs: Dinosaur[]): Dinosaur {
  // Count occurrences of each personality type from answers
  const typeScores: Record<string, number> = {};
  
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

  return bestMatch;
}

export function getPersonalityInsight(answers: AnswerData[]): string {
  const typeScores: Record<string, number> = {};
  
  answers.forEach(answer => {
    typeScores[answer.type] = (typeScores[answer.type] || 0) + 1;
  });

  const dominantTypes = Object.entries(typeScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([type]) => type);

  const insights: Record<string, string> = {
    extrovert: "사교적이고 활발한",
    introvert: "내성적이고 사려깊은", 
    leader: "리더십이 강한",
    creative: "창의적이고 예술적인",
    logical: "논리적이고 분석적인",
    adventurous: "모험을 좋아하는",
    peaceful: "평화롭고 온화한",
    action: "행동력이 뛰어난",
    collaborative: "협력을 중요시하는"
  };

  const personalityTraits = dominantTypes
    .map(type => insights[type])
    .filter(Boolean)
    .slice(0, 2);

  if (personalityTraits.length === 0) {
    return "균형잡힌 성격의";
  }

  return personalityTraits.join(", ") + " 성격의";
}
