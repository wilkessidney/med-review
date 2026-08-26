# 医学应试复习系统（生化 / 生理 / 病理 / 内科 / 外科）

一个**基于 Vite + TypeScript** 的多科目交互复习网页，按 **25 维度 × 5 章** 模型组织，面向执业医师 / 研究生（西医综合）考试。

- 科目随时切换：生物化学、生理学、病理学、内科学、外科学
- 章节贴合标准学习大纲（大纲已按各科 syllabus 预置）
- 每个知识点用 25 个维度拆解：认知 / 应用 / 错误辨析 / 知识网络 / 薄弱环节
- 三种模式：**浏览**（看全部 25 维度）、**复习**（卡片 + 间隔重复）、**编辑**（电脑端增删改）
- 手机端自动隐藏「编辑」，仅做复习交互；电脑端负责主要编辑
- 复习进度与本地编辑存于 `localStorage`

---

## 一、技术栈与架构

| 项 | 说明 |
|---|---|
| 构建 | **Vite 5** + **TypeScript 5**（需 Node 18+） |
| 入口 | `index.html` → `<script type="module" src="/src/main.ts">` |
| 启动逻辑 | `src/main.ts` → `initApp(SUBJECTS)`（`src/app.ts`） |
| 核心逻辑 | `src/app.ts`（科目切换 / 25 维度渲染 / 复习调度 / 编辑导出） |
| 类型锁 | `src/types.ts` —— `DimensionDims` 把 25 个维度键**精确锁死**，写错进不了编译 |
| 数据真相来源 | `src/data/*.ts`（5 个科目模块，由 `src/data/index.ts` 汇总为 `SUBJECTS`） |
| 状态存储 | `localStorage`（`medreview_data_v1` 编辑覆盖、`medreview_state_v1` 复习状态） |
| 间隔重复 | 自研轻量调度：`again/hard/good/easy` → 更新 `reps/interval/mastery/weak/nextReview` |

> ⚠️ 旧版是「零构建静态站 + `data/*.js` + `window.SUBJECTS`」，**已废弃**。现在的真相来源是 `src/data/*.ts`，双击 `index.html` 或 `python -m http.server` 直接打开**不会加载任何数据**（未经 Vite 打包）。请一律用下面的命令。

---

## 二、本地开发 / 预览

```bash
npm install      # 安装 vite / typescript（首次）
npm run dev      # 启动开发服务器，默认 http://localhost:5173
```

改动 `src/` 任意文件会热更新，浏览器实时刷新。

---

## 三、构建与部署（GitHub Pages 自动发布）

```bash
npm run build    # tsc 类型检查 + vite 构建 → 产物在 dist/
npm run preview  # 本地预览构建产物（http://localhost:4173）
```

`vite.config.ts` 已设 `base: "./"`，构建出的 `dist/` 用**相对路径**，可直接丢到任意静态托管：

- **GitHub Pages（推荐，已自动化）**：push 到 `main` 后，GitHub Actions（`.github/workflows/deploy.yml`）自动 `npm ci → build → 上传 dist/ → 发布`。在线地址：
  > 🔗 https://wilkessidney.github.io/med-review/
- **任意静态服务器 / 对象存储 / CDN**：上传 `dist/` 整个目录，访问 `index.html`。

**首次启用 Pages（一次性）**：仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**（旧「从分支部署」方式即失效）。选好后每次 push `main` 都会自动重新部署，手机浏览器直接打开上面的地址即可复习。

> 复习进度按浏览器本地保存（`localStorage`），不跨设备同步。换设备延续进度：用顶栏「导出进度 / 导入进度」按钮备份与恢复。

---

## 四、电脑编辑 / 手机复习 分工

| 端 | 能做的 | 不能做的 |
|---|---|---|
| 电脑（浏览器） | 浏览、复习、**编辑（增删章节/知识点、填 25 维度）、导出 .ts** | — |
| 手机（浏览器） | 浏览、复习（卡片 + 评分 + 间隔重复） | 编辑（已隐藏，防误触） |

