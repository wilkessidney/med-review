import type { Subject } from "../types";

/* 内科学 — 数据文件（全局变量，兼容 file:// 与 GitHub Pages） */
export const internal: Subject = {
  id: "internal",
  name: "内科学",
  chapters: [
    {
      id: "i1",
      name: "第一章 呼吸系统疾病",
      points: [
        {
          id: "in1-1",
          title: "慢性阻塞性肺疾病(COPD)",
          dims: {
            c1_concept: "以持续气流受限为特征的可防可治疾病,多与吸烟相关。",
            c1_keywords: "Smoking、FEV1/FVC<70%、桶状胸、肺气肿",
            c1_principle: "慢性炎症致小气道阻塞与肺泡弹性减退。",
            c1_structure: "慢性支气管炎+肺气肿;肺功能示阻塞性通气障碍。",
            c1_variables: "吸烟、α1-抗胰蛋白酶缺乏、空气污染。",
            c1_conclusion: "诊断靠肺功能(FEV1/FVC<70%);治疗戒烟+支气管舒张。",
            c2_condition: "长期吸烟/暴露于有害颗粒。",
            c2_application: "慢支、肺气肿、肺心病链;急性加重处理。",
            c2_questiontype: "诊断标准(FEV1/FVC)、危险因素、并发症(肺心病)。",
            c2_variant: "给肺功能数值判断是否阻塞性。",
            c2_boundary: "哮喘亦气流受限但可逆,需鉴别。",
            c3_error: "把COPD与哮喘混(可逆性不同)。",
            c3_confuse: "COPD vs 支气管哮喘(可逆性)。",
            c3_errortype: "疾病鉴别错。",
            c4_related: "肺心病、呼吸衰竭、吸烟。",
            c4_hook: "COPD:吸烟+FEV1/FVC<70%+持续受限。",
            c4_forget: "易忘（肺功能标准）", c4_lastreview: "", c4_nextreview: "",
            c5_mastery: "中", c5_weak: "是", c5_weaksource: "肺功能 cutoff 与哮喘鉴别",
            c5_errfreq: "中", c5_impact: "高", c5_priority: "高"
          }
        }
      ]
    },
    {
      id: "i2",
      name: "第二章 循环系统疾病",
      points: [
        {
          id: "in2-1",
          title: "慢性心力衰竭",
          dims: {
            c1_concept: "心脏泵血功能减低致组织灌注不足与淤血的临床综合征。",
            c1_keywords: "NYHA分级、BNP、射血分数、ACEI/ARB、β阻滞剂",
            c1_principle: "心肌损害→神经内分泌激活→心室重构→功能恶化。",
            c1_structure: "左心衰(肺淤血)、右心衰(体循环淤血)。",
            c1_variables: "前/后负荷、收缩/舒张功能、诱因(感染)。",
            c1_conclusion: "治疗'金三角'(ACEI/ARB+β阻+醛阻);改善预后需长期。",
            c2_condition: "心肌梗死、高血压、瓣膜病等基础心脏病。",
            c2_application: "分型、NYHA分级、药物选择、急性肺水肿抢救。",
            c2_questiontype: "NYHA分级、BNP意义、基础用药。",
            c2_variant: "问'急性左心衰首选'→呋塞米+硝普钠+吸氧。",
            c2_boundary: "舒张性心衰 EF 可正常。",
            c3_error: "急性期用β阻滞剂(应稳定后上)。",
            c3_confuse: "急性 vs 慢性心衰处理差异。",
            c3_errortype: "用药时机错。",
            c4_related: "冠心病、高血压、心律失常。",
            c4_hook: "心衰:泵衰+神经内分泌激活;金三角长期。",
            c4_forget: "易忘（分级/用药）", c4_lastreview: "", c4_nextreview: "",
            c5_mastery: "中", c5_weak: "是", c5_weaksource: "药物时机与分级",
            c5_errfreq: "高", c5_impact: "高", c5_priority: "高"
          }
        }
      ]
    },
    { id: "i3", name: "第三章 消化系统疾病" },
    { id: "i4", name: "第四章 泌尿系统疾病" },
    { id: "i5", name: "第五章 血液系统疾病" },
    { id: "i6", name: "第六章 内分泌系统疾病" },
    { id: "i7", name: "第七章 风湿免疫病" },
    { id: "i8", name: "第八章 传染病" },
    { id: "i9", name: "第九章 神经系统疾病" },
    { id: "i10", name: "第十章 中毒" }
  ]
};
