import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dino-green text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🦕</span>
              </div>
              <h3 className="text-xl font-bold">공룡 매칭</h3>
            </div>
            <p className="text-white/80 leading-relaxed">
              당신의 성격과 가장 잘 맞는 공룡을 찾아보세요. 
              16마리의 다양한 공룡들이 당신을 기다리고 있어요!
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">빠른 링크</h4>
            <ul className="space-y-2 text-white/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="hover:text-white transition-colors">
                  성격 테스트
                </Link>
              </li>
              <li>
                <Link href="/dinosaurs" className="hover:text-white transition-colors">
                  공룡 도감
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">공유하기</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          <p>&copy; 2024 공룡 매칭. 모든 권리 보유.</p>
        </div>
      </div>
    </footer>
  );
}
