/* 医学应试复习系统 —— Vite + TypeScript 版核心逻辑 */
import type {
  SubjectsMap,
  Subject,
  Chapter,
  Point,
  GroupMeta,
  DimensionMeta,
  ReviewGrade,
  PointState,
  StateMap,
} from "./types";

const $ = (id: string): HTMLElement => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`missing element #${id}`);
  return el;
};

/* ---------- 25 维度配置 ---------- */
const GROUPS: GroupMeta[] = [
  { id: "认知", name: "第一章 知识认知", sub: "是什么 / 为什么 / 靠什么" },
  { id: "应用", name: "第二章 知识应用", sub: "何时用 / 怎么考" },
  { id: "错误", name: "第三章 错误与辨析", sub: "易错 / 易混" },
  { id: "网络", name: "第四章 知识网络与记忆", sub: "关联 / 钩子 / 复习" },
  { id: "薄弱", name: "第五章 薄弱环节与长尾", sub: "掌握 / 薄弱 / 优先级" },
];

const DIMENSIONS: DimensionMeta[] = [
  { k: "c1_concept", n: "①", t: "核心概念", g: "认知" },
  { k: "c1_keywords", n: "②", t: "关键词", g: "认知" },
  { k: "c1_principle", n: "③", t: "核心原理", g: "认知" },
  { k: "c1_structure", n: "④", t: "核心结构", g: "认知" },
  { k: "c1_variables", n: "⑤", t: "关键变量", g: "认知" },
  { k: "c1_conclusion", n: "⑥", t: "核心结论", g: "认知" },
  { k: "c2_condition", n: "⑦", t: "使用条件", g: "应用" },
  { k: "c2_application", n: "⑧", t: "典型应用", g: "应用" },
  { k: "c2_questiontype", n: "⑨", t: "典型题型", g: "应用" },
  { k: "c2_variant", n: "⑩", t: "变式问题", g: "应用" },
  { k: "c2_boundary", n: "⑪", t: "边界与局限", g: "应用" },
  { k: "c3_error", n: "⑫", t: "易错点", g: "错误" },
  { k: "c3_confuse", n: "⑬", t: "易混淆", g: "错误" },
  { k: "c3_errortype", n: "⑭", t: "错误类型", g: "错误" },
  { k: "c4_related", n: "⑮", t: "知识关联", g: "网络" },
  { k: "c4_hook", n: "⑯", t: "记忆钩子", g: "网络" },
  { k: "c4_forget", n: "⑰", t: "遗忘状态", g: "网络", state: true },
  { k: "c4_lastreview", n: "⑱", t: "最近复习", g: "网络", state: true },
  { k: "c4_nextreview", n: "⑲", t: "下次复习", g: "网络", state: true },
  { k: "c5_mastery", n: "⑳", t: "掌握程度", g: "薄弱", state: true },
  { k: "c5_weak", n: "㉑", t: "薄弱程度", g: "薄弱", state: true },
  { k: "c5_weaksource", n: "㉒", t: "薄弱来源", g: "薄弱", state: true },
  { k: "c5_errfreq", n: "㉓", t: "错误频率", g: "薄弱", state: true },
  { k: "c5_impact", n: "㉔", t: "影响程度", g: "薄弱", state: true },
  { k: "c5_priority", n: "㉕", t: "修复优先级", g: "薄弱", state: true },
];

/* ---------- 安全存储（file:// 部分浏览器禁 localStorage） ---------- */
const mem: Record<string, string> = {};
const store = {
  get(k: string): string | null {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return k in mem ? mem[k] : null;
    }
  },
  set(k: string, v: string): void {
    try {
      localStorage.setItem(k, v);
    } catch (e) {
      mem[k] = v;
    }
  },
};

const DKEY = "medreview_data_v1";
const SKEY = "medreview_state_v1";

/* ---------- 数据加载与合并 ---------- */
let DATA: SubjectsMap = {} as SubjectsMap;
let STATE: StateMap = {};

function loadData(fallback: SubjectsMap): SubjectsMap {
  const saved = store.get(DKEY);
  if (saved) {
    try {
      return JSON.parse(saved) as SubjectsMap;
    } catch (e) {
      // ignore broken data
    }
  }
  return fallback;
}

