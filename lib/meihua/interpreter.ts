/**
 * 梅花易数 AI 解读生成器
 * 基于规则引擎 + 知识库拼接，生成专业命理风格解读
 */

import meihuaData from "@/knowledge/meihua.json";
import type { MeihuaResult } from "./engine";

/**
 * 获取卦象详细数据
 */
function getHexData(num: number): any {
  return (meihuaData as any).hexagrams[num.toString()] || null;
}

/**
 * 获取八卦数据
 */
function getTrigramData(idx: number): any {
  return (meihuaData as any).trigrams[idx.toString()] || null;
}

/**
 * 生成梅花易数完整解读
 */
export function generateMeihuaInterpretation(
  result: MeihuaResult,
  question: string
): {
  hexagramAnalysis: string;
  shortTerm: string;
  mediumTerm: string;
  longTerm: string;
  suggestions: string;
  comprehensiveAnalysis: string;
  humanisticReading: string;
} {
  const hexData = getHexData(result.originalHexagram);
  const mutualData = getHexData(result.mutualHexagram);
  const changedData = getHexData(result.changedHexagram);
  const upperTri = getTrigramData(result.upperTrigram);
  const lowerTri = getTrigramData(result.lowerTrigram);

  // ========== 卦象解析 ==========
  const hexagramAnalysis = generateHexagramAnalysis(result, hexData, mutualData, changedData, upperTri, lowerTri);

  // ========== 事情发展趋势 ==========
  const { shortTerm, mediumTerm, longTerm } = generateTrendForecast(result, hexData, changedData);

  // ========== 可执行建议 ==========
  const suggestions = generateSuggestions(result, hexData, question);

  // ========== 综合判断（专业命理分析） ==========
  const comprehensiveAnalysis = generateComprehensiveAnalysis(result, hexData, changedData, question);

  // ========== 人文关怀解读 ==========
  const humanisticReading = generateHumanisticReading(result, hexData, question);

  return {
    hexagramAnalysis,
    shortTerm,
    mediumTerm,
    longTerm,
    suggestions,
    comprehensiveAnalysis,
    humanisticReading,
  };
}

function generateHexagramAnalysis(
  result: MeihuaResult,
  hexData: any,
  mutualData: any,
  changedData: any,
  upperTri: any,
  lowerTri: any
): string {
  const parts: string[] = [];

  parts.push(`此次起卦得「${result.originalName}」`);
  parts.push(`上卦为${result.upperName}（${upperTri?.image ?? "未知"}），下卦为${result.lowerName}（${lowerTri?.image ?? "未知"}）。`);
  parts.push(`卦象释义：${hexData?.meaning ?? "吉凶待判"}`);
  parts.push(`卦辞曰：「${hexData?.judgment ?? ""}」`);

  // 互卦分析
  parts.push(`互卦为「${result.mutualName}」，反映了事情发展过程中的内在变化。`);
  if (mutualData) {
    parts.push(`互卦含义：${mutualData.meaning}`);
  }

  // 变卦分析
  parts.push(`变卦为「${result.changedName}」，预示事情发展的最终趋势。`);
  if (changedData) {
    parts.push(`变卦含义：${changedData.meaning}`);
  }

  // 动爻分析
  const movingLineMeanings: Record<number, string> = {
    1: "初爻变动，事情刚刚开始有变化迹象，根基正在动摇。",
    2: "二爻变动，内部因素开始发挥作用，需要关注内在问题。",
    3: "三爻变动，事情进入关键转折期，面临重要抉择。",
    4: "四爻变动，外部环境正在改变，需要调整策略以适应。",
    5: "五爻变动，主要领导或核心因素发生变化，大局将定。",
    6: "上爻变动，已经到了最后阶段，过度或极端的情况需要警惕。",
  };
  parts.push(`动爻在第${result.movingLine}爻：${movingLineMeanings[result.movingLine] ?? "变动之爻，卦象转化。"}`);

  // 体用生克
  parts.push(`体用关系：${result.tiYong}。`);

  return parts.join("\n");
}

