import type { Subject } from "../types";

/* 外科学 — 数据文件（全局变量，兼容 file:// 与 GitHub Pages） */
export const surgery: Subject = {
  id: "surgery",
  name: "外科学",
  chapters: [
    {
      id: "s1",
      name: "第一章 外科总论",
      points: [
        {
          id: "su1-1",
          title: "休克",
          dims: {
            c1_concept: "有效循环血量锐减致组织灌注不足、细胞代谢紊乱的综合征。",
            c1_keywords: "低血容量、感染、暖/冷休克、CVP、补液",
            c1_principle: "微循环障碍(缺血→淤血→DIC)致组织缺氧。",
            c1_structure: "分低血容量性、感染性、心源性、过敏性、神经源性。",
            c1_variables: "血压、心率、CVP、尿量、乳酸。",
            c1_conclusion: "治疗核心:恢复灌注(补液/纠酸/血管活性药)。",
            c2_condition: "大出血、感染、创伤、过敏等。",
            c2_application: "急诊评估、液体复苏、监测CVP/尿量。",
            c2_questiontype: "分类、早期表现、补液原则、监测指标。",
            c2_variant: "问'感染性休克特点'→暖休克高排低阻(早期)。",
            c2_boundary: "休克≠单纯低血压(需灌注指标)。",
            c3_error: "只看血压忽略组织灌注(尿量/CVP)。",
            c3_confuse: "休克类型鉴别(低血容量 vs 感染性)。",
            c3_errortype: "监测指标漏判。",
            c4_related: "水电解质、输血、创伤、ICU。",
            c4_hook: "休克=灌注不足;核心补液,看尿/CVP。",
            c4_forget: "易忘（分期监测）", c4_lastreview: "", c4_nextreview: "",
            c5_mastery: "中", c5_weak: "是", c5_weaksource: "类型鉴别与监测",
            c5_errfreq: "中", c5_impact: "高", c5_priority: "高"
          }
        }
      ]
    },
    {
      id: "s2",
      name: "第二章 麻醉",
      points: [
        {
          id: "su2-1",
          title: "急性阑尾炎",
          dims: {
            c1_concept: "阑尾管腔阻塞后细菌感染致的急性炎症,外科最常见急腹症。",
            c1_keywords: "转移性右下腹痛、麦氏点、穿孔、手术",
            c1_principle: "管腔阻塞(粪石)→细菌繁殖→缺血坏死→炎症/穿孔。",
            c1_structure: "腹痛始于上腹/脐周→转移固定右下腹麦氏点。",
            c1_variables: "年龄、穿孔风险、并存病。",
            c1_conclusion: "诊断靠病史+体征;治疗以阑尾切除为主。",
            c2_condition: "任何年龄,青年多见。",
            c2_application: "急腹症鉴别、手术指征、术后并发症。",
            c2_questiontype: "典型症状(转移痛)、体征、鉴别诊断。",
            c2_variant: "问'小儿/老人表现不典型'→易穿孔/延误。",
            c2_boundary: "需与宫外孕、胃肠炎等鉴别。",
            c3_error: "忽视不典型表现(老人/孕妇)。",
            c3_confuse: "与右侧输尿管结石、宫外孕鉴别。",
            c3_errortype: "鉴别遗漏。",
            c4_related: "急腹症、感染、围手术期。",
            c4_hook: "阑尾炎:转移右下腹痛+麦氏点;切除为主。",
            c4_forget: "稳定", c4_lastreview: "", c4_nextreview: "",
            c5_mastery: "高", c5_weak: "否", c5_weaksource: "",
            c5_errfreq: "低", c5_impact: "中", c5_priority: "低"
          }
        }
      ]
    },
    { id: "s3", name: "第三章 神经外科" },
    { id: "s4", name: "第四章 胸心外科" },
    { id: "s5", name: "第五章 普通外科（甲状腺/乳腺/胃肠/肝胆/疝）" },
    { id: "s6", name: "第六章 泌尿外科" },
    { id: "s7", name: "第七章 骨科" },
    { id: "s8", name: "第八章 血管外科" }
  ]
};
