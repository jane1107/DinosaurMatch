import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Play, Book } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-amber-500/20"></div>
      
      <div className="relative container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold dino-green mb-6"
          >
            나랑 어울리는{" "}
            <span className="dino-amber">공룡</span>을 찾아보세요! 🦕
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 leading-relaxed"
          >
            간단한 성격 테스트로 당신과 가장 잘 맞는 공룡을 찾아드려요.<br />
            16마리의 다양한 공룡들이 당신을 기다리고 있어요!
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/quiz">
              <Button className="bg-dino-green hover:bg-dino-green/90 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                <Play className="mr-2 h-5 w-5" />
                테스트 시작하기
              </Button>
            </Link>
            
            <Link href="/dinosaurs">
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-50 text-dino-green border-2 border-dino-green px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                <Book className="mr-2 h-5 w-5" />
                공룡 도감 보기
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Floating dinosaur icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 text-4xl opacity-50"
      >
        🦕
      </motion.div>
      
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-40 right-20 text-3xl opacity-50"
      >
        🦖
      </motion.div>
      
      <motion.div
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-20 text-3xl opacity-50"
      >
        🦴
      </motion.div>
    </section>
  );
}