function generateTrendForecast(
  result: MeihuaResult,
  hexData: any,
  changedData: any
): { shortTerm: string; mediumTerm: string; longTerm: string } {
  const isHexagramFavorable = (num: number): boolean => {
    const favorable = [1, 11, 14, 24, 35, 42, 46, 55, 63];
    const unfavorable = [12, 23, 29, 36, 39, 47, 52, 64];
    if (favorable.includes(num)) return true;
    if (unfavorable.includes(num)) return false;
    // 中性卦按动爻判断
    return result.movingLine % 2 === 0;
  };

  const originalFavorable = isHexagramFavorable(result.originalHexagram);
  const changedFavorable = isHexagramFavorable(result.changedHexagram);
  const hasTiKeYong = result.tiYong.includes("体克用");
  const hasYongKeTi = result.tiYong.includes("用克体");
  const hasYongShengTi = result.tiYong.includes("用生体");
  const hasTiShengYong = result.tiYong.includes("体生用");
  const hasBiHe = result.tiYong.includes("比和");

  // 短期
  let short: string;
  if (hasYongKeTi) {
    short = "短期内可能会遇到一些阻力或挑战，外部的压力较大。建议以守为主，不宜贸然推进重要计划。先把基础打牢，做好充分准备。";
  } else if (hasTiKeYong) {
    short = "短期内虽然你有主导权，但需要付出较多努力才能推动事情。建议稳扎稳打，步步为营。";
  } else if (hasYongShengTi) {
    short = "短期内就有好兆头，外部环境对你有利，可能会有贵人相助或意想不到的助力。宜积极行动。";
  } else if (hasBiHe) {
    short = "短期内诸事平顺，内外协调。适合稳步推进现有计划，不宜冒进。";
  } else {
    short = "短期内运势平稳，但也需要你付出一些心力。建议保持平常心，踏实做事。";
  }

  // 中期
  let medium: string;
  if (originalFavorable && changedFavorable) {
    medium = "中期趋势向好发展。随着事态的推进，局面会逐渐明朗，有利因素将不断显现。建议保持积极的态度，抓住每一个可能的机会。";
  } else if (originalFavorable && !changedFavorable) {
    medium = "中期需要多加留意。虽然目前态势不错，但后期可能会发生转变。建议在中期阶段做好风险防范，预留应对变化的余地。";
  } else if (!originalFavorable && changedFavorable) {
    medium = "中期将是重要的转折期。当前的困难和挑战会逐渐缓解，新的机遇将浮出水面。坚持就是胜利。";
  } else {
    medium = "中期可能会经历一段调整期。事情的发展不会一帆风顺，但每一次波折都是成长的机会。建议保持灵活应变的心态。";
  }

  // 长期
  let long: string;
  if (changedFavorable) {
    long = "从长期来看，事态的发展方向是积极的。最终的结局会趋于有利，事情整体向好。但需要耐心等待时机成熟，不可急功近利。";
  } else {
    long = "从长期来看，事情可能会经历一些波折。最终的走向需要你持续付出努力来引导。建议做好长期规划，保持韧性和耐心。";
  }

  return { shortTerm: short, mediumTerm: medium, longTerm: long };
}

