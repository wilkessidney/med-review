# 生理学第 4–6 章高频考点补全实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 为 `src/data/physiol.ts` 的第 4–6 章添加 22 个完整的 25 维度高频复习知识点。

**架构：** 仅扩展 `physiol` 的 `p4`、`p5`、`p6` 三个章节对象，并遵循既有 `Subject`、`Chapter` 和 `DimensionDims` 类型。新增内容不触碰运行时渲染、状态存储或 Vite 配置。

**技术栈：** TypeScript、Vite、Node.js 内置断言。

---

## 文件结构

- 修改：`src/data/physiol.ts` — 在 `p4`、`p5`、`p6` 添加知识点和全部 25 个维度。
- 创建：`tests/physiol-ch4-6-data.test.mjs` — 静态验证章节 ID 与规划知识点 ID 的覆盖；TypeScript 类型检查负责验证每点全部 25 个维度键。

### 任务 1：建立数据覆盖回归测试

**文件：**
- 创建：`tests/physiol-ch4-6-data.test.mjs`

- [ ] **步骤 1：编写失败的测试**

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("生理学第4至6章包含规划的高频知识点", () => {
  const source = fs.readFileSync(new URL("../src/data/physiol.ts", import.meta.url), "utf8");
  const expected = { p4: 8, p5: 7, p6: 7 };
  for (const [id, count] of Object.entries(expected)) {
    const matches = source.match(new RegExp(`id: "ph${id.slice(1)}-\\d+"`, "g")) ?? [];
    assert.equal(matches.length, count, `${id} 应有 ${count} 个知识点`);
  }
});
```

- [ ] **步骤 2：运行测试验证失败**

运行：`node --test tests/physiol-ch4-6-data.test.mjs`

预期：失败，因为 `p4`、`p5` 与 `p6` 尚未包含规划的知识点 ID。

### 任务 2：补全循环、呼吸和消化吸收数据

**文件：**
- 修改：`src/data/physiol.ts:501-503`

- [ ] **步骤 1：为 `p4` 写入 8 个知识点**

将 `{ id: "p4", name: "第四章 血液循环" }` 替换为含 `points` 数组的章节，按顺序加入 `ph4-1` 至 `ph4-8`：心肌细胞生物电、心肌收缩、心动周期、心输出量、动脉血压、微循环、静脉回流、心血管调节。每点提供 `DimensionDims` 的全部 25 个字符串键。

- [ ] **步骤 2：为 `p5` 写入 7 个知识点**

将 `{ id: "p5", name: "第五章 呼吸" }` 替换为含 `points` 数组的章节，按顺序加入 `ph5-1` 至 `ph5-7`：肺通气、肺容积与通气量、肺泡通气和换气、氧运输、二氧化碳运输、呼吸调节、缺氧。每点提供 `DimensionDims` 的全部 25 个字符串键。

- [ ] **步骤 3：为 `p6` 写入 7 个知识点**

将 `{ id: "p6", name: "第六章 消化和吸收" }` 替换为含 `points` 数组的章节，按顺序加入 `ph6-1` 至 `ph6-7`：胃肠平滑肌和调节、唾液与吞咽、胃液和胃排空、胰液与胆汁、小肠液与小肠运动、三大营养物吸收、胃肠激素。每点提供 `DimensionDims` 的全部 25 个字符串键。

- [ ] **步骤 4：运行类型检查与构建**

运行：`npm run typecheck && npm run build`

预期：两个命令均以退出码 0 结束。

- [ ] **步骤 5：运行数据回归测试**

运行：`node --test tests/physiol-ch4-6-data.test.mjs`

预期：通过，`p4`、`p5`、`p6` 的知识点数分别为 8、7、7，且每点有 25 个维度键。

- [ ] **步骤 6：Commit**

```bash
git add src/data/physiol.ts tests/physiol-ch4-6-data.test.mjs
git commit -m "feat: add physiology chapters 4-6 review content"
```
