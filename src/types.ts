/* 25 维度类型定义 —— 用 interface 把维度键精确锁死，写错进不了编译 */

export interface DimensionDims {
  /* 第一章 知识认知 */
  c1_concept: string;
  c1_keywords: string;
  c1_principle: string;
  c1_structure: string;
  c1_variables: string;
  c1_conclusion: string;
  /* 第二章 知识应用 */
  c2_condition: string;
  c2_application: string;
  c2_questiontype: string;
  c2_variant: string;
  c2_boundary: string;
  /* 第三章 错误与辨析 */
  c3_error: string;
  c3_confuse: string;
  c3_errortype: string;
  /* 第四章 知识网络与记忆 */
  c4_related: string;
  c4_hook: string;
  c4_forget: string;
  c4_lastreview: string;
  c4_nextreview: string;
  /* 第五章 薄弱环节与长尾 */
  c5_mastery: string;
  c5_weak: string;
  c5_weaksource: string;
  c5_errfreq: string;
  c5_impact: string;
  c5_priority: string;
}

export type DimKey = keyof DimensionDims;

export interface Point {
  id: string;
  title: string;
  dims: DimensionDims;
}

/* ---------- 临床执业医师：两段式应试模型 ----------
   砍掉一切元信息，只留两块：能直接背的知识 + 能直接做的题 */

/* 题库：结构化题目，前后端都能判分 */
export type QuizType = "A1" | "A2" | "A3" | "A4" | "B1";

/* A3/A4 的小问；B1 的每个共用备选下的小题干 */
export interface QuizSub {
  q: string;
  o?: string[];
  a: string;
  e: string;
}

export interface QuizQ {
  t: QuizType;
  q?: string; /* 题干（B1 为空，A3/A4 为病例） */
  o?: string[]; /* 5 个备选，不含「A.」前缀；B1 为共用备选 */
  a?: string; /* A1/A2 答案字母 */
  e?: string; /* A1/A2 解析 */
  s?: QuizSub[]; /* A3/A4/B1 的小问 */
  src?: string; /* 来源标记：「真题」= 历年真题原题 */
}

export interface ExamDims {
  k1_knowledge: string; /* ① 必背知识：教材级讲义（一、/1．/（1）/① 层级） */
  k2_quiz: QuizQ[]; /* ② 题库：A1 / A2 / A3-A4 / B1 */
}

export type ExamDimKey = keyof ExamDims;

/* ---------- 题眼速查（独立板块） ----------
   每条 = 题干关键词 → 秒选答案；h 为历年真题命中次数（不显年份，只作加权） */
export interface EyeRow {
  q: string;
  a: string;
  h?: number;
}
export interface EyePoint {
  id: string;
  t: string;
  r: EyeRow[];
}
export interface EyeChapter {
  id: string;
  n: string;
  p: EyePoint[];
}

export interface ExamPoint {
  id: string;
  title: string;
  dims: ExamDims;
}

export interface Chapter {
  id: string;
  name: string;
  points?: Point[];
  epoints?: ExamPoint[];
}

export interface Subject {
  id: string;
  name: string;
  /* exam = 执业医师低维考点模型（8 维）；basic = 教材提取式 25 维 */
  kind?: "basic" | "exam";
  chapters: Chapter[];
}

export type SubjectsMap = Record<string, Subject>;

export type GroupId = "认知" | "应用" | "错误" | "网络" | "薄弱" | "知识" | "题目";

export interface DimensionMeta {
  k: DimKey;
  n: string;
  t: string;
  g: GroupId;
  state?: boolean;
}

export interface GroupMeta {
  id: GroupId;
  name: string;
  sub: string;
}

export type ReviewGrade = "again" | "hard" | "good" | "easy";

/* 复习状态（运行时存 localStorage，不进数据文件） */
export interface PointState {
  reps?: number;
  interval?: number;
  lastReview?: number;
  nextReview?: number;
  mastery?: string;
  weak?: boolean;
  weaksource?: string;
  errfreq?: string;
  impact?: string;
  priority?: string;
  forget?: string;
}

export type StateMap = Record<string, PointState>;
