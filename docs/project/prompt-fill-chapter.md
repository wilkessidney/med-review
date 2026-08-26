# 提示词：补全某一章节内容

> 用法：复制下面的「万能模板」，替换 3 个方括号占位，粘给 AI 即可。
> 本文档对应 **Vite + TypeScript** 版本：数据真相来源是 `src/data/*.ts`，**不再是 `data/*.js` / `window.SUBJECTS`**。

---

## 一、万能模板（复制这个）

```
请为本项目（Vite+TS 医学应试复习系统，25 维度模型）补全【[科目名] · [章节名]】的知识点数据。

上下文：
- 项目路径：/Volumes/DevSSD/作品/临床医学考试内容
- 先读 docs/project/PROJECT_BRIEF.md 了解项目，再读 src/types.ts 的 DimensionDims（25 维度键定义），
  再读 src/data/[数据文件名].ts 现有格式，然后动手。

任务：
- 目标章节已存在于 src/data/[数据文件名].ts（章节 id = "[章节id]"），当前 points 为空/不全，请填充。
- 每个知识点格式：{ id: "[点id前缀]-1", title: "…", dims: { …25 个维度键… } }
- 需覆盖的考点：[列出本章要考的知识点，或写"按执业医师/考研大纲自行拆分"]

维度填写要求（考点导向，短文本，不写长篇）：
- c1_concept 一句话定义；c1_keywords 列关键词（逗号分隔）；c1_principle 写为什么成立/机制
- c1_structure 组成或分类；c1_variables 影响因素；c1_conclusion 必须记住的结论/数值
- c2_condition 适用前提；c2_application 临床或实际应用；c2_questiontype 常见考法
- c2_variant 换个问法怎么考；c2_boundary 什么情况失效/例外
- c3_error 最易错处；c3_confuse 与什么易混（写清两者区别）；c3_errortype 错误类型归因
- c4_related 关联知识点；c4_hook 记忆口诀/钩子
- c4_forget 填"易忘/中性/稳定"之一
- c4_lastreview、c4_nextreview 一律填空字符串 ""（系统自动管理，不要手填日期）
- c5_mastery 填"低/中/高"；c5_weak 填"是/否"；c5_weaksource、c5_errfreq、c5_impact、c5_priority 按考试重要性合理预估

硬约束：
- 维度键名必须与 src/types.ts 的 DimensionDims 完全一致，不得增减或改名（写错 tsc 直接报错）。
- 只新增本章 points，不要改动其他章节和其他文件。
- 内容必须医学准确，贴合执业医师/考研大纲，不臆造。
- 改完执行 npm run typecheck 确认类型通过，并报告新增了几个知识点。
```

---

## 二、3 个占位怎么填（查表）

### 科目名 → 数据文件名 → 章节 id 规则 → 知识点 id 前缀

| 科目名 | 数据文件名 | 章节 id 规则 | 知识点 id 前缀规则 |
|---|---|---|---|
| 生物化学 | `biochem` | `ch1`…`ch16` | `b<章号>-<序号>`，如 `b3-1` |
| 生理学 | `physiol` | `p1`…`p12` | `ph<章号>-<序号>`，如 `ph3-1` |
| 病理学 | `patho` | `pa1`…`pa13` | `pt<章号>-<序号>`，如 `pt4-1` |
| 内科学 | `internal` | `i1`…`i10` | `in<章号>-<序号>`，如 `in3-1` |
| 外科学 | `surgery` | `s1`…`s8` | `su<章号>-<序号>`，如 `su5-1` |

### 现有章节清单（照抄章节名与 id，括号为已填知识点数，`空`=待补）

**生物化学 biochem（`src/data/biochem.ts`，16 章已全部有内容）**
| 章节 id | 章节名 | 状态 |
|---|---|---|
| ch1 | 第一章 蛋白质的结构与功能 | 5 |
| ch2 | 第二章 核酸的结构与功能 | 4 |
| ch3 | 第三章 酶 | 8 |
| ch4 | 第四章 糖代谢 | 6 |
| ch5 | 第五章 脂类代谢 | 5 |
| ch6 | 第六章 生物氧化 | 3 |
| ch7 | 第七章 氨基酸代谢 | 5 |
| ch8 | 第八章 核苷酸代谢 | 3 |
| ch9 | 第九章 物质代谢的联系与调节 | 3 |
| ch10 | 第十章 基因信息的传递 | 4 |
| ch11 | 第十一章 基因工程与重组DNA | 3 |
| ch12 | 第十二章 细胞信号转导 | 3 |
| ch13 | 第十三章 癌基因与抑癌基因 | 3 |
| ch14 | 第十四章 血液生化 | 4 |
| ch15 | 第十五章 肝生化 | 4 |
| ch16 | 第十六章 维生素 | 3 |

**生理学 physiol（`src/data/physiol.ts`，仅前 3 章有内容，p4–p12 为空待补）**
| p1 绪论(4) | p2 细胞的基本功能(7) | p3 血液(8) |
| p4 血液循环(**空**) | p5 呼吸(**空**) | p6 消化和吸收(**空**) |
| p7 能量代谢与体温(**空**) | p8 尿的生成和排出(**空**) | p9 感觉器官(**空**) |
| p10 神经系统(**空**) | p11 内分泌(**空**) | p12 生殖(**空**) |

**病理学 patho（`src/data/patho.ts`，pa1/pa2 各 1 点，pa3–pa5 空，pa6–pa13 已填）**
| pa1 细胞和组织的适应与损伤(1) | pa2 损伤的修复(1) | pa3 局部血液循环障碍(**空**) |
| pa4 炎症(**空**) | pa5 肿瘤(**空**) | pa6 心血管系统疾病(5) |
| pa7 呼吸系统疾病(5) | pa8 消化系统疾病(5) | pa9 淋巴造血系统疾病(5) |
| pa10 泌尿系统疾病(7) | pa11 生殖系统疾病(4) | pa12 内分泌系统疾病(4) |
| pa13 传染病和寄生虫病(5) | | |

