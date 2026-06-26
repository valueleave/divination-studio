"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import CodeVerification from "@/components/CodeVerification";

export default function MeihuaPage() {
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [activeCode, setActiveCode] = useState("");
  const router = useRouter();

  const handleVerified = (code: string) => {
    setIsVerified(true);
    setActiveCode(code);
  };

  const handleSubmit = async () => {
    if (!question.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const body: Record<string, unknown> = { question: question.trim() };
      if (activeCode) body.code = activeCode;
      const res = await fetch("/api/divination/meihua", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.id) router.push("/meihua/result/" + data.id);
    } catch (err) {
      console.error("Divination failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-display tracking-[0.15em] text-foreground mb-3">Meihua Yishu</h1>
          <p className="text-gold/70 text-sm font-display tracking-wider mb-4">\u6885\u82b1\u6613\u6570\u5360\u65ad</p>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
        </motion.div>

        {!isVerified ? (
          <CodeVerification onVerified={handleVerified} />
        ) : (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="border-gold/10 subtle-glow">
              <CardHeader>
                <CardTitle className="font-serif text-lg text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  Enter Your Question
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm">Enter the question you would like to seek guidance on</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="question" className="text-foreground/80 text-sm">Your Question</Label>
                  <Textarea id="question" placeholder="For example: What will my graduate school exam results be like?" value={question} onChange={e => setQuestion(e.target.value)} className="bg-background/50" rows={4} />
                </div>
                <Button onClick={handleSubmit} disabled={!question.trim() || isSubmitting} className="w-full group relative overflow-hidden" size="lg">
                  {isSubmitting ? <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Divining...
                  </> : <>
                    <span className="relative z-10">Begin Divination</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold-light to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </>}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}
          className="text-xs text-muted-foreground/50 text-center mt-8 leading-relaxed">
          This system is provided for traditional cultural research and entertainment reference only.
        </motion.p>
      </div>
    </div>
  );
}
