import { dinosaurs, quizQuestions, quizResults, type Dinosaur, type InsertDinosaur, type QuizQuestion, type InsertQuizQuestion, type QuizResult, type InsertQuizResult } from "@shared/schema";

export interface IStorage {
  getDinosaur(id: number): Promise<Dinosaur | undefined>;
  getAllDinosaurs(): Promise<Dinosaur[]>;
  createDinosaur(dinosaur: InsertDinosaur): Promise<Dinosaur>;
  
  getQuizQuestion(id: number): Promise<QuizQuestion | undefined>;
  getAllQuizQuestions(): Promise<QuizQuestion[]>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  getQuizResult(sessionId: string): Promise<QuizResult | undefined>;
}

export class MemStorage implements IStorage {
  private dinosaurs: Map<number, Dinosaur>;
  private quizQuestions: Map<number, QuizQuestion>;
  private quizResults: Map<string, QuizResult>;
  private currentDinosaurId: number;
  private currentQuestionId: number;
  private currentResultId: number;

  constructor() {
    this.dinosaurs = new Map();
    this.quizQuestions = new Map();
    this.quizResults = new Map();
    this.currentDinosaurId = 1;
    this.currentQuestionId = 1;
    this.currentResultId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize dinosaurs
    const dinosaurData: InsertDinosaur[] = [
      {
        name: "Tyrannosaurus Rex",
        koreanName: "티라노사우루스 렉스",
        personality: "리더십의 왕",
        description: "강한 리더십과 결단력을 가진 당신! 어떤 상황에서도 앞장서서 문제를 해결하는 타입이에요.",
        period: "백악기 후기 (약 6,800만 년 전)",
        traits: ["리더십", "결단력", "강함", "카리스마"],
        matchingScore: {"leader": 10, "action": 9, "confrontational": 8, "logical": 7},
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        personalityType: "리더형"
      },
      {
        name: "Triceratops",
        koreanName: "트리케라톱스",
        personality: "평화로운 수호자",
        description: "온화하고 신중한 성격으로 가족과 친구들을 보호하는 따뜻한 마음을 가진 당신입니다.",
        period: "백악기 후기 (약 6,800만 년 전)",
        traits: ["온순함", "보호본능", "평화", "안정감"],
        matchingScore: {"peaceful": 10, "mediator": 9, "cautious": 8, "collaborative": 7},
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        personalityType: "온순형"
      },
      {
        name: "Velociraptor",
        koreanName: "벨로키랍토르",
        personality: "영리한 전략가",
        description: "뛰어난 지능과 전략적 사고를 가진 당신! 문제를 창의적으로 해결하는 능력이 탁월해요.",
        period: "백악기 후기 (약 7,500만 년 전)",
        traits: ["지능", "전략", "민첩함", "협력"],
        matchingScore: {"logical": 10, "creative": 9, "adaptable": 8, "collaborative": 7},
        imageUrl: "https://images.unsplash.com/photo-1574870111867-089730e5a72b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        personalityType: "지능형"
      },
      {
        name: "Brachiosaurus",
        koreanName: "브라키오사우루스",
        personality: "온화한 거인",
        description: "마음이 넓고 포용력이 뛰어난 당신! 다른 사람들에게 안정감과 위로를 주는 존재예요.",
        period: "쥐라기 후기 (약 1억 5천만 년 전)",
        traits: ["온화함", "포용력", "평온", "인내"],
        matchingScore: {"peaceful": 10, "intuitive": 8, "cautious": 7, "mediator": 9},
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        personalityType: "평화형"
      },
      {
        name: "Stegosaurus",
        koreanName: "스테고사우루스",
        personality: "신중한 방어자",
        description: "신중하고 차분한 성격으로 주변을 잘 관찰하며 필요할 때 확실한 행동을 취하는 당신입니다.",
        period: "쥐라기 후기 (약 1억 5천만 년 전)",
        traits: ["신중함", "방어력", "관찰력", "인내"],
        matchingScore: {"cautious": 10, "planning": 9, "observant": 8, "avoidant": 6},
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        personalityType: "방어형"
      },
      {
        name: "Pteranodon",
        koreanName: "프테라노돈",
        personality: "자유로운 탐험가",
        description: "자유롭고 모험을 좋아하는 당신! 새로운 경험과 도전을 두려워하지 않는 용감한 영혼이에요.",
        period: "백악기 후기 (약 8,500만 년 전)",
        traits: ["자유로움", "모험심", "독립성", "호기심"],
        matchingScore: {"adventurous": 10, "adaptable": 9, "action": 8, "extrovert": 7},
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        personalityType: "자유형"
      },
      {
        name: "Spinosaurus",
        koreanName: "스피노사우루스",
        personality: "독특한 개성파",
        description: "남들과는 다른 독특한 매력을 가진 당신! 자신만의 스타일을 추구하며 개성이 강해요.",
        period: "백악기 중기 (약 1억 년 전)",
        traits: ["개성", "독창성", "적응력", "강인함"],
        matchingScore: {"creative": 10, "adventurous": 8, "adaptable": 9, "action": 7},
        imageUrl: "https://images.unsplash.com/photo-1574870111867-089730e5a72b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        personalityType: "개성형"
      },
      {
        name: "Ankylosaurus",
        koreanName: "안킬로사우루스",
        personality: "든든한 수호자",
        description: "믿음직하고 안정적인 성격으로 주변 사람들에게 든든한 지원군이 되어주는 당신입니다.",
        period: "백악기 후기 (약 7,000만 년 전)",
        traits: ["든든함", "보호본능", "안정성", "충성"],
        matchingScore: {"executor": 10, "cautious": 9, "collaborative": 8, "mediator": 7},
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        personalityType: "보호형"
      },
      {
        name: "Dilophosaurus",
        koreanName: "딜로포사우루스",
        personality: "활발한 사교가",
        description: "밝고 활발한 성격으로 사람들과 어울리기를 좋아하는 당신! 분위기 메이커 역할을 잘해요.",
        period: "쥐라기 전기 (약 1억 9천만 년 전)",
        traits: ["사교성", "활발함", "유머", "친근함"],
        matchingScore: {"extrovert": 10, "social": 9, "ambivert": 7, "creative": 8},
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        personalityType: "사교형"
      },
      {
        name: "Parasaurolophus",
        koreanName: "파라사우롤로푸스",
        personality: "소통의 달인",
        description: "뛰어난 소통 능력으로 사람들 사이의 다리 역할을 잘하는 당신! 공감 능력이 뛰어나요.",
        period: "백악기 후기 (약 7,600만 년 전)",
        traits: ["소통력", "공감능력", "화합", "친화력"],
        matchingScore: {"mediator": 10, "collaborative": 9, "social": 8, "intuitive": 7},
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        personalityType: "소통형"
      },
      {
        name: "Allosaurus",
        koreanName: "알로사우루스",
        personality: "열정적인 도전자",
        description: "열정적이고 경쟁심이 강한 당신! 목표를 향해 끝까지 포기하지 않는 투지를 가지고 있어요.",
        period: "쥐라기 후기 (약 1억 5천만 년 전)",
        traits: ["열정", "경쟁심", "도전정신", "끈기"],
        matchingScore: {"action": 10, "confrontational": 9, "leader": 8, "adventurous": 7},
        imageUrl: "https://images.unsplash.com/photo-1574870111867-089730e5a72b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        personalityType: "도전형"
      },
      {
        name: "Diplodocus",
        koreanName: "디플로도쿠스",
        personality: "친근한 조력자",
        description: "친근하고 도움을 주기 좋아하는 당신! 다른 사람의 성공을 위해 기꺼이 지원하는 따뜻한 마음을 가졌어요.",
        period: "쥐라기 후기 (약 1억 5천만 년 전)",
        traits: ["친근함", "협력", "지원", "겸손"],
        matchingScore: {"collaborative": 10, "executor": 8, "peaceful": 9, "social": 7},
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        personalityType: "협력형"
      },
      {
        name: "Carnotaurus",
        koreanName: "카르노타우루스",
        personality: "스피드의 화신",
        description: "빠른 판단력과 실행력을 가진 당신! 신속하게 움직이며 효율성을 추구하는 성격이에요.",
        period: "백악기 후기 (약 7,200만 년 전)",
        traits: ["신속함", "효율성", "집중력", "민첩성"],
        matchingScore: {"action": 10, "adaptable": 9, "logical": 7, "active": 10},
        imageUrl: "https://images.unsplash.com/photo-1574870111867-089730e5a72b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        personalityType: "신속형"
      },
      {
        name: "Therizinosaurus",
        koreanName: "테리지노사우루스",
        personality: "평온한 철학자",
        description: "깊이 있는 사고를 하며 평온함을 추구하는 당신! 내면의 성찰을 통해 지혜를 얻는 타입이에요.",
        period: "백악기 후기 (약 7,000만 년 전)",
        traits: ["평온함", "성찰", "지혜", "독립성"],
        matchingScore: {"introvert": 10, "solitary": 9, "intuitive": 8, "cautious": 7},
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        personalityType: "성찰형"
      },
      {
        name: "Dracorex",
        koreanName: "드라코렉스",
        personality: "신비로운 몽상가",
        description: "상상력이 풍부하고 창의적인 당신! 남들이 보지 못하는 것을 발견하는 특별한 능력이 있어요.",
        period: "백악기 후기 (약 6,700만 년 전)",
        traits: ["상상력", "창의성", "신비로움", "독창성"],
        matchingScore: {"creative": 10, "intuitive": 9, "introvert": 7, "observant": 8},
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        personalityType: "창의형"
      },
      {
        name: "Amargasaurus",
        koreanName: "아마르가사우루스",
        personality: "독특한 예술가",
        description: "예술적 감성과 독특한 표현력을 가진 당신! 자신만의 방식으로 세상을 아름답게 만들어요.",
        period: "백악기 전기 (약 1억 3천만 년 전)",
        traits: ["예술성", "감성", "표현력", "독창성"],
        matchingScore: {"creative": 10, "intuitive": 9, "ambivert": 8, "observant": 7},
        imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        personalityType: "예술형"
      }
    ];

    dinosaurData.forEach(data => {
      this.createDinosaur(data);
    });

    // Initialize quiz questions
    const questionData: InsertQuizQuestion[] = [
      {
        question: "친구들과 함께 있을 때 나는?",
        answers: [
          { text: "모든 사람들과 활발하게 이야기한다", type: "extrovert" },
          { text: "가까운 친구들과만 깊은 대화를 나눈다", type: "ambivert" },
          { text: "조용히 관찰하며 필요할 때만 말한다", type: "introvert" }
        ],
        order: 1
      },
      {
        question: "새로운 도전에 직면했을 때 나는?",
        answers: [
          { text: "즉시 행동에 옮긴다", type: "action" },
          { text: "신중하게 계획을 세운다", type: "planning" },
          { text: "다른 사람의 조언을 구한다", type: "collaborative" }
        ],
        order: 2
      },
      {
        question: "스트레스를 받을 때 나는?",
        answers: [
          { text: "혼자만의 시간이 필요하다", type: "solitary" },
          { text: "친구들과 함께 시간을 보낸다", type: "social" },
          { text: "운동이나 활동으로 해소한다", type: "active" }
        ],
        order: 3
      },
      {
        question: "팀 프로젝트에서 나의 역할은?",
        answers: [
          { text: "리더 역할을 맡는다", type: "leader" },
          { text: "아이디어를 제공한다", type: "creative" },
          { text: "꼼꼼하게 실행한다", type: "executor" }
        ],
        order: 4
      },
      {
        question: "휴일에 가장 하고 싶은 것은?",
        answers: [
          { text: "새로운 곳을 탐험한다", type: "adventurous" },
          { text: "집에서 편안히 쉰다", type: "peaceful" },
          { text: "친구들과 함께 놀이를 한다", type: "social" }
        ],
        order: 5
      },
      {
        question: "중요한 결정을 내릴 때 나는?",
        answers: [
          { text: "논리적으로 분석한다", type: "logical" },
          { text: "감정과 직감을 따른다", type: "intuitive" },
          { text: "다양한 의견을 수렴한다", type: "collaborative" }
        ],
        order: 6
      },
      {
        question: "갈등 상황에서 나는?",
        answers: [
          { text: "정면으로 해결한다", type: "confrontational" },
          { text: "중재자 역할을 한다", type: "mediator" },
          { text: "조용히 피해간다", type: "avoidant" }
        ],
        order: 7
      },
      {
        question: "새로운 환경에 적응할 때 나는?",
        answers: [
          { text: "빠르게 적응한다", type: "adaptable" },
          { text: "시간을 두고 천천히 적응한다", type: "cautious" },
          { text: "다른 사람들을 따라한다", type: "observant" }
        ],
        order: 8
      }
    ];

    questionData.forEach(data => {
      this.createQuizQuestion(data);
    });
  }