function generateSuggestions(result: MeihuaResult, hexData: any, question: string): string {
  const suggestions: string[] = [];

  // 根据体用生克给出建议
  if (result.tiYong.includes("用生体")) {
    suggestions.push("目前运势对您有利，外界资源正在向您汇聚。建议主动出击，积极把握眼前的机会。");
  } else if (result.tiYong.includes("体生用")) {
    suggestions.push("您需要主动投入更多精力来推动事情发展。虽然付出多一些，但最终会有所收获。耐心和坚持是关键。");
  } else if (result.tiYong.includes("用克体")) {
    suggestions.push("当前外部环境压力较大，建议以退为进，不要硬碰硬。审时度势，等待更好的时机再行动。");
  } else if (result.tiYong.includes("体克用")) {
    suggestions.push("您有能力掌控局面，但过程会比较费力。建议善用智慧和资源，寻找更高效的方法。");
  } else if (result.tiYong.includes("比和")) {
    suggestions.push("内外协调，人事和谐。建议继续保持这种平衡状态，在稳健中寻求发展。");
  }

  // 根据卦象添加建议
  if (hexData && hexData.advice) {
    suggestions.push(hexData.advice);
  }

  // 通用建议
  if (result.movingLine >= 4) {
    suggestions.push("动爻在高位，事情已进入关键阶段，宜冷静决策，避免情绪化判断。");
  } else if (result.movingLine <= 2) {
    suggestions.push("动爻在低位，根基正在调整。建议从基础工作做起，夯实根基再求发展。");
  }

  suggestions.push("建议将此次占卜结果作为参考，结合自己的直觉和理性判断来做出最终决策。");

  return suggestions.join("。") + "。";
}

function generateComprehensiveAnalysis(
  result: MeihuaResult,
  hexData: any,
  changedData: any,
  question: string
): string {
  const parts: string[] = [];

  const timePrefix = result.time ? `观君于${result.time}起卦` : "观君此次起卦";
  parts.push(`${timePrefix}，得「${result.originalName}」为本次之应答。`);

  if (hexData) {
    parts.push(`此卦上${result.upperName}下${result.lowerName}，${hexData.meaning}`);
  }

  // 体用生克深度解读
  if (result.tiYong.includes("用生体")) {
    parts.push("从体用关系来看，用生体为大吉之象，外界的能量正在滋养你的本体，意味着你所问之事能够得到外部力量的支持，事情的发展方向对外有利。");
  } else if (result.tiYong.includes("体生用")) {
    parts.push("体生用表明你需要付出较多心力来滋养此事。虽然暂时看似付出大于收获，但这种投入是有价值的，最终会以你意想不到的方式回馈于你。");
  } else if (result.tiYong.includes("用克体")) {
    parts.push("用克体显示外界力量对你有所克制，目前的环境或形势并不完全站在你这边。建议你审时度势，不可强求，等待合适的时机再行动。");
  } else if (result.tiYong.includes("体克用")) {
    parts.push("体克用说明你有能力掌控局面，但过程需要付出相当的努力。你的意志力和决心是成功的关键因素。");
  } else {
    parts.push("体用比和，内外和谐，表明你与所问之事处于一种协调的状态，顺势而为即可。");
  }

  // 变卦分析
  if (changedData) {
    parts.push(`变卦「${result.changedName}」预示着最终的趋势：${changedData.meaning}`);
  }

  // 动爻启示
  parts.push(`本次动爻在第${result.movingLine}爻，${getMovingLineWisdom(result.movingLine)}`);

  parts.push("《易》为君子谋，卦象所示不过是天地之道在此时此地的映照。真正的转机在于你如何理解这些信息，并将其转化为生活中的智慧。你问何事，便得何应，卦不欺人，人自欺之。");

  return parts.join("。");
}

function getMovingLineWisdom(line: number): string {
  const wisdom: Record<number, string> = {
    1: "凡事之初，根基为重。初爻动，提醒你关注事情的根本和起点，把基础打扎实了，后面的路才会顺畅。",
    2: "二爻主内，提醒你关注自身内在的状态。内心的安定是应对外界变化的最好武器。",
    3: "三爻处于上下之间，是关键的转折位。此时你需要做出选择，犹豫不决反而会错失良机。",
    4: "四爻已进入上卦，外部环境正在发生变化。你需要调整自己的策略来适应新的局面。",
    5: "五爻为尊位，核心要素正在发挥作用。此时大局渐定，你的决策将产生深远影响。",
    6: "上爻为终位，事情已经到了收尾阶段。过犹不及，是时候考虑如何完美收官了。",
  };
  return wisdom[line] || "此爻变动，指示事情将有所转折，宜顺势而为。";
}

