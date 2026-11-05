import type { Subject } from "../types";

/* 学科元数据：先渲染标签页，数据按需动态加载（代码分割，降低首屏体积） */
export interface SubjectMeta {
  id: string;
  name: string;
  kind?: "basic" | "exam";
}
export const SUBJECT_META: SubjectMeta[] = [
  { id: "license", name: "临床执业医师 · 通关体系", kind: "exam" },
  { id: "biochem", name: "生物化学", kind: "basic" },
  { id: "physiol", name: "生理学", kind: "basic" },
  { id: "patho", name: "病理学", kind: "basic" },
  { id: "internal", name: "内科学", kind: "basic" },
  { id: "surgery", name: "外科学", kind: "basic" },
];

export const subjectLoaders: Record<string, () => Promise<Subject>> = {
  license: () => import("./license").then((m) => m.license),
  biochem: () => import("./biochem").then((m) => m.biochem),
  physiol: () => import("./physiol").then((m) => m.physiol),
  patho: () => import("./patho").then((m) => m.patho),
  internal: () => import("./internal").then((m) => m.internal),
  surgery: () => import("./surgery").then((m) => m.surgery),
};