function saveData(): void {
  store.set(DKEY, JSON.stringify(DATA));
}

function loadState(): StateMap {
  const s = store.get(SKEY);
  if (s) {
    try {
      return JSON.parse(s) as StateMap;
    } catch (e) {
      // ignore broken state
    }
  }
  return {};
}

function saveState(): void {
  store.set(SKEY, JSON.stringify(STATE));
}

function stateKey(sub: string, pid: string): string {
  return `${sub}:${pid}`;
}

function getSt(sub: string, pid: string): PointState {
  return STATE[stateKey(sub, pid)] || {};
}

function updSt(sub: string, pid: string, patch: PointState): void {
  STATE[stateKey(sub, pid)] = { ...getSt(sub, pid), ...patch };
  saveState();
}

/* ---------- 工具 ---------- */
function fmtDate(ts: number | undefined): string {
  if (!ts) return "—";
  const d = new Date(ts);
  const p = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function esc(s: unknown): string {
  return String(s == null ? "" : s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" } as Record<string, string>)[c]);
}

function days(ts: number | undefined): number | null {
  if (!ts) return null;
  return Math.round((ts - Date.now()) / 86400000);
}

/* ---------- 轻量 Markdown 渲染（先转义，再套有限标记，防 XSS） ---------- */
function mdInline(t: string): string {
  return esc(t)
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function isTable(l: string): boolean {
  return /^\s*\|.*\|\s*$/.test(l);
}
function isUl(l: string): boolean {
  return /^\s*[-•]\s+/.test(l);
}
function isOl(l: string): boolean {
  return /^\s*\d+[.、)]\s+/.test(l);
}
function isNote(l: string): boolean {
  return /^\s*>\s?/.test(l);
}
function isHead(l: string): boolean {
  return /^\s*#{2,4}\s+/.test(l);
}

function mdHTML(src: string): string {
  const lines = String(src == null ? "" : src).replace(/\r/g, "").split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const ln = lines[i];
    if (/^\s*$/.test(ln)) {
      i++;
      continue;
    }
    if (isTable(ln)) {
      const rows: string[] = [];
      while (i < lines.length && isTable(lines[i])) {
        rows.push(lines[i]);
        i++;
      }
      const cells = (r: string) =>
        r
          .trim()
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((s) => s.trim());
      let head: string[] = [];
      const body: string[][] = [];
      rows.forEach((r, idx) => {
        const c = cells(r);
        if (idx === 1 && c.length && c.every((x) => /^:?-{2,}:?$/.test(x))) return;
        if (idx === 0) head = c;
        else body.push(c);
      });
      let t = '<table class="md-t">';
      if (head.length) t += "<thead><tr>" + head.map((c) => `<th>${mdInline(c)}</th>`).join("") + "</tr></thead>";
      t +=
        "<tbody>" +
        body
          .map((r) => "<tr>" + r.map((c) => `<td>${mdInline(c)}</td>`).join("") + "</tr>")
          .join("") +
        "</tbody></table>";
      out.push(t);
      continue;
    }
    if (isUl(ln)) {
      const it: string[] = [];
      while (i < lines.length && isUl(lines[i])) {
        it.push(lines[i].replace(/^\s*[-•]\s+/, ""));
        i++;
      }
      out.push('<ul class="md-ul">' + it.map((x) => `<li>${mdInline(x)}</li>`).join("") + "</ul>");
      continue;
    }
    if (isOl(ln)) {
      const it: string[] = [];
      while (i < lines.length && isOl(lines[i])) {
        it.push(lines[i].replace(/^\s*\d+[.、)]\s+/, ""));
        i++;
      }
      out.push('<ol class="md-ol">' + it.map((x) => `<li>${mdInline(x)}</li>`).join("") + "</ol>");
      continue;
    }
    if (isNote(ln)) {
      const buf: string[] = [];
      while (i < lines.length && isNote(lines[i])) {
        buf.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      out.push('<div class="md-note">' + buf.map(mdInline).join("<br>") + "</div>");
      continue;
    }
    if (isHead(ln)) {
      out.push('<div class="md-h">' + mdInline(ln.replace(/^\s*#{2,4}\s+/, "")) + "</div>");
      i++;
      continue;
    }
    const buf: string[] = [];
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !isTable(lines[i]) &&
      !isUl(lines[i]) &&
      !isOl(lines[i]) &&
      !isNote(lines[i]) &&
      !isHead(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    out.push('<p class="md-p">' + buf.map(mdInline).join("<br>") + "</p>");
  }
  return out.join("");
}

/* ---------- 全局状态 ---------- */
interface AppState {
  subject: string | null;
  chapterId: string | null;
  pointId: string | null;
  mode: "browse" | "review" | "edit";
  reviewFilter: "due" | "weak" | "all";
  reviewIdx: number;
  reviewQueue: { ch: string; p: Point }[];
  _revealed?: boolean;
}

const App: AppState = {
  subject: null,
  chapterId: null,
  pointId: null,
  mode: "browse",
  reviewFilter: "due",
  reviewIdx: 0,
  reviewQueue: [],
};

function subjects(): SubjectsMap {
  return DATA;
}
function curSubject(): Subject {
  return subjects()[App.subject!];
}
function curChapter(): Chapter | undefined {
  return curSubject().chapters.find((c) => c.id === App.chapterId);
}
function curPoint(): Point | null {
  const ch = curChapter();
  if (!ch || !ch.points) return null;
  return ch.points.find((p) => p.id === App.pointId) || null;
}

/* ---------- 渲染：科目标签 ---------- */
function renderSubjects(): void {
  const nav = $("subjectTabs");
  nav.innerHTML = "";
  Object.keys(subjects()).forEach((id) => {
    const b = document.createElement("button");
    b.textContent = subjects()[id].name;
    b.className = id === App.subject ? "active" : "";
    b.onclick = () => selectSubject(id);
    nav.appendChild(b);
  });
}

function selectSubject(id: string): void {
  App.subject = id;
  const ch = curSubject().chapters[0];
  App.chapterId = ch ? ch.id : null;
  App.pointId = ch && ch.points && ch.points[0] ? ch.points[0].id : null;
  renderSubjects();
  renderTree();
  renderMode();
  if (window.innerWidth <= 768) {
    $("sidebar").classList.remove("open");
  }
}

/* ---------- 渲染：侧边树 ---------- */
function renderTree(): void {
  const tree = $("tree");
  tree.innerHTML = "";
  curSubject().chapters.forEach((ch) => {
    const wrap = document.createElement("div");
    wrap.className = "chapter";
    const cnt = ch.points ? ch.points.length : 0;
    const head = document.createElement("div");
    head.className = "ch-title";
    head.innerHTML = `<span>${esc(ch.name)}</span><span class="cnt">${cnt}</span>`;
    head.onclick = () => {
      App.chapterId = ch.id;
      App.pointId = ch.points && ch.points[0] ? ch.points[0].id : null;
      renderTree();
      renderMode();
      if (window.innerWidth <= 768) $("sidebar").classList.remove("open");
    };
    wrap.appendChild(head);
    if (ch.points) {
      ch.points.forEach((p) => {
        const el = document.createElement("div");
        el.className = "point" + (p.id === App.pointId ? " active" : "");
        const st = getSt(App.subject!, p.id);
        let badge = "";
        if (st.weak) badge = '<span class="badge weak">薄</span>';
        else if (!st.lastReview || (st.nextReview && st.nextReview <= Date.now())) {
          badge = '<span class="badge">待</span>';
        }
        el.innerHTML = esc(p.title) + badge;
        el.onclick = () => {
          App.chapterId = ch.id;
          App.pointId = p.id;
          renderTree();
          renderMode();
          if (window.innerWidth <= 768) $("sidebar").classList.remove("open");
        };
        wrap.appendChild(el);
      });
    }
    tree.appendChild(wrap);
  });
  $("sideTitle").textContent = curSubject().name;
}

/* ---------- 渲染：维度卡片 ---------- */
function dimHTML(d: DimensionMeta, value: string, isState: boolean): string {
  const cls = isState ? "num s" : "num";
  const lab = isState ? "lab s" : "lab";
  const isEmpty = value == null || value === "";
  const empty = isEmpty ? " empty" : " md";
  const shown = isEmpty ? "待补充" : mdHTML(value);
  return `<div class="dim"><div class="${cls}">${d.n}</div><div class="body">
      <div class="${lab}">${d.t}</div><div class="val${empty}">${shown}</div></div></div>`;
}

function pointValue(p: Point, d: DimensionMeta, sub: string, pid: string): string {
  if (d.state) {
    const st = getSt(sub, pid);
    switch (d.k) {
      case "c4_forget":
        return st.forget || p.dims.c4_forget || "未评估";
      case "c4_lastreview":
        return st.lastReview ? fmtDate(st.lastReview) : "未复习";
      case "c4_nextreview":
        return st.nextReview
          ? fmtDate(st.nextReview) +
              (days(st.nextReview)! <= 0 ? "（已到期）" : `（${days(st.nextReview)}天后）`)
          : "—";
      case "c5_mastery":
        return st.mastery || p.dims.c5_mastery || "未评估";
      case "c5_weak":
        return st.weak ? "是" : p.dims.c5_weak || "否";
      case "c5_weaksource":
        return st.weaksource || p.dims.c5_weaksource || "";
      case "c5_errfreq":
        return st.errfreq || p.dims.c5_errfreq || "";
      case "c5_impact":
        return st.impact || p.dims.c5_impact || "";
      case "c5_priority":
        return st.priority || p.dims.c5_priority || "";
    }
  }
  return p.dims[d.k] || "";
}

function renderBrowse(): void {
  const p = curPoint();
  const c = $("content");
  if (!p) {
    c.innerHTML = `<div class="card"><h2>${esc(curChapter()!.name)}</h2>
        <div class="empty-tip">本章暂无知识点。切换到「编辑」模式可新增（电脑端）。</div></div>`;
    return;
  }
  let html = `<div class="card"><h2>${esc(p.title)}</h2>
      <div class="pt-sub">${esc(curSubject().name)} · ${esc(curChapter()!.name)}</div></div>`;
  GROUPS.forEach((g) => {
    const dims = DIMENSIONS.filter((d) => d.g === g.id);
    let inner = "";
    dims.forEach((d) => {
      inner += dimHTML(d, pointValue(p, d, App.subject!, p.id), d.state ?? false);
    });
    const color = g.id === "薄弱" ? "var(--amber)" : g.id === "错误" ? "var(--red)" : "var(--brand)";
    html += `<div class="group" data-g="${esc(g.id)}"><div class="group-head">
        <span class="fold">▾</span>
        <span class="gn" style="color:${color}">${esc(g.name)}</span>
        <span class="gs">${esc(g.sub)}</span><span class="bar"></span></div>${inner}</div>`;
  });
  c.innerHTML = html;
  Array.prototype.forEach.call(c.querySelectorAll(".group"), (gEl: Element) => {
    const head = gEl.querySelector(".group-head");
    if (!head) return;
    (head as HTMLElement).style.cursor = "pointer";
    head.addEventListener("click", () => {
      const folded = gEl.classList.toggle("folded");
      const f = gEl.querySelector(".fold");
      if (f) f.textContent = folded ? "▸" : "▾";
    });
  });
}

/* ---------- 复习模式 ---------- */
function buildQueue(): void {
  const sub = curSubject();
  let pts: { ch: string; p: Point }[] = [];
  sub.chapters.forEach((ch) => {
    if (ch.points) {
      ch.points.forEach((p) => pts.push({ ch: ch.name, p }));
    }
  });
  if (App.reviewFilter === "due") {
    pts = pts.filter((o) => {
      const st = getSt(App.subject!, o.p.id);
      return !st.lastReview || (st.nextReview && st.nextReview <= Date.now());
    });
  } else if (App.reviewFilter === "weak") {
    pts = pts.filter((o) => getSt(App.subject!, o.p.id).weak);
  }
  App.reviewQueue = pts;
  App.reviewIdx = 0;
}

function renderReview(): void {
  const c = $("content");
  if (!App.reviewQueue.length) buildQueue();
  if (App.reviewIdx >= App.reviewQueue.length) {
    c.innerHTML = `<div class="card"><div class="empty-tip">🎉 本轮复习完成！<br>
        <button id="rvRestart" style="margin-top:12px;padding:8px 18px;border:none;background:var(--green);color:#fff;border-radius:8px;cursor:pointer">再来一轮</button></div></div>`;
    const r = $("rvRestart");
    r.onclick = () => {
      App.reviewIdx = 0;
      App._revealed = false;
      buildQueue();
      renderReview();
    };
    return;
  }
  const item = App.reviewQueue[App.reviewIdx];
  const p = item.p;
  const revealed = App._revealed;
  const recallList = DIMENSIONS.filter((d) => !d.state)
    .map((d) => d.t)
    .join("、");
  let html = '<div class="review-box">';
  html += `<div class="chips">
      <button data-f="due" class="${App.reviewFilter === "due" ? "active" : ""}">待复习</button>
      <button data-f="weak" class="${App.reviewFilter === "weak" ? "active" : ""}">薄弱</button>
      <button data-f="all" class="${App.reviewFilter === "all" ? "active" : ""}">全部</button>
    </div>`;
  html += `<div class="front"><div class="q">${esc(curSubject().name)} · ${esc(item.ch)}</div>
      <div class="ttl">${esc(p.title)}</div>
      <div class="recall">凭记忆回忆：${esc(recallList)}</div></div>`;
  if (revealed) {
    GROUPS.forEach((g) => {
      const dims = DIMENSIONS.filter((d) => d.g === g.id);
      let inner = "";
      dims.forEach((d) => {
        inner += dimHTML(d, pointValue(p, d, App.subject!, p.id), d.state ?? false);
      });
      html += `<div class="group"><div class="group-head"><span class="gn">${esc(g.name)}</span><span class="bar"></span></div>${inner}</div>`;
    });
    html += `<div class="rating">
        <button class="again" data-g="again">忘记</button>
        <button class="hard" data-g="hard">模糊</button>
        <button class="good" data-g="good">记住</button>
        <button class="easy" data-g="easy">熟练</button></div>`;
  } else {
    html += `<div class="rating"><button class="good" id="showAns" style="background:var(--brand)">显示答案</button></div>`;
  }
  const total = App.reviewQueue.length;
  html += `<div class="rprogress">进度 ${Math.min(App.reviewIdx + 1, total)} / ${total}</div>`;
  html += "</div>";
  c.innerHTML = html;

  c.querySelectorAll(".chips button").forEach((b) => {
    (b as HTMLElement).onclick = () => {
      App.reviewFilter = (b as HTMLElement).dataset.f as typeof App.reviewFilter;
      buildQueue();
      App._revealed = false;
      renderReview();
    };
  });
  const sa = document.getElementById("showAns");
  if (sa) {
    sa.onclick = () => {
      App._revealed = true;
      renderReview();
    };
  }
  c.querySelectorAll(".rating button[data-g]").forEach((b) => {
    (b as HTMLElement).onclick = () => rate(((b as HTMLElement).dataset.g ?? "hard") as ReviewGrade);
  });
}

function rate(grade: ReviewGrade): void {
  const item = App.reviewQueue[App.reviewIdx];
  const pid = item.p.id;
  const st: PointState = { ...getSt(App.subject!, pid) };
  st.reps = st.reps || 0;
  st.interval = st.interval || 0;
  const now = Date.now();
  st.lastReview = now;
  if (grade === "again") {
    st.reps = 0;
    st.interval = 0;
    st.mastery = "低";
    st.weak = true;
  } else if (grade === "hard") {
    st.reps = (st.reps || 0) + 1;
    st.interval = Math.max(1, Math.round((st.interval || 0) * 1.3) || 1);
    st.mastery = (st.reps || 0) >= 2 ? "高" : "中";
  } else if (grade === "good") {
    st.reps = (st.reps || 0) + 1;
    st.interval = Math.max(2, Math.round((st.interval || 0) * 2.5) || 2);
    st.mastery = (st.reps || 0) >= 2 ? "高" : "中";
    if ((st.reps || 0) >= 3) st.weak = false;
  } else if (grade === "easy") {
    st.reps = (st.reps || 0) + 1;
    st.interval = Math.max(4, Math.round((st.interval || 0) * 4) || 4);
    st.mastery = "高";
    st.weak = false;
  }
  st.nextReview = now + (st.interval || 0) * 86400000;
  updSt(App.subject!, pid, st);
  App.reviewIdx += 1;
  App._revealed = false;
  updateStat();
  renderTree();
  renderReview();
}

/* ---------- 编辑模式（电脑端） ---------- */
function renderEdit(): void {
  const c = $("content");
  const p = curPoint();
  let html = `<div class="card"><h2>编辑模式（电脑端）</h2>
      <div class="pt-sub">当前：${esc(curSubject().name)} · ${esc(curChapter()!.name)}</div>
      <div class="edit-tools">
        <button id="edSave">保存（本地）</button>
        <button class="ghost" id="edExport">导出本学科 .ts</button>
        <button class="ghost" id="edAddPoint">+ 知识点</button>
        <button class="ghost" id="edAddCh">+ 章节</button>
        <button class="ghost" id="edDelPoint">删除本点</button>
      </div></div>`;
  if (!p) {
    c.innerHTML = html + '<div class="card"><div class="empty-tip">请选择或新增一个知识点进行编辑。</div></div>';
    bindEdit();
    return;
  }
  p.dims = p.dims || ({} as typeof p.dims);
  html += `<div class="card edit-form"><h2 style="font-size:17px">${esc(p.title)}</h2>`;
  html += `<div class="frow"><label>知识点标题</label><input type="text" id="f_title" value="${esc(p.title)}"></div>`;
  GROUPS.forEach((g) => {
    html += `<div class="group"><div class="group-head"><span class="gn">${esc(g.name)}</span><span class="bar"></span></div>`;
    DIMENSIONS.filter((d) => d.g === g.id).forEach((d) => {
      let val = "";
      if (d.state) {
        const st = getSt(App.subject!, p.id);
        if (d.k === "c4_forget") val = st.forget || p.dims.c4_forget || "";
        else if (d.k === "c5_mastery") val = st.mastery || p.dims.c5_mastery || "";
        else if (d.k === "c5_weak") val = st.weak ? "是" : p.dims.c5_weak || "否";
        else if (d.k === "c5_weaksource") val = st.weaksource || p.dims.c5_weaksource || "";
        else if (d.k === "c5_errfreq") val = st.errfreq || p.dims.c5_errfreq || "";
        else if (d.k === "c5_impact") val = st.impact || p.dims.c5_impact || "";
        else if (d.k === "c5_priority") val = st.priority || p.dims.c5_priority || "";
        if (d.k === "c4_lastreview" || d.k === "c4_nextreview") {
          html += `<div class="frow"><label>${d.n} ${d.t}（系统管理）</label>
              <input type="text" value="${d.k === "c4_lastreview" ? fmtDate(st.lastReview) : st.nextReview ? fmtDate(st.nextReview) : "—"}" disabled></div>`;
          return;
        }
      } else {
        val = p.dims[d.k] || "";
      }
      const isSel = d.k === "c4_forget" || d.k === "c5_mastery" || d.k === "c5_weak";
      if (isSel) {
        const opts = d.k === "c5_weak" ? ["否", "是"] : ["", "易忘", "中性", "稳定", "低", "中", "高"];
        let o = `<select id="f_${d.k}" style="width:100%;padding:8px;border:1px solid var(--line);border-radius:8px">`;
        opts.forEach((op) => {
          o += `<option value="${op}" ${String(val) === op ? "selected" : ""}>${op || "（空）"}</option>`;
        });
        o += "</select>";
        html += `<div class="frow"><label>${d.n} ${d.t}</label>${o}</div>`;
      } else {
        html += `<div class="frow"><label>${d.n} ${d.t}</label>
            <textarea id="f_${d.k}">${esc(val)}</textarea></div>`;
      }
    });
    html += "</div>";
  });
  html += `<div class="edit-save"><button class="btn-primary" id="edSave2">保存（本地）</button>
      <button class="btn-ghost" id="edExport2">导出本学科 .ts</button></div>`;
  html += "</div>";
  c.innerHTML = html;
  bindEdit();
}

function bindEdit(): void {
  const save = () => {
    const p = curPoint();
    if (!p) return;
    const titleInput = document.getElementById("f_title") as HTMLInputElement | null;
    if (titleInput) p.title = titleInput.value;
    p.dims = p.dims || ({} as typeof p.dims);
    DIMENSIONS.forEach((d) => {
      if (d.k === "c4_lastreview" || d.k === "c4_nextreview") return;
      const el = document.getElementById("f_" + d.k) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (!el) return;
      if (d.state) {
        const st: PointState = { ...getSt(App.subject!, p.id) };
        if (d.k === "c4_forget") st.forget = el.value;
        else if (d.k === "c5_mastery") st.mastery = el.value;
        else if (d.k === "c5_weak") st.weak = el.value === "是";
        else if (d.k === "c5_weaksource") st.weaksource = el.value;
        else if (d.k === "c5_errfreq") st.errfreq = el.value;
        else if (d.k === "c5_impact") st.impact = el.value;
        else if (d.k === "c5_priority") st.priority = el.value;
        updSt(App.subject!, p.id, st);
      } else {
        p.dims[d.k] = el.value;
      }
    });
    saveData();
    alert("已保存到本地（localStorage）。如需多设备同步或正式发布，请点「导出本学科」：会下载一个 " + curSubject().id + ".ts，用它覆盖 src/data/" + curSubject().id + ".ts 后提交，再执行 npm run build 重新构建。");
    renderTree();
  };
  const exp = () => exportSubject();
  const addPoint = () => {
    const ch = curChapter()!;
    ch.points = ch.points || [];
    const pid = "u" + Date.now();
    ch.points.push({ id: pid, title: "新知识点", dims: {} as Point["dims"] });
    App.pointId = pid;
    saveData();
    renderTree();
    renderEdit();
  };
  const addCh = () => {
    const sub = curSubject();
    const cid = "c" + Date.now();
    sub.chapters.push({ id: cid, name: "新章节", points: [] });
    App.chapterId = cid;
    App.pointId = null;
    saveData();
    renderTree();
    renderEdit();
  };
  const delPoint = () => {
    const ch = curChapter()!;
    if (!ch.points) return;
    const i = ch.points.findIndex((p) => p.id === App.pointId);
    if (i < 0) return;
    if (!confirm("确认删除该知识点？")) return;
    ch.points.splice(i, 1);
    App.pointId = ch.points[0] ? ch.points[0].id : null;
    saveData();
    renderTree();
    renderEdit();
  };
  ["edSave", "edSave2"].forEach((id) => {
    const e = document.getElementById(id);
    if (e) e.onclick = save;
  });
  ["edExport", "edExport2"].forEach((id) => {
    const e = document.getElementById(id);
    if (e) e.onclick = exp;
  });
  const ap = document.getElementById("edAddPoint");
  if (ap) ap.onclick = addPoint;
  const ac = document.getElementById("edAddCh");
  if (ac) ac.onclick = addCh;
  const dp = document.getElementById("edDelPoint");
  if (dp) dp.onclick = delPoint;
}

function exportSubject(): void {
  const sub = curSubject();
  /* 导出为可直接覆盖 src/data/<id>.ts 的 TypeScript 模块。
     补全每个知识点缺失的 25 维度键（填空串），保证生成物能过 tsc 类型检查。 */
  const filled: Subject = {
    ...sub,
    chapters: sub.chapters.map((ch) => ({
      ...ch,
      points: (ch.points || []).map((p) => {
        const dims = {} as typeof p.dims;
        DIMENSIONS.forEach((d) => {
          (dims as unknown as Record<string, string>)[d.k] = (p.dims as unknown as Record<string, string>)[d.k] ?? "";
        });
        return { ...p, dims };
      }),
    })),
  };
  const body = JSON.stringify(filled, null, 2);
  const txt =
    'import type { Subject } from "../types";\n\n' +
    `export const ${sub.id}: Subject = ${body};\n`;
  const blob = new Blob([txt], { type: "text/typescript" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = sub.id + ".ts";
  a.click();
}

/* ---------- 复习进度导出 / 导入 ---------- */
function exportProgress(): void {
  const raw = store.get(SKEY);
  if (!raw) {
    alert("当前没有可导出的复习进度。");
    return;
  }
  let obj: StateMap;
  try {
    obj = JSON.parse(raw) as StateMap;
  } catch (e) {
    alert("本地进度数据损坏，无法导出。");
    return;
  }
  const d = new Date();
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const payload = { type: "medreview_state_v1", exportedAt: Date.now(), data: obj };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download =
    "medreview-progress-" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + ".json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function importProgress(file: File | undefined): void {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    const text = reader.result;
    if (typeof text !== "string") {
      alert("文件读取失败。");
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      alert("文件不是有效的 JSON，导入失败。");
      return;
    }
    let state: StateMap;
    const typed = parsed as { type?: string; data?: StateMap };
    if (typed && typed.type === "medreview_state_v1" && typed.data && typeof typed.data === "object") {
      state = typed.data;
    } else if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      state = parsed as StateMap;
    } else {
      alert("文件格式无法识别为复习进度。");
      return;
    }
    try {
      store.set(SKEY, JSON.stringify(state));
      STATE = state;
      alert("进度已导入，正在刷新视图…");
      renderTree();
      renderMode();
      updateStat();
    } catch (e) {
      alert("写入进度失败：" + (e && (e as Error).message ? (e as Error).message : String(e)));
    }
  };
  reader.onerror = function () {
    alert("文件读取出错。");
  };
  reader.readAsText(file);
}

/* ---------- 统计徽章 ---------- */
function updateStat(): void {
  const sub = curSubject();
  let due = 0;
  let weak = 0;
  let total = 0;
  sub.chapters.forEach((ch) => {
    if (ch.points) {
      ch.points.forEach((p) => {
        total++;
        const st = getSt(App.subject!, p.id);
        if (!st.lastReview || (st.nextReview && st.nextReview <= Date.now())) due++;
        if (st.weak) weak++;
      });
    }
  });
  $("statBadge").textContent = `待复习 ${due} · 薄弱 ${weak} / 共 ${total}`;
}

/* ---------- 模式切换 ---------- */
function setMode(m: AppState["mode"]): void {
  if (m === "edit" && window.innerWidth <= 768) {
    alert("编辑模式仅在电脑端可用，手机端仅做复习。");
    return;
  }
  App.mode = m;
  App._revealed = false;
  if (m === "review") {
    App.reviewFilter = App.reviewFilter || "due";
    buildQueue();
  }
  document.querySelectorAll(".mode").forEach((b) => {
    b.classList.toggle("active", (b as HTMLElement).dataset.mode === m);
  });
  document.querySelectorAll(".mobilebar button[data-mode]").forEach((b) => {
    b.classList.toggle("active", (b as HTMLElement).dataset.mode === m);
  });
  renderMode();
}

function renderMode(): void {
  if (App.mode === "browse") renderBrowse();
  else if (App.mode === "review") renderReview();
  else if (App.mode === "edit") renderEdit();
  updateStat();
}

/* ---------- 事件绑定 ---------- */
function bindGlobal(): void {
  document.querySelectorAll(".mode").forEach((b) => {
    (b as HTMLElement).onclick = () => setMode(((b as HTMLElement).dataset.mode ?? "browse") as AppState["mode"]);
  });
  document.querySelectorAll(".mobilebar button[data-mode]").forEach((b) => {
    (b as HTMLElement).onclick = () => setMode(((b as HTMLElement).dataset.mode ?? "browse") as AppState["mode"]);
  });
  $("mbMenu").onclick = () => $("sidebar").classList.toggle("open");
  $("sideToggle").onclick = () => $("sidebar").classList.toggle("open");
  $("btnExport").onclick = exportProgress;
  $("btnImport").onclick = () => {
    const f = document.getElementById("importFile") as HTMLInputElement | null;
    if (f) f.click();
  };
  const fi = document.getElementById("importFile") as HTMLInputElement | null;
  if (fi) {
    fi.onchange = function () {
      if (fi.files && fi.files[0]) importProgress(fi.files[0]);
      fi.value = ""; // 允许重复导入同一文件
    };
  }
}

/* ---------- 启动 ---------- */
export function initApp(SUBJECTS: SubjectsMap): void {
  if (!SUBJECTS || !Object.keys(SUBJECTS).length) {
    $("content").innerHTML = '<div class="empty-tip">未加载到数据模块，请确认 src/data/*.ts 已导出。</div>';
    return;
  }
  DATA = loadData(SUBJECTS);
  STATE = loadState();
  App.subject = Object.keys(DATA)[0];
  const ch = curSubject().chapters[0];
  App.chapterId = ch ? ch.id : null;
  App.pointId = ch && ch.points && ch.points[0] ? ch.points[0].id : null;
  bindGlobal();
  renderSubjects();
  renderTree();
  renderMode();
}