/**
 * 生成人文关怀风格解读
 */
function generateHumanisticReading(result: MeihuaResult, hexData: any, question: string): string {
  const parts: string[] = [];

  // 开篇问候
  parts.push("亲爱的朋友，感谢你的信任，愿意在这里分享你心中的问题。");

  // 共情理解
  const questionType = analyzeQuestionType(question);
  const empathy = getEmpathy(questionType);
  parts.push(empathy);

  // 卦象的启示
  if (hexData) {
    parts.push(`你此次所起之卦为「${result.originalName}」。${hexData.meaning}`);
  }
  parts.push(`但卦象不只是吉凶的判断，更像是一面镜子，映照出你当下的状态和心境。${result.originalName}告诉我们，你正处于${getHexagramLifeAdvice(result.originalHexagram)}`);

  // 心理层面的解读
  parts.push(getPsychologicalReading(result, questionType));

  // 温暖的鼓励
  const encouragement = getEncouragement(result);
  parts.push(encouragement);

  // 结尾寄语
  parts.push("人生的智慧不在于预知未来，而在于在每一个当下做出最适合自己的选择。卦象是天地给你的一封书信，而你才是自己人生的作者。愿你以从容之心面对一切，在时光里慢慢成长。");

  return parts.join("\n\n");
}

type QuestionType = "career" | "love" | "study" | "health" | "wealth" | "family" | "general";

function analyzeQuestionType(question: string): QuestionType {
  const keywords = {
    career: ["工作", "事业", "职场", "创业", "升职", "加薪", "跳槽", "辞职", "转行", "生意", "项目", "老板", "面试"],
    love: ["感情", "恋爱", "婚姻", "对象", "伴侣", "分手", "复合", "表白", "相亲", "结婚", "离婚", "TA", "ta"],
    study: ["考研", "考试", "学习", "学业", "成绩", "升学", "毕业", "论文", "读书", "教育", "留学"],
    health: ["健康", "身体", "疾病", "病情", "生病", "体检", "康复", "养生"],
    wealth: ["财运", "投资", "股票", "基金", "理财", "赚钱", "钱财", "债务", "收入"],
    family: ["家人", "父母", "孩子", "子女", "家庭", "亲戚", "长辈"],
  };

  for (const [type, words] of Object.entries(keywords)) {
    for (const word of words) {
      if (question.includes(word)) return type as QuestionType;
    }
  }
  return "general";
}

function getEmpathy(type: QuestionType): string {
  const empathies: Record<QuestionType, string> = {
    career: "我理解在事业道路上，每个人都希望能看清方向，避免走弯路。你此刻的思考和求索，本身就是一种认真对待生活的态度。",
    love: "感情是人生中最美好也最复杂的事。你愿意为一段关系寻求指引，说明你是一个重情重义的人，这份心意本身就值得珍惜。",
    study: "求学之路从来都不轻松，你为此付出的努力和焦虑我都能够体会。但请相信，每一份耕耘都不会被辜负。",
    health: "健康是我们最宝贵的财富，你对自己的身体状况有所关切，这正是善待自己的表现。",
    wealth: "对财富的追求是人类进步的动力之一。你关心财运，说明你对生活品质有追求，也愿意为更好的生活而努力。",
    family: "家是我们永远的港湾。你关心家庭相关的问题，说明你是一个有责任感和爱心的人。",
    general: "你愿意静下心来寻求指引，这本身就说明你是一个认真思考生活的人。在这个喧嚣的时代，愿意停下来反思，是一种难得的品质。",
  };
  return empathies[type] || empathies.general;
}

