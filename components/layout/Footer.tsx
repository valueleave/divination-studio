import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="font-display text-sm text-foreground tracking-wider">
              Divination Studio of Zhou Xiaotong
            </span>
          </div>

          {/* Center info */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Traditional Chinese Divination Research
            </p>
          </div>

          {/* Copyright */}
          <div className="text-xs text-muted-foreground">
            <p>&copy; 2026 Divination Studio</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground/60 max-w-2xl mx-auto leading-relaxed">
            Disclaimer: This system is provided for traditional cultural research and
            entertainment reference only. It does not constitute a basis for real-world
            decision-making. Please use rational judgment for important life decisions.
            <br />
            免责声明：本系统仅供传统文化研究与娱乐参考，不构成现实决策依据。
            重要人生决定请依靠理性判断。
          </p>
        </div>
      </div>
    </footer>
  );
}