  async getDinosaur(id: number): Promise<Dinosaur | undefined> {
    return this.dinosaurs.get(id);
  }

  async getAllDinosaurs(): Promise<Dinosaur[]> {
    return Array.from(this.dinosaurs.values());
  }

  async createDinosaur(dinosaur: InsertDinosaur): Promise<Dinosaur> {
    const id = this.currentDinosaurId++;
    const newDinosaur: Dinosaur = { ...dinosaur, id };
    this.dinosaurs.set(id, newDinosaur);
    return newDinosaur;
  }

  async getQuizQuestion(id: number): Promise<QuizQuestion | undefined> {
    return this.quizQuestions.get(id);
  }

  async getAllQuizQuestions(): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values()).sort((a, b) => a.order - b.order);
  }

  async createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion> {
    const id = this.currentQuestionId++;
    const newQuestion: QuizQuestion = { ...question, id };
    this.quizQuestions.set(id, newQuestion);
    return newQuestion;
  }

  async createQuizResult(result: InsertQuizResult): Promise<QuizResult> {
    const id = this.currentResultId++;
    const newResult: QuizResult = { ...result, id };
    this.quizResults.set(result.sessionId, newResult);
    return newResult;
  }

  async getQuizResult(sessionId: string): Promise<QuizResult | undefined> {
    return this.quizResults.get(sessionId);
  }
}

export const storage = new MemStorage();