function getHexagramLifeAdvice(hexNum: number): string {
  const advice: Record<number, string> = {
    1: "一个需要主动作为、勇于担当的阶段。",
    2: "一个需要包容接纳、顺势而为的阶段。",
    11: "一个天地交泰、万事顺遂的阶段。",
    12: "一个需要耐心等待、隐忍守正的阶段。",
    15: "一个需要谦虚谨慎、厚积薄发的阶段。",
    23: "一个需要顺应变化、耐心等待转机的阶段。",
    24: "一个万物复苏、重新出发的阶段。",
    29: "一个面临考验、需要坚定信念的阶段。",
    36: "一个需要隐忍坚守、保持内心光明的阶段。",
    63: "一个功成名就、居安思危的阶段。",
    64: "一个需要谨慎前行、不急不躁的阶段。",
  };
  return advice[hexNum] || "一个需要用心体会、顺势而为的阶段。";
}

function getPsychologicalReading(result: MeihuaResult, type: QuestionType): string {
  const readings: Record<QuestionType, string> = {
    career: "在事业的层面上，卦象告诉我们，外在的机遇固然重要，但内在的积累才是根本。你不是在等待一个机会，而是在成为一个能够把握机会的人。真正的职业发展不是与别人赛跑，而是与自己和解，找到那条属于你自己的路。",
    love: "在感情的问题上，卦象启示我们，真正的缘分不是刻意寻找的，而是在你成为最好的自己时自然遇见的。关系中的每一个波折，都是为了让彼此更加认清自己的心意。无论结果如何，爱的经历本身就是一份珍贵的礼物。",
    study: "在学业的道路上，卦象提醒我们，知识不是用来和别人比较的筹码，而是照亮自己前路的灯火。你现在的每一分努力，都在为未来的自己铺路。不必过分焦虑结果，专注于学习的过程本身，收获自然会随之而来。",
    health: "在健康的问题上，卦象告诉我们，身体是灵魂的庙宇。倾听身体的声音，尊重它的节奏，比任何灵丹妙药都重要。健康不只是没有疾病，更是一种身心和谐的状态。",
    wealth: "在财富的问题上，卦象启迪我们，财富如水，流动方能生生不息。追求财富本身没有错，但要记得，财富是让我们生活更好的工具，而不是生活的目的。真正的富足来自内心的丰盈。",
    family: "在家庭的问题上，卦象告诉我们，家不是讲理的地方，而是讲情的地方。血缘是最深的缘分，即使有分歧和矛盾，也改变不了彼此之间那份最深层的连接。理解比说服更重要，包容比对错更重要。",
    general: "卦象告诉我们，人生如同一场修行，每一个问题都是成长的契机。你此刻的困惑和思考，正是你生命在向前发展的信号。不必急于找到所有的答案，有时候，学会与问题共处，也是一种智慧。",
  };
  return readings[type] || readings.general;
}

function getEncouragement(result: MeihuaResult): string {
  const hasGoodTiYong = result.tiYong.includes("用生体") || result.tiYong.includes("比和");
  const hasChangedFavorable = [11, 14, 24, 35, 42, 46, 55, 63].includes(result.changedHexagram);

  if (hasGoodTiYong && hasChangedFavorable) {
    return "此刻的卦象显示，一切都在向着好的方向发展。你内心的那份不安，或许只是黎明前的短暂黑暗。请相信自己，也相信生命本身的智慧。你比你想象的更加坚强和有力。";
  } else if (!hasGoodTiYong && !hasChangedFavorable) {
    return "此刻的卦象虽然显示了一些挑战，但这正是生命在提醒你调整方向或方式的信号。困难不是终点，而是转折点。每一个低谷都是通往更高处的起点。请给自己一些时间和空间，慢慢来。";
  } else {
    return "卦象告诉我们，生活从来不是一条直线，而是一条充满起伏的曲线。在顺境中保持谦逊，在逆境中保持希望，这才是真正的智慧。无论此刻你面对的是什么，都请相信，你的内在拥有应对一切的力量。";
  }
}

export { analyzeQuestionType };
export type { QuestionType };