**内科学 internal（`src/data/internal.ts`，10 章均已填）**
| i1 呼吸系统疾病(7) | i2 循环系统疾病(7) | i3 消化系统疾病(7) | i4 泌尿系统疾病(6) | i5 血液系统疾病(7) |
| i6 内分泌系统疾病(6) | i7 风湿免疫病(5) | i8 传染病(6) | i9 神经系统疾病(7) | i10 中毒(6) |

**外科学 surgery（`src/data/surgery.ts`，8 章均已填）**
| s1 外科总论(6) | s2 麻醉与围术期处理(4) | s3 神经外科(4) | s4 胸心外科(4) |
| s5 普通外科(7) | s6 泌尿外科(5) | s7 骨科(6) | s8 血管外科(6) |

---

## 三、填好的实例

### 实例 1：补生化第三章「酶」

```
请为本项目（Vite+TS 医学应试复习系统，25 维度模型）补全【生物化学 · 第三章 酶】的知识点数据。

上下文：
- 项目路径：/Volumes/DevSSD/作品/临床医学考试内容
- 先读 docs/project/PROJECT_BRIEF.md 了解项目，再读 src/types.ts 的 DimensionDims（25 维度键定义），
  再读 src/data/biochem.ts 现有格式，然后动手。

任务：
- 目标章节已存在于 src/data/biochem.ts（章节 id = "ch3"，当前 8 点），如需扩写请继续追加。
- 每个知识点格式：{ id: "b3-9", title: "…", dims: { …25 个维度键… } }
- 需覆盖的考点：酶的概念与分子组成（单纯酶/结合酶/全酶/辅酶与辅基）、酶的活性中心与必需基团、
  酶促反应特点（高效性/特异性/可调节性）、米氏方程与 Km 意义、竞争性抑制 vs 非竞争性抑制 vs 反竞争性抑制、
  影响酶促反应速度的因素（温度/pH/激活剂/抑制剂）、酶原与酶原激活、同工酶（LDH、CK）、
  关键酶（限速酶）与酶活性调节（共价修饰/别构调节）、酶在医学上的应用。

维度填写要求（考点导向，短文本，不写长篇）：
- c1_concept 一句话定义；c1_keywords 列关键词（逗号分隔）；c1_principle 写为什么成立/机制
- c1_structure 组成或分类；c1_variables 影响因素；c1_conclusion 必须记住的结论/数值
- c2_condition 适用前提；c2_application 临床或实际应用；c2_questiontype 常见考法
- c2_variant 换个问法怎么考；c2_boundary 什么情况失效/例外
- c3_error 最易错处；c3_confuse 与什么易混（写清两者区别）；c3_errortype 错误类型归因
- c4_related 关联知识点；c4_hook 记忆口诀/钩子
- c4_forget 填"易忘/中性/稳定"之一
- c4_lastreview、c4_nextreview 一律填空字符串 ""（系统自动管理，不要手填日期）
- c5_mastery 填"低/中/高"；c5_weak 填"是/否"；c5_weaksource、c5_errfreq、c5_impact、c5_priority 按考试重要性合理预估

硬约束：
- 维度键名必须与 src/types.ts 的 DimensionDims 完全一致，不得增减或改名。
- 只新增 ch3 的 points，不要改动其他章节和其他文件。
- 内容必须医学准确，贴合执业医师/考研大纲，不臆造。
- 改完执行 npm run typecheck 确认类型通过，并报告新增了几个知识点。
```

### 实例 2：补生理第四章「血液循环」（精简版，考点让 AI 自己拆）

```
请为本项目（Vite+TS 医学应试复习系统，25 维度模型）补全【生理学 · 第四章 血液循环】的知识点数据。

上下文：项目在 /Volumes/DevSSD/作品/临床医学考试内容，先读 docs/project/PROJECT_BRIEF.md 与 src/types.ts 的 DimensionDims，
再读 src/data/physiol.ts 现有格式（参照 ph1-1、ph2-1、ph3-1 的写法）。

任务：章节 id = "p4"，当前 points 为空，请按执业医师/考研大纲自行拆分本章核心考点并填充，
每点格式 { id: "ph4-1", title, dims:{25 键} }。

维度与硬约束同 docs/project/prompt-fill-chapter.md 的万能模板（考点导向短文本；
c4_lastreview/c4_nextreview 填 ""；键名不得改；只动 p4；改完 npm run typecheck）。
```

---

## 四、更省事的办法

不想填模板的话，直接跟 AI 说一句：

> 「按 `docs/project/prompt-fill-chapter.md` 的万能模板，补全**生化第三章 酶**」

或者更短：

> 「补全生化第三章」

AI 读了本文件就能自己查表定位 `src/data/biochem.ts` / `ch3` / `b3-` 并按规范填充，改完跑 `npm run typecheck`。

---

## 五、把浏览器内的编辑变成正式数据

电脑端「编辑」模式改的内容只存 `localStorage`，不会进源码。要正式发布：

1. 在编辑模式点「**导出本学科 .ts**」，浏览器下载 `<科目id>.ts`（如 `biochem.ts`）。
2. 用下载的文件**覆盖** `src/data/<科目id>.ts`。
3. `npm run typecheck` 确认无误 → `npm run build` 重新构建 → 提交 `dist/` 部署。

> 导出的 `.ts` 已自动补全所有 25 维度键（缺的填空串），可直接通过类型检查。
