import type { Subject } from "../types";

/* 病理学 — 数据文件（全局变量，兼容 file:// 与 GitHub Pages） */
export const patho: Subject = {
  id: "patho",
  name: "病理学",
  chapters: [
    {
      id: "pa1",
      name: "第一章 细胞和组织的适应与损伤",
      points: [
        {
          id: "pt1-1",
          title: "萎缩、变性、坏死",
          dims: {
            c1_concept: "适应(萎缩/肥大/增生/化生)是可逆改变;损伤轻为变性、重为坏死。",
            c1_keywords: "萎缩、化生、脂肪变、玻璃样变、坏死、凋亡",
            c1_principle: "细胞在损伤因子下先适应或变性,严重则不可逆坏死。",
            c1_structure: "变性:细胞水肿、脂肪变、玻璃样变、淀粉样变等。",
            c1_variables: "损伤因子强度与持续时间、细胞耐受性。",
            c1_conclusion: "坏死标志核固缩/碎裂/溶解;凋亡为程序性死亡。",
            c2_condition: "缺血、缺氧、中毒、感染等致病因素作用时。",
            c2_application: "理解器官萎缩、脂肪肝、梗死等病变。",
            c2_questiontype: "适应性改变类型、坏死标志、凋亡特点。",
            c2_variant: "给镜下描述判断变性/坏死类型。",
            c2_boundary: "化生可逆但可恶变(如柱状上皮→鳞状)。",
            c3_error: "把凋亡当坏死;漏记坏死核改变三征。",
            c3_confuse: "变性(可逆) vs 坏死(不可逆);凋亡 vs 坏死。",
            c3_errortype: "可逆性判断错、类型混。",
            c4_related: "修复、炎症、肿瘤。",
            c4_hook: "适应四变(萎肥增生化);坏死核三征;凋亡程序死。",
            c4_forget: "易忘（类型）", c4_lastreview: "", c4_nextreview: "",
            c5_mastery: "中", c5_weak: "是", c5_weaksource: "变性类型与坏死标志混",
            c5_errfreq: "中", c5_impact: "高", c5_priority: "高"
          }
        }
      ]
    },
    {
      id: "pa2",
      name: "第二章 损伤的修复",
      points: [
        {
          id: "pt2-1",
          title: "肉芽组织与瘢痕",
          dims: {
            c1_concept: "修复由再生与纤维性修复完成;肉芽组织为修复基础。",
            c1_keywords: "肉芽组织、瘢痕、再生、一期/二期愈合",
            c1_principle: "损伤后炎性渗出→肉芽组织取代→胶原沉积瘢痕。",
            c1_structure: "肉芽组织=新生毛细血管+成纤维细胞+炎细胞。",
            c1_variables: "组织再生能力、创面条件。",
            c1_conclusion: "肉芽组织最终成熟为瘢痕。",
            c2_condition: "组织缺损后。",
            c2_application: "伤口处理、愈合评价。",
            c2_questiontype: "肉芽组织成分、一期vs二期愈合。",
            c2_variant: "问'何种创面二期愈合'→感染/大创面。",
            c2_boundary: "仍存细胞(肝、骨)可再生;心肌/神经多纤维修复。",
            c3_error: "肉芽组织成分记错(含炎细胞非仅纤维)。",
            c3_confuse: "肉芽组织 vs 肉芽肿(不同概念)。",
            c3_errortype: "成分/概念混淆。",
            c4_related: "炎症、坏死。",
            c4_hook: "肉芽=新血管+成纤维+炎细胞;终成瘢痕。",
            c4_forget: "稳定", c4_lastreview: "", c4_nextreview: "",
            c5_mastery: "中", c5_weak: "否", c5_weaksource: "",
            c5_errfreq: "低", c5_impact: "中", c5_priority: "低"
          }
        }
      ]
    },
    { id: "pa3", name: "第三章 局部血液循环障碍" },
    { id: "pa4", name: "第四章 炎症" },
    { id: "pa5", name: "第五章 肿瘤" },
    { id: "pa6", name: "第六章 心血管系统疾病" },
    { id: "pa7", name: "第七章 呼吸系统疾病" },
    { id: "pa8", name: "第八章 消化系统疾病" },
    { id: "pa9", name: "第九章 淋巴造血系统疾病" },
    { id: "pa10", name: "第十章 泌尿系统疾病" },
    { id: "pa11", name: "第十一章 生殖系统疾病" },
    { id: "pa12", name: "第十二章 内分泌系统疾病" },
    { id: "pa13", name: "第十三章 传染病和寄生虫病" }
  ]
};
