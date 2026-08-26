/* 生理学 — 数据文件（全局变量，兼容 file:// 与 GitHub Pages） */
window.SUBJECTS = window.SUBJECTS || {};
window.SUBJECTS.physiol = {
  id: "physiol",
  name: "生理学",
  chapters: [
    {
      id: "p1",
      name: "第一章 绪论",
      points: [
        {
          id: "ph1-1",
          title: "内环境稳态与调节",
          dims: {
            c1_concept: "内环境=细胞外液;稳态=内环境的理化性质相对稳定状态。",
            c1_keywords: "内环境、稳态、神经-体液-自身调节",
            c1_principle: "机体通过神经/体液/自身调节维持稳态负反馈。",
            c1_structure: "调节方式:神经(快准)、体液(慢广)、自身(局部)。",
            c1_variables: "反馈(负/正)、前馈。",
            c1_conclusion: "稳态是生命活动基础;负反馈最常见。",
            c2_condition: "机体应对内外环境变化以维持生存。",
            c2_application: "理解疾病时代偿与失代偿。",
            c2_questiontype: "内环境定义、稳态定义、调节方式比较。",
            c2_variant: "给实例判断属何种调节(如降压反射=神经负反馈)。",
            c2_boundary: "稳态是动态平衡非固定不变。",
            c3_error: "把内环境当细胞内液;混淆正负反馈。",
            c3_confuse: "内环境(细胞外液) vs 外环境;负反馈 vs 正反馈。",
            c3_errortype: "概念混淆。",
            c4_related: "各系统功能、病理生理代偿。",
            c4_hook: "内环境=细胞外液;稳态=动态平衡;负反馈为主。",
            c4_forget: "稳定", c4_lastreview: "", c4_nextreview: "",
            c5_mastery: "高", c5_weak: "否", c5_weaksource: "",
            c5_errfreq: "低", c5_impact: "高", c5_priority: "低"
          }
        }
      ]
    },
    {
      id: "p2",
      name: "第二章 细胞的基本功能",
      points: [
        {
          id: "ph2-1",
          title: "动作电位",
          dims: {
            c1_concept: "可兴奋细胞受刺激产生的可传播膜电位快速倒转与恢复。",
            c1_keywords: "去极化、Na⁺内流、K⁺外流、全或无、不应期",
            c1_principle: "阈刺激→Na⁺通道开放去极化至阈电位→再生性Na⁺内流→复极K⁺外流。",
            c1_structure: "上升支(Na⁺)、下降支(K⁺)、后电位。",
            c1_variables: "阈电位、离子通道状态、膜电阻。",
            c1_conclusion: "动作电位具'全或无'、不衰减传导;峰电位标志兴奋。",
            c2_condition: "刺激达阈值、膜去极化达阈电位。",
            c2_application: "神经传导、肌收缩、心电产生基础。",
            c2_questiontype: "产生机制(离子)、'全或无'、不应期意义。",
            c2_variant: "问'局部电位 vs 动作电位'区别(总和性 vs 全或无)。",
            c2_boundary: "局部电位可总和、衰减;动作电位不可总和。",
            c3_error: "记反Na⁺/K⁺方向;忽略阈电位。",
            c3_confuse: "局部电位 vs 动作电位;静息电位 vs 动作电位。",
            c3_errortype: "离子方向错、概念层级混。",
            c4_related: "静息电位、阈电位、兴奋-收缩耦联。",
            c4_hook: "动作电位:Na进K出,全或无,不衰减。",
            c4_forget: "易忘（离子流向）", c4_lastreview: "", c4_nextreview: "",
            c5_mastery: "中", c5_weak: "是", c5_weaksource: "Na/K流向与分期易混",
            c5_errfreq: "中", c5_impact: "高", c5_priority: "高"
          }
        }
      ]
    },
    { id: "p3", name: "第三章 血液" },
    { id: "p4", name: "第四章 血液循环" },
    { id: "p5", name: "第五章 呼吸" },
    { id: "p6", name: "第六章 消化和吸收" },
    { id: "p7", name: "第七章 能量代谢与体温" },
    { id: "p8", name: "第八章 尿的生成和排出" },
    { id: "p9", name: "第九章 感觉器官" },
    { id: "p10", name: "第十章 神经系统" },
    { id: "p11", name: "第十一章 内分泌" },
    { id: "p12", name: "第十二章 生殖" }
  ]
};
