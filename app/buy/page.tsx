"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function BuyPage() {
  const [paymentNote, setPaymentNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ code: string; turnCount: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleGetCode = async () => {
    if (!paymentNote.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: "single", paymentNote: paymentNote.trim() }),
      });
      const order = await res.json();
      const simRes = await fetch("/api/payment/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.orderId, paymentNote: paymentNote.trim() }),
      });
      const data = await simRes.json();
      if (data.code) setResult({ code: data.code, turnCount: data.turnCount });
      else setError("Failed to generate code");
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  };

  const copyCode = () => {
    if (result) {
      navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <h1 className="text-3xl font-display tracking-[0.15em] text-foreground mb-3">Purchase</h1>
          <p className="text-muted-foreground font-display tracking-wider text-sm">Buy a redemption code for divination</p>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
        </motion.div>

        {result ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="border-gold/30 subtle-glow text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <CardTitle className="font-display text-2xl tracking-wider text-gold">Code Generated</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground text-sm">Your redemption code ({result.turnCount} divination):</p>
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 flex items-center justify-between gap-4">
                  <span className="text-2xl font-mono tracking-[0.2em] text-gold font-bold">{result.code}</span>
                  <Button variant="outline" size="sm" onClick={copyCode}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Go to divination page, enter this code to start.</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => window.location.href = "/meihua"}>Meihua Yishu</Button>
                  <Button onClick={() => window.location.href = "/xiaoliuren"} variant="outline">Xiao Liu Ren</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-gold/10 subtle-glow">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-4xl font-display text-gold tracking-wider">2</p>
                  <p className="text-sm text-muted-foreground">yuan / 1 divination</p>
                </div>

                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-3">Scan with WeChat to pay</p>
                  <div className="bg-white rounded-lg p-4 inline-block">
                    <img src="/wechat_qr.jpg" alt="WeChat Pay" className="w-48 h-48 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground text-center">After payment, enter your WeChat transfer note and get the code:</p>
                  <div className="flex gap-3">
                    <input
                      value={paymentNote}
                      onChange={e => setPaymentNote(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleGetCode()}
                      placeholder="Your WeChat transfer note"
                      className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                    />
                    <Button onClick={handleGetCode} disabled={loading || !paymentNote.trim()}>
                      {loading ? "..." : "Get Code"}
                    </Button>
                  </div>
                  {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                </div>

                <div className="mt-6 pt-4 border-t border-border text-center">
                  <p className="text-xs text-muted-foreground/60 flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3" />
                    Code generated immediately after verification
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
