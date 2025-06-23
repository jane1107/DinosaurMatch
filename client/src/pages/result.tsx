import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, RotateCcw, Book, Crown, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import type { Dinosaur, QuizResult } from "@shared/schema";

export default function Result() {
  const [location] = useLocation();
  const sessionId = location.split("/").pop();
  const { toast } = useToast();

  const { data: result, isLoading } = useQuery<QuizResult & { matchedDinosaur: Dinosaur }>({
    queryKey: [`/api/quiz/result/${sessionId}`],
    enabled: !!sessionId,
  });

  const handleShare = async () => {
    if (navigator.share && result?.matchedDinosaur) {
      try {
        await navigator.share({
          title: "나랑 어울리는 공룡 찾기 결과",
          text: `나는 ${result.matchedDinosaur.koreanName}와 잘 어울려요! 🦕`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("공유 실패:", error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "링크가 복사되었습니다",
        description: "친구들과 결과를 공유해보세요!",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 bg-gradient-to-br from-green-50 to-amber-50 flex justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dino-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">결과를 분석하는 중...</p>
        </div>
      </div>
    );
  }

  if (!result || !result.matchedDinosaur) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-600">결과를 찾을 수 없습니다.</p>
        <Link href="/">
          <Button className="mt-4">홈으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  const dinosaur = result.matchedDinosaur;

  return (
    <div className="py-20 bg-gradient-to-br from-green-50 to-amber-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-4xl font-bold dino-green mb-4">🎉 결과가 나왔어요!</h2>
            <p className="text-xl text-gray-600">당신과 가장 잘 어울리는 공룡은...</p>
          </motion.div>

          {/* Result Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-2xl mb-8">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center">
                    <img
                      src={dinosaur.imageUrl}
                      alt={dinosaur.koreanName}
                      className="w-full h-64 object-cover rounded-2xl mb-4 shadow-lg"
                      onError={(e) => {
                        // Fallback to emoji if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden text-8xl mb-4">🦕</div>
                    <Badge className="bg-dino-green text-white px-6 py-2 text-xl font-bold">
                      {dinosaur.koreanName} 🦖
                    </Badge>
                  </div>
                  
                  <div className="text-left">
                    <h3 className="text-3xl font-bold dino-green mb-4">{dinosaur.personality}</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Crown className="text-amber-500 mr-3 mt-1 h-5 w-5" />
                        <div>
                          <h4 className="font-semibold text-gray-800">성격 특징</h4>
                          <p className="text-gray-600">{dinosaur.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock className="text-amber-500 mr-3 mt-1 h-5 w-5" />
                        <div>
                          <h4 className="font-semibold text-gray-800">생존 시기</h4>
                          <p className="text-gray-600">{dinosaur.period}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Heart className="text-amber-500 mr-3 mt-1 h-5 w-5" />
                        <div>
                          <h4 className="font-semibold text-gray-800">주요 특성</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {dinosaur.traits.map((trait, index) => (
                              <Badge key={index} variant="secondary" className="text-sm">
                                {trait}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              onClick={handleShare}
              className="bg-dino-green hover:bg-dino-green/90 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <Share2 className="mr-2 h-5 w-5" />
              결과 공유하기
            </Button>
            
            <Link href="/quiz">
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-50 text-dino-green border-2 border-dino-green px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                다시 테스트하기
              </Button>
            </Link>
            
            <Link href="/dinosaurs">
              <Button className="bg-dino-amber hover:bg-dino-amber/90 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                <Book className="mr-2 h-5 w-5" />
                다른 공룡 보기
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
