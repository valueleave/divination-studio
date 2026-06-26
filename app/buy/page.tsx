"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Check, Copy, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PRICING_PLANS, formatPrice } from "@/lib/payment";

export default function BuyPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("starter");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ code: string; turnCount: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Create order
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlan }),
      });
      const order = await res.json();
      // 2. Simulate payment (in production, user scans WeChat QR code)
      const simRes = await fetch("/api/payment/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.orderId }),
      });
      const simData = await simRes.json();
      if (simData.code) {
        setResult(simData);
      } else {
        setError("Payment failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (result) {
      navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const plan = PRICING_PLANS.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-display tracking-[0.15em] text-foreground mb-3">Purchase Turns</h1>
          <p className="text-muted-foreground font-display tracking-wider text-sm">Buy redemption codes for divination services</p>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
        </motion.div>

        {result ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="border-gold/30 subtle-glow text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <CardTitle className="font-display text-2xl tracking-wider text-gold">Payment Successful</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground text-sm">Your redemption code ({result.turnCount} turns):</p>
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 flex items-center justify-between gap-4">
                  <span className="text-2xl font-mono tracking-[0.2em] text-gold font-bold">{result.code}</span>
                  <Button variant="outline" size="sm" onClick={copyCode} className="shrink-0">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Go to the divination page and enter this code to start.</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => window.location.href = "/meihua"}>Meihua Yishu</Button>
                  <Button onClick={() => window.location.href = "/xiaoliuren"} variant="outline">Xiao Liu Ren</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {PRICING_PLANS.map((plan, i) => (
                <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <Card
                    className={"cursor-pointer transition-all duration-300 gold-glow-hover " + (selectedPlan === plan.id ? "border-gold ring-1 ring-gold" : "border-gold/10")}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <p className="text-3xl font-display tracking-wider text-gold mb-2">{formatPrice(plan.price)}</p>
                      <p className="text-lg font-serif text-foreground mb-1">{plan.label}</p>
                      <p className="text-xs text-muted-foreground">{plan.desc}</p>
                      {plan.id === "starter" && <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-gold/20 text-gold">Recommended</span>}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="text-center">
              <Button size="lg" onClick={handlePay} disabled={loading} className="w-full md:w-auto">
                {loading ? "Processing..." : "Pay " + formatPrice(plan ? plan.price : 0) + " via WeChat"}
              </Button>
              <p className="text-xs text-muted-foreground/60 mt-4 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
                Secure payment. Code will be sent via SMS and displayed on screen.
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
