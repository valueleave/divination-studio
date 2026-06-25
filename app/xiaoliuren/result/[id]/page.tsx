"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Compass, Clock, ChevronDown, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
interface XiaoliurenResultData {
  question: string;
  time: string;
  deityName: string;
  grade: string;
  element: string;
  direction: string;
  basicAnalysis: string;
  meaning: string;
  loveForecast: string;
  careerForecast: string;
  wealthForecast: string;
  healthForecast: string;
  advice: string;
  comprehensiveAnalysis: string;
  humanisticReading: string;
}
const gradeColors: Record<string, string> = {
  "上吉": "text-green-400",
  "大吉": "text-green-400",
  "中吉": "text-yellow-400",
  "凶": "text-red-400",
  "未凶": "text-yellow-400",
  "大凶": "text-red-500",
};
export default function XiaoliurenResultPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<XiaoliurenResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true, details: false, advice: false, comprehensive: false, humanistic: false,
  });
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch("/api/divination/record/" + params.id);
        const json = await res.json();
        setData(json.result);
      } catch (err) {
        console.error("Failed to load result:", err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchResult();
  }, [params.id]);
  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Sparkles className="w-8 h-8 text-gold" />
        </motion.div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Result not found.</p>
      </div>
    );
  }
  const sectionClass = "cursor-pointer flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gold/5 transition-colors";
  const contentClass = "px-4 pb-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line";
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/divination")} className="text-muted-foreground hover:text-gold">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Divination Center
          </Button>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <h1 className="text-2xl md:text-3xl font-display tracking-[0.1em] text-foreground mb-2">{data.deityName}</h1>
          <p className={"text-sm font-display tracking-wider mb-1 " + (gradeColors[data.grade] || "text-gold/70")}>{data.grade}</p>
          <p className="text-gold/70 text-xs font-display tracking-wider">Xiao Liu Ren Divination Result</p>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{data.time}</span>
            <span className="flex items-center gap-1"><Compass className="w-3 h-3" />{data.element} - {data.direction}</span>
          </div>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-center mb-10">
          <p className="text-xs text-muted-foreground mb-1">Your Question</p>
          <p className="text-foreground/80 font-serif italic">{data.question}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Card className="border-gold/10 subtle-glow">
            <CardContent className="p-0">
              <div className="border-b border-border">
                <div onClick={() => toggleSection("basic")} className={sectionClass}>
                  <span className="flex items-center gap-2 text-foreground font-serif"><Compass className="w-4 h-4 text-gold" /> Basic Analysis</span>
                  <ChevronDown className={"w-4 h-4 text-muted-foreground transition-transform duration-300 " + (expandedSections.basic ? "rotate-180" : "")} />
                </div>
                {expandedSections.basic && <div className={contentClass}><p className="text-xs leading-relaxed">{data.basicAnalysis}</p></div>}
              </div>
              <div className="border-b border-border">
                <div onClick={() => toggleSection("details")} className={sectionClass}>
                  <span className="flex items-center gap-2 text-foreground font-serif"><Sparkles className="w-4 h-4 text-gold" /> Detailed Interpretation</span>
                  <ChevronDown className={"w-4 h-4 text-muted-foreground transition-transform duration-300 " + (expandedSections.details ? "rotate-180" : "")} />
                </div>
                {expandedSections.details && (
                  <div className={contentClass}>
                    <div className="space-y-4">
                      <div><p className="text-gold text-xs font-medium mb-1">Interpretation</p><p className="text-xs">{data.meaning}</p></div>
                      <div><p className="text-gold text-xs font-medium mb-1">Love</p><p className="text-xs">{data.loveForecast}</p></div>
                      <div><p className="text-gold text-xs font-medium mb-1">Career</p><p className="text-xs">{data.careerForecast}</p></div>
                      <div><p className="text-gold text-xs font-medium mb-1">Wealth</p><p className="text-xs">{data.wealthForecast}</p></div>
                      <div><p className="text-gold text-xs font-medium mb-1">Health</p><p className="text-xs">{data.healthForecast}</p></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="border-b border-border">
                <div onClick={() => toggleSection("advice")} className={sectionClass}>
                  <span className="flex items-center gap-2 text-foreground font-serif"><Sparkles className="w-4 h-4 text-gold" /> Advice</span>
                  <ChevronDown className={"w-4 h-4 text-muted-foreground transition-transform duration-300 " + (expandedSections.advice ? "rotate-180" : "")} />
                </div>
                {expandedSections.advice && <div className={contentClass}><p className="text-xs">{data.advice}</p></div>}
              </div>
              <div className="border-b border-border">
                <div onClick={() => toggleSection("comprehensive")} className={sectionClass}>
                  <span className="flex items-center gap-2 text-foreground font-serif"><BookOpen className="w-4 h-4 text-gold" /> Comprehensive Analysis</span>
                  <ChevronDown className={"w-4 h-4 text-muted-foreground transition-transform duration-300 " + (expandedSections.comprehensive ? "rotate-180" : "")} />
                </div>
                {expandedSections.comprehensive && <div className={contentClass}><p className="text-xs leading-relaxed">{data.comprehensiveAnalysis}</p></div>}
              </div>
              <div>
                <div onClick={() => toggleSection("humanistic")} className={sectionClass}>
                  <span className="flex items-center gap-2 text-foreground font-serif"><Sparkles className="w-4 h-4 text-gold" /> Life Guidance</span>
                  <ChevronDown className={"w-4 h-4 text-muted-foreground transition-transform duration-300 " + (expandedSections.humanistic ? "rotate-180" : "")} />
                </div>
                {expandedSections.humanistic && (
                  <div className={contentClass}>
                    <div className="bg-gold/5 rounded-lg p-4">
                      <p className="text-xs leading-relaxed whitespace-pre-line">{data.humanisticReading}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}
          className="text-xs text-muted-foreground/50 text-center mt-8 leading-relaxed">
          This system is provided for traditional cultural research and entertainment
          reference only. It does not constitute a basis for real-world decision-making.
        </motion.p>
      </div>
    </div>
  );
}
