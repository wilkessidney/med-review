# 医学应试复习系统 · 项目综述与提示词

> 单项目文件夹：`/Volumes/DevSSD/作品/临床医学考试内容`
> Git 远程：`wilkessidney/med-review`（branch `main`）
> 最后更新：2026-08-26（已迁移至 Vite + TypeScript）

---

## 一、项目定位

一个**基于 Vite + TypeScript** 的多科目医学考试交互复习网页，面向**执业医师考试 / 考研（西医综合）**。

核心特征：
- **五科目随时切换**：生物化学、生理学、病理学、内科学、外科学
- **25 维度 × 5 章** 知识组织模型（认知 / 应用 / 错误辨析 / 知识网络 / 薄弱长尾），每个知识点按 ①–㉕ 拆解
- **三种模式**：浏览（看全维度）、复习（卡片 + 间隔重复评分）、编辑（电脑端增删改）
- **手机只复习、电脑主编辑**（手机端 CSS 隐藏 + JS 守卫拦截编辑）
- 复习进度存本地 `localStorage`；构建产物 `dist/` 可部署到任意静态托管

---

## 二、技术架构（Vite + TypeScript）

| 项 | 说明 |
|---|---|
| 构建 | Vite 5 + TypeScript 5（需 Node 18+） |
| 入口 | `index.html` → `<script type="module" src="/src/main.ts">` |
| 启动 | `src/main.ts` 导入 `SUBJECTS` 并调用 `initApp(SUBJECTS)` |
| 核心逻辑 | `src/app.ts`（~900 行：渲染 / 复习调度 / 编辑 / 导出） |
| 类型锁 | `src/types.ts` —— `DimensionDims` 把 25 个维度键**精确锁死**，键名写错编译即报错 |
| 数据真相来源 | `src/data/*.ts`（5 科模块）→ `src/data/index.ts` 汇总为 `SUBJECTS` |
| 状态存储 | `localStorage`：`medreview_data_v1`（编辑覆盖）、`medreview_state_v1`（复习状态） |
| 间隔重复 | `again/hard/good/easy` → 更新 `reps/interval/mastery/weak/nextReview` |

**目录结构**
```
临床医学考试内容/
├── index.html              # 入口，引用 /src/main.ts
├── vite.config.ts          # base:"./" 构建到 dist/
├── src/
│   ├── main.ts             # 组装 SUBJECTS 并 initApp
│   ├── app.ts              # 全部逻辑
│   ├── types.ts            # 25 维度接口（DimensionDims 锁死键名）
│   ├── style.css
│   └── data/
│       ├── index.ts        # 汇总 5 科 → export const SUBJECTS
│       ├── biochem.ts / physiol.ts / patho.ts / internal.ts / surgery.ts
├── docs/
│   ├── project/            # 本综述 + prompt-fill-chapter.md
│   └── superpowers/{plans,specs}/
├── dist/                   # 构建产物（gitignore）
└── README.md
```

> ⚠️ **历史陷阱（务必注意）**：早期版本是「零构建静态站 + `data/*.js` + `window.SUBJECTS` 全局变量」，可 `file://` 双击打开。**该架构已废弃**。现在的真相来源是 `src/data/*.ts`，必须 `npm run build` 后才能运行；直接双击 `index.html` 或 `python -m http.server` 打开只会拿到一个空壳。

---

## 三、数据模型（必读，AI 改数据前必须理解）

`src/data/<subject>.ts` 结构（TypeScript）：

```ts
import type { Subject } from "../types";

export const biochem: Subject = {
  id: "biochem",
  name: "生物化学",
  chapters: [
    {
      id: "ch1",
      name: "第一章 蛋白质的结构与功能",
      points: [
        {
          id: "b1-1",
          title: "蛋白质的组成与氨基酸",
          dims: {
            c1_concept: "……",   // 25 个维度键，见下表
            c1_keywords: "……",
            // …… 共 25 个
          }
        }
      ]
    }
  ]
};
```

- 在 `src/data/index.ts` 里 `import` 该模块并加进 `SUBJECTS` 对象，才会被应用加载。
- TypeScript 的 `DimensionDims` 要求 **25 个键全部存在且为 `string`**，缺键或拼错键名会直接 `tsc` 报错——这是防线，不是负担。

