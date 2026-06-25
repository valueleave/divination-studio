"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, BookOpen, Sun, Clock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

interface MeihuaResultData {
  question: string;
  time: string;
  originalHexagram: number;
  originalName: string;
  upperName: string;
  lowerName: string;
  movingLine: number;
  mutualName: string;
  changedName: string;
  tiYong: string;
  element: string;
  hexagramAnalysis: string;
  shortTerm: string;
  mediumTerm: string;
  longTerm: string;
  suggestions: string;
  comprehensiveAnalysis: string;
  humanisticReading: string;
}

export default function MeihuaResultPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<MeihuaResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    trend: false,
    suggestion: false,
    comprehensive: false,
    humanistic: false,
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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
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
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push("/divination")}
            className="text-muted-foreground hover:text-gold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Divination Center
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <h1 className="text-2xl md:text-3xl font-display tracking-[0.1em] text-foreground mb-2">
            {data.originalName}
          </h1>
          <p className="text-gold/70 text-sm font-display tracking-wider">
            Meihua Yishu Divination Result
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {data.time}
            </span>
            <span className="flex items-center gap-1">
              <Sun className="w-3 h-3" />
              {data.element}
            </span>
          </div>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
        </motion.div>

        {/* Question Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-10"
        >
          <p className="text-xs text-muted-foreground mb-1">Your Question</p>
          <p className="text-foreground/80 font-serif italic">&ldquo;{data.question}&rdquo;</p>
        </motion.div>

        {/* Result Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-gold/10 subtle-glow">
            <CardContent className="p-0">
              {/* Section: Basic Hexagram Info */}
              <div className="border-b border-border">
                <div
                  onClick={() => toggleSection("basic")}
                  className={sectionClass}
                >
                  <span className="flex items-center gap-2 text-foreground font-serif">
                    <BookOpen className="w-4 h-4 text-gold" />
                    Hexagram Analysis
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                      expandedSections.basic ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {expandedSections.basic && (
                  <div className={contentClass}>
                    <div className="mb-4 grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-gold/5 rounded p-3">
                        <span className="text-gold block mb-1">Original</span>
                        <span className="text-foreground">{data.originalName}</span>
                      </div>
                      <div className="bg-gold/5 rounded p-3">
                        <span className="text-gold block mb-1">Mutual</span>
                        <span className="text-foreground">{data.mutualName}</span>
                      </div>
                      <div className="bg-gold/5 rounded p-3">
                        <span className="text-gold block mb-1">Changed</span>
                        <span className="text-foreground">{data.changedName}</span>
                      </div>
                      <div className="bg-gold/5 rounded p-3">
                        <span className="text-gold block mb-1">Moving Line</span>
                        <span className="text-foreground">Line {data.movingLine}</span>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed">{data.hexagramAnalysis}</p>
                  </div>
                )}
              </div>

              {/* Section: Trend */}
              <div className="border-b border-border">
                <div
                  onClick={() => toggleSection("trend")}
                  className={sectionClass}
                >
                  <span className="flex items-center gap-2 text-foreground font-serif">
                    <Sun className="w-4 h-4 text-gold" />
                    Development Trend
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                      expandedSections.trend ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {expandedSections.trend && (
                  <div className={contentClass}>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gold text-xs font-medium mb-1">Short Term</p>
                        <p className="text-xs">{data.shortTerm}</p>
                      </div>
                      <div>
                        <p className="text-gold text-xs font-medium mb-1">Medium Term</p>
                        <p className="text-xs">{data.mediumTerm}</p>
                      </div>
                      <div>
                        <p className="text-gold text-xs font-medium mb-1">Long Term</p>
                        <p className="text-xs">{data.longTerm}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section: Suggestions */}
              <div className="border-b border-border">
                <div
                  onClick={() => toggleSection("suggestion")}
                  className={sectionClass}
                >
                  <span className="flex items-center gap-2 text-foreground font-serif">
                    <Sparkles className="w-4 h-4 text-gold" />
                    Suggestions
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                      expandedSections.suggestion ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {expandedSections.suggestion && (
                  <div className={contentClass}>
                    <p className="text-xs">{data.suggestions}</p>
                  </div>
                )}
              </div>

              {/* Section: Comprehensive */}
              <div className="border-b border-border">
                <div
                  onClick={() => toggleSection("comprehensive")}
                  className={sectionClass}
                >
                  <span className="flex items-center gap-2 text-foreground font-serif">
                    <BookOpen className="w-4 h-4 text-gold" />
                    Comprehensive Analysis
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                      expandedSections.comprehensive ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {expandedSections.comprehensive && (
                  <div className={contentClass}>
                    <p className="text-xs leading-relaxed">{data.comprehensiveAnalysis}</p>
                  </div>
                )}
              </div>

              {/* Section: Humanistic Reading */}
              <div>
                <div
                  onClick={() => toggleSection("humanistic")}
                  className={sectionClass}
                >
                  <span className="flex items-center gap-2 text-foreground font-serif">
                    <Sparkles className="w-4 h-4 text-gold" />
                    Life Guidance
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                      expandedSections.humanistic ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {expandedSections.humanistic && (
                  <div className={contentClass}>
                    <div className="bg-gold/5 rounded-lg p-4">
                      <p className="text-xs leading-relaxed whitespace-pre-line">
                        {data.humanisticReading}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Body-Element relationship display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-6 text-center text-xs text-muted-foreground/60"
        >
          <p>Body-Use Relation: {data.tiYong}</p>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-xs text-muted-foreground/50 text-center mt-8 leading-relaxed"
        >
          This system is provided for traditional cultural research and entertainment
          reference only. It does not constitute a basis for real-world decision-making.
        </motion.p>
      </div>
    </div>
  );
}
