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

export interface Chapter {
  id: string;
  name: string;
  points?: Point[];
}

export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}

export type SubjectsMap = Record<string, Subject>;

export type GroupId = "认知" | "应用" | "错误" | "网络" | "薄弱";

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
