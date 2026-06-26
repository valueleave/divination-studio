/**
 * Payment & Redemption Code System
 * Supports simulated mode for development and xorpay for production
 */

const CODE_PREFIX = "DS";

/**
 * Pricing plans available for purchase
 */
export const PRICING_PLANS = [
  { id: "trial", turns: 1, price: 1, label: "\u5355\u6b21", desc: "\u5355\u6b21\u4f53\u9a8c" },
  { id: "starter", turns: 10, price: 9, label: "10\u6b21\u5957\u9910", desc: "\u63a8\u8350\uff0c\u6253\u6298" },
  { id: "pro", turns: 30, price: 25, label: "30\u6b21\u5957\u9910", desc: "\u8d85\u503c\uff0c\u7ea6\u516b\u6298" },
] as const;

/**
 * Generate a unique redemption code
 * Format: DS-XXXXXXXX (8 alphanumeric characters)
 */
export function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return CODE_PREFIX + "-" + code;
}

/**
 * Generate order number
 */
export function generateOrderNo(): string {
  const now = new Date();
  const ts = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return "DS" + ts + rand;
}

/**
 * Payment provider configuration
 */
export const PAYMENT_CONFIG = {
  // Set to "simulated" for development, "xorpay" for production
  provider: (process.env.PAYMENT_PROVIDER || "simulated") as "simulated" | "xorpay",
  xorpay: {
    apiKey: process.env.XORPAY_API_KEY || "",
    apiSecret: process.env.XORPAY_API_SECRET || "",
    callbackUrl: process.env.NEXT_PUBLIC_SITE_URL + "/api/payment/callback",
  },
};

/**
 * Formats price in yuan
 */
export function formatPrice(yuan: number): string {
  return "\u00a5" + yuan;
}