**编辑操作（电脑端，点「编辑」标签）：**
- 左侧目录选知识点 → 右侧表单填 25 个维度 →「保存（本地）」（写入 `localStorage`）。
- 「+ 知识点」「+ 章节」「删除本点」用于扩展大纲。
- 「导出本学科 .ts」：下载 `<科目id>.ts`，用它**覆盖 `src/data/<科目id>.ts`** 后提交并重新构建，改动才会进入正式站点。

**复习操作（手机/电脑，点「复习」标签）：**
- 卡片正面只显示知识点标题与「凭记忆回忆」提示，点「显示答案」看全部维度。
- 根据回忆程度点 **忘记 / 模糊 / 记住 / 熟练**，系统按间隔重复自动排定下次复习时间，并标记薄弱点。
- 顶部「待复习 / 薄弱 / 全部」切换复习范围；顶栏徽章显示待复习、薄弱数量。

---

## 五、25 维度模型

| 章 | 维度 | 说明 |
|---|---|---|
| 第一章 知识认知 | ①核心概念 ②关键词 ③核心原理 ④核心结构 ⑤关键变量 ⑥核心结论 | 是什么/为什么/靠什么 |
| 第二章 知识应用 | ⑦使用条件 ⑧典型应用 ⑨典型题型 ⑩变式问题 ⑪边界与局限 | 何时用/怎么考 |
| 第三章 错误与辨析 | ⑫易错点 ⑬易混淆 ⑭错误类型 | 易错/易混 |
| 第四章 知识网络与记忆 | ⑮知识关联 ⑯记忆钩子 ⑰遗忘状态 ⑱最近复习 ⑲下次复习 | 关联/钩子/复习调度 |
| 第五章 薄弱环节与长尾 | ⑳掌握程度 ㉑薄弱程度 ㉒薄弱来源 ㉓错误频率 ㉔影响程度 ㉕修复优先级 | 掌握/薄弱/优先级 |

⑰–⑲ 与 ⑳–㉕ 为**复习状态维度**，由复习评分自动维护（也可在编辑模式手动填写）。

---

## 六、目录结构

```
临床医学考试内容/
├── index.html              # 应用入口（引用 /src/main.ts）
├── vite.config.ts          # Vite 配置（base:"./"、构建到 dist/）
├── tsconfig.json
├── package.json            # scripts: dev / build / preview / typecheck
├── src/
│   ├── main.ts             # 入口：组装 SUBJECTS 并 initApp
│   ├── app.ts              # 全部逻辑（~900 行）
│   ├── types.ts            # 25 维度接口（DimensionDims 锁死键名）
│   ├── style.css
│   └── data/
│       ├── index.ts        # 汇总 5 科 → export const SUBJECTS
│       ├── biochem.ts      # 生物化学
│       ├── physiol.ts      # 生理学
│       ├── patho.ts        # 病理学
│       ├── internal.ts      # 内科学
│       └── surgery.ts      # 外科学
├── docs/
│   ├── project/            # 项目综述、提示词（见下）
│   └── superpowers/        # 设计文档骨架
└── dist/                   # 构建产物（gitignore，勿手改）
```

---

## 七、当前内容量（实测）

| 科目 | 章节 | 知识点 |
|---|---|---|
| 生物化学 | 16 | 66 |
| 生理学 | 12 | 19 |
| 病理学 | 13 | 42 |
| 内科学 | 10 | 64 |
| 外科学 | 8 | 42 |
| **合计** | **59** | **233** |

数据仍在持续补全中（生理、病理部分章节为大纲骨架 + 种子点）。补全方法见 `docs/project/prompt-fill-chapter.md`。

---

## 八、扩展内容

- **改数据**：直接用编辑器改 `src/data/*.ts`（有 TS 类型提示，维度键写错编译即报错），改完 `npm run build`。
- **浏览器内编辑**：电脑端「编辑」模式改的只存本地；要进正式站点，点「导出本学科 .ts」覆盖源文件再构建。
- **加新科目**：在 `src/data/` 新建 `<id>.ts`（`export const <id>: Subject = {...}`），并在 `src/data/index.ts` 加一行 import + 注册到 `SUBJECTS`。
