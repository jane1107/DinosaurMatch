import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { QuizQuestion } from "@shared/schema";

export default function Quiz() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Array<{ questionId: number; answerIndex: number; type: string }>
  >([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const { data: questions, isLoading } = useQuery<QuizQuestion[]>({
    queryKey: ["/api/quiz/questions"],
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (data: {
      sessionId: string;
      answers: Array<{ questionId: number; answerIndex: number; type: string }>;
    }) => {
      const response = await apiRequest("POST", "/api/quiz/submit", data);
      return response.json();
    },
    onSuccess: (data, variables) => {
      setLocation(`/result/${variables.sessionId}`);
    },
    onError: () => {
      toast({
        title: "오류가 발생했습니다",
        description: "퀴즈 제출 중 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (questions && currentQuestionIndex < questions.length) {
      const currentAnswer = answers.find(
        (a) => a.questionId === questions[currentQuestionIndex].id
      );
      setSelectedAnswer(currentAnswer?.answerIndex ?? null);
    }
  }, [currentQuestionIndex, questions, answers]);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dino-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">퀴즈를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-600">퀴즈 질문을 불러올 수 없습니다.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);

    const newAnswer = {
      questionId: currentQuestion.id,
      answerIndex,
      type: currentQuestion.answers[answerIndex].type,
    };

    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== currentQuestion.id);
      return [...filtered, newAnswer];
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Submit quiz
      const sessionId = Math.random().toString(36).substring(7);
      submitQuizMutation.mutate({ sessionId, answers });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">진행상황</span>
              <span className="text-sm dino-green font-semibold">
                {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Quiz Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-xl border border-gray-100">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <HelpCircle className="text-dino-green text-2xl h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {currentQuestion.question}
                    </h3>
                    <p className="text-gray-600">
                      가장 잘 맞는 답을 선택해주세요
                    </p>
                  </div>

                  <div className="space-y-4">
                    {currentQuestion.answers.map((answer, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full p-4 text-left border-2 rounded-xl transition-all group ${
                          selectedAnswer === index
                            ? "border-dino-green bg-green-50"
                            : "border-gray-200 hover:border-dino-green hover:bg-green-50/50"
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-6 h-6 border-2 rounded-full mr-4 transition-colors ${
                              selectedAnswer === index
                                ? "border-dino-green bg-dino-green"
                                : "border-gray-300 group-hover:border-dino-green"
                            }`}
                          ></div>
                          <span
                            className={`transition-colors ${
                              selectedAnswer === index
                                ? "dino-green font-medium"
                                : "text-gray-700 group-hover:text-dino-green"
                            }`}
                          >
                            {answer.text}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex justify-between mt-8">
                    <Button
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                      variant="outline"
                      className="px-6 py-3"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      이전
                    </Button>

                    <Button
                      onClick={handleNext}
                      disabled={
                        selectedAnswer === null || submitQuizMutation.isPending
                      }
                      className="bg-dino-green hover:bg-dino-green/90 px-6 py-3"
                    >
                      {submitQuizMutation.isPending ? (
                        "처리중..."
                      ) : isLastQuestion ? (
                        "결과 보기"
                      ) : (
                        <>
                          다음
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
