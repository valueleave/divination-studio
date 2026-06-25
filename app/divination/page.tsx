"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Compass, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const methods = [
  {
    id: "meihua",
    title: "Meihua Yishu",
    subtitle: "梅花易数",
    description:
      "An ancient divination method based on the I Ching. It generates hexagrams using time and numerical calculations to provide profound insights into your questions.",
    icon: BookOpen,
    href: "/meihua",
    color: "from-gold/20 via-gold/5 to-transparent",
  },
  {
    id: "xiaoliuren",
    title: "Xiao Liu Ren",
    subtitle: "小六壬",
    description:
      "A traditional Chinese rapid divination technique using the six deities. Quick and effective for timely guidance on daily matters and decisions.",
    icon: Compass,
    href: "/xiaoliuren",
    color: "from-gold/20 via-gold/5 to-transparent",
  },
];

export default function DivinationPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-display tracking-[0.15em] text-foreground mb-4">
            Choose Your Divination Method
          </h1>
          <p className="text-muted-foreground font-display tracking-wider max-w-xl mx-auto">
            Select the ancient wisdom that resonates with your question today
          </p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {methods.map((method, i) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.2 }}
              >
                <Card className="relative group overflow-hidden bg-gradient-to-br from-card to-card/80 border-gold/10 hover:border-gold/30 transition-all duration-500 gold-glow-hover h-full">
                  {/* Background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  <CardHeader className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-300">
                        <Icon className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <CardTitle className="font-display text-2xl tracking-wider">
                          {method.title}
                        </CardTitle>
                        <p className="text-gold/70 text-sm">{method.subtitle}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    <CardDescription className="text-muted-foreground leading-relaxed text-sm">
                      {method.description}
                    </CardDescription>
                  </CardContent>

                  <CardFooter className="relative z-10">
                    <Link href={method.href} className="w-full">
                      <Button
                        variant="outline"
                        className="w-full group"
                      >
                        <span>Start Divination</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom decorative line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-16"
        />
      </div>
    </div>
  );
}
