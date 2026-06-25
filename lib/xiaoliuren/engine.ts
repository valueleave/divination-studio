/**
 * 小六壬占卜引擎
 * 传统六神轮转算法：月到日到时
 * 六神顺序：大安(1) 留连(2) 速喜(3) 赤口(4) 小吉(5) 空亡(6)
 */
import xiaoliurenData from "@/knowledge/xiaoliuren.json";
const DEITIES = ["大安", "留连", "速喜", "赤口", "小吉", "空亡"];
export interface XiaoliurenResult {
  finalPosition: number;
  deityName: string;
  grade: string;
  element: string;
  direction: string;
  monthPosition: number;
  dayPosition: number;
  hourPosition: number;
  time: string;
  month: number;
  day: number;
  shichen: number;
}
export function getShichen(h: number): number {
  if (h >= 23 || h < 1) return 1;
  if (h >= 1 && h < 3) return 2;
  if (h >= 3 && h < 5) return 3;
  if (h >= 5 && h < 7) return 4;
  if (h >= 7 && h < 9) return 5;
  if (h >= 9 && h < 11) return 6;
  if (h >= 11 && h < 13) return 7;
  if (h >= 13 && h < 15) return 8;
  if (h >= 15 && h < 17) return 9;
  if (h >= 17 && h < 19) return 10;
  if (h >= 19 && h < 21) return 11;
  return 12;
}
export function getShichenName(h: number): string {
  const names = ["子时", "丑时", "寅时", "卯时", "辰时", "巳时", "午时", "未时", "申时", "酉时", "戌时", "亥时"];
  return names[getShichen(h) - 1];
}
function cycleFrom(start: number, steps: number): number {
  return ((start - 1 + steps - 1) % 6) + 1;
}
export function performXiaoliurenDivination(now: Date): XiaoliurenResult {
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const shichen = getShichen(now.getHours());
  const monthPos = cycleFrom(1, month);
  const dayPos = cycleFrom(monthPos, day);
  const finalPos = cycleFrom(dayPos, shichen);
  const deityData = (xiaoliurenData as any).deities[finalPos.toString()];
  const timeStr = now.getFullYear() + "年" + month + "月" + day + "日 " + getShichenName(now.getHours());
  return {
    finalPosition: finalPos,
    deityName: DEITIES[finalPos - 1],
    grade: deityData?.grade ?? "未知",
    element: deityData?.element ?? "未知",
    direction: deityData?.direction ?? "未知",
    monthPosition: monthPos,
    dayPosition: dayPos,
    hourPosition: finalPos,
    time: timeStr,
    month,
    day,
    shichen,
  };
}
export function getDeityData(position: number): any {
  return (xiaoliurenData as any).deities[position.toString()] || null;
}
