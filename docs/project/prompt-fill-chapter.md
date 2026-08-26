# 提示词：补全某一章节内容

> 用法：复制下面的「万能模板」，替换 3 个方括号占位，粘给 AI 即可。

---

## 一、万能模板（复制这个）

```
请为本项目（医学应试复习系统，25 维度模型）补全【[科目名] · [章节名]】的知识点数据。

上下文：
- 项目路径：/Volumes/DevSSD/作品/临床医学考试内容
- 先读 docs/project/PROJECT_BRIEF.md 了解项目，再读 assets/app.js 顶部的 DIMENSIONS（25 维度键定义），
  再读 data/[数据文件名].js 现有格式，然后动手。

任务：
- 目标章节已存在于 data/[数据文件名].js（章节 id = "[章节id]"），当前 points 为空/不全，请填充。
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
- 维度键名必须与 app.js 的 DIMENSIONS 完全一致，不得增减或改名。
- 只新增本章 points，不要改动其他章节和其他文件。
- 保持零构建/file:// 兼容：数据仍写在 window.SUBJECTS 全局变量的 .js 文件里，禁止引入 fetch / ES module / 构建步骤。
- 内容必须医学准确，贴合执业医师/考研大纲，不臆造。
- 改完执行 node --check data/[数据文件名].js 确认语法通过，并报告新增了几个知识点。
```

---

## 二、3 个占位怎么填（查表）

### 科目名 → 数据文件名 → 知识点 id 前缀

| 科目名 | 数据文件名 | 章节 id 规则 | 知识点 id 前缀规则 |
|---|---|---|---|
| 生物化学 | `biochem` | `ch1`…`ch10` | `b<章号>-<序号>`，如 `b3-1` |
| 生理学 | `physiol` | `p1`…`p12` | `ph<章号>-<序号>`，如 `ph3-1` |
| 病理学 | `patho` | `pa1`…`pa13` | `pt<章号>-<序号>`，如 `pt4-1` |
| 内科学 | `internal` | `i1`…`i10` | `in<章号>-<序号>`，如 `in3-1` |
| 外科学 | `surgery` | `s1`…`s8` | `su<章号>-<序号>`，如 `su5-1` |

### 现有章节清单（照抄章节名与 id）

**生物化学 biochem**
| 章节 id | 章节名 | 状态 |
|---|---|---|
| ch1 | 第一章 蛋白质的结构与功能 | 已填 5 点 |
| ch2 | 第二章 核酸的结构与功能 | 已填 4 点 |
| ch3 | 第三章 酶 | **空，待补** |
| ch4 | 第四章 糖代谢 | 空 |
| ch5 | 第五章 脂类代谢 | 空 |
| ch6 | 第六章 生物氧化 | 空 |
| ch7 | 第七章 氨基酸代谢 | 空 |
| ch8 | 第八章 核苷酸代谢 | 空 |
| ch9 | 第九章 物质代谢的联系与调节 | 空 |
| ch10 | 第十章 基因信息的传递 | 空 |

**生理学 physiol**
| p1 绪论(已1点) | p2 细胞的基本功能(已1点) | p3 血液 | p4 血液循环 | p5 呼吸 | p6 消化和吸收 |
| p7 能量代谢与体温 | p8 尿的生成和排出 | p9 感觉器官 | p10 神经系统 | p11 内分泌 | p12 生殖 |

**病理学 patho**
| pa1 细胞和组织的适应与损伤(已1点) | pa2 损伤的修复(已1点) | pa3 局部血液循环障碍 | pa4 炎症 | pa5 肿瘤 |
| pa6 心血管系统疾病 | pa7 呼吸系统疾病 | pa8 消化系统疾病 | pa9 淋巴造血系统疾病 |
| pa10 泌尿系统疾病 | pa11 生殖系统疾病 | pa12 内分泌系统疾病 | pa13 传染病和寄生虫病 |

**内科学 internal**
| i1 呼吸系统疾病(已1点) | i2 循环系统疾病(已1点) | i3 消化系统疾病 | i4 泌尿系统疾病 | i5 血液系统疾病 |
| i6 内分泌系统疾病 | i7 风湿免疫病 | i8 传染病 | i9 神经系统疾病 | i10 中毒 |

**外科学 surgery**
| s1 外科总论(已1点) | s2 麻醉(已1点) | s3 神经外科 | s4 胸心外科 |
| s5 普通外科（甲状腺/乳腺/胃肠/肝胆/疝） | s6 泌尿外科 | s7 骨科 | s8 血管外科 |

---

## 三、填好的实例

### 实例 1：补生化第三章「酶」

```
请为本项目（医学应试复习系统，25 维度模型）补全【生物化学 · 第三章 酶】的知识点数据。

上下文：
- 项目路径：/Volumes/DevSSD/作品/临床医学考试内容
- 先读 docs/project/PROJECT_BRIEF.md 了解项目，再读 assets/app.js 顶部的 DIMENSIONS（25 维度键定义），
  再读 data/biochem.js 现有格式，然后动手。

任务：
- 目标章节已存在于 data/biochem.js（章节 id = "ch3"），当前 points 为空，请填充。
- 每个知识点格式：{ id: "b3-1", title: "…", dims: { …25 个维度键… } }
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
- 维度键名必须与 app.js 的 DIMENSIONS 完全一致，不得增减或改名。
- 只新增 ch3 的 points，不要改动其他章节和其他文件。
- 保持零构建/file:// 兼容：数据仍写在 window.SUBJECTS 全局变量的 .js 文件里，禁止引入 fetch / ES module / 构建步骤。
- 内容必须医学准确，贴合执业医师/考研大纲，不臆造。
- 改完执行 node --check data/biochem.js 确认语法通过，并报告新增了几个知识点。
```

### 实例 2：补生理第三章「血液」（精简版，考点让 AI 自己拆）

```
请为本项目（医学应试复习系统，25 维度模型）补全【生理学 · 第三章 血液】的知识点数据。

上下文：项目在 /Volumes/DevSSD/作品/临床医学考试内容，先读 docs/project/PROJECT_BRIEF.md 与 assets/app.js 的 DIMENSIONS，
再读 data/physiol.js 现有格式（参照 ph1-1、ph2-1 的写法）。

任务：章节 id = "p3"，points 为空，请按执业医师/考研大纲自行拆分本章核心考点并填充，
每点格式 { id: "ph3-1", title, dims:{25 键} }。

维度与硬约束同 docs/project/prompt-fill-chapter.md 的万能模板（考点导向短文本；
c4_lastreview/c4_nextreview 填 ""；键名不得改；只动 p3；保持零构建 file:// 兼容；改完 node --check data/physiol.js）。
```

---

## 四、更省事的办法

不想填模板的话，直接跟 AI 说一句：

> 「按 `docs/project/prompt-fill-chapter.md` 的万能模板，补全**生化第三章 酶**」

或者更短：

> 「补全生化第三章」

AI 读了本文件就能自己查表定位 `data/biochem.js` / `ch3` / `b3-` 并按规范填充。
