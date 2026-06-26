"use client";
import { useState } from "react";
import { Key, Check, X, Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CodeVerificationProps {
  onVerified: (code: string, remaining: number) => void;
}

export default function CodeVerification({ onVerified }: CodeVerificationProps) {
  const [codeInput, setCodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [remaining, setRemaining] = useState(0);

  const handleVerify = async () => {
    if (!codeInput.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/code/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeInput.trim() }),
      });
      const data = await res.json();
      if (data.valid) {
        setVerified(true);
        setRemaining(data.remaining);
        onVerified(data.code, data.remaining);
      } else {
        setError(data.error || "Invalid code");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleConsumeAndVerify = async () => {
    if (!codeInput.trim()) return;
    setLoading(true);
    setError("");
    try {
      // Consume one turn
      const res = await fetch("/api/code/consume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setVerified(true);
        setRemaining(data.remaining);
        onVerified(data.code, data.remaining);
      } else {
        setError(data.error || "Invalid code");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
        <Check className="w-5 h-5 text-green-400 shrink-0" />
        <div>
          <p className="text-sm text-green-400">Code verified</p>
          <p className="text-xs text-muted-foreground">{remaining} turns remaining</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gold/20 rounded-lg p-6 mb-6 subtle-glow">
      <div className="flex items-center gap-2 mb-4">
        <Key className="w-5 h-5 text-gold" />
        <h3 className="text-sm font-serif text-foreground">Enter Redemption Code</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Enter your redemption code to unlock divination.</p>
      <div className="flex gap-3">
        <Input
          value={codeInput}
          onChange={e => setCodeInput(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && handleConsumeAndVerify()}
          placeholder="e.g. DS-A1B2C3D4"
          className="font-mono uppercase tracking-wider"
        />
        <Button onClick={handleConsumeAndVerify} disabled={loading || !codeInput.trim()} className="shrink-0">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Use"}
        </Button>
      </div>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
      <div className="mt-3 text-center">
        <Button variant="link" size="sm" onClick={() => window.location.href = "/buy"} className="text-xs text-gold">
          <ShoppingCart className="w-3 h-3 mr-1" /> Buy turns
        </Button>
      </div>
    </div>
  );
}
