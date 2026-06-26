import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: {
    default: "Hidden Mandate | Traditional Chinese Divination",
    template: "%s | Hidden Mandate",
  },
  description:
    "Traditional Chinese divination platform offering Meihua Yishu (Plum Blossom Divination) and Xiao Liu Ren divination. Hidden Mandate - Decode the Ancient Wisdom.",
  keywords: ["\u6885\u82b1\u6613\u6570", "\u5c0f\u516d\u58ec", "\u5360\u535c", "\u6613\u7ecf", "traditional chinese divination", "plum blossom divination"],
  authors: [{ name: "Hidden Mandate" }],
  openGraph: {
    title: "Hidden Mandate",
    description: "Hidden Mandate - Decode the Ancient Wisdom",
    type: "website",
    locale: "zh_CN",
    siteName: "Hidden Mandate",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Hidden Mandate",
              description:
                "Traditional Chinese divination platform offering Meihua Yishu and Xiao Liu Ren divination services.",
              url: (process.env.NEXT_PUBLIC_SITE_URL || "https://hidden-mandate.vercel.app"),
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
