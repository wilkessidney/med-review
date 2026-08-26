# 医学应试复习系统 · 项目综述与提示词

> 单项目文件夹：`/Volumes/DevSSD/作品/临床医学考试内容`
> 线上地址（GitHub Pages，固定）：https://wilkessidney.github.io/med-review/
> Git 远程：`wilkessidney/med-review`（branch `main`）
> 最后更新：2026-08-26

---

## 一、项目定位

一个**纯静态、零构建**的多科目医学考试交互复习网页，面向**执业医师考试 / 考研（西医综合）**。

核心特征：
- **五科目随时切换**：生物化学、生理学、病理学、内科学、外科学
- **25 维度 × 5 章** 知识组织模型（认知 / 应用 / 错误辨析 / 知识网络 / 薄弱长尾），每个知识点按 ①–㉕ 拆解
- **三种模式**：浏览（看全维度）、复习（卡片 + 间隔重复评分）、编辑（电脑端增删改）
- **手机只复习、电脑主编辑**（手机端 CSS 隐藏 + JS 守卫拦截编辑）
- **本地双击可开**、**可部署 GitHub Pages**、复习进度存本地
- 章节大纲贴合标准医学教材 syllabus

---

## 二、技术架构

| 项 | 说明 |
|---|---|
| 运行环境 | 任意现代浏览器，**无需 Node/构建** |
| 加载方式 | 直接 `file://` 双击，或 `python3 -m http.server` / GitHub Pages |
| 前端 | 原生 HTML + CSS + JS（IIFE，无框架、无依赖） |
| 数据 | 全局变量 `window.SUBJECTS.<id>`（`.js` 文件，兼容 file:// 与 Pages） |
| 状态存储 | `localStorage`（`medreview_data_v1` 编辑覆盖、`medreview_state_v1` 复习状态）；`file://` 部分浏览器禁 localStorage，已 `try/catch` 降级到内存 |
| 间隔重复 | 自研轻量调度：`again/hard/good/easy` → 更新 `reps/interval/mastery/weak/nextReview` |

**目录结构**
```
临床医学考试内容/
├── index.html                # 页面骨架（引入 assets + data）
├── assets/
│   ├── styles.css            # 全部样式（含手机端响应式、隐藏编辑）
│   └── app.js                # 核心逻辑（477 行，IIFE）
├── data/
│   ├── biochem.js            # 生物化学（9 个知识点已填 25 维度）
│   ├── physiol.js            # 生理学（大纲 + 种子点）
│   ├── patho.js              # 病理学（大纲 + 种子点）
│   ├── internal.js           # 内科学（大纲 + 种子点）
│   └── surgery.js            # 外科学（大纲 + 种子点）
├── docs/
│   ├── superpowers/{plans,specs}/   # 设计文档骨架（空占位）
│   └── project/              # 本综述与提示词
├── .gitignore
└── README.md                 # 部署与编辑说明
```

---

## 三、数据模型（必读，AI 改数据前必须理解）

`data/<subject>.js` 结构：
```js
window.SUBJECTS = window.SUBJECTS || {};
window.SUBJECTS.biochem = {
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
            c1_concept: "……",     // 25 个维度键，见下表
            c1_keywords: "……",
            // …… 共 25 个
          }
        }
      ]
    }
  ]
};
```

**25 维度键（与 `app.js` 中 `DIMENSIONS` 完全一致，键名不可改）**

| 章 | 键 | 名称 | 类型 |
|---|---|---|---|
| 认知 | `c1_concept` `c1_keywords` `c1_principle` `c1_structure` `c1_variables` `c1_conclusion` | 核心概念/关键词/核心原理/核心结构/关键变量/核心结论 | 文本内容 |
| 应用 | `c2_condition` `c2_application` `c2_questiontype` `c2_variant` `c2_boundary` | 使用条件/典型应用/典型题型/变式问题/边界与局限 | 文本内容 |
| 错误 | `c3_error` `c3_confuse` `c3_errortype` | 易错点/易混淆/错误类型 | 文本内容 |
| 网络 | `c4_related` `c4_hook` `c4_forget` | 知识关联/记忆钩子/遗忘状态 | 文本 |
| 网络 | `c4_lastreview` `c4_nextreview` | 最近复习/下次复习 | **系统管理，不手动填**（运行时由复习状态注入） |
| 薄弱 | `c5_mastery` `c5_weak` `c5_weaksource` `c5_errfreq` `c5_impact` `c5_priority` | 掌握程度/薄弱程度/薄弱来源/错误频率/影响程度/修复优先级 | 文本或"是/否" |