**25 维度键（与 `src/app.ts` 的 `DIMENSIONS` 完全一致，键名不可改）**

| 章 | 键 | 名称 | 类型 |
|---|---|---|---|
| 认知 | `c1_concept` `c1_keywords` `c1_principle` `c1_structure` `c1_variables` `c1_conclusion` | 核心概念/关键词/核心原理/核心结构/关键变量/核心结论 | 文本 |
| 应用 | `c2_condition` `c2_application` `c2_questiontype` `c2_variant` `c2_boundary` | 使用条件/典型应用/典型题型/变式问题/边界与局限 | 文本 |
| 错误 | `c3_error` `c3_confuse` `c3_errortype` | 易错点/易混淆/错误类型 | 文本 |
| 网络 | `c4_related` `c4_hook` `c4_forget` | 知识关联/记忆钩子/遗忘状态 | 文本 |
| 网络 | `c4_lastreview` `c4_nextreview` | 最近复习/下次复习 | **系统管理，留空串即可**（运行时由复习状态注入） |
| 薄弱 | `c5_mastery` `c5_weak` `c5_weaksource` `c5_errfreq` `c5_impact` `c5_priority` | 掌握程度/薄弱程度/薄弱来源/错误频率/影响程度/修复优先级 | 文本或"是/否" |

注意：
- `c4_lastreview` / `c4_nextreview` 由复习评分自动写入，**数据文件里留空字符串 `""` 即可**。
- `c4_forget`、`c5_*` 系列既可种子预填，也可由运行时复习状态覆盖（编辑模式可改）。
- 任何维度留空 → 浏览页显示"待补充"，不报错。

---

## 四、当前进度与内容覆盖（实测）

| 科目 | 章节 | 已填 25 维度知识点 | 状态 |
|---|---|---|---|
| 生物化学 | 16 | 66 | 较完整（多数章节已填） |
| 生理学 | 12 | 19 | 部分章节种子点，待补 |
| 病理学 | 13 | 42 | 部分章节已填，待补 |
| 内科学 | 10 | 64 | 较完整 |
| 外科学 | 8 | 42 | 较完整 |
| **合计** | **59** | **233** | — |

**已知瑕疵（待修）**
- 生理、病理部分章节仍为大纲骨架 + 少量种子点，需逐章补全（见 `prompt-fill-chapter.md`）。
- 早期 biochem 笔误「（更正：肽键为酰胺键）」已在新版数据中清理。

---

## 五、本地与部署约定

- **本地预览**：`npm install` → `npm run dev`，开 `http://localhost:5173`。
- **构建**：`npm run build` → `dist/`（`vite.config.ts` 已 `base: "./"`，相对路径，可直接丢任意静态托管）。
- **部署**：把 `dist/` 推到 GitHub Pages / 对象存储 / CDN。挂子路径时把 `base` 改成对应前缀（如 `"/med-review/"`）。
- **改数据后发布**：电脑端「编辑」模式保存只写 `localStorage`；要全设备生效需「导出本学科 .ts」→ 覆盖 `src/data/<id>.ts` → `git add` 提交 → `npm run build` 重新构建部署。
- **手机复习**：访问部署后的网址即可，进度按浏览器本地保存。换设备用顶栏「导出进度 / 导入进度」同步。

---

## 六、分场景提示词（可直接复制给 AI 继续开发）

> 通用约束（每次都带上）：
> 1. 先读 `src/types.ts`（`DimensionDims` 25 维度定义）和 `src/data/<subject>.ts` 现有结构，再动手。
> 2. **数据一律写在 `src/data/*.ts`**，并通过 `src/data/index.ts` 注册；不要写 `data/*.js`、不要再用 `window.SUBJECTS`。
> 3. 维度键名（`c1_concept` 等）必须与 `src/types.ts` 完全一致，新增维度须同步改 `types.ts` 与 `app.ts` 的 `DIMENSIONS`。
> 4. 改完必须 `npm run typecheck` 通过（缺键/拼错键会直接报错）。
> 5. 改数据用纯文本填充 25 维度，简洁、考点导向、贴合执业医师/考研大纲。

### 场景 A：补全某学科某章节内容（最常见）

> **详细版见 [`prompt-fill-chapter.md`](./prompt-fill-chapter.md)**。简版：

