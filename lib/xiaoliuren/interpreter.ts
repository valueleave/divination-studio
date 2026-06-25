/**
 * 小六壬 AI 解读生成器
 * 基于知识库 + 规则模板生成专业解读
 */
import xiaoliurenData from "@/knowledge/xiaoliuren.json";
import type { XiaoliurenResult } from "./engine";
import { analyzeQuestionType, type QuestionType } from "@/lib/meihua/interpreter";
function getDeityData(pos: number): any {
  return (xiaoliurenData as any).deities[pos.toString()] || null;
}
export function generateXiaoliurenInterpretation(
  result: XiaoliurenResult,
  question: string
): {
  basicAnalysis: string;
  meaning: string;
  loveForecast: string;
  careerForecast: string;
  wealthForecast: string;
  healthForecast: string;
  advice: string;
  comprehensiveAnalysis: string;
  humanisticReading: string;
} {
  const deity = getDeityData(result.finalPosition);
  const qType = analyzeQuestionType(question);
  const basicAnalysis = generateBasicAnalysis(result, deity);
  const meaning = deity?.meaning ?? "暂无详细释义。";
  const loveForecast = deity?.love ?? "感情方面暂无特别指引。";
  const careerForecast = deity?.career ?? "事业方面暂无特别指引。";
  const wealthForecast = deity?.wealth ?? "财运方面暂无特别指引。";
  const healthForecast = deity?.health ?? "健康方面暂无特别指引。";
  const advice = deity?.advice ?? "暂无建议。";
  const comprehensiveAnalysis = generateComprehensiveAnalysis(result, deity, question, qType);
  const humanisticReading = generateHumanisticReading(result, deity, question, qType);
  return {
    basicAnalysis,
    meaning,
    loveForecast,
    careerForecast,
    wealthForecast,
    healthForecast,
    advice,
    comprehensiveAnalysis,
    humanisticReading,
  };
}
function generateBasicAnalysis(result: XiaoliurenResult, deity: any): string {
  const parts: string[] = [];
  parts.push("小六壬占卜推算结果如下：");
  parts.push("");
  parts.push("推算过程：");
  parts.push("正月起大安，顺数至" + result.month + "月，落位" + getDeityName(result.monthPosition) + "。");
  parts.push("从" + getDeityName(result.monthPosition) + "起初一，顺数至" + result.day + "日，落位" + getDeityName(result.dayPosition) + "。");
  parts.push("从" + getDeityName(result.dayPosition) + "起子时，顺数至" + getShichenNameByOrder(result.shichen) + "，最终落位" + result.deityName + "。");
  parts.push("");
  parts.push("结论：" + result.deityName + "（" + result.grade + "）");
  parts.push("五行属" + result.element + "，方位" + result.direction + "。");
  if (deity) {
    parts.push(deity.poem ?? "");
    parts.push("");
    parts.push("断辞：" + deity.meaning);
  }
  return parts.join("\n");
}
function getDeityName(pos: number): string {
  const names = ["大安", "留连", "速喜", "赤口", "小吉", "空亡"];
  return names[pos - 1] || "未知";
}
function getShichenNameByOrder(order: number): string {
  const names = ["子时", "丑时", "寅时", "卯时", "辰时", "巳时", "午时", "未时", "申时", "酉时", "戌时", "亥时"];
  return names[order - 1] || "未知";
}
function generateComprehensiveAnalysis(
  result: XiaoliurenResult,
  deity: any,
  question: string,
  qType: QuestionType
): string {
  const parts: string[] = [];
  const pinyin = deity?.pinyin ?? "";
  parts.push("观君于" + result.time + "起课小六壬，得「" + result.deityName + "」（" + pinyin + "），" + result.grade + "。");
  const gradeDesc: Record<string, string> = {
    "上吉": "此乃上吉之兆，天地交感，万事可成。",
    "大吉": "大吉之象，诸事顺遂，福星高照。",
    "中吉": "中吉之兆，虽有小碍，终归顺遂。",
    "凶": "此课为凶，需谨言慎行，以避其锋。",
    "未凶": "此课示未凶之象，事有拖延，但非绝路。",
    "大凶": "大凶之象，诸事不宜，静守为上。",
  };
  parts.push(gradeDesc[result.grade] ?? "吉凶待辨。");
  if (deity) {
    parts.push(deity.interpretation ?? "");
    const questionAdvice = getQuestionSpecificAdvice(qType, result);
    if (questionAdvice) {
      parts.push(questionAdvice);
    }
  }
  parts.push("小六壬之法，贵在速断。课象所示，乃天地之气在此时对君之问的回应。然命数虽有定，人事尚可为。望君以平和之心看待，以智慧之行应对。");
  return parts.join("\n");
}
function getQuestionSpecificAdvice(type: QuestionType, result: XiaoliurenResult): string {
  const advice: Record<QuestionType, string> = {
    career: "事业发展需根据当前课象判断。若得吉课，可积极进取；若得凶课，宜稳守待机。职场上多一分谨慎，少一分冲动，方为上策。",
    love: "感情之事，贵在真诚。课象的吉凶只是一个侧面反映，真正的缘分在于彼此的经营和珍惜。无论课象如何，都建议以真心待人，以包容相处。",
    study: "学业之道，贵在坚持。课象所示仅为一时的气运变化，真正的学识需要日积月累的努力。保持专注和恒心，必有收获。",
    health: "身体健康是一切的根本。课象如有不吉，建议及时关注身体状况，适时就医。同时保持积极乐观的心态，对康复大有裨益。",
    wealth: "财富运势需结合课象理性看待。吉课可适当把握机会，凶课则宜保守理财。切记投资有风险，决策需谨慎。",
    family: "家庭和睦是人生幸福的基石。课象提示我们，无论吉凶，家人的理解和支持都是最珍贵的财富。多一份沟通，少一份隔阂。",
    general: "人生之事，起落无常。课象的吉凶只是当下时运的反映，并非定数。保持平和之心，以智慧之行应对生活中的每一个挑战。",
  };
  return advice[type] || advice.general;
}
function generateHumanisticReading(
  result: XiaoliurenResult,
  deity: any,
  question: string,
  qType: QuestionType
): string {
  const parts: string[] = [];
  parts.push("亲爱的朋友，感谢你在此刻停下脚步，向天地请教心中的疑惑。");
  const empathies: Record<QuestionType, string> = {
    career: "在事业的道路上，每个人都会经历迷茫和不确定的时刻。你愿意寻求指引，说明你对未来有着认真的思考和期待。这种态度本身就是一种力量。",
    love: "关于感情的问题总是最牵动人心的。你愿意为心中的那份情感寻求答案，说明你是一个认真对待感情的人。无论缘分如何，真诚的心意永远值得尊重。",
    study: "学海无涯，你在求学路上的每一分付出都不会白费。偶尔的迷茫和焦虑只是成长过程中的正常反应，请相信自己的能力和潜力。",
    health: "关注健康是对自己负责任的表现。身体的状态与心灵的状态息息相关，保持平和乐观的心态对身体恢复有着不可忽视的作用。",
    wealth: "对美好生活的向往是人类进步的动力。在追求物质丰盈的同时，也请不要忘记内心的充实和精神的富足。",
    family: "家是我们永远的港湾。感谢你愿意为了家庭的和谐而寻求智慧，这份心意本身就充满了爱与责任。",
    general: "你愿意静下心来倾听天地的声音，这本身就是一种难得的智慧和定力。在这个浮躁的时代，能够停下来思考，是一种珍贵的品质。",
  };
  parts.push(empathies[qType] || empathies.general);
  const isFavorable = result.grade.includes("吉");
  if (isFavorable) {
    parts.push("此次占得" + result.deityName + "，为" + result.grade + "之课，这是一个积极的信号。世间万物都有其运行的规律，当下的好兆头是天地对你的一份鼓励。请带着这份信心，继续走好脚下的路。但也要记得，顺境时不骄不躁，才能走得更远。");
  } else {
    parts.push("此次占得" + result.deityName + "，为" + result.grade + "之课。但请不要因此而忧虑。天地之道，阴阳交替，否极泰来。课象的不吉并非终点，而是一个提醒——提醒我们在此刻更需要谨慎、耐心和内省。困难只是暂时的，你的内在力量远比想象中强大。");
  }
  parts.push("小六壬的智慧告诉我们，人生就像四季的轮转，有春华秋实，也有寒冬酷暑。每一个季节都有它的意义，每一个经历都是一份礼物。你所问之事，无论结果如何，都将成为你生命历程中不可或缺的一部分。");
  parts.push("愿你以从容之心面对生活中的起伏，以智慧之眼看清前行的方向。人生没有白走的路，每一步都算数。");
  return parts.join("\n\n");
}
export { analyzeQuestionType };
export type { QuestionType };