注意：
- `c4_lastreview` / `c4_nextreview` 由复习评分自动写入，**数据文件里留空字符串即可**。
- `c4_forget`、`c5_*` 系列既可由种子数据预填，也可由运行时复习状态覆盖（编辑模式可改）。
- 任何维度留空 → 浏览页显示"待补充"，不报错。

---

## 四、当前进度与内容覆盖

| 科目 | 章节大纲 | 已填 25 维度知识点 | 状态 |
|---|---|---|---|
| 生物化学 | 完整（蛋白质、核酸、…占位） | 第1–2 章共 9 点（蛋白质组成/肽键/二级结构/变性、DNA双螺旋/三种RNA/限制酶等） | **较完整** |
| 生理学 | 大纲占位 | 1–2 种子点（动作电位等） | 待补 |
| 病理学 | 大纲占位 | 1–2 种子点（休克等） | 待补 |
| 内科学 | 大纲占位 | 1–2 种子点（COPD、心衰等） | 待补 |
| 外科学 | 大纲占位 | 1–2 种子点 | 待补 |

**已知瑕疵（待修）**
- `biochem.js` 中 `b1-2` 的 `c1_concept` 含笔误文字「（更正：肽键为酰胺键）」「3',5'-磷酸二酯键」——应为正确表述，需清理。
- 生化仅第 1–2 章有内容，其余章节为大纲骨架，需逐章补全。

---

## 五、部署与同步约定

- **编辑内容后发布**：电脑端编辑模式保存只写 `localStorage`；要全设备生效需「导出本学科 JSON」→ 覆盖 `data/<subject>.js` → `git add -A && git commit && git push`，GitHub Pages 自动更新。
- **手机复习**：直接访问 `https://wilkessidney.github.io/med-review/`，无需本地服务器。
- **本地预览**：`python3 -m http.server 8123 --directory "/Volumes/DevSSD/作品/临床医学考试内容"`，浏览器开 `http://127.0.0.1:8123/index.html`。

---

## 六、分场景提示词（可直接复制给 AI 继续开发）

> 通用约束（每次都带上）：
> 1. 先读 `assets/app.js` 顶部的 `GROUPS` / `DIMENSIONS`（25 维度定义）和 `data/<subject>.js` 现有结构，再动手。
> 2. **不要破坏 `file://` 兼容性**：数据一律用 `window.SUBJECTS` 全局变量 `.js` 文件，禁止引入 `fetch`/ES module/构建步骤。
> 3. 维度键名（`c1_concept` 等）与 `app.js` 必须一致，新增维度须同步改 `app.js` 的 `DIMENSIONS` 与 `GROUPS`。
> 4. 改数据用纯文本填充 25 维度，保持简洁、考点导向、贴合执业医师/考研大纲。
> 5. 改完自验：`node --check assets/app.js data/*.js` 通过；用最小 DOM 桩或浏览器验证浏览/复习/编辑三模式无异常。

### 场景 A：补全某学科某章节内容（最常见）

> **详细版见 [`prompt-fill-chapter.md`](./prompt-fill-chapter.md)** —— 含万能模板、科目/章节 id 查表、两个填好的实例。下面是简版。

