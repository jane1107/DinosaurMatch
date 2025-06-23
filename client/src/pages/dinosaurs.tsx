import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import type { Dinosaur } from "@shared/schema";

export default function Dinosaurs() {
  const { data: dinosaurs, isLoading } = useQuery<Dinosaur[]>({
    queryKey: ["/api/dinosaurs"],
  });

  if (isLoading) {
    return (
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold dino-green mb-4">공룡 도감 🦕</h2>
            <p className="text-xl text-gray-600">16마리의 다양한 공룡들을 만나보세요!</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="shadow-lg animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-2xl"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dinosaurs || dinosaurs.length === 0) {
    return (
      <div className="py-20 bg-white text-center">
        <p className="text-gray-600">공룡 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const getPersonalityColor = (type: string) => {
    const colors: Record<string, string> = {
      "리더형": "bg-red-100 text-red-600",
      "온순형": "bg-green-100 text-green-600", 
      "지능형": "bg-blue-100 text-blue-600",
      "평화형": "bg-green-100 text-green-600",
      "방어형": "bg-gray-100 text-gray-600",
      "자유형": "bg-sky-100 text-sky-600",
      "개성형": "bg-purple-100 text-purple-600",
      "보호형": "bg-orange-100 text-orange-600",
      "사교형": "bg-yellow-100 text-yellow-600",
      "소통형": "bg-pink-100 text-pink-600",
      "도전형": "bg-red-100 text-red-600",
      "협력형": "bg-green-100 text-green-600",
      "신속형": "bg-blue-100 text-blue-600",
      "성찰형": "bg-indigo-100 text-indigo-600",
      "창의형": "bg-purple-100 text-purple-600",
      "예술형": "bg-pink-100 text-pink-600"
    };
    return colors[type] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold dino-green mb-4">공룡 도감 🦕</h2>
          <p className="text-xl text-gray-600">16마리의 다양한 공룡들을 만나보세요!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dinosaurs.map((dinosaur, index) => (
            <motion.div
              key={dinosaur.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full">
                <img
                  src={dinosaur.imageUrl}
                  alt={dinosaur.koreanName}
                  className="w-full h-48 object-cover rounded-t-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUI5QjlCIiBmb250LXNpemU9IjQ4Ij7wn6aVPC90ZXh0Pgo8L3N2Zz4K";
                  }}
                />
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold dino-green mb-2">{dinosaur.koreanName}</h3>
                  <p className="text-gray-600 mb-4 flex-1">{dinosaur.personality}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {dinosaur.period.split('(')[0].trim()}
                    </span>
                    <Badge className={getPersonalityColor(dinosaur.personalityType)}>
                      {dinosaur.personalityType}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
