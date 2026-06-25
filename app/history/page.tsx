"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, Sparkles, Trash2, BookOpen, Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

interface HistoryRecord {
  id: string;
  method: string;
  question: string;
  result: {
    originalName?: string;
    deityName?: string;
    comprehensiveAnalysis?: string;
  };
  createdAt: string;
}

const methodIcons: Record<string, typeof BookOpen> = {
  meihua: BookOpen,
  xiaoliuren: Compass,
};

const methodLabels: Record<string, string> = {
  meihua: "Meihua Yishu",
  xiaoliuren: "Xiao Liu Ren",
};

export default function HistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const deleteRecord = async (id: string) => {
    try {
      await fetch("/api/divination/record/" + id, { method: "DELETE" });
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const viewDetail = (record: HistoryRecord) => {
    if (record.method === "meihua") {
      router.push("/meihua/result/" + record.id);
    } else {
      router.push("/xiaoliuren/result/" + record.id);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-display tracking-[0.15em] text-foreground mb-3">
            Divination History
          </h1>
          <p className="text-muted-foreground font-display tracking-wider text-sm">
            Your past divination records
          </p>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
        </motion.div>

        {/* Records */}
        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-gold" />
            </motion.div>
          </div>
        ) : records.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground mb-4">No divination records yet.</p>
            <Button onClick={() => router.push("/divination")}>
              Start Your First Divination
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {records.map((record, i) => {
              const Icon = methodIcons[record.method] || BookOpen;
              const resultName =
                record.result?.originalName || record.result?.deityName || "Result";
              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Card className="border-gold/10 hover:border-gold/30 transition-all duration-300 gold-glow-hover">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-gold" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gold font-medium">
                                {methodLabels[record.method] || record.method}
                              </span>
                              <span className="text-xs text-muted-foreground">|</span>
                              <span className="text-xs text-muted-foreground truncate">
                                {resultName}
                              </span>
                            </div>
                            <p className="text-sm text-foreground/80 truncate">
                              {record.question}
                            </p>
                            <p className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(record.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewDetail(record)}
                            className="text-muted-foreground hover:text-gold"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteRecord(record.id)}
                            className="text-muted-foreground hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