```
请为本项目（Vite+TS 医学应试复习系统，25 维度模型）补全【生物化学 · 第三章 酶】的 25 维度知识点数据。

约束：
- 数据写入 src/data/biochem.ts，追加到 chapters 中 id="ch3" 的 points 数组。
- 每个知识点对象：{ id: "b3-1", title: "…", dims: { 25 个维度键 } }，维度键名见 src/types.ts 的 DimensionDims。
- 覆盖考点：酶的概念与分子组成、活性中心、酶促反应特点、米氏方程与 Km、竞争性/非竞争性抑制、酶原激活、同工酶、关键酶与调节……
- 每个维度填考点导向短文本（c1_concept 一句话定义，c1_keywords 列关键词，c2_questiontype 写常见考法，c3_confuse 写易混点，c4_hook 写记忆口诀）。
- 只新增本章 points，不改动其他章节与文件。改完 npm run typecheck 通过，并报告新增了几个知识点。
```

### 场景 B：新增一个科目

```
请为系统新增科目【药理学】，按现有 5 科格式：
1. 新建 src/data/pharm.ts：import type { Subject } from "../types"; export const pharm: Subject = { id:"pharm", name:"药理学", chapters:[...] }。
2. 先列标准 syllabus 章节大纲，每章 1–2 个种子知识点填好 25 维度。
3. 在 src/data/index.ts 加 import { pharm } from "./pharm"; 并写进 export const SUBJECTS 对象。
4. 确认科目标签出现"药理学"（自动遍历 SUBJECTS，无需改 app.ts）。
5. 自验 npm run typecheck 与 npm run build 均通过。
```

### 场景 C：新增功能（例如复习进度导出/导入备份）

```
请给系统加"复习进度导出/导入"按钮（当前进度只存各自 localStorage，手机↔电脑不互通）。
约束：
- 顶栏已有两个按钮 btnExport/btnImport（见 index.html），逻辑在 src/app.ts 的 exportProgress/importProgress（已实现，可复用）。
- 不能破坏三模式与手机端隐藏编辑的逻辑。改完 npm run typecheck 通过。
```

### 场景 D：定位并修复 bug

```
系统表现：[现象，例如"复习模式评分后进度数字不更新"]。
请先读 src/app.ts 相关函数（renderReview / rate / updateStat），定位根因，最小改动修复，说明改了哪几行、为什么。改完 npm run typecheck 通过，并说明如何验证。
```

### 场景 E：把已有 HTML 复习材料转成 25 维度数据

```
我有一份 HTML 复习笔记（路径 xxx.html），请将其内容抽取并转写为本系统的 25 维度知识点，写入对应 src/data/*.ts。
约束：
- 解析 HTML 提取各小节标题与要点。
- 按 25 维度归类：定义→c1_concept，关键词→c1_keywords，机制→c1_principle，组成→c1_structure，影响因素→c1_variables，结论→c1_conclusion，临床/考法→c2_*，易错→c3_*，联想→c4_*，掌握自评→c5_*。
- 输出标准 { id, title, dims } 数组，追加到对应科目 chapters。保留原文考点准确性，不臆造。
- 改完 npm run typecheck 通过。
```

### 场景 F：整体检查与修复数据瑕疵

```
请扫描 src/data/*.ts 全部已填知识点，检查并修复：
1. 维度键名是否与 src/types.ts 的 DimensionDims 完全一致（多了/少了/拼错）——直接跑 npm run typecheck 即可暴露。
2. 文本中含"更正：""待改""TODO""（应为"等明显笔误或占位符，清理为正确表述。
3. 必填文本维度是否为空却本应有内容。
列出问题清单 + 逐条修复，改完 npm run typecheck 通过。
```

---

## 七、给接手 AI 的一句话

"这是 Vite + TypeScript 工程，数据驱动（25 维度模型，真相来源是 `src/data/*.ts`，由 `src/data/index.ts` 汇总成 `SUBJECTS`）。先读 `src/types.ts` 的维度定义和现有 `src/data/*.ts` 结构，再按场景提示词动手；改完必须 `npm run typecheck` 通过，发布要 `npm run build`。别再碰 `data/*.js` / `window.SUBJECTS` 那套旧架构。"
