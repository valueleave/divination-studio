/**
 * 梅花易数起卦引擎
 * 按照传统规则：上卦(年+月+日)%8，下卦(年+月+日+时)%8，动爻(年+月+日+时)%6
 */

import meihuaData from "@/knowledge/meihua.json";

// 八卦映射：1乾 2兑 3离 4震 5巽 6坎 7艮 8坤
const TRIGRAM_NAMES: Record<number, string> = {
  1: "乾", 2: "兑", 3: "离", 4: "震", 5: "巽", 6: "坎", 7: "艮", 8: "坤",
};

export interface MeihuaResult {
  /** 本卦编号 (1-64) */
  originalHexagram: number;
  /** 本卦名称 */
  originalName: string;
  /** 上卦编号 */
  upperTrigram: number;
  /** 上卦名称 */
  upperName: string;
  /** 下卦编号 */
  lowerTrigram: number;
  /** 下卦名称 */
  lowerName: string;
  /** 动爻 (1-6) */
  movingLine: number;
  /** 互卦编号 */
  mutualHexagram: number;
  /** 互卦名称 */
  mutualName: string;
  /** 变卦编号 */
  changedHexagram: number;
  /** 变卦名称 */
  changedName: string;
  /** 体用生克 (体卦 vs 用卦) */
  tiYong: string;
  /** 本卦五行 */
  element: string;
  /** 起卦时间 */
  time: string;
  /** 原始年、月、日、时 */
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

interface HexagramData {
  name: string;
  pinyin: string;
  upper: string;
  lower: string;
  element: string;
  judgment: string;
  meaning: string;
  advice: string;
}

/**
 * 获取当前时辰 (子0-1, 丑1-2, ..., 亥21-22)
 * 采用传统十二时辰制
 */
export function getShichen(h: number): number {
  if (h >= 23 || h < 1) return 1;   // 子时
  if (h >= 1 && h < 3) return 2;    // 丑时
  if (h >= 3 && h < 5) return 3;    // 寅时
  if (h >= 5 && h < 7) return 4;    // 卯时
  if (h >= 7 && h < 9) return 5;    // 辰时
  if (h >= 9 && h < 11) return 6;   // 巳时
  if (h >= 11 && h < 13) return 7;  // 午时
  if (h >= 13 && h < 15) return 8;  // 未时
  if (h >= 15 && h < 17) return 9;  // 申时
  if (h >= 17 && h < 19) return 10; // 酉时
  if (h >= 19 && h < 21) return 11; // 戌时
  return 12; // 亥时
}

/**
 * 获取时辰名称
 */
export function getShichenName(h: number): string {
  const names = ["子时", "丑时", "寅时", "卯时", "辰时", "巳时", "午时", "未时", "申时", "酉时", "戌时", "亥时"];
  const shichen = getShichen(h);
  return names[shichen - 1];
}

/**
 * 根据上下卦计算本卦编号
 * 公式：(上卦-1) × 8 + 下卦
 */
export function calcHexagramNumber(upper: number, lower: number): number {
  return (upper - 1) * 8 + lower;
}

/**
 * 获取卦象名称
 */
function getHexagramName(num: number): string {
  const data = (meihuaData as any).hexagrams;
  const hex = data[num.toString()] as HexagramData | undefined;
  return hex?.name ?? `第${num}卦`;
}

/**
 * 根据上下卦和动爻计算互卦
 * 互卦规则：本卦的二、三、四爻为下卦，三、四、五爻为上卦
 */
export function calcMutualHexagram(upperIdx: number, lowerIdx: number, hexNum: number): number {
  const mutualMap = (meihuaData as any).mutualHexagramMap;
  const entry = mutualMap[hexNum.toString()];
  if (entry && entry.number) {
    return entry.number;
  }
  // fallback: use mapping from upper/lower
  const trigramMap: Record<number, number[]> = {
    1: [1, 1, 1], 2: [0, 1, 1], 3: [1, 0, 1], 4: [0, 0, 1],
    5: [1, 1, 0], 6: [0, 1, 0], 7: [1, 0, 0], 8: [0, 0, 0],
  };
  const upperLines = trigramMap[upperIdx] || [0, 0, 0];
  const lowerLines = trigramMap[lowerIdx] || [0, 0, 0];
  const hexLines = [...upperLines, ...lowerLines];
  // 互卦下卦 = 二、三、四爻 (index 1,2,3)
  const mutualLowerLines = hexLines.slice(1, 4);
  // 互卦上卦 = 三、四、五爻 (index 2,3,4)
  const mutualUpperLines = hexLines.slice(2, 5);

  const lineToTrigram: Record<string, number> = {
    "1,1,1": 1, "0,1,1": 2, "1,0,1": 3, "0,0,1": 4,
    "1,1,0": 5, "0,1,0": 6, "1,0,0": 7, "0,0,0": 8,
  };
  const mUpper = lineToTrigram[mutualUpperLines.join(",")] || 8;
  const mLower = lineToTrigram[mutualLowerLines.join(",")] || 8;
  return calcHexagramNumber(mUpper, mLower);
}

/**
 * 计算变卦
 * 在互卦基础上根据动爻变动
 */
export function calcChangedHexagram(upperIdx: number, lowerIdx: number, movingLine: number): number {
  // 将上下卦转换为二进制线条
  const trigramToYao: Record<number, number[]> = {
    1: [1, 1, 1], 2: [0, 1, 1], 3: [1, 0, 1], 4: [0, 0, 1],
    5: [1, 1, 0], 6: [0, 1, 0], 7: [1, 0, 0], 8: [0, 0, 0],
  };
  const upperYao = [...(trigramToYao[upperIdx] || [0, 0, 0])];
  const lowerYao = [...(trigramToYao[lowerIdx] || [0, 0, 0])];
  const allYao = [...upperYao, ...lowerYao];
  // 动爻改变 (从下往上数，1-6)
  const idx = 6 - movingLine;
  allYao[idx] = allYao[idx] === 1 ? 0 : 1;

  const newUpperYao = allYao.slice(0, 3);
  const newLowerYao = allYao.slice(3, 6);

  const yaoToTrigram: Record<string, number> = {
    "1,1,1": 1, "0,1,1": 2, "1,0,1": 3, "0,0,1": 4,
    "1,1,0": 5, "0,1,0": 6, "1,0,0": 7, "0,0,0": 8,
  };
  const newUpper = yaoToTrigram[newUpperYao.join(",")] || 8;
  const newLower = yaoToTrigram[newLowerYao.join(",")] || 8;
  return calcHexagramNumber(newUpper, newLower);
}

/**
 * 计算体用生克关系
 * 体卦 = 没有动爻的卦 (上或下)
 * 用卦 = 有动爻的卦
 * 生克关系决定了吉凶
 */
export function calcTiYong(upperIdx: number, lowerIdx: number, movingLine: number): string {
  const trigramElement: Record<number, string> = {
    1: "金", 2: "金", 3: "火", 4: "木", 5: "木", 6: "水", 7: "土", 8: "土",
  };

  // 动爻在上卦(1-3)则上卦为用卦，下卦为体卦
  // 动爻在下卦(4-6)则下卦为用卦，上卦为体卦
  const tiTrigram = movingLine <= 3 ? lowerIdx : upperIdx;
  const yongTrigram = movingLine <= 3 ? upperIdx : lowerIdx;

  const tiElem = trigramElement[tiTrigram];
  const yongElem = trigramElement[yongTrigram];

  // 五行生克关系
  const elements = ["金", "水", "木", "火", "土"];
  const getIndex = (e: string) => elements.indexOf(e);
  const tiIdx = getIndex(tiElem);
  const yongIdx = getIndex(yongElem);

  // 生克判断：相生(generates), 相克(controls)
  // 金生水, 水生木, 木生火, 火生土, 土生金
  // 金克木, 木克土, 土克水, 水克火, 火克金
  function isGenerating(parent: string, child: string): boolean {
    const pairs: Record<string, string> = { "金": "水", "水": "木", "木": "火", "火": "土", "土": "金" };
    return pairs[parent] === child;
  }
  function isControlling(stronger: string, weaker: string): boolean {
    const pairs: Record<string, string> = { "金": "木", "木": "土", "土": "水", "水": "火", "火": "金" };
    return pairs[stronger] === weaker;
  }

  if (isGenerating(tiElem, yongElem)) return `${tiElem}生${yongElem}，体生用，有耗损但最终有利`;
  if (isGenerating(yongElem, tiElem)) return `${yongElem}生${tiElem}，用生体，大吉，得助力`;
  if (isControlling(tiElem, yongElem)) return `${tiElem}克${yongElem}，体克用，虽克但费力，需努力克服`;
  if (isControlling(yongElem, tiElem)) return `${yongElem}克${tiElem}，用克体，大凶，需谨慎行事`;
  return `${tiElem}与${yongElem}比和，体用相同，万事顺遂`;
}

/**
 * 梅花易数主引擎：根据当前时间起卦
 */
export function performMeihuaDivination(now: Date): MeihuaResult {
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();         // 1-31
  const hour = getShichen(now.getHours()); // 1-12
  const min = now.getMinutes(); // 0-59

  // 计算上卦
  const upperNum = ((year + month + day) % 8) === 0 ? 8 : ((year + month + day) % 8);
  // 计算下卦
  const lowerNum = ((year + month + day + hour + min) % 8) === 0 ? 8 : ((year + month + day + hour + min) % 8);
  // 计算动爻
  const movingLine = ((year + month + day + hour + min) % 6) === 0 ? 6 : ((year + month + day + hour + min) % 6);

  // 本卦
  const hexNum = calcHexagramNumber(upperNum, lowerNum);
  const hexData = (meihuaData as any).hexagrams[hexNum.toString()] as HexagramData | undefined;

  // 互卦
  const mutualNum = calcMutualHexagram(upperNum, lowerNum, hexNum);
  const mutualData = (meihuaData as any).hexagrams[mutualNum.toString()] as HexagramData | undefined;

  // 变卦
  const changedNum = calcChangedHexagram(upperNum, lowerNum, movingLine);
  const changedData = (meihuaData as any).hexagrams[changedNum.toString()] as HexagramData | undefined;

  // 体用生克
  const tiYong = calcTiYong(upperNum, lowerNum, movingLine);

  const timeStr = `${year}年${month}月${day}日 ${getShichenName(now.getHours())} ${String(now.getMinutes()).padStart(2,"0")}分`;

  return {
    originalHexagram: hexNum,
    originalName: hexData?.name ?? `第${hexNum}卦`,
    upperTrigram: upperNum,
    upperName: TRIGRAM_NAMES[upperNum] || "未知",
    lowerTrigram: lowerNum,
    lowerName: TRIGRAM_NAMES[lowerNum] || "未知",
    movingLine,
    mutualHexagram: mutualNum,
    mutualName: mutualData?.name ?? `第${mutualNum}卦`,
    changedHexagram: changedNum,
    changedName: changedData?.name ?? `第${changedNum}卦`,
    tiYong,
    element: hexData?.element ?? "未知",
    time: timeStr,
    year,
    month,
    day,
    hour,
    minute: min,
  };
}

/**
 * 获取本卦的爻线表示
 */
export function getHexagramLines(upperIdx: number, lowerIdx: number): number[] {
  const trigramToYao: Record<number, number[]> = {
    1: [1, 1, 1], 2: [0, 1, 1], 3: [1, 0, 1], 4: [0, 0, 1],
    5: [1, 1, 0], 6: [0, 1, 0], 7: [1, 0, 0], 8: [0, 0, 0],
  };
  const upper = trigramToYao[upperIdx] || [0, 0, 0];
  const lower = trigramToYao[lowerIdx] || [0, 0, 0];
  return [...upper, ...lower];
}

export type { HexagramData };