```
请为本项目（医学应试复习系统，25 维度模型）补全【生物化学 · 第三章 酶】的 25 维度知识点数据。

约束：
- 数据写入 data/biochem.js，追加到 window.SUBJECTS.biochem.chapters 数组。
- 每个知识点对象格式：{ id, title, dims:{ 25 个维度键 } }，维度键名见 assets/app.js 的 DIMENSIONS。
- 覆盖考点：酶的概念与分子组成（单纯酶/结合酶/辅酶）、活性中心、酶促反应特点、米氏方程与 Km、竞争性/非竞争性抑制、酶原激活、同工酶、关键酶（限速酶）、酶的调节。
- 每个维度填考点导向的短文本（c1_concept 一句话定义，c1_keywords 列关键词，c2_questiontype 写常见考法，c3_confuse 写易混点，c4_hook 写记忆口诀）。
- 不要改已有章节，只新增。改完 node --check data/biochem.js 并通过。
```

### 场景 B：新增一个科目
```
请为系统新增科目【药理学】，按现有 5 科格式：
1. 新建 data/pharm.js，定义 window.SUBJECTS.pharm = { id:"pharm", name:"药理学", chapters:[...] }。
2. 先列出标准 syllabus 章节大纲（总论、传出神经系统药、中枢神经药、心血管药、内脏/内分泌/化疗药、抗肿瘤等），每章 1–2 个种子知识点填好 25 维度。
3. 在 index.html 的 data 引入区加一行 <script src="data/pharm.js"></script>。
4. 在 app.js 无需改（自动遍历 SUBJECTS）。但确认科目标签能出现"药理学"。
5. 自验所有 JS node --check 通过。
```

### 场景 C：新增功能（例如进度导出/导入备份）
```
请给系统加一个"复习进度导出/导入"按钮，用于手机↔电脑同步（当前进度只存各自 localStorage）。
约束：
- 在 index.html 顶栏加两个按钮"导出进度""导入进度"。
- 导出：把 localStorage 的 medreview_state_v1 打包成 .json 下载。
- 导入：选文件读入并写回 localStorage（覆盖），刷新状态徽章与侧边树徽标。
- 不能破坏 file:// 打开方式，不能用 fetch 外部资源；导入用 <input type=file> + FileReader。
- 改 assets/app.js 与 index.html、styles.css，保持现有三模式与手机端隐藏编辑的逻辑不变。
- 自验：浏览器实测导出→清空→导入→状态恢复。
```

### 场景 D：定位并修复 bug
```
系统表现：[描述现象，例如"复习模式评分后进度数字不更新"]。
请：先读 assets/app.js 相关函数（renderReview / rate / updateStat），定位根因，最小改动修复，说明改了哪几行、为什么。改完 node --check 通过，并说明如何验证。
```

### 场景 E：把已有 HTML 复习材料转成 25 维度数据
```
我有一份 HTML 复习笔记（路径 xxx.html），请将其内容抽取并转写为本系统的 25 维度知识点，写入对应 data/*.js。
约束：
- 先解析 HTML 提取各小节标题与要点。
- 按 25 维度归类：定义→c1_concept，关键词→c1_keywords，机制→c1_principle，组成→c1_structure，影响因素→c1_variables，结论→c1_conclusion，临床/考法→c2_*，易错→c3_*，联想→c4_*，掌握自评→c5_*。
- 输出为标准 { id, title, dims } 数组，追加到对应科目 chapters。
- 保留原文考点准确性，不臆造。
```

### 场景 F：整体检查与修复数据瑕疵
```
请扫描 data/*.js 全部已填知识点，检查并修复：
1. 维度键名是否与 app.js DIMENSIONS 完全一致（多了/少了/拼错）。
2. 文本中含"更正：""待改""TODO""（应为"等明显笔误或占位符，清理为正确表述。
3. 必填文本维度是否为空却本应有内容。
列出发现的问题清单 + 逐条修复，改完 node --check 通过。
```

---

## 七、给接手 AI 的一句话

"这是一个零构建静态站，数据驱动（window.SUBJECTS + 25 维度），先读 app.js 顶部的维度定义和现有 data/*.js 结构，再按场景提示词动手；永远保持 file:// 可双击打开、不引入构建步骤。"
