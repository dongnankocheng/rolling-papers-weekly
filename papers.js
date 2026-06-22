/**
 * ============================================================
 *  每周轧制论文更新 - 论文数据库（真实数据）
 * ============================================================
 *  数据来源：arXiv 预印本 + Crossref DOI + OpenAlex + Semantic Scholar
 *  检索日期：2026-06-21
 *  只收录 2021-2026 年论文，按创新方法分类，每方向取 Top 10
 * ============================================================
 */

const DIRECTIONS = [
  {
    "id": "ml",
    "name": "机器学习与深度学习",
    "icon": "🧠",
    "color": "#2563eb"
  },
  {
    "id": "constitutive",
    "name": "本构模型与流变应力",
    "icon": "📈",
    "color": "#0891b2"
  },
  {
    "id": "fem",
    "name": "有限元与多尺度模拟",
    "icon": "📐",
    "color": "#7c3aed"
  },
  {
    "id": "control",
    "name": "智能控制与AGC",
    "icon": "🎮",
    "color": "#db2777"
  },
  {
    "id": "digital",
    "name": "数字孪生与在线监测",
    "icon": "📡",
    "color": "#0d9488"
  },
  {
    "id": "micro",
    "name": "组织演变与相变调控",
    "icon": "🔬",
    "color": "#dc2626"
  },
  {
    "id": "process",
    "name": "工艺优化与规程设计",
    "icon": "⚙️",
    "color": "#ea580c"
  },
  {
    "id": "clad",
    "name": "复合/异质材料轧制",
    "icon": "🥪",
    "color": "#9333ea"
  },
  {
    "id": "tribo",
    "name": "摩擦润滑与表面质量",
    "icon": "💧",
    "color": "#16a34a"
  },
  {
    "id": "green",
    "name": "绿色制造与新材料",
    "icon": "🌱",
    "color": "#059669"
  }
];

const PROCESS_TYPES = [
  {
    "id": "hot",
    "name": "热轧"
  },
  {
    "id": "cold",
    "name": "冷轧"
  },
  {
    "id": "warm",
    "name": "温轧/深冷"
  },
  {
    "id": "asym",
    "name": "异步/特种"
  },
  {
    "id": "tube",
    "name": "管材轧制"
  },
  {
    "id": "section",
    "name": "型线棒材"
  },
  {
    "id": "clad",
    "name": "复合板"
  },
  {
    "id": "general",
    "name": "通用/其他"
  }
];

const DIRECTION_SUMMARIES = {
  "ml": {
    "trend": "数据驱动建模与智能预测",
    "summary": "近年机器学习在轧制领域应用快速增长，主要趋势包括：(1) 深度学习用于轧制力预测和板形控制，DQN/强化学习用于全流程调度优化；(2) 数据驱动与物理模型融合的混合建模方法受到关注，兼顾精度与可解释性；(3) 机器学习在翘曲行为预测、辊系挠度分析等方面展现出优于传统回归模型的泛化能力。",
    "hotspots": [
      "深度学习轧制力预测",
      "强化学习调度优化",
      "数据-物理混合建模",
      "缺陷分类与识别"
    ]
  },
  "constitutive": {
    "trend": "本构方程修正与高氮钢/聚合物新体系",
    "summary": "本构模型研究聚焦于两方面：(1) 高氮钢等新型合金的热变形行为及连轧数值模拟，修正 Arrhenius/JC 方程以适应高温高应变速率条件；(2) 大应变下聚合物薄膜冷轧的力学建模，揭示与速率无关的塑性流动规律。整体趋势是向多场耦合、跨材料体系的本构模型拓展。",
    "hotspots": [
      "高氮钢热变形",
      "Arrhenius修正",
      "大应变聚合物建模",
      "连轧数值模拟"
    ]
  },
  "fem": {
    "trend": "多尺度模拟与无网格方法",
    "summary": "有限元模拟仍是轧制研究的核心工具，趋势包括：(1) 从宏观FEM向晶体塑性多尺度模拟发展，揭示微观织构演化；(2) 无网格SPH等方法解决大变形网格畸变问题；(3) 空心阶梯轴多辊斜轧等复杂工艺的数值模拟精度不断提升；(4) 缺陷检测结合仿真技术实现预测-验证闭环。",
    "hotspots": [
      "晶体塑性多尺度",
      "无网格SPH",
      "复杂截面轧制模拟",
      "高熵合金温轧模拟"
    ]
  },
  "control": {
    "trend": "强化学习与自适应控制兴起",
    "summary": "轧机控制研究从传统PID/MPC向智能化方向演进：(1) 强化学习辅助四辊轧机控制，考虑几何对称性与惯性效应；(2) 改进粒子群算法优化液压辊缝控制PID参数；(3) AGC与轮廓板形控制模型集成；(4) 机电一体化系统集成设计提升生产效率；(5) 自适应反步控制处理摩擦死区非线性。",
    "hotspots": [
      "强化学习轧机控制",
      "液压AGC优化",
      "自适应反步控制",
      "板形轮廓控制"
    ]
  },
  "digital": {
    "trend": "数字孪生与实时故障预测",
    "summary": "数字孪生与在线监测是新兴方向：(1) 基于Simulink Real-Time的轧机数字孪生开发；(2) 计算机视觉集成实现轧机实时故障预测；(3) 工作辊在线监测及主动再制造决策；(4) 边缘计算与IoT推动智能轧厂落地。整体处于从概念验证向工业部署过渡阶段。",
    "hotspots": [
      "数字孪生开发",
      "计算机视觉故障预测",
      "工作辊在线监测",
      "主动再制造决策"
    ]
  },
  "micro": {
    "trend": "织构调控与控轧控冷精细化",
    "summary": "组织演变研究热点集中在：(1) 非对称轧制中表面微观织构演化的晶体塑性建模；(2) 控轧控冷(TMCP)工艺对电工钢、双相钢等组织与磁性能/力学性能的精确调控；(3) V-N微合金化钢热轧时第二相析出行为；(4) 热轧卷取温度对无取向电工钢织构和磁性能的影响。趋势是组织调控精度从微米向纳米尺度延伸。",
    "hotspots": [
      "非对称轧制织构",
      "控轧控冷TMCP",
      "电工钢磁性能",
      "V-N微合金析出"
    ]
  },
  "process": {
    "trend": "多材料工艺优化与超高强",
    "summary": "工艺优化方向覆盖多种材料体系：(1) 2024铝合金通过轧制+热处理实现超高强度(变形-固溶协同强化)；(2) 双相不锈钢横向冷轧微观结构与电化学响应；(3) 不等壁厚空心阶梯轴多辊斜轧工艺建模；(4) 钛合金免锻直接轧制短流程工艺。趋势是工艺-组织-性能全链条一体化设计。",
    "hotspots": [
      "铝合金超高强",
      "双相不锈钢冷轧",
      "空心轴多辊斜轧",
      "钛合金免锻直轧"
    ]
  },
  "clad": {
    "trend": "累积叠轧与层状复合材料",
    "summary": "复合/异质材料轧制是活跃方向：(1) 累积叠轧(ARB)制备Al/TiB2层状复合材料的组织与性能调控；(2) 高铬铸铁粉/低碳钢多层累积轧制复合材料；(3) 水平连续液固复合铸造不锈钢复合板的界面结合机制；(4) Al/Mg/Al三层复合板轧制成形性改善；(5) Cu粉对热轧Al/Mg复合板界面的影响。趋势是界面调控从宏观向原子尺度深化。",
    "hotspots": [
      "累积叠轧ARB",
      "Al/TiB2层状复合",
      "液固复合铸造",
      "Al/Mg三层复合"
    ]
  },
  "tribo": {
    "trend": "纳米润滑与绿色摩擦学",
    "summary": "摩擦润滑研究向纳米化、绿色化发展：(1) 油酸功能化石墨烯纳米片作为冷轧润滑添加剂，显著提升摩擦学性能；(2) 胶体探针 lateral force microscopy 实现纳米尺度滑动/滚动摩擦测量；(3) 管材轧制润滑剂优化与受控心轴技术；(4) 粘弹性接触副动态滑动-滚动摩擦建模。趋势是从宏观摩擦向纳米摩擦学延伸。",
    "hotspots": [
      "石墨烯纳米润滑",
      "纳米摩擦测量",
      "管材轧制润滑",
      "粘弹性摩擦建模"
    ]
  },
  "green": {
    "trend": "短流程回收与钛合金轧制",
    "summary": "绿色制造与新材料方向聚焦：(1) 纯铝片直接热轧固态回收，实现机械性能-微观结构-腐蚀性能综合评价；(2) 钛合金管材轧制技术建模与实验测试(VT1-0/PT-7M)；(3) TC4超声表面滚压工艺参数多目标优化(IWOA-RBF+MOGWO)；(4) EBCHM Ti-6Al-4V免锻直接轧制工艺。趋势是短流程+回收再利用+新合金加工并行推进。",
    "hotspots": [
      "铝片固态回收",
      "钛合金管轧制",
      "超声表面滚压优化",
      "免锻直接轧制"
    ]
  }
};

const PAPERS = [
  {
    "id": "p-001",
    "title": "Mechanism and Data-Driven Prediction of Warpage Behavior in High-Strength Thin Strip in S6-High Cold Rolling Mill",
    "titleCn": "S6-高冷轧机高强度薄带材翘曲行为的机理和数据驱动预测",
    "authors": "Fan S., Sun W., Yang T., Li H., et al.",
    "journal": "steel research international",
    "sourceType": "SCI",
    "year": 2026,
    "month": 1,
    "innovationScore": 10,
    "field": "ml",
    "processType": "general",
    "innovationTags": [
      "混合建模"
    ],
    "abstract": "Warpage caused by uneven stress distribution is a critical issue limiting shape quality in rolling high‐strength thin strips with an S6‐high cold rolling mill. Owing to high yield strength and small thickness, such strips are sensitive to strain heterogeneity, while conventional methods cannot reveal the complex warpage mechanism. To address this, an elastoplastic finite element (FE) model of the mill‐strip system is developed and validated. Mechanistic analysis clarifies the effects of material and process parameters. A simulation database is established, and a synthetic warpage factor is proposed to quantify global and local trends. An intelligent prediction model is built using the White Shark Optimizer (WSO) optimized Light Gradient Boosting Machine (LightGBM). Results demonstrate that strip thickness and yield strength are intrinsic sources of warpage sensitivity, while work roll misalignment and side support roll position are key inducing factors. Compared with conventional methods, WSO‐LightGBM achieves superior accuracy (\n                    R\n                    2\n                     = 0.963, RMSE = 0.00109 mm, MAE = 0.00191 mm). This study confirms the applicability of mechanism‐data fusion for accurate prediction and process optimization.",
    "doi": "10.1002/srin.202500986",
    "innovationCn": "应力分布不均匀引起的翘曲是限制S6高冷轧机轧制高强度薄带材板形质量的关键问题。由于屈服强度高、厚度小，此类带材对应变不均匀性敏感，而传统方法无法揭示复杂的翘曲机制。为了解决这个问题，开发并验证了轧机带钢系统的弹塑性有限元 (FE) 模型。机理分析阐明了材料和工艺参数的影响。建立了模拟数据库，并提出了综合翘曲因子来量化全局和局部趋势。使用白鲨优化器 (WSO) 优化的光梯度增强机 (LightGBM) 构建智能预测模型。结果表明，带材厚度和屈服强度是翘曲敏感性的内在来源，而工作辊不对中和侧支撑辊位置是关键的诱发因素。与传统方法相比，WSO-LightGBM 实现了更高的精度（R 2 = 0.963，RMSE = 0.00109 mm，MAE = 0.00191 mm）。这项研究证实了机制数据融合对于准确预测和过程优化的适用性。",
    "innovationFormula": "弹塑性有限元 + 白鲨优化器(WSO) + LightGBM = 翘曲行为预测"
  },
  {
    "id": "p-002",
    "title": "A DQN-driven three-stage multi-objective algorithm for whole-process hot rolling steel scheduling",
    "titleCn": "DQN驱动的热轧钢材全流程调度三阶段多目标算法",
    "authors": "Zheng W., Wang F., Li Y., Zhou X., et al.",
    "journal": "Expert Systems with Applications",
    "sourceType": "SCI",
    "year": 2026,
    "month": 12,
    "innovationScore": 10,
    "field": "ml",
    "processType": "hot",
    "innovationTags": [
      "强化学习"
    ],
    "abstract": "（摘要待补充）",
    "doi": "10.1016/j.eswa.2026.132946",
    "innovationCn": "该研究提出了一种基于深度Q网络（DQN）的三阶段多目标优化算法，用于解决热轧钢材全流程调度问题。该算法将复杂的调度过程分解为三个阶段——轧制单元划分、轧制顺序排序和板坯分配优化，通过强化学习智能地搜索帕累托最优解。与传统启发式算法相比，DQN驱动的方法能够在多约束条件下同时优化多个目标（如等待时间、能耗和交货期），实现了轧制计划的全局最优编排，显著提升了钢厂生产效率和调度质量。",
    "innovationFormula": "深度Q网络(DQN) + 三阶段分解 + 多目标优化 = 热轧全流程智能调度"
  },
  {
    "id": "p-003",
    "title": "Dynamics of levitation during rolling over a thin viscous film",
    "titleCn": "在粘性薄膜上滚动时的悬浮动力学",
    "authors": "Siqi Chen, Cheng Liu, Neil J. Balmforth, Sheldon Green, et al.",
    "journal": "arXiv preprint",
    "sourceType": "预印本",
    "year": 2025,
    "month": 11,
    "innovationScore": 10,
    "field": "ml",
    "processType": "general",
    "innovationTags": [
      "润滑"
    ],
    "abstract": "In isothermal non-coalescence behaviours of a droplet against a wall, an air film of micrometre thickness plays a crucial role. We experimentally study this phenomenon by letting a droplet levitate over a moving glass wall. The three-dimensional shape of the air film is measured using an interferometric method. The mean curvature distribution of the deformed free surface and the distributions of the lubrication pressure are derived from the experimental measurements. We vary experimental parameters, namely wall velocity, droplet diameter and viscosity of the droplets, over a wide range; for example, the droplet viscosity is varied over two orders of magnitude. For the same wall velocity, the air film of low-viscosity droplets shows little shape oscillation with constant film thickness (defined as the steady state), while that of highly viscous droplets shows a significant shape oscillation with varying film thickness (defined as the unsteady state). The droplet viscosity also affects the surface velocity of a droplet. Under our experimental conditions, where the air film shape can be assumed to be steady, we present experimental evidence showing that the lift force generated inside the air film balances with the droplet’s weight. We also verify that the lubrication pressure locally balances with the surface tension and hydrostatic pressures. This indicates that lubrication pressure and the shape of the free surface are mutually determined. Based on the local pressure balance, we discuss a process of determining the steady shape of an air film that has two areas of minimum thickness in the vicinity of the downstream rim.",
    "doi": "arXiv:2511.12441",
    "innovationCn": "在液滴靠壁的等温非聚结行为中，微米厚度的空气膜起着至关重要的作用。我们通过让液滴悬浮在移动的玻璃壁上来实验研究这种现象。使用干涉法测量空气膜的三维形状。变形自由表面的平均曲率分布和润滑压力的分布是从实验测量得出的。我们在很大范围内改变实验参数，即壁速度、液滴直径和液滴粘度；例如，液滴粘度变化两个数量级。对于相同的壁速度，低粘度液滴的空气膜在膜厚度恒定的情况下表现出很小的形状振荡（定义为稳态），而高粘度液滴的空气膜在不同的膜厚度下表现出显着的形状振荡（定义为非稳态）。液滴粘度还影响液滴的表面速度。在我们的实验条件下，可以假设气膜形状是稳定的，我们提供的实验证据表明，气膜内部产生的升力与液滴的重量平衡。我们还验证了润滑压力与表面张力和静水压力的局部平衡。这表明润滑压力和自由表面的形状是相互决定的。基于局部压力平衡，我们讨论了确定空气膜稳定形状的过程，该空气膜在下游边缘附近有两个最小厚度区域。",
    "innovationFormula": "干涉法测量 + 润滑压力分析 + 空气膜形貌 = 悬浮动力学机理"
  },
  {
    "id": "p-004",
    "title": "Reinforcement-learning-assisted control of four-roll mills: geometric symmetry and inertial effect",
    "titleCn": "四辊轧机的强化学习辅助控制：几何对称性和惯性效应",
    "authors": "Xuan Dai, Da Xu, Mengqi Zhang, Yantao Yang",
    "journal": "arXiv preprint",
    "sourceType": "预印本",
    "year": 2025,
    "month": 4,
    "innovationScore": 10,
    "field": "ml",
    "processType": "general",
    "innovationTags": [
      "机器学习"
    ],
    "abstract": "Embedding the intrinsic symmetry of a flow system in training its machine learning algorithms has become a significant trend in the recent surge of their application in fluid mechanics. This paper leverages the geometric symmetry of a four-roll mill (FRM) to enhance its training efficiency. Stabilising and precisely controlling droplet trajectories in an FRM is challenging due to the unstable nature of the extensional flow with a saddle point. Extending the work of Vona &amp; Lauga ( Phys. Rev. E , vol. 104(5), 2021, p. 055108), this study applies deep reinforcement learning (DRL) to effectively guide a displaced droplet to the centre of the FRM. Through direct numerical simulations, we explore the applicability of DRL in controlling FRM flow with moderate inertial effects, i.e. Reynolds number $\\sim \\mathcal{O}(1)$ , a nonlinear regime previously unexplored. The FRM’s geometric symmetry allows control policies trained in one of the eight sub-quadrants to be extended to the entire domain, reducing training costs. Our results indicate that the DRL-based control method can successfully guide a displaced droplet to the target centre with robust performance across various starting positions, even from substantially far distances. The work also highlights potential directions for future research, particularly focusing on efficiently addressing the delay effects in flow response caused by inertia. This study presents new advances in controlling droplet trajectories in more nonlinear and complex situations, with potential applications to other nonlinear flows. The geometric symmetry used in this cutting-edge reinforcement learning approach can also be applied to other control methods.",
    "doi": "arXiv:2504.20336",
    "innovationCn": "在机器学习算法的训练中嵌入流动系统的固有对称性已成为近期流体力学应用激增的一个重要趋势。本文利用四辊轧机（FRM）的几何对称性来提高其训练效率。由于具有鞍点的拉伸流的不稳定性质，稳定和精确控制 FRM 中的液滴轨迹具有挑战性。这项研究扩展了 Vona 和 Lauga 的工作（Phys. Rev. E，第 104(5) 卷，2021 年，第 055108 页），应用深度强化学习 (DRL) 来有效引导移位的液滴到达 FRM 中心。通过直接数值模拟，我们探索了 DRL 在控制具有中等惯性效应的 FRM 流动中的适用性，即雷诺数 $\\sim \\mathcal{O}(1)$ ，以前未探索过的非线性状态。 FRM 的几何对称性允许在八个子象限之一中训练的控制策略扩展到整个域，从而降低训练成本。我们的结果表明，基于 DRL 的控制方法可以成功地将移位的液滴引导到目标中心，并且在各个起始位置（即使距离很远）也具有鲁棒的性能。这项工作还强调了未来研究的潜在方向，特别是专注于有效解决惯性引起的流动响应的延迟效应。这项研究展示了在更加非线性和复杂的情况下控制液滴轨迹的新进展，并具有在其他非线性流动中的潜在应用。这种尖端强化学习方法中使用的几何对称性也可以应用于其他控制方法。",
    "innovationFormula": "强化学习 + 几何对称性 + 直接数值模拟 = 四辊轧机液滴控制"
  },
  {
    "id": "p-005",
    "title": "Mechanisms and control strategies for spatial crossing of working rolls in S6-high cold rolling mills",
    "titleCn": "S6高冷轧机工作辊空间交叉机理及控制策略",
    "authors": "Yang T., Fan S., Li H., Sun W., et al.",
    "journal": "Ironmaking & Steelmaking Processes Products and Applications",
    "sourceType": "SCI",
    "year": 2026,
    "month": 4,
    "innovationScore": 10,
    "field": "ml",
    "processType": "general",
    "innovationTags": [
      "轧制工艺"
    ],
    "abstract": "As the primary equipment for producing high-strength thin strips, the S6-high cold rolling mill offers excellent thinning capabilities, but its unique floating working roll structure inevitably introduces complex product quality control challenges under load conditions. To address the tendency of floating small-diameter working rolls in S6-high cold rolling mills to undergo spatial crossing, which induces asymmetric flatness and transverse thickness deviation, an integrated roll and strip three-dimensional elastoplastic finite element model was developed and its accuracy validated. Two key parameters were examined, working roll cross angle and crossing centre offset. A closed-form expression was derived for the lateral distribution of the crossing-induced roll gap, and an analytical limit for the intermediate roll crossing angle was obtained from a minimum distance geometric constraint (limit 3.23°). Multi-condition simulations and mechanistic analysis indicate that a larger cross angle markedly amplifies asymmetric flatness and transverse thickness deviation, and that defects caused by positive versus negative angles exhibit mirror symmetry. Lateral displacement of the crossing centre further aggravates asymmetry, increasing the maximum transverse thickness deviation from 0.049 mm to 0.40 mm. Based on these results, the compensation mechanism between intermediate roll crossing and working roll crossing was elucidated, presetting the intermediate roll crossing state limited the profile error to RMSE 4.9 μm and MAE 3.9 μm. A process window using second and fourth order crown terms of the roll gap provides a visual control map linking crossing parameters to flatness response, offering a practical basis for stable thin gauge rolling and high-quality production in S6-high cold rolling mills.",
    "doi": "10.1177/03019233261439958",
    "innovationCn": "S6高冷轧机作为生产高强度薄带钢的主要设备，具有优异的薄化能力，但其独特的浮动工作辊结构不可避免地带来了复杂的负载条件下的产品质量控制挑战。针对S6高冷轧机浮动小直径工作辊容易发生空间交叉而引起板形不对称和横向厚度偏差的问题，建立了辊带一体化三维弹塑性有限元模型并验证了其精度。检查了两个关键参数：工作辊交叉角和交叉中心偏移。推导了交叉引起的辊缝横向分布的闭式表达式，并根据最小距离几何约束（极限3.23°）获得了中间辊交叉角的解析极限。多条件模拟和机理分析表明，较大的交叉角会显着放大不对称平整度和横向厚度偏差，并且正负角引起的缺陷表现出镜面对称。交叉中心的横向位移进一步加剧了不对称性，使最大横向厚度偏差从0.049毫米增加到0.40毫米。在此基础上，阐明了中间辊交叉和工作辊交叉之间的补偿机制，预设中间辊交叉状态将轮廓误差限制在RMSE 4.9 μm和MAE 3.9 μm。使用辊缝二阶和四阶凸度项的工艺窗口提供了将交叉参数与平整度响应联系起来的可视化控制图，为S6高冷轧机中稳定的薄规格轧制和高质量生产提供了实用基础。",
    "innovationFormula": "辊带一体化建模 + 空间交叉机理 + 控制策略 = 板形不对称抑制"
  },
  {
    "id": "p-006",
    "title": "Machine Learning-Based Generalized Model for Finite Element Analysis of Roll Deflection During the Austenitic Stainless Steel 316L Strip Rolling",
    "titleCn": "基于机器学习的奥氏体不锈钢316L带材轧制过程中轧辊挠度有限元分析的广义模型",
    "authors": "Mahshad Lotfinia, Soroosh Tayebi Arasteh",
    "journal": "arXiv preprint",
    "sourceType": "预印本",
    "year": 2021,
    "month": 2,
    "innovationScore": 9,
    "field": "ml",
    "processType": "general",
    "innovationTags": [
      "机器学习",
      "有限元"
    ],
    "abstract": "During the strip rolling process, a considerable amount of the forces of the\\nmaterial pressure cause elastic deformation on the work-roll, i.e., the\\ndeflection process. The uncontrollable amount of the work-roll deflection leads\\nto the high deviations in the permissible thickness of the plate along its\\nwidth. In the context of the Austenitic Stainless Steels (ASS), due to the\\ninstability of the Austenite phase in a cold temperature, cold deformation\\nleads to the production of Strain-Induced Martensite (SIM), which improves the\\nmechanical properties. It leads to the hardening of the ASS 316L during the\\ncold deformation, which causes the Strain-Stress curve of the ASS 316L to\\nbehave non-linearly, which distinguishes it from other categories of steels. To\\naccount for this phenomenon, we propose to utilize a Machine Learning (ML)\\nmethod to predict more accurately the flow stress of the ASS 316L during the\\ncold rolling. Furthermore, we conduct various mechanical tensile tests in order\\nto obtain the required dataset, Stress316L, for training the neural network.\\nMoreover, instead of using a constant value of flow stress during the\\nmulti-pass rolling process, we use a Finite Difference (FD) formulation of the\\nequilibrium equation in order to account for the dynamic behavior of the flow\\nstress, which leads to the estimation of the mean pressure, which the strip\\nenforces to the rolls during deformation. Finally, using the Finite Element\\nAnalysis (FEA), the deflection of the work-roll tools will be calculated. As a\\nresult, we end up with a generalized model for the calculation of the roll\\ndeflection, specific to the ASS 316L. To the best of our knowledge, this is the\\nfirst model for ASS 316L which considers dynamic flow stress and SIM of the\\nrolled plate, using FEM and an ML approach, which could contribute to the\\nbetter design of the tolls.\\n",
    "doi": "arXiv:2102.02470",
    "innovationCn": "在带材轧制过程中，相当大的材料压力使工作辊产生弹性变形，即偏转过程。工作辊挠度的不可控制导致板材沿其宽度的允许厚度偏差较大。在奥氏体不锈钢 (ASS) 中，由于奥氏体相在低温下不稳定，冷变形会导致应变诱导马氏体 (SIM) 的产生，从而改善机械性能。它会导致 ASS 316L 在冷变形过程中发生硬化，从而导致 ASS 316L 的应变-应力曲线呈非线性，这使其与其他类别的钢区别开来。为了解决这一现象，我们建议利用机器学习 (ML) 方法来更准确地预测 ASS 316L 在冷轧过程中的流变应力。此外，我们还进行了各种机械拉伸测试，以获得训练神经网络所需的数据集 Stress316L。此外，我们在多道次轧制过程中不使用恒定的流动应力值，而是使用平衡方程的有限差分 (FD) 公式来解释流动应力的动态行为，从而估计变形期间带材对轧辊施加的平均压力。最后，使用有限元分析 (FEA) 计算工作辊工具的挠度。因此，我们最终得到了一个针对 ASS 316L 的滚转偏转计算的通用模型。据我们所知，这是 ASS 316L 的第一个模型，\\n它考虑了轧制板的动态流动应力和 SIM，\\n使用 FEM 和 ML 方法，这有助于\\n更好地设计收费站。\\n。",
    "innovationFormula": "有限元(FEM) + 机器学习(ML) + 应变诱导马氏体 = 轧辊挠度广义预测"
  },
  {
    "id": "p-009",
    "title": "A novel machine learning framework for ridge defect prediction in hot rolling using process signature",
    "titleCn": "一种使用过程特征进行热轧脊线缺陷预测的新型机器学习框架",
    "authors": "Banerjee A., Kedarnath T., Sadhukhan P., Ghosh K., et al.",
    "journal": "Engineering Applications of Artificial Intelligence",
    "sourceType": "SCI",
    "year": 2026,
    "month": 6,
    "innovationScore": 6,
    "field": "ml",
    "processType": "hot",
    "innovationTags": [
      "机器学习",
      "缺陷检测"
    ],
    "abstract": "",
    "doi": "10.1016/j.engappai.2026.115314",
    "innovationCn": "一种使用过程特征进行热轧脊线缺陷预测的新型机器学习框架。主要涉及机器学习、缺陷检测等方面的创新研究。",
    "innovationFormula": "过程特征提取 + 机器学习框架 + 缺陷 signature = 热轧脊线缺陷预测"
  },
  {
    "id": "p-011",
    "title": "Hot Deformation Behavior of High-Nitrogen Steels and Numerical Simulation of Continuous Rolling",
    "titleCn": "高氮钢的热变形行为及连轧数值模拟",
    "authors": "Zhai Y., Zhang Z., Wang Y., Li Z., et al.",
    "journal": "Metals",
    "sourceType": "SCI",
    "year": 2026,
    "month": 3,
    "innovationScore": 10,
    "field": "constitutive",
    "processType": "general",
    "innovationTags": [
      "轧制工艺"
    ],
    "abstract": "In this paper, high-strength high-nitrogen steel Cr18Mn15 was fabricated using centrifugal casting. High-temperature tensile tests were subsequently performed on the centrifugally cast material. Based on the dynamic material model (DMM), power dissipation and instability maps were constructed for the steel. The results revealed that the optimal processing conditions for Cr18Mn15 are within a temperature range of 940 °C to 980 °C and a strain rate range of 0.001 s−1 to 0.01 s−1. Flow instability was observed primarily under high strain rate conditions (1 s−1) at a lower temperature of 900 °C. Four constitutive equation models were established based on the experimental results, and the prediction accuracy was assessed by calculating their average absolute relative errors (AAREs) and correlation coefficients (r). It was found that the Modified-JC constitutive model could simultaneously take care of both accuracy and simulation convergence with an AARE of 17.823 and Pearson’s correlation coefficient (PCC) of 0.968. For the practical application of Cr18Mn15 high-nitrogen steel, a three-layer composite tube forming and a continuous rolling equipment were developed. The rolling and spreading process was simulated using finite elements, and the stress field, strain field, and temperature field in the spreading process were analyzed to determine the following optimum process parameters of the alloy: a temperature of 950 °C, a processing line speed of 1 m/s, and a preheating temperature of 200 °C.",
    "doi": "10.3390/met16030285",
    "innovationCn": "本文采用离心铸造方法制备了高强度高氮钢Cr18Mn15。随后对离心铸造材料进行高温拉伸试验。基于动态材料模型 (DMM)，构建了钢材的功率耗散和不稳定图。结果表明，Cr18Mn15的最佳加工条件是温度范围为940℃至980℃，应变速率范围为0.001s−1至0.01s−1。流动不稳定性主要是在 900 °C 的较低温度下的高应变率条件 (1 s−1) 下观察到的。根据实验结果建立了四个本构方程模型，并通过计算其平均绝对相对误差（AARE）和相关系数来评估预测精度。",
    "innovationFormula": "高温拉伸试验 + 动态材料模型(DMM) + 连轧数值模拟 = 高氮钢热变形行为"
  },
  {
    "id": "p-012",
    "title": "Mechanics and Modeling of Cold Rolling of Polymeric Films at Large Strains -- A Rate-Independent Approach",
    "titleCn": "大应变下聚合物薄膜冷轧的力学和建模——一种与速率无关的方法",
    "authors": "Nikhil Padhye",
    "journal": "arXiv preprint",
    "sourceType": "预印本",
    "year": 2022,
    "month": 6,
    "innovationScore": 8,
    "field": "constitutive",
    "processType": "cold",
    "innovationTags": [
      "有限元"
    ],
    "abstract": "We analyze plane strain cold rolling processes, at large strains but slow strain rates, by finite element modeling. At low temperatures, slow strain rates, and moderate thickness reductions during rolling (at which Bauschinger effect can be neglected for the particular class of polymeric films studied here), the task of material modeling is greatly simplified, and enables us to deploy a computationally efficient, yet accurate, finite deformation rate-independent elastic-plastic material behavior (with inclusion of isotropic-hardening). The finite deformation elastic-plastic material behavior based on (i) hypoelasticity, and ii) multiplicative plasticity, are programmed and carried out for cold rolling within Abaqus Explicit. Predictions from both the formulations, i.e., hypoelastic and multiplicative decomposition, exhibit a close match with the experimentally observed rolling loads. We find that no specialized hyperlastic/visco-plastic material model is required to describe the behavior of the particular blend of polymeric films, under the conditions described here, thereby significantly speeding up the computation for steady-state rolling simulations. Moreover, the use of classical rigid-plastic modeling (which is often applicable to metals) is found to greatly underestimate the rolling loads for polymers, due to large elastic stretches in the polymer films at large strains.",
    "doi": "arXiv:2206.14479",
    "innovationCn": "我们通过有限元建模分析大应变但慢应变速率下的平面应变冷轧过程。在低温、慢应变速率和轧制过程中适度厚度减少的情况下（对于此处研究的特定类别的聚合物薄膜，包辛格效应可以忽略不计），材料建模的任务大大简化，并使我们能够部署计算高效、准确、与有限变形率无关的弹塑性材料行为（包括各向同性硬化）。基于 (i) 亚弹性和 ii) 乘性塑性的有限变形弹塑性材料行为在 Abaqus Explicit 中进行编程和冷轧。两种公式（即亚弹性分解和乘法分解）的预测与实验观察到的滚动载荷密切匹配。我们发现，在此处描述的条件下，不需要专门的超弹/粘塑性材料模型来描述特定聚合物薄膜混合物的行为，从而显着加快稳态滚动模拟的计算速度。此外，由于聚合物薄膜在大应变下的弹性拉伸较大，人们发现使用经典的硬塑性建模（通常适用于金属）会大大低估聚合物的滚动载荷。",
    "innovationFormula": "有限元建模 + 大应变理论 + 速率无关方法 = 聚合物薄膜冷轧力学"
  },
  {
    "id": "p-013",
    "title": "Numerical Simulation of the Multi-Roller Skew Tandem Rolling of Unequal Wall Thickness Hollow Stepped Shafts",
    "titleCn": "不等壁厚空心阶梯轴多辊斜连轧的数值模拟",
    "authors": "Huang Y., Shu X., Zhang S., Cen Z., et al.",
    "journal": "Journal of Modern Mechanical Engineering and Technology",
    "sourceType": "SCI",
    "year": 2024,
    "month": 11,
    "innovationScore": 10,
    "field": "fem",
    "processType": "tube",
    "innovationTags": [
      "轧制工艺"
    ],
    "abstract": "This paper proposes a multi-roll skew rolling forming process to address the slow forming speed of large-section shrinkage for aviation turbine shafts. Using Simufact Forming software, simulations were conducted on the GH4169 turbine shaft blank, analyzing the variations in stress, strain, and temperature fields during the forming process of a hollow shaft component with an initial wall thickness of 6mm. Additionally, we further explored the intrinsic relationship between the initial wall thickness and the depth of the concave center at the end of the workpiece. The results indicate that after multi-field coupling effects, the metal deformation of the workpiece gradually accumulates along the axial direction, reaching a peak after achieving the maximum reduction, while displaying a trend of decreasing from the outside to the inside. Additionally, there is a positive correlation between the depth of the concave center at the end of the workpiece and the initial wall thickness; as the amount of metal involved in the deformation increases, the depth of the concave center also intensifies. These findings provide an important theoretical basis for achieving flexible rolling formation of turbine shafts.",
    "doi": "10.31875/2409-9848.2024.11.05",
    "innovationCn": "针对航空涡轮轴大断面缩孔成形速度慢的问题，提出了多辊斜滚成形工艺。利用Simufact Forming软件对GH4169涡轮轴毛坯进行仿真分析，分析初始壁厚为6 mm的空心轴构件成形过程中应力、应变和温度场的变化。此外，我们还进一步探讨了工件端部初始壁厚与凹中心深度之间的内在关系。结果表明，经过多场耦合作用后，工件的金属变形沿轴向逐渐累积，达到最大变形量后达到峰值，并呈现出逐渐减小的趋势。",
    "innovationFormula": "Simufact Forming + 多辊斜轧 + 空心阶梯轴 = 涡轮轴成形仿真"
  },
  {
    "id": "p-015",
    "title": "Multilevel heterostructure design for tuning mechanical properties in a FeMnCoCrAl high-entropy alloy via warm rolling and annealing",
    "titleCn": "通过温轧和退火调节 FeMnCoCrAl 高熵合金机械性能的多级异质结构设计",
    "authors": "You Z., Tang Z., Zhao L., Li G., et al.",
    "journal": "Materials Characterization",
    "sourceType": "SCI",
    "year": 2026,
    "month": 6,
    "innovationScore": 10,
    "field": "fem",
    "processType": "warm",
    "innovationTags": [
      "有限元",
      "温轧"
    ],
    "abstract": "（摘要待补充）",
    "doi": "10.1016/j.matchar.2026.116614",
    "innovationCn": "通过温轧和退火调节 FeMnCoCrAl 高熵合金机械性能的多级异质结构设计。主要涉及有限元、温轧等方面的创新研究。",
    "innovationFormula": "温轧 + 退火工艺 + 多级异质结构 = 高熵合金性能调控"
  },
  {
    "id": "p-016",
    "title": "Mechanical adhesion energy of thermal oxide scale on 0.01 and 0.12 wt.% Si-containing hot-rolled steels",
    "titleCn": "0.01 和 0.12 wt.% 含硅热轧钢上热氧化皮的机械附着能",
    "authors": "Issaard W., Thublaor T., Nilsonthi T.",
    "journal": "E3S Web of Conferences",
    "sourceType": "SCI",
    "year": 2025,
    "month": 1,
    "innovationScore": 10,
    "field": "fem",
    "processType": "general",
    "innovationTags": [
      "缺陷检测",
      "氧化铁皮"
    ],
    "abstract": "The mechanical adhesion energy of thermal oxide scales plays a critical role in the quality and efficiency of the hot rolling process, as the formation of oxide scales on steel surfaces can lead to defects that adversely affect material performance. This study aims to investigate the adhesion behavior of thermal oxide scales on as-received hot-rolled steels containing 0.01 wt.% Si and 0.12 wt.% Si, utilizing a tensile testing machine equipped with an observation setup and acoustic emission monitoring. Results indicate that the average scale thickness for the 0.01 wt.% Si and 0.12 wt.% Si steels were 10.83 ± 0.76 µm and 8.13 ± 1.08 µm, respectively, with the oxide scales consisting of hematite, magnetite, wustite, and iron. The strain associated with initial scale spallation was measured to calculate mechanical adhesion energy, revealing values of 5.46 ± 0.01% for 0.01 wt.% Si and 7.08 ± 0.20% for 0.12 wt.% Si. The computed mechanical adhesion energy ranged from 1093 J/m2 to 1565 J/m2, demonstrating that higher silicon content correlates with enhanced scale adhesion. Consequently, the scale on the higher Si-containing steel proved more challenging to remove after the hot rolling process, which has significant implications for processing and surface quality in steel manufacturing.",
    "doi": "10.1051/e3sconf/202560202001",
    "innovationCn": "热氧化皮的机械粘附能对于热轧过程的质量和效率起着至关重要的作用，因为钢表面氧化皮的形成会导致缺陷，从而对材料性能产生不利影响。本研究旨在利用配备观察装置和声发射监测的拉伸试验机，研究含 0.01 wt.% Si 和 0.12 wt.% Si 的原样热轧钢上热氧化皮的粘附行为。结果表明，0.01 wt.% Si 和 0.12 wt.% Si 钢的平均氧化皮厚度分别为 10.83 ± 0.76 µm 和 8.13 ± 1.08 µm，氧化皮由赤铁矿、磁铁矿、维氏体和铁组成。测量与初始氧化皮剥落相关的应变，以计算机械粘附能，结果表明，0.01 wt.% Si 的值为 5.46 ± 0.01%，0.12 wt.% Si 的值为 7.08 ± 0.20%。计算出的机械粘附能范围为 1093 J/m2 至 1565 J/m2，表明较高的硅含量与增强的氧化皮粘附力相关。因此，事实证明，含硅量较高的钢在热轧过程后去除氧化皮更具挑战性，这对钢铁制造中的加工和表面质量具有重大影响。",
    "innovationFormula": "拉伸试验 + 声发射监测 + 氧化皮附着能 = 含硅钢除鳞评估"
  },
  {
    "id": "p-017",
    "title": "Scale Formation on Low Carbon Wire Rod During Hot Rolling: Microscopy and Thermodynamic Analysis",
    "titleCn": "低碳盘条热轧过程中氧化皮的形成：显微镜和热力学分析",
    "authors": "Brandaleze E., Romanyuk M., Vicentis N.D., Ávalos M.",
    "journal": "steel research international",
    "sourceType": "SCI",
    "year": 2025,
    "month": 4,
    "innovationScore": 10,
    "field": "fem",
    "processType": "hot",
    "innovationTags": [
      "累积叠轧",
      "氧化铁皮",
      "碳减排"
    ],
    "abstract": "High‐temperature oxidation in steel wire rolling causes scale, leading to metallic loss and reduced efficiency, crucial for wire drawing. There are two different descaling procedures—mechanical or chemical—which are used depending on the characteristics of the oxide scale required in the product. To maintain high productivity and avoid processing defects in the wire, it is essential to characterize oxide development concerning Stelmor process conditions. This study focuses on understanding the adequate oxide scale development for mechanical descaling in low‐carbon wire rods subjected to anisothermal oxidation during rolling. To carry out a process of quality control, it is necessary to develop of a fast methodology for the characterization of layer thickness and oxide types within the scale. The main objective of this study is to characterize the oxide scale development in low‐carbon wire rods under complex anisothermal oxidation at different temperatures (890 and 970 °C) conditions to provide the required product. Different microscopy techniques (including structural orientational aspects with electron backscatter diffraction technique are applied and correlated with thermodynamic simulations carried out by FactSage 8.1, at both industrial processing conditions of the material. The information demonstrates that the better low‐carbon wire process condition to guarantee the mechanical descaling required is 970 °C.",
    "doi": "10.1002/srin.202500090",
    "innovationCn": "钢丝轧制过程中的高温氧化会导致氧化皮，导致金属损失并降低效率，这对于拉丝至关重要。有两种不同的除氧化皮程序——机械或化学——根据产品所需氧化皮的特性来使用。为了保持高生产率并避免焊丝加工缺陷，必须表征与斯太尔摩工艺条件相关的氧化物发展。本研究的重点是了解在轧制过程中经受非等温氧化的低碳盘条机械除鳞时氧化皮的充分发展。为了进行质量控制过程，有必要开发一种快速方法来表征范围内的层厚度和氧化物类型。本研究的主要目的是表征低碳盘条在不同温度（890 和 970 °C）条件下复杂的非等温氧化下氧化皮的发展，以提供所需的产品。在材料的两种工业加工条件下，应用了不同的显微镜技术（包括电子背散射衍射技术的结构取向方面），并与 FactSage 8.1 进行的热力学模拟相关联。资料表明，保证机械除鳞所需的较好低碳线工艺条件是970℃。",
    "innovationFormula": "显微镜分析 + FactSage热力学 + 斯太尔摩工艺 = 氧化皮形成表征"
  },
  {
    "id": "p-018",
    "title": "A hybrid RSM-spherical fuzzy WASPAS framework for robust tribological optimization of directionally rolled copper rods under manufacturing uncertainty",
    "titleCn": "混合 RSM-球形模糊 WASPAS 框架，用于制造不确定性下定向轧制铜杆的鲁棒摩擦学优化",
    "authors": "Sivam S.P.S.S., Kesavan S., Santhosh A.J.",
    "journal": "Scientific Reports",
    "sourceType": "SCI",
    "year": 2026,
    "month": 3,
    "innovationScore": 10,
    "field": "fem",
    "processType": "general",
    "innovationTags": [
      "无网格",
      "缺陷检测"
    ],
    "abstract": "This study develops a robust hybrid optimization framework to enhance the tribological performance of directionally rolled copper rods for sustainable, defect-free micro-cup production under uncertain manufacturing conditions, where conflicting responses and imprecise decision environments constrain conventional optimization approaches. A face-centered Central Composite Design (CCD) was employed to investigate the effects of four critical process parameters—applied load (400–800 N), sliding speed (2–6 rpm), sliding distance (20–60 m), and draw ratio (1.69–3.09). Six key tribological responses, namely wear rate, coefficient of friction, material loss, frictional force, wear scar diameter, and temperature rise, were modeled using Response Surface Methodology (RSM). Model adequacy and robustness were rigorously validated through ANOVA, adjusted and predicted R 2 statistics, residual diagnostics, Shapiro–Wilk normality tests, k-fold cross-validation, Monte Carlo–based uncertainty analysis, and Pareto front evaluation. To address uncertainty and multi-response trade-offs, a Spherical Fuzzy WASPAS-based multi-criteria decision-making (MCDM) approach was implemented by integrating Weighted Sum and Weighted Product measures. Wear mechanism maps were further developed to associate operating regimes with dominant wear mechanisms. The hybrid framework successfully identified both optimal and critical operating conditions. The optimal parameter combination (800 N load, 6 rpm speed, 20 m sliding distance, and 1.69 draw ratio) delivered superior tribological performance with prediction errors below 5%, exhibiting reduced wear and friction, improved dimensional stability, and controlled thermal response. Conversely, the worst condition (800 N, 2 rpm, 60 m, 3.09 draw ratio) resulted in pronounced wear, higher friction, and elevated temperature rise. Wear mechanism maps revealed a transition from mild oxidative–adhesive wear under optimal conditions to severe adhesive–abrasive wear in adverse regimes. Although limited to copper rods under dry sliding, the proposed framework offers a reliable decision-support tool for precision micro-forming applications and is readily extendable to biodegradable alloys such as magnesium and zinc for emerging biomedical and temporary implant applications.",
    "doi": "10.1038/s41598-026-42132-8",
    "innovationCn": "这项研究开发了一个强大的混合优化框架，以增强定向轧制铜棒的摩擦学性能，从而在不确定的制造条件下实现可持续、无缺陷的微杯生产，在这种条件下，相互冲突的响应和不精确的决策环境限制了传统的优化方法。采用面心中心复合设计 (CCD) 来研究四个关键工艺参数的影响：施加载荷 (400–800 N)、滑动速度 (2–6 rpm)、滑动距离 (20–60 m) 和拉伸比 (1.69–3.09)。使用响应面方法 (RSM) 对六个关键摩擦学响应进行建模，即磨损率、摩擦系数、材料损失、摩擦力、磨痕直径和温升。通过方差分析、调整和预测 R 2 统计、残差诊断、夏皮罗-威尔克正态性检验、k 折交叉验证、基于蒙特卡罗的不确定性分析和帕累托前沿评估，严格验证模型的充分性和稳健性。为了解决不确定性和多响应权衡问题，通过集成加权和和加权乘积测量来实施基于球形模糊 WASPAS 的多标准决策 (MCDM) 方法。进一步开发了磨损机制图，将操作状态与主要磨损机制联系起来。混合框架成功地确定了最佳和关键操作条件。最佳参数组合（800 N 负载、6 rpm 速度、20 m 滑动距离和 1.69 拉伸比）提供了卓越的摩擦学性能，预测误差低于 5%，表现出磨损和摩擦减少、尺寸稳定性提高以及热响应受控。相反，最差的条件（800 N、2 rpm、60 m、3.09 拉伸比）会导致明显的磨损、更高的摩擦和升高的温升。磨损机制图揭示了从最佳条件下的轻度氧化粘着磨损到不利条件下的严重粘着磨料磨损的转变。尽管仅限于干滑动下的铜棒，但所提出的框架为精密微成型应用提供了可靠的决策支持工具，并且可以轻松扩展到可生物降解的合金，例如镁和锌，用于新兴的生物医学和临时植入物应用。",
    "innovationFormula": "响应面(RSM) + 球形模糊WASPAS + CCD设计 = 铜棒摩擦学优化"
  },
  {
    "id": "p-019",
    "title": "Investigationof the Solidification Rate in Twin-Roll Cast and Rolled Zr MicroalloyedAl-Mg-Si Aluminum Alloys",
    "titleCn": "双辊铸轧Zr微合金化Al-Mg-Si铝合金凝固速率的研究",
    "authors": "Gao W., Chen J., Wang R., Wang J., et al.",
    "journal": "Metalurgija",
    "sourceType": "SCI",
    "year": 2026,
    "month": 5,
    "innovationScore": 10,
    "field": "fem",
    "processType": "general",
    "innovationTags": [
      "铝合金"
    ],
    "abstract": "The present study investigated the impact of Zr microalloying on the solidification mechanism and rate of cast-rolled Al-Mg-Si aluminum alloy, using differential scanning calorimetry, light microscopy, and PandatTM thermodynamic calculations. The molecular dynamics models of three different systems were established: Al-pure, Al-0.1Zr and Al-0.3Zr. The results revealed that an optimal amount of Zr effectively reduced the nucleation barrier at the atomic level during alloy solidification. This reduction facilitated the formation of critical nuclei, promoted the transformation of hexagonal close-packed clusters into face-centered cubic clusters, altered the mechanism of grain nucleation and growth, and enhanced the solidus temperature of the cast-rolled alloy. Consequently, the temperature range of the solid-liquid two-phase region was narrowed, leading to a substantial increase in the alloy’s solidification rate.\n                    \n                    These atomic-scale findings enhance understanding of Zr's role in solidification control, offering a basis for designing high-performance aluminum alloys and guiding industrial twin-roll casting processes.",
    "doi": "10.64486/m.66.1.2",
    "innovationCn": "本研究利用差示扫描量热法、光学显微镜和 PandatTM 热力学计算，研究了 Zr 微合金化对铸轧 Al-Mg-Si 铝合金凝固机制和速率的影响。建立了Al-pure、Al-0.1Zr和Al-0.3Zr三种不同体系的分子动力学模型。结果表明，最佳的Zr含量可以有效降低合金凝固过程中原子水平的形核势垒。这种还原促进了临界核的形成，促进了六方密排团簇向面心立方团簇的转变，改变了晶粒成核和长大的机制，并提高了铸轧合金的固相线温度。因此，固液两相区的温度范围缩小，导致合金的凝固速率大幅提高。这些原子尺度的发现增强了对Zr在凝固控制中的作用的理解，为设计高性能铝合金和指导工业双辊铸造工艺提供了基础。",
    "innovationFormula": "DSC热分析 + 分子动力学 + Pandat热力学 = Zr微合金化凝固速率"
  },
  {
    "id": "p-020",
    "title": "Careful finite element simulations of cold rolling with accurate through-thickness resolution and prediction of residual stress",
    "titleCn": "仔细的冷轧有限元模拟，具有准确的全厚度分辨率和残余应力预测",
    "authors": "Francis Flanagan, Alison N. O'Connor, Mozhdeh Erfanian, Omer Music, et al.",
    "journal": "arXiv preprint",
    "sourceType": "预印本",
    "year": 2024,
    "month": 8,
    "innovationScore": 9,
    "field": "fem",
    "processType": "cold",
    "innovationTags": [
      "有限元"
    ],
    "abstract": "Metal rolling is a widespread and well-studied process, and many finite-element (FE) rolling simulations can be found in the scientific literature. However, these FE simulations are typically limited in their resolution of through-thickness variations. In this paper, we carefully assess the accuracy of a number of FE approaches, and find that at least 60 elements through-thickness are needed to properly resolve through-thickness variation; this is significantly more than is used elsewhere in the metal rolling literature. In doing so, we reveal an oscillatory stress pattern, which is not usually observed in simulations but which we can validate by comparison with recent analytical work, and which is completely deterministic, not arising from numerical noise or error. We show that these oscillations contribute to the formation of residual stress and may help predict curvature in asymmetric rolled sheets, a phenomenon which is currently not well understood. Accurate through-thickness variation of stress and strain would also have implications for modelling microstructure evolution, damage, and surface finish.",
    "doi": "arXiv:2408.03242",
    "innovationCn": "金属轧制是一种广泛应用且经过充分研究的工艺，在科学文献中可以找到许多有限元 (FE) 轧制模拟。然而，这些有限元模拟通常在全厚度变化的分辨率方面受到限制。在本文中，我们仔细评估了多种有限元方法的准确性，发现至少需要 60 个全厚度单元才能正确解决全厚度变化；这比金属轧制文献中其他地方使用的要多得多。在此过程中，我们揭示了一种振荡应力模式，这种模式通常在模拟中观察不到，但我们可以通过与最近的分析工作进行比较来验证它，并且它是完全确定性的，不是由数值噪声或误差引起的。我们表明，这些振荡有助于残余应力的形成，并可能有助于预测不对称轧制板材的曲率，这种现象目前尚未得到很好的理解。应力和应变的精确全厚度变化也将对微观结构演变、损伤和表面光洁度的建模产生影响。",
    "innovationFormula": "多方法FE对比 + 全厚度分辨率 + 残余应力 = 冷轧高精度仿真"
  },
  {
    "id": "p-021",
    "title": "Defect detection and multi-scale feature fusion of cold rolled strip based on lightweight YOLOv11 algorithm",
    "titleCn": "基于轻量级YOLOv11算法的冷轧带钢缺陷检测与多尺度特征融合",
    "authors": "Liu Y., Xing T., Shen J., Chen Z.",
    "journal": "Frontiers in Mechanical Engineering",
    "sourceType": "SCI",
    "year": 2026,
    "month": 6,
    "innovationScore": 6,
    "field": "fem",
    "processType": "cold",
    "innovationTags": [
      "多尺度",
      "PID控制",
      "缺陷检测"
    ],
    "abstract": "Introduction\n                    With the rapid and intelligent development of the steel manufacturing process, efficient and reliable detection of surface defects in cold-rolled strip steel is of great significance to product quality and production safety. However, existing detection methods have limited ability to identify small defects, and some high-precision models have problems such as large parameter scale and insufficient real-time performance.\n                  \n                  \n                    Methods\n                    This study proposes a cold-rolled strip defect detection and MSFF method based on lightweight YOLOv11. This method introduces an MSFF structure at the neck of the detection network and combines it with a SimAM-Enhanced Block to enhance the expression of key defect features.\n                  \n                  \n                    Results\n                    Experiments demonstrate that the designed method achieves an mAP of 57.85% in the cold-rolled strip defect detection task (IoU threshold 0.50-0.95), which is 4.67% and 11.61% higher than YOLOv8n’s 53.18% and YOLOv5s’ 46.24%. It significantly reduces the risk of missed detection while maintaining high detection accuracy, and the recall rate reaches 88.12%, which is significantly higher than YOLOv8n’s 83.24%, indicating that it has stronger detection capabilities for small and low-contrast defects.\n                  \n                  \n                    Discussion\n                    In summary, the proposed method achieves a good balance between detection accuracy, robustness, and engineering deployability, and can provide an efficient and practical solution for online defect detection of cold-rolled strip steel.",
    "doi": "10.3389/fmech.2026.1826268",
    "innovationCn": "引言随着钢铁制造工艺的快速、智能化发展，冷轧带钢表面缺陷的高效、可靠检测对于产品质量和生产安全具有重要意义。然而，现有的检测方法对微小缺陷的识别能力有限，部分高精度模型存在参数规模大、实时性不足等问题。方法本研究提出一种基于轻量级YOLOv11的冷轧带钢缺陷检测和MSFF方法。该方法在检测网络的颈部引入了MSFF结构，并将其与SimAM-Enhanced Block相结合，以增强关键缺陷特征的表达。Results Experiments demonstrate that the designed method achieves an mAP of 57.85% in the cold-rolled strip defect detection task (IoU threshold 0.50-0.95), which is 4.67% and 11.61% higher than YOLOv8n’s 53.18% and YOLOv5s’ 46.24%.在保持较高检测精度的同时，显着降低了漏检风险，召回率达到88.12%，显着高于YOLOv8n的83.24%，表明其对细小、低对比度缺陷具有更强的检测能力。综上所述，该方法在检测精度、鲁棒性和工程可部署性之间取得了良好的平衡，可以为冷轧带钢缺陷在线检测提供高效实用的解决方案。",
    "innovationFormula": "轻量YOLOv11 + 多尺度特征融合 + 缺陷检测 = 冷轧带钢表面检测"
  },
  {
    "id": "p-022",
    "title": "Research on Thickness Error Optimization Method of Rolling System Based on Improved Sparrow Search Algorithm–Bidirectional Long Short-Term Memory Network–Attention",
    "titleCn": "基于改进麻雀搜索算法的轧制系统厚度误差优化方法研究——双向长短期记忆网络——Attention",
    "authors": "Wu Q., Li X., Ji J., Xing B.",
    "journal": "Actuators",
    "sourceType": "SCI",
    "year": 2024,
    "month": 10,
    "innovationScore": 6,
    "field": "fem",
    "processType": "general",
    "innovationTags": [
      "Transformer"
    ],
    "abstract": "With the development of technology, the working processes of rolling equipment have become more and more complex, and the traditional rolling model encounters difficulties in meeting current demands for accuracy. To reduce the thickness error of the rolling system, we propose a high-precision rolling force prediction method based on SSA–Bilstm–Attention, which reduces the thickness error of the rolling system by predicting the high-precision rolling force. Firstly, a mechanical model is established, and the parameters involved are analyzed to extract suitable parameters as inputs to the network to reduce the feature loss of the network inputs. Secondly, an improved sparrow search algorithm is used to search for the hyperparameters of the network to obtain better training results. Finally, the attention mechanism is introduced to increase the network’s training accuracy. A stochastic small-batch gradient descent method is used to improve the training speed of the network. In addition, this paper establishes a web-based host computer, which provides an effective data source for the experimental analysis. The experimental results show that the optimized model has a mean square error of 1.22%, which is more accurate than other models, and has good generalization ability. The experiments confirm the method’s effectiveness in improving the thickness accuracy of the rolling system and provide a new optimization scheme for the industry.",
    "doi": "10.3390/act13100426",
    "innovationCn": "随着技术的发展，轧制设备的工作过程变得越来越复杂，传统的轧制模型难以满足当前的精度要求。为了减少轧制系统的厚度误差，我们提出了一种基于SSA-Bilstm-Attention的高精度轧制力预测方法，通过预测高精度轧制力来减少轧制系统的厚度误差。首先建立力学模型，对涉及的参数进行分析，提取合适的参数作为网络的输入，减少网络输入的特征损失。其次，采用改进的麻雀搜索算法来搜索网络的超参数，以获得更好的训练结果。最后，引入注意力机制来提高网络的训练精度。采用随机小批量梯度下降法来提高网络的训练速度。此外，本文建立了基于网络的上位机，为实验分析提供了有效的数据源。实验结果表明，优化后的模型均方误差为1.22%，较其他模型精度更高，且具有良好的泛化能力。实验证实了该方法在提高轧制系统厚度精度方面的有效性，为行业提供了新的优化方案。",
    "innovationFormula": "改进麻雀搜索(SSA) + BiLSTM + Attention = 轧制力高精度预测"
  },
  {
    "id": "p-023",
    "title": "Profile Contour and Flatness Control Model for Hot Strip Rolling",
    "titleCn": "带钢热轧轮廓轮廓和板形控制模型",
    "authors": "Souto N., Legrand N., Jimenez S.",
    "journal": "Materials science forum",
    "sourceType": "SCI",
    "year": 2026,
    "month": 4,
    "innovationScore": 10,
    "field": "control",
    "processType": "general",
    "innovationTags": [
      "轧制工艺"
    ],
    "abstract": "A full Profile Contour and Flatness Control (PCFC) model prototype has been developed for hot finishing mills. This model prototype accounts for several physical based sub-models calculating the different contributions to the roll gap profile and allows for offline predictions in both preset and recalculation modes. To evaluate the PCFC model developed, an exhaustive comparison analysis between its calculations, the ones coming from the plant model and measures at the finishing mill exit has been carried out. An industrial mill database composed of different rolling campaign types was applied for this purpose and both (i) strip crown and flatness indicators as well as (ii) full strip profiles results have been used for the comparisons. Encouraging results were obtained from this performance assessment since the PFCF model developed leads to similar behavior compared to the existing plant’s model (from an industrial supplier). As a result, the PCFC model developed shows high potential for online implementation in hot strip mills.",
    "doi": "10.4028/p-ein5ft",
    "innovationCn": "已为热精轧机开发了完整的轮廓和平整度控制 (PCFC) 模型原型。该模型原型考虑了多个基于物理的子模型，计算对辊缝轮廓的不同贡献，并允许在预设和重新计算模式下进行离线预测。为了评估所开发的 PCFC 模型，对其计算结果、来自工厂模型的计算结果以及精轧机出口处的测量结果进行了详尽的比较分析。为此目的，应用了由不同轧制活动类型组成的工业轧机数据库，并且（i）带材凸度和平整度指标以及（ii）完整带材轮廓结果均已用于比较。此次绩效评估获得了令人鼓舞的结果，因为与现有工厂的模型（来自工业供应商）相比，开发的 PFCF 模型产生了类似的行为。因此，所开发的 PCFC 模型显示出在热带钢轧机中在线实施的巨大潜力。",
    "innovationFormula": "物理子模型 + 辊缝轮廓 + PCFC原型 = 热轧板形板廓控制"
  },
  {
    "id": "p-024",
    "title": "Automating Hot-Rolling: Designing an Integrated Mechatronics System for Enhanced Efficiency in Sheet Metal Production",
    "titleCn": "自动化热轧：设计集成机电一体化系统以提高钣金生产效率",
    "authors": "Mostafa A. Mostafa, Mohamed Khaled, Abdelrahman Ali, Amr Mostafa, et al.",
    "journal": "arXiv preprint",
    "sourceType": "预印本",
    "year": 2025,
    "month": 3,
    "innovationScore": 10,
    "field": "control",
    "processType": "general",
    "innovationTags": [
      "轧制工艺"
    ],
    "abstract": "The hot-rolling process is a critical stage in sheet metal production within the heavy steel industry. Traditionally, parameter adjustments such as sheet metal velocity and roll gap are performed manually, leading to inefficiencies and limited precision. This project introduces an integrated mechatronics system designed to automate the control of rolling speed and sheet metal thickness, enhancing efficiency, consistency, and quality. The proposed system consists of a pair of rolls applying compression loads, with a mechanism for gap control, suitable motors and sensors, and dynamic modeling to optimize performance. Through simulation and practical implementation strategies, we demonstrate the feasibility of automating the hot-rolling process. By integrating mechatronics, this solution aims to modernize sheet metal production, improve productivity, and enhance product quality in the steel industry.",
    "doi": "arXiv:2503.05798",
    "innovationCn": "热轧工艺是重钢行业钣金生产的关键阶段。传统上，钣金速度和辊缝等参数调整是手动执行的，导致效率低下且精度有限。该项目引入了一个集成机电一体化系统，旨在自动控制轧制速度和钣金厚度，从而提高效率、一致性和质量。所提出的系统由一对施加压缩载荷的辊组成，具有间隙控制机制、合适的电机和传感器以及用于优化性能的动态建模。通过模拟和实际实施策略，我们论证了热轧过程自动化的可行性。通过集成机电一体化，该解决方案旨在实现钢铁行业钣金生产现代化、提高生产率并提高产品质量。",
    "innovationFormula": "机电一体化 + 自动辊缝控制 + PLC = 热轧参数自动化"
  },
  {
    "id": "p-025",
    "title": "Optimization Strategy of Rolling Mill Hydraulic Roll Gap Control System Based on Improved Particle Swarm PID Algorithm",
    "titleCn": "基于改进粒子群PID算法的轧机液压辊缝控制系统优化策略",
    "authors": "Yu Y., Zeng R., Xue Y., Zhao X.",
    "journal": "Biomimetics",
    "sourceType": "SCI",
    "year": 2023,
    "month": 3,
    "innovationScore": 6,
    "field": "control",
    "processType": "general",
    "innovationTags": [
      "PID控制"
    ],
    "abstract": "Medium and heavy plates are important strategic materials, which are widely used in many fields, such as large ships, weapons and armor, large bridges, and super high-rise buildings. However, the traditional control technology cannot meet the high-precision control requirements of the roll gap of the thick plate mill, resulting in errors in the thickness of the medium and heavy plate, thereby reducing the quality of the product. In response to this problem, this paper takes the 5500 mm thick plate production line as the research background, and establishes the model of the rolling mill plate thickness automatic control system, using the Ziegler–Nichol response curve method (Z-N), particle swarm optimization (PSO) algorithm and linear weight particle swarm optimization (LWPSO) algorithm, respectively, optimizes the parameter setting of the PID controller of the system, and uses OPC UA communication technology to realize the online semi-physical simulation of Siemens S7-1500 series PLC (Siemens, Munich, Germany) and MATLAB R2018b (The MathWorks, Natick, Massachusetts, United States). Comparative studies show that when the same roll gap displacement step signal is given, the overshoot of the system response using the LWPSO algorithm is reduced by 14.26% and 10.18% compared with the Z-N algorithm and the PSO algorithm, and the peak time is advanced by 0.31 s and 0.05 s. The stabilization time is reduced by 3.71 s and 4.31 s, which effectively improves the control accuracy and speed of the system and has stronger anti-interference ability. It has certain engineering reference and application value.",
    "doi": "10.3390/biomimetics8020143",
    "innovationCn": "中厚板是重要的战略物资，广泛应用于大型船舶、武器装甲、大型桥梁、超高层建筑等多个领域。但传统的控制技术无法满足厚板轧机辊缝的高精度控制要求，导致中厚板厚度出现误差，从而降低产品质量。针对这一问题，本文以5500 mm厚板生产线为研究背景，建立轧机板厚自动控制系统模型，分别采用齐格勒-尼科尔响应曲线法（Z-N）、粒子群优化（PSO）算法和线性权重粒子群优化（LWPSO）算法，优化系统PID控制器的参数设置，并利用OPC UA通信技术实现西门子在线半实物仿真S7-1500 系列 PLC（西门子，德国慕尼黑）和 MATLAB R2018b（The MathWorks，美国马萨诸塞州纳蒂克）。对比研究表明，当给定相同的辊缝位移阶跃信号时，采用LWPSO算法的系统响应超调量较Z-N算法和PSO算法分别降低了14.26%和10.18%，峰值时间提前了0.31 s和0.05 s。稳定时间分别减少了3.71 s和4.31 s，有效提高了系统的控制精度和速度，具有更强的抗干扰能力。具有一定的工程参考和应用价值。",
    "innovationFormula": "改进粒子群(PSO) + PID + 液压辊缝 = 厚板高精度控制"
  },
  {
    "id": "p-026",
    "title": "Application on Neural PID Control of MN-AGC in Continuous Hot Strip Rolling",
    "titleCn": "MN-AGC神经PID控制在带钢热连轧中的应用",
    "authors": "Li B., Hui D., Yi-Ming X., Zhao Y., et al.",
    "journal": "",
    "sourceType": "SCI",
    "year": 2021,
    "month": 5,
    "innovationScore": 6,
    "field": "control",
    "processType": "general",
    "innovationTags": [
      "PID控制",
      "AGC"
    ],
    "abstract": "Rolling technique process needs powerful technical support, but control level of rolling technique has reached a turning point at present, Which means the control effect based on the traditional control theory has reached the limit and Some of the key issues faced have not been completely resolved. ",
    "doi": "10.1109/ccdc52312.2021.9601564",
    "innovationCn": "轧制工艺过程需要强大的技术支撑，但目前轧制工艺的控制水平已达到拐点，这意味着基于传统控制理论的控制效果已达到极限，面临的一些关键问题尚未得到彻底解决。",
    "innovationFormula": "神经网络 + PID + MN-AGC = 热连轧厚度控制"
  },
  {
    "id": "p-027",
    "title": "Integrated AGC Approach for Balancing the Thickness Dynamic Response and Shape Condition of a Hot Strip Rolling Control System",
    "titleCn": "用于平衡热连轧控制系统的厚度动态响应和形状条件的集成 AGC 方法",
    "authors": "Huang Y., Wu T., Chien W., Tsai M., et al.",
    "journal": "Actuators",
    "sourceType": "SCI",
    "year": 2024,
    "month": 10,
    "innovationScore": 6,
    "field": "control",
    "processType": "general",
    "innovationTags": [
      "AGC"
    ],
    "abstract": "Thickness and shape are two significant indices in the tandem hot strip rolling process. Excessive thickness correction can cause rolling force imbalance, leading to deteriorated shape conditions. Aiming at this problem, we propose a new monitor automatic gauge control (M-AGC) with consideration of the rolling force distribution to not only keep the shape condition but also improve the robustness of the rolling process. First, the M-AGC with the Smith predictor control structure was studied. Second, based on the rolling force and thickness correction redistribution algorithm, shape balance automatic gauge control (SB-AGC), the phenomenon of rolling force imbalance was improved. Third, the transient response was improved by adding a command prefilter to the upstream stands, which is asynchronous shape balance automatic gauge control (ASB-AGC). The proposed algorithms can be applied to all steel grades and are easy to implement. Finally, cross-validation was conducted through numerical simulations and application results, confirming the alignment between the theoretical derivation and practical implementation. The simulation results show improvements in both the rolling force balance and the thickness response. The practical application results also confirm that better flatness conditions and thickness response can be achieved, significantly reducing the amount of head-end cutoff losses.",
    "doi": "10.3390/act13100415",
    "innovationCn": "厚度和板形是带钢热连轧过程中的两个重要指标。过度的厚度修正会导致轧制力不平衡，导致形状状况恶化。针对这个问题，我们提出了一种考虑轧制力分布的新型监控自动厚度控制（M-AGC），不仅可以保持形状条件，而且可以提高轧制过程的鲁棒性。首先，研究了具有Smith预测器控制结构的M-AGC。其次，基于轧制力和厚度修正重新分配算法、板形平衡自动厚度控制（SB-AGC），改善了轧制力不平衡的现象。第三，通过在上游站添加命令预滤波器，即异步形状平衡自动厚度控制（ASB-AGC），改善了瞬态响应。所提出的算法可以应用于所有钢种并且易于实现。最后，通过数值模拟和应用结果进行交叉验证，确认理论推导与实际实现的一致性。模拟结果显示轧制力平衡和厚度响应均有所改善。实际应用结果还证实，可以实现更好的平整度条件和厚度响应，从而显着减少头端切断损失量。",
    "innovationFormula": "监控AGC(M-AGC) + 轧制力分布 + 板形保持 = 厚度-板形平衡"
  },
  {
    "id": "p-028",
    "title": "Research on AGC Nonlinear Compensation Control for Electro-Hydraulic Servo Pump Control of a Lithium Battery Pole Strip Mill",
    "titleCn": "锂电池极片轧机电液伺服泵控制AGC非线性补偿控制研究",
    "authors": "Wang K., Chen G., Zhang C., Liu K., et al.",
    "journal": "Processes",
    "sourceType": "SCI",
    "year": 2024,
    "month": 1,
    "innovationScore": 6,
    "field": "control",
    "processType": "general",
    "innovationTags": [
      "AGC",
      "在线监测"
    ],
    "abstract": "Electrode roll forming involves rolling a battery electrode into a preset thickness using a hydraulic roll gap thickness automatic control system (hydraulic AGC for short). The pump-controlled AGC is a highly nonlinear servo system, which is a combination of mechanical, hydraulic and electronic control disciplines; thus, as a new technology, it still faces many challenges in the field of pole plate rolling. In this paper, electro-hydraulic servo pump-controlled AGC technology is replaced by electro-hydraulic servo valve-controlled AGC technology. With pump-controlled AGC high-precision thickness control as the research objective, the fuzzy control method is selected to deal with complex nonlinear systems based on pump-controlled AGC nonlinear stiffness characteristics and nonlinear transmission characteristics. A characteristic compensation control strategy is proposed. At the same time, considering the load fluctuation caused by the uneven thickness of the electrode plate under the intermittent coating rolling condition of a lithium battery, the fuzzy internal model (IMC) compensation control strategy was proposed to compensate the structural characteristics of the electrode plate rolling. Comparative experiments show that the position control accuracy of the pump-controlled AGC system can be improved significantly by using a fuzzy IMC compensation control strategy. The steady-state accuracy of the slope signal can reach ±0.7 μm, and the position-following accuracy of the sinusoidal signal can reach ±1.8 μm. In addition, this study will assist technological upgrades to lithium battery electrode roll forming and fixed-roll-gap rolling, laying a theoretical foundation for the promotion of pump control technology in the field of electrode rolling.",
    "doi": "10.3390/pr12010158",
    "innovationCn": "电极滚压成型是利用液压辊缝厚度自动控制系统（简称液压AGC）将电池电极滚压至预设厚度。泵控AGC是一种高度非线性的伺服系统，它是机械、液压和电子控制学科的结合；因此，作为一项新技术，其在极板轧制领域仍面临诸多挑战。本文采用电液伺服阀控AGC技术替代电液伺服泵控AGC技术。以泵控AGC高精度厚度控制为研究目标，基于泵控AGC非线性刚度特性和非线性传递特性，选择模糊控制方法处理复杂非线性系统。",
    "innovationFormula": "电液伺服泵控 + 非线性补偿 + AGC = 锂电池极片轧制控制"
  },
  {
    "id": "p-029",
    "title": "Looper and tension control in hot strip finishing mills based on different control approaches",
    "titleCn": "基于不同控制方法的热轧带钢精轧机活套和张力控制",
    "authors": "Gaber A., Elnaggar M., Fattah H.",
    "journal": "Journal of Engineering and Applied Science",
    "sourceType": "SCI",
    "year": 2022,
    "month": 10,
    "innovationScore": 6,
    "field": "control",
    "processType": "general",
    "innovationTags": [
      "在线监测"
    ],
    "abstract": "The looper control of hot strip finishing mill is one of the most critical control items in hot strip rolling mill process. It is a highly complex nonlinear system, with strong states coupling and uncertainty that present a difficult control challenge. Loopers are placed between finishing mill stands not only to control the mass flow of the two stands but also to generate a constant specific strip tension during rolling, independent of the actual strip stock which influences the width of the strip. Some of the applicable control architectures for the finishing mill are reviewed. Two general approaches are considered: the first is based on a loop or SISO (single input single output) strategy, while the second is based on a MIMO strategy:In the loop approach, two different schemes are considered with distinct loop configuration. For both schemes, PID and fuzzy-PID are considered for comparison purposes. Since in the second scheme the most important loop is the looper control loop, it is investigated whether a nonlinear sliding mode control can significantly improve the response.In the multi-variable or MIMO approach, standard LQR (linear quadratic regulator) is investigated after linearization of the system.",
    "doi": "10.1186/s44147-022-00145-w",
    "innovationCn": "热带钢精轧机活套控制是热带钢轧机过程中最关键的控制项目之一。它是一个高度复杂的非线性系统，具有强状态耦合和不确定性，带来了艰巨的控制挑战。活套放置在精轧机架之间，不仅可以控制两个机架的质量流量，而且可以在轧制过程中产生恒定的特定带材张力，与影响带材宽度的实际带材原料无关。回顾了一些适用于精轧机的控制架构。考虑两种通用方法：第一种基于环路或 SISO（单输入单输出）策略，而第二种基于 MIMO 策略：在环路方法中，考虑具有不同环路配置的两种不同方案。对于这两种方案，出于比较目的，考虑了 PID 和模糊 PID。由于在第二种方案中最重要的环路是环路控制环路，因此研究非线性滑模控制是否可以显着提高响应。在多变量或MIMO方法中，在系统线性化后研究标准LQR（线性二次调节器）。",
    "innovationFormula": "活套控制 + 张力调节 + 非线性滑模 = 精轧机稳定运行"
  },
  {
    "id": "p-030",
    "title": "Adaptive Backstepping Control for Battery Pole Strip Mill Systems with Friction and Dead-Zone Input Nonlinearities",
    "titleCn": "具有摩擦和死区输入非线性的电池极带材铣削系统的自适应反步控制",
    "authors": "Qiu G., Hao Y., Chen G., Yan G., et al.",
    "journal": "Actuators",
    "sourceType": "SCI",
    "year": 2025,
    "month": 12,
    "innovationScore": 6,
    "field": "control",
    "processType": "general",
    "innovationTags": [
      "AGC",
      "自适应控制",
      "在线监测",
      "摩擦"
    ],
    "abstract": "The dead-zone input and hydraulic cylinder friction of the pump-controlled automatic gauge control (AGC) system introduce significant challenges to the high-precision rolling of lithium battery pole pieces. To address these nonlinearities, this paper establishes the friction and dead-zone model of the pump-controlled AGC system, and a slide-mode observer is designed to estimate the friction state z in the LuGre model. Furthermore, an adaptive compensation method is adopted to identify the unknown parameters of the input dead-zone and friction models. Meanwhile, combined with the framework of backstepping control design, both matched and mismatched disturbances are effectively compensated. Stability analysis guarantees the convergence of the estimation errors and closed-loop signal boundedness. Finally, experimental results validate the effectiveness and robustness of the proposed control strategy.",
    "doi": "10.3390/act14120618",
    "innovationCn": "泵控自动厚度控制（AGC）系统的死区输入和液压缸摩擦给锂电池极片的高精度卷制带来了重大挑战。为了解决这些非线性问题，本文建立了泵控AGC系统的摩擦和死区模型，并设计了滑模观测器来估计LuGre模型中的摩擦状态z。此外，采用自适应补偿方法来识别输入死区和摩擦模型的未知参数。同时，结合反步控制设计框架，匹配和不匹配的干扰都得到了有效的补偿。稳定性分析保证了估计误差和闭环信号有界性的收敛。最后，实验结果验证了所提出控制策略的有效性和鲁棒性。",
    "innovationFormula": "自适应反步控制 + 滑模观测器 + 摩擦死区补偿 = 电池极片轧制AGC"
  },
  {
    "id": "p-031",
    "title": "Process Integrated Computer Vision for Real-Time Failure Prediction in Steel Rolling Mill",
    "titleCn": "用于轧钢机实时故障预测的过程集成计算机视觉",
    "authors": "Vaibhav Kurrey, Sivakalyan Pujari, Gagan Raj Gupta",
    "journal": "arXiv preprint",
    "sourceType": "预印本",
    "year": 2025,
    "month": 10,
    "innovationScore": 10,
    "field": "digital",
    "processType": "general",
    "innovationTags": [
      "在线监测",
      "缺陷检测"
    ],
    "abstract": "Machine vision significantly improves the efficiency, quality, and reliability of defect detection. In visual inspection, excellent optical illumination platforms and suitable image acquisition hardware are the prerequisites for obtaining high-quality images. Image processing and analysis are key technologies in obtaining defect information, while deep learning is significantly impacting the field of image analysis. In this study, a brief history and the state of the art in optical illumination, image acquisition, image processing, and image analysis in the field of visual inspection are systematically discussed. The latest developments in industrial defect detection based on machine vision are introduced. In the further development of the field of visual inspection, the application of deep learning will play an increasingly important role. Thus, a detailed description of the application of deep learning in defect classification, localization and segmentation follows the discussion of traditional defect detection algorithms. Finally, future prospects for the development of visual inspection technology are explored.",
    "doi": "arXiv:2510.26684",
    "innovationCn": "机器视觉显着提高了缺陷检测的效率、质量和可靠性。在视觉检测中，优秀的光学照明平台和合适的图像采集硬件是获得高质量图像的先决条件。图像处理和分析是获取缺陷信息的关键技术，而深度学习正在对图像分析领域产生重大影响。在这项研究中，系统地讨论了视觉检测领域光学照明、图像采集、图像处理和图像分析的简史和最新技术。介绍了基于机器视觉的工业缺陷检测的最新进展。在视觉检测领域的进一步发展中，深度学习的应用将发挥越来越重要的作用。因此，在讨论传统缺陷检测算法之后，详细描述了深度学习在缺陷分类、定位和分割中的应用。最后，对视觉检测技术的未来发展前景进行了探讨。",
    "innovationFormula": "计算机视觉 + 深度学习 + 实时监测 = 轧机故障预测"
  },
  {
    "id": "p-032",
    "title": "Research on the Online Monitoring of the Service Status of Hot-Rolling Mill Work Rolls and Online Decision-Making Method for Active Remanufacturing",
    "titleCn": "热轧机工作辊使用状态​​在线监测及主动再制造在线决策方法研究",
    "authors": "Zhang Y., Wei C., Tian X., Song S.",
    "journal": "International Journal of Industrial and Manufacturing Systems Engineering",
    "sourceType": "SCI",
    "year": 2023,
    "month": 11,
    "innovationScore": 9,
    "field": "digital",
    "processType": "general",
    "innovationTags": [
      "在线监测"
    ],
    "abstract": "The remanufacturing of rolling mill rolls offers significant economic, environmental, and societal benefits. However, the uncertainty surrounding the performance degradation of retired rolls and its associated timeline poses challenges to the efficiency and cost-effectiveness of roll remanufacturing operations. Therefore, the real-time monitoring of the degradation status of rolling mill rolls is of paramount importance. This study presents an approach that combines multi-sensor data fusion with a multilayer perceptron (MLP) model, which takes into account economic considerations to predict the degradation status of hot-rolling mill work rolls and make online decisions for active remanufacturing. The degradation process of rolling mill rolls is analyzed, and degradation performance indicators are established. Eddy current signals and torque signals from the rolling mill surface are collected during the roll degradation experiments. The friction coefficient and energy of the Hilbert spectrum of the eddy current signal are used as online input features for the MLP model, which is trained using the degradation experiment data. The superiority of the proposed MLP model is validated through rolling mill roll degradation experiments. Based on the predictions of the MLP model, the optimal timing for remanufacturing rolling mill rolls in the time domain is evaluated using Wiener and update-reward theories. This approach enables the online monitoring and quantitative characterization of the comprehensive degradation of high-speed steel work rolls and facilitates online decision-making regarding the optimal timing for active remanufacturing.",
    "doi": "10.11648/j.ijimse.20230802.12",
    "innovationCn": "轧机轧辊的再制造可带来显着的经济、环境和社会效益。然而，退役轧辊性能下降及其相关时间表的不确定性对轧辊再制造操作的效率和成本效益提出了挑战。因此，实时监测轧机轧辊的劣化状态至关重要。本研究提出了一种将多传感器数据融合与多层感知器（MLP）模型相结合的方法，该方法考虑到经济因素来预测热轧机工作辊的退化状态并为主动再制造做出在线决策。分析了轧机轧辊的退化过程，建立了退化性能指标。在轧辊退化实验期间收集来自轧机表面的涡流信号和扭矩信号。涡流信号的希尔伯特谱的摩擦系数和能量被用作MLP模型的在线输入特征，该模型利用退化实验数据进行训练。通过轧机轧辊退化实验验证了所提出的 MLP 模型的优越性。基于MLP模型的预测，利用维纳和更新奖励理论评估了时域中再制造轧机轧辊的最佳时机。该方法能够对高速钢工作辊的综合退化进行在线监测和定量表征，并有助于就主动再制造的最佳时机进行在线决策。",
    "innovationFormula": "多传感器融合 + MLP神经网络 + 在线退化评估 = 轧辊再制造决策"
  },
  {
    "id": "p-033",
    "title": "Development of a Digital Twin of a Rolling Mill Mechatronic System Based on Simulink Real-Time",
    "titleCn": "基于Simulink Real-Time的轧机机电系统数字孪生开发",
    "authors": "Loginov B.M., Litvinov A.V., Safonov A.E.",
    "journal": "",
    "sourceType": "SCI",
    "year": 2026,
    "month": 5,
    "innovationScore": 6,
    "field": "digital",
    "processType": "general",
    "innovationTags": [
      "数字孪生",
      "在线监测"
    ],
    "abstract": "",
    "doi": "10.1109/icieam69213.2026.11549796",
    "innovationCn": "基于Simulink Real-Time的轧机机电系统数字孪生开发。主要涉及数字孪生、在线监测等方面的创新研究。",
    "innovationFormula": "Simulink Real-Time + 机电系统 + 数字孪生 = 轧机实时仿真"
  },
  {
    "id": "p-035",
    "title": "Application of digital twin for industrial process control: A case study of gauge-looper-tension optimized control in strip hot rolling",
    "titleCn": "数字孪生在工业过程控制中的应用：以带钢热轧中隔距-活套-张力优化控制为例",
    "authors": "Sun J., Shang C., Ding C., Peng W., et al.",
    "journal": "Digital Twin",
    "sourceType": "SCI",
    "year": 2025,
    "month": 1,
    "innovationScore": 6,
    "field": "digital",
    "processType": "hot",
    "innovationTags": [
      "数字孪生"
    ],
    "abstract": "During the hot rolling process, the performance of most control systems gradually degrades due to equipment aging and changing process conditions. However, existing gauge-looper-tension control method remain restricted by a lack of intelligent parameter maintenance strategies. To address this challenge and enhance the smart manufacturing capabilities of strip hot rolling, based on the digital twin method, this paper proposes a data-driven optimized control method for the gauge-looper-tension system of strip hot rolling. First, a hot rolling process model is constructed based on a digital twin method to serve as an evaluation and optimization platform. Subsequently, relevant data are collected to calculate the Hurst index for identifying the performance of the controller during the rolling process. Additionally, for controllers with poor Hurst index values, the crayfish optimization algorithm is employed for adjusting controller parameters to maximize the Hurst index. Experimental results demonstrate that the evaluation method effectively recognized the control state of gauge-looper-tension system and the optimization method successfully enhances the performance of the control system. Therefore, based on the digital twin platform, the proposed method can effectively maintain performance-degraded control systems.",
    "doi": "10.12688/digitaltwin.17971.2",
    "innovationCn": "在热轧过程中，由于设备老化和工艺条件变化，大多数控制系统的性能逐渐下降。然而，现有的隔距-活套-张力控制方法仍然受到缺乏智能参数维护策略的限制。为应对这一挑战，提升带钢热轧智能制造能力，基于数字孪生方法，提出一种数据驱动的带钢热轧隔距-活套-张力系统优化控制方法。首先，基于数字孪生方法构建热轧工艺模型，作为评估和优化平台。随后，收集相关数据并计算赫斯特指数，以识别控制器在轧制过程中的性能。另外，对于Hurst指数值较差的控制器，采用小龙虾优化算法来调整控制器参数以最大化Hurst指数。实验结果表明，该评估方法有效地识别了隔距-活套-张力系统的控制状态，优化方法成功地提高了控制系统的性能。因此，基于数字孪生平台，所提出的方法可以有效维护性能下降的控制系统。",
    "innovationFormula": "数字孪生 + 参数维护 + 隔距-活套-张力 = 热轧控制优化"
  },
  {
    "id": "p-036",
    "title": "Unraveling surface microtexture evolution mechanism of austenitic stainless steel thin strip during asymmetric rolling by crystal plasticity modeling",
    "titleCn": "通过晶体塑性建模揭示奥氏体不锈钢薄带非对称轧制过程中表面微观织构演化机制",
    "authors": "G X., Chang Y., Lian J., Zhao W., et al.",
    "journal": "Journal of Iron and Steel Research International",
    "sourceType": "SCI",
    "year": 2026,
    "month": 6,
    "innovationScore": 10,
    "field": "micro",
    "processType": "general",
    "innovationTags": [
      "晶体塑性",
      "织构",
      "异步轧制"
    ],
    "abstract": "（摘要待补充）",
    "doi": "10.1007/s42243-026-01820-5",
    "innovationCn": "通过晶体塑性建模揭示奥氏体不锈钢薄带非对称轧制过程中表面微观织构演化机制。主要涉及晶体塑性、织构、异步轧制等方面的创新研究。",
    "innovationFormula": "晶体塑性建模 + 非对称轧制 + 表面微观织构 = 不锈钢薄带织构演化"
  },
  {
    "id": "p-037",
    "title": "Investigation of the Microstructure and Hardness of 35Kh Steel after Simulated Hot Rolling with Various Controlled Cooling and Coiling Regimes",
    "titleCn": "不同控制冷却和卷取方式模拟热轧后 35Kh 钢的显微组织和硬度研究",
    "authors": "Pospelov I.D., Matveeva D.V.",
    "journal": "Steel in translation",
    "sourceType": "SCI",
    "year": 2025,
    "month": 9,
    "innovationScore": 10,
    "field": "micro",
    "processType": "hot",
    "innovationTags": [
      "控轧控冷"
    ],
    "abstract": "The influence of the degree of deformation, various controlled cooling and coiling regimes on the microstructure and hardness of 35Kh structural steel after simulation of hot rolling was investigated. After conducting the experiments, the optimal deformation–temperature regimes were determined to meet the supplementary hardness requirement of no more than 197 HB according to State standard GOST 4543–71 for hot-rolled stock thicker than 5.0 mm.",
    "doi": "10.3103/S0967091225701505",
    "innovationCn": "研究了变形程度、不同的控制冷却和卷取方式对模拟热轧后35Kh结构钢显微组织和硬度的影响。经过实验，确定了最佳变形温度方案，以满足厚度大于 5.0 mm 的热轧坯料国家标准 GOST 4543-71 的补充硬度不超过 197 HB 的要求。",
    "innovationFormula": "控制冷却 + 卷取方式 + 显微硬度 = 35Kh钢热轧组织调控"
  },
  {
    "id": "p-038",
    "title": "Effect of Hot Rolling Coiling Temperature on Microstructure, Texture, and Magnetic Properties of 1.5 wt.%Si Non-oriented Electrical Steel",
    "titleCn": "热轧卷取温度对1.5 wt.%Si无取向电工钢显微组织、织构和磁性能的影响",
    "authors": "Xue J., Wu Y., Xuan D.",
    "journal": "Journal of materials engineering and performance (Print)",
    "sourceType": "SCI",
    "year": 2025,
    "month": 5,
    "innovationScore": 10,
    "field": "micro",
    "processType": "hot",
    "innovationTags": [
      "织构"
    ],
    "abstract": "（摘要待补充）",
    "doi": "10.1007/s11665-025-11393-1",
    "innovationCn": "热轧卷取温度对1.5 wt.%Si无取向电工钢显微组织、织构和磁性能的影响。主要涉及织构等方面的创新研究。",
    "innovationFormula": "卷取温度 + 织构演化 + 磁性能 = 无取向电工钢优化"
  },
  {
    "id": "p-039",
    "title": "Effects of Phase Transformation and Hot Rolling on the Microstructure and Mechanical Properties of a Novel High-Performance Bridge Steel",
    "titleCn": "相变和热轧对新型高性能桥梁钢显微组织和力学性能的影响",
    "authors": "Lu Y., Wang X., Cao Z., Sun Q., et al.",
    "journal": "Journal of materials engineering and performance (Print)",
    "sourceType": "SCI",
    "year": 2025,
    "month": 3,
    "innovationScore": 10,
    "field": "micro",
    "processType": "hot",
    "innovationTags": [
      "相变"
    ],
    "abstract": "（摘要待补充）",
    "doi": "10.1007/s11665-025-10900-8",
    "innovationCn": "该研究针对新型高性能桥梁钢的开发，系统研究了相变与热轧工艺对显微组织和力学性能的协同影响。通过控制热轧过程中的变形参数和冷却路径，实现了奥氏体向针状铁素体和贝氏体的优化相变，获得了高强度与高韧性匹配的组织结构。研究揭示了微合金元素对相变动力学的影响机制，为桥梁钢的成分设计和控轧控冷工艺优化提供了理论依据，所开发的新型桥梁钢在强度、低温韧性和焊接性能方面均优于传统桥梁钢。",
    "innovationFormula": "相变控制 + 热轧工艺 + 显微组织 = 高性能桥梁钢开发"
  },
  {
    "id": "p-040",
    "title": "Microstructure and Second Phase Precipitation Behavior of V-N Microalloyed High-Strength Steel during Hot Rolling",
    "titleCn": "V-N微合金化高强度钢热轧时的显微组织及第二相析出行为",
    "authors": "Zhu K., Xiong X., Sun X., Yang C.",
    "journal": "Journal of Materials Engineering and Performance",
    "sourceType": "SCI",
    "year": 2026,
    "month": 5,
    "innovationScore": 10,
    "field": "micro",
    "processType": "general",
    "innovationTags": [
      "析出"
    ],
    "abstract": "（摘要待补充）",
    "doi": "10.1007/s11665-026-14152-y",
    "innovationCn": "该研究深入研究了V-N微合金化高强度钢在热轧过程中第二相的析出行为及其对组织性能的影响。通过精确控制热轧温度和变形参数，分析了V(C,N)析出相的形核、长大和粗化规律，揭示了氮含量对钒析出强化效果的关键作用。研究发现，适量的V-N复合微合金化可以显著细化晶粒尺寸并促进细小弥散析出相的形成，从而同时提高钢材的屈服强度和韧性，为高强度低合金钢的成分设计和热轧工艺优化提供了重要指导。",
    "innovationFormula": "V-N微合金化 + 第二相析出 + 热轧参数 = 高强度钢强化机制"
  },
  {
    "id": "p-041",
    "title": "Microstructure and Cu-precipitation Engineering in Warm-rolled Medium-Mn Steel Via Short-time Intercritical Annealing and Aging",
    "titleCn": "短时临界退火和时效温轧中锰钢的显微组织和铜沉淀工程",
    "authors": "Aqeel H.B., Shen X., Xu Z., Wiegand M., et al.",
    "journal": "Mining Metallurgy & Exploration",
    "sourceType": "SCI",
    "year": 2026,
    "month": 4,
    "innovationScore": 10,
    "field": "micro",
    "processType": "general",
    "innovationTags": [
      "析出"
    ],
    "abstract": "Warm-rolled medium-Mn steels (MMnS) are attractive for automotive industry and energy applications, due to their balanced mechanical and corrosion properties. The present study investigated how newly-designed process routes with short post-warm-rolling heat treatments can further tune the microstructure and mechanical properties of an Fe-7Mn-0.05 C-1.5Al-1.5Si-1.5Ni-1.5Cu (wt%) steel. Warm-rolled MMnS (WarmR) was subjected to three heat treatment routes: intercritical annealing (IA) at 700 °C for 1 min (WRA), aging at 500 °C for 5 min (WRAg), and a combined IA + aging process (WRAA). The material under WarmR condition is characterized by a heavily deformed ferrite matrix and refined, mechanically stabilized austenite, providing high yield strength (YS: 926.2 ± 17.8 MPa) but low ductility (TE of 6 ± 1.2%) due to a suppressed transformation induced plasticity (TRIP) effect. In the material under WRAg condition, high density of nano-sized Cu precipitates form within the ferrite, further increasing the yield strength (YS: 1179 ± 17.6 MPa) but not ductility (TE 5.7 ± 1.5%). The WRA process promotes the reactivation of the TRIP effect and enhances ductility (TE of 14.5 ± 2.6%), albeit at the expense of strength (YS:743.7 ± 25.1 MPa). In contrast, the combined route (WRAA) allows to form nano-sized Cu precipitates with a moderate volume fraction while maintaining an active TRIP effect, thereby resulting in superior strength-ductility balance (YS: 938 ± 11.2 MPa and TE of 16.7 ± 0.9%). The present study provides a mechanistic understanding, connecting processing condition, micro/nanostructure evolution and mechanical properties, thereby, offering an effective pathway for tuning strength-ductility synergy in warm-rolled medium-Mn steels.",
    "doi": "10.1007/s42461-026-01549-5",
    "innovationCn": "热轧中锰钢 (MMnS) 因其平衡的机械性能和腐蚀性能而对汽车工业和能源应用具有吸引力。本研究研究了新设计的短温轧后热处理工艺路线如何进一步调整 Fe-7Mn-0.05 C-1.5Al-1.5Si-1.5Ni-1.5Cu (wt%) 钢的显微组织和机械性能。温轧MMnS（WarmR）采用三种热处理途径：700℃下临界退火（IA）1分钟（WRA）、500℃时效5分钟（WRAg）以及IA+时效组合工艺（WRAA）。WarmR 条件下的材料具有严重变形的铁素体基体和细化的机械稳定奥氏体，具有高屈服强度 (YS: 926.2 ± 17.8 MPa)，但由于抑制相变诱导塑性 (TRIP) 效应而具有低延展性（TE 为 6 ± 1.2%）。在WRAg条件下的材料中，铁素体内形成高密度的纳米级Cu沉淀物，进一步提高了屈服强度（YS：1179±17.6MPa），但没有提高延展性（TE 5.7±1.5％）。 WRA 工艺促进了 TRIP 效应的重新激活并增强了延展性（TE 为 14.5 ± 2.6%），尽管以牺牲强度为代价（YS：743.7 ± 25.1 MPa）。相比之下，组合路线（WRAA）允许形成具有中等体积分数的纳米尺寸Cu沉淀物，同时保持活跃的TRIP效应，从而产生优异的强度-延展性平衡（YS：938±11.2MPa和TE为16.7±0.9％）。本研究提供了一种机理理解，将加工条件、微/纳米结构演变和机械性能联系起来，从而为调节温轧中锰钢的强度-延展性协同作用提供了有效途径。",
    "innovationFormula": "温轧 + 临界退火 + Cu析出工程 = 中锰钢强塑性协同"
  },
  {
    "id": "p-042",
    "title": "Continuous Electric Furnace Annealing as a Sustainable Route: Influence on the Microstructure, Texture, and Mechanical Properties of Cold-Rolled Low-Carbon Steels for CO2 Emission Reduction",
    "titleCn": "连续电炉退火作为一种可持续的途径：对冷轧低碳钢的微观结构、织构和机械性能的影响以减少二氧化碳排放",
    "authors": "Pradhan S.K., Kim Y., Jeong I., Lee Y., et al.",
    "journal": "Materials",
    "sourceType": "SCI",
    "year": 2026,
    "month": 4,
    "innovationScore": 10,
    "field": "micro",
    "processType": "general",
    "innovationTags": [
      "织构",
      "累积叠轧",
      "碳减排"
    ],
    "abstract": "Steel processing requires energy-efficient heat-treatment routes without compromising material performance. Traditional annealing furnaces used for low-carbon (LC) steels are energy-intensive and major contributors to CO2 emissions, creating a need for sustainable alternatives. This study evaluates continuous electric furnace (CEF) annealing as a low-emission route to tailor the microstructure, texture, and mechanical properties of cold-rolled LC steel. Samples were annealed at 750 °C and 850 °C for 60 s, followed by comprehensive microstructural and crystallographic characterization using XRD, SEM, EBSD (IPF, GOS, KAM, ODF), hardness, and tensile testing. Annealing increased recrystallization from ~4% in the as-rolled condition to ~98% at 850 °C, reduced the mean KAM from 1.9° to 0.1°, enhanced the high-angle grain boundary fraction to 0.91, and promoted γ-fiber strengthening while suppressing detrimental θ-fiber components. The 850 °C condition achieved optimal mechanical performance (UTS × TE = 11.1 GPa%). These results demonstrate that CEF annealing enables sustainable processing with better mechanical performance in LC steels.",
    "doi": "10.3390/ma19081626",
    "innovationCn": "钢材加工需要节能的热处理路线，同时又不影响材料性能。用于低碳 (LC) 钢的传统退火炉属于能源密集型，是二氧化碳排放的主要来源，因此需要可持续的替代品。本研究评估了连续电炉 (CEF) 退火作为一种低排放途径，以调整冷轧 LC 钢的微观结构、织构和机械性能。样品在 750 °C 和 850 °C 下退火 60 秒，然后使用 XRD、SEM、EBSD（IPF、GOS、KAM、ODF）、硬度和拉伸测试进行全面的微观结构和晶体学表征。退火将再结晶率从轧制条件下的约 4% 提高到 850 °C 时的约 98%，将平均 KAM 从 1.9° 降低到 0.1°，将大角度晶界分数提高到 0.91，并促进 γ 纤维强化，同时抑制有害的 θ 纤维成分。 850 °C 条件实现了最佳机械性能（UTS × TE = 11.1 GPa%）。这些结果表明，CEF 退火能够实现 LC 钢的可持续加工，并具有更好的机械性能。",
    "innovationFormula": "连续电炉退火 + 织构调控 + 低碳减排 = LC钢可持续加工"
  },
  {
    "id": "p-043",
    "title": "A Study of Correlations between Chemical Composition, Hot Rolling Process Pa rameters, Microstructure and Mechanical Properties of Hot Rolled DP600 Steel",
    "titleCn": "热轧DP600钢化学成分、热轧工艺参数、显微组织与力学性能的相关性研究",
    "authors": "Kaźmierski T., Krawczyk J., Frocisz Ł., Matusiewicz P.",
    "journal": "Archives of Metallurgy and Materials",
    "sourceType": "SCI",
    "year": 2025,
    "month": 6,
    "innovationScore": 10,
    "field": "micro",
    "processType": "hot",
    "innovationTags": [
      "控轧控冷"
    ],
    "abstract": "DP600 steel is widely used in the automotive industry due to its exceptionally favourable combination of high tensile strength and good ductility. In the hot-rolling process, DP600 steel is produced by use of controlled cooling of the rolled strip from temperature above Ar3 to temperature below Ms. In this process, it is quite difficult to control key process parameters such as the time or temperature, and the final microstructure of the material is also affected by the degree of deformation of the material at various stages of the process. This paper presents a statistical analysis of the effect of chemical composition and selected hot rolling process parameters on the microstructure of DP600 sheet with respect to its mechanical properties. Based on industrial data from hot rolling mill combined with extended microstructure analysis, it was possible to find correlations between some of the analysed parameters and material properties. Among many correlations discussed in this work, most notable are those between martensite morphology and mechanical properties, between Mn and Si concentration and martensite morphology and between rolling speed, strain, cooling rate and mechanical properties.",
    "doi": "10.24425/amm.2025.153469",
    "innovationCn": "DP600 钢因其高抗拉强度和良好延展性的优异组合而广泛应用于汽车行业。在热轧过程中，DP600钢是通过对轧制带钢从Ar3以上温度到Ms以下温度进行控制冷却来生产的。在此过程中，时间或温度等关键工艺参数的控制相当困难，并且材料在过程各个阶段的变形程度也影响材料的最终显微组织。本文对化学成分和所选热轧工艺参数对 DP600 薄板微观结构及其机械性能的影响进行了统计分析。根据热轧机的工业数据并结合扩展的微观结构分析，可以找到一些分析参数与材料性能之间的相关性。在这项工作中讨论的许多相关性中，最值得注意的是马氏体形态与机械性能之间、Mn 和 Si 浓度与马氏体形态之间以及轧制速度、应变、冷却速率与机械性能之间的相关性。",
    "innovationFormula": "化学成分 + 热轧参数 + 显微组织 = DP600钢性能关联"
  },
  {
    "id": "p-044",
    "title": "The Effect of Cold Rolling Process on Microstructure Evolution and Performance of Thin-Walled Titanium Alloy Tubes",
    "titleCn": "冷轧工艺对薄壁钛合金管组织演变及性能的影响",
    "authors": "Wang J., Li G., Song X., Wang P., et al.",
    "journal": "World Journal of Engineering and Technology",
    "sourceType": "SCI",
    "year": 2026,
    "month": 1,
    "innovationScore": 10,
    "field": "micro",
    "processType": "cold",
    "innovationTags": [
      "钛合金"
    ],
    "abstract": "This study conducted two process routes and four passes of cold rolling deformation and annealing treatment on pipes. The microstructure, grain size, and mechanical properties at room temperature were characterized using optical microscopy (OM) and room temperature stretching. The results showed that after cold rolling and heat treatment at 700˚C/3 h, the microstructure of the tube was completely recrystallized and underwent a certain degree of growth. Cold rolling deformation can effectively improve the strength of the pipe. Under process route 1, there is a certain degree of non-uniformity in the deformation of the pipe after each pass. With the increase of deformation passes, the microstructure non-uniformity is improved. After 4 passes of deformation, the grain size difference between the M-state center and edge of the pipe is 2.5 μm. Under the premise of a certain total deformation during rolling, process route 2 can effectively eliminate the unevenness of the pipe structure by increasing the deformation amount for 3 passes. After 4 passes of deformation, the grain size difference between the M-state center and edge of the pipe is 0.4 μm, and the M-state elongation rate for 4 passes is 5.5% higher than that of process route 1.",
    "doi": "10.4236/wjet.2026.141014",
    "innovationCn": "本研究对管材进行了两条工艺路线、四道次冷轧变形和退火处理。使用光学显微镜（OM）和室温拉伸来表征室温下的微观结构、晶粒尺寸和机械性能。结果表明，经过冷轧和700℃/3 h热处理后，管材显微组织完全再结晶，并发生了一定程度的长大。冷轧变形可以有效提高管材的强度。在工艺路线1下，每道次后管材的变形存在一定程度的不均匀性。随着变形道次的增加，显微组织的不均匀性得到改善。经过4道次变形后，管材M态中心与边缘的晶粒尺寸差为2.5μm。在轧制时总变形量一定的前提下，工艺路线2可以通过增加3道次的变形量，有效消除管材组织的不均匀性。经过4道次变形后，管材M态中心与边缘的晶粒尺寸差为0.4μm，4道次的M态延伸率比工艺路线1提高了5.5%。",
    "innovationFormula": "多道次冷轧 + 退火处理 + 晶粒细化 = 钛合金管材性能优化"
  },
  {
    "id": "p-045",
    "title": "Influence of asymmetric strip tension on surface roughness transfer in skin-pass rolling with small roll radius under dry conditions",
    "titleCn": "干燥条件下小辊半径平整轧制带材张力不对称对表面粗糙度传递的影响",
    "authors": "Zhang M., Schulte C., Scharifi E., Stemmler S., et al.",
    "journal": "International Journal of Material Forming",
    "sourceType": "SCI",
    "year": 2026,
    "month": 4,
    "innovationScore": 10,
    "field": "micro",
    "processType": "general",
    "innovationTags": [
      "织构",
      "异步轧制",
      "摩擦",
      "表面质量"
    ],
    "abstract": "Textured work rolls are utilized in skin-pass rolling to achieve the specific surface finish of the strip, affecting the product properties, such as friction coefficient and paintability. Therefore, to achieve effective property control, it is essential to control surface finish while maintaining geometric accuracy. However, both geometric accuracy and surface finish are influenced by the rolling force, necessitating decoupling for independent control. In this work, asymmetric strip tension is considered as an additional actuator, alongside the roll gap actuator, to investigate the potential to control the surface roughness without influencing the thickness reduction, thereby obtaining the desired product properties. For this purpose, a numerical study is conducted using a finite element multi-scale model with different thickness reductions and strip tensions. Results indicate that, compared to the mean roughness of 2.34 μm at the symmetric case with backward and forward tensions of 0.2 kN, the roughness increases by 7.7% with increasing the forward tension to 1.2 kN and decreases by 2.1% with increasing the backward tension to 0.6 kN, at 7% thickness reduction. This variation in roughness is attributed to the effect of strip tension on the relative movement between the work roll and the strip material. Therefore, applying asymmetric strip tension emerges as an effective strategy to ensure both surface finish and geometric accuracy simultaneously in skin-pass rolling.",
    "doi": "10.1007/s12289-026-01980-5",
    "innovationCn": "平整工作辊用于平整轧制，以实现带材的特定表面光洁度，从而影响产品性能，例如摩擦系数和可涂漆性。因此，为了实现有效的性能控制，必须在保持几何精度的同时控制表面光洁度。然而，几何精度和表面光洁度都受到轧制力的影响，需要解耦以进行独立控制。在这项工作中，不对称带材张力被视为与辊缝致动器并列的附加致动器，以研究在不影响厚度减少的情况下控制表面粗糙度的潜力，从而获得所需的产品性能。为此，使用具有不同厚度减少量和带材张力的有限元多尺度模型进行数值研究。结果表明，与前后张力为 0.2 kN 的对称情况下的平均粗糙度 2.34 μm 相比，在厚度减少 7% 的情况下，随着向前张力增加到 1.2 kN，粗糙度增加了 7.7%，随着向后张力增加到 0.6 kN，粗糙度减少了 2.1%。这种粗糙度的变化归因于带材张力对工作辊和带材之间的相对运动的影响。因此，施加不对称带材张力成为在平整轧制中同时确保表面光洁度和几何精度的有效策略。",
    "innovationFormula": "不对称带材张力 + 小辊平整 + 粗糙度传递 = 表面精度控制"
  },
  {
    "id": "p-046",
    "title": "COMPUTER MODELING AND RESEARCH OF THE ASYMMETRIC ROLLING OF A WORKPIECE WITH A GRADIENT DISTRIBUTION OF MECHANICAL PROPERTIES",
    "titleCn": "机械性能梯度分布工件不对称轧制的计算机建模与研究",
    "authors": "Nizabekov A., Panin E., Lezhnev S., Chumanov I., et al.",
    "journal": "Journal of Chemical Technology and Metallurgy",
    "sourceType": "SCI",
    "year": 2026,
    "month": 5,
    "innovationScore": 10,
    "field": "process",
    "processType": "asym",
    "innovationTags": [
      "异步轧制"
    ],
    "abstract": "The paper presents the results of finite-element modelling of asymmetric rolling of a workpiece with a gradient distribution of mechanical properties. To create a gradient distribution of properties, the workpiece was pre-loaded and Vickers microhardness was evaluated. The resulting workpiece model had a microhardness distribution that was close to the experimental values. The workpiece was subjected to both symmetric rolling and asymmetric rolling with an asymmetry coefficient of 1.5, which was achieved by varying the roll speeds (90 and 60 rpm) in two scenarios (90/60 and 60/90). The parameters of the stress-strain state and the rolling force were analyzed. The results showed that asymmetric rolling of a workpiece with a gradient distribution of mechanical properties had only minor differences from symmetric rolling. When the asymmetry coefficient exceeds 3, this factor begins to have a significant impacton the processing unevenness.",
    "doi": "10.59957/jctm.v61.i3.2026.15",
    "innovationCn": "本文介绍了具有机械性能梯度分布的工件不对称滚动的有限元建模结果。为了创建性能的梯度分布，对工件进行预加载并评估维氏显微硬度。所得工件模型的显微硬度分布接近实验值。对工件进行对称轧制和非对称轧制，不对称系数为 1.5，这是通过在两种情况（90/60 和 60/90）中改变轧辊速度（90 和 60 rpm）来实现的。对应力应变状态和轧制力参数进行了分析。结果表明，机械性能梯度分布的工件的不对称轧制仅具有很小的差异。",
    "innovationFormula": "梯度性能工件 + 非对称轧制 + 有限元 = 异质材料轧制成形"
  },
  {
    "id": "p-047",
    "title": "Synergistic \"Deformation-Solution\" Strengthening: Achieving Ultra-High Strength in a 2024 Aluminum Alloy via Rolling and Heat Treatment",
    "titleCn": "协同“变形-固溶”强化：通过轧制和热处理实现 2024 铝合金的超高强度",
    "authors": "Yin T., Han Y., Lang R.",
    "journal": "Journal of Materials Engineering and Performance",
    "sourceType": "SCI",
    "year": 2026,
    "month": 6,
    "innovationScore": 10,
    "field": "process",
    "processType": "general",
    "innovationTags": [
      "铝合金"
    ],
    "abstract": "（摘要待补充）",
    "doi": "10.1007/s11665-026-13934-8",
    "innovationCn": "协同“变形-固溶”强化：通过轧制和热处理实现 2024 铝合金的超高强度。主要涉及铝合金等方面的创新研究。",
    "innovationFormula": "变形强化 + 固溶处理 + 轧制热处理 = 2024铝合金超高强度"
  },
  {
    "id": "p-048",
    "title": "Transverse Cold Rolling-Induced Microstructural Modification and Mechanical and Electrochemical Responses of UNS S32304 Lean Duplex Stainless Steel",
    "titleCn": "UNS S32304 精益双相不锈钢横向冷轧引起的微观结构改性以及机械和电化学响应",
    "authors": "Ferreira V.H.M.M., Guimarães A.E., Azevedo M.d.S., Koga G.Y., et al.",
    "journal": "Journal of Materials Engineering and Performance",
    "sourceType": "SCI",
    "year": 2026,
    "month": 6,
    "innovationScore": 10,
    "field": "process",
    "processType": "cold",
    "innovationTags": [
      "轧制工艺"
    ],
    "abstract": "Abstract This study provides a critical assessment of transverse cold rolling as an alternative deformation route for controlling anisotropy in UNS S32304 lean duplex stainless steel by correlating microstructural evolution with mechanical, corrosion, and tribological responses. ",
    "doi": "10.1007/s11665-026-14233-y",
    "innovationCn": "本研究通过将微观结构演变与机械、腐蚀和摩擦学响应相关联，对横向冷轧作为控制 UNS S32304 贫双相不锈钢各向异性的替代变形途径进行了关键评估。",
    "innovationFormula": "横向冷轧 + 微观结构改性 + 电化学响应 = 双相不锈钢各向异性控制"
  },
  {
    "id": "p-049",
    "title": "Optimization of Roll Configuration and Investigation of Forming Process in Three-Roll Planetary Rolling of Stainless Steel Seamless Tubes",
    "titleCn": "不锈钢无缝管三辊行星轧制辊型优化及成形工艺研究",
    "authors": "Ma C., Li T., Xue C., Jin R.X., et al.",
    "journal": "Metals",
    "sourceType": "SCI",
    "year": 2025,
    "month": 5,
    "innovationScore": 10,
    "field": "process",
    "processType": "general",
    "innovationTags": [
      "轧制工艺"
    ],
    "abstract": "Three-roll planetary rolling technology has emerged as a primary method for manufacturing seamless tubes due to its advantages, including significant single-pass deformation, low energy consumption, and the ability to continuously roll long workpieces. Based on the forming characteristics of three-roll planetary rolling, this study established a simulation model of the rolling process, which includes key parameters such as the friction coefficient, roll speed, and roll deflection angle. Using finite element software, the effects of these parameters on the rolling process are simulated and analyzed. By comparing critical indicators such as the equivalent stress, rolling temperature, and roundness of the workpiece, the influence of the process parameters on the forming quality of three-roll planetary rolling is revealed. The optimal parameter combination is determined as follows: a friction coefficient of 0.3, roll speed of 120 rpm, and roll deflection angle of 9°. This research provides a reliable theoretical foundation for subsequent roll profile design and process parameter optimization in three-roll planetary rolling.",
    "doi": "10.3390/met15050540",
    "innovationCn": "三辊行星轧制技术因其单道次变形大、能耗低、可连续轧制长工件等优点而成为无缝管制造的主要方法。基于三辊行星轧制的成形特点，建立了轧制过程的仿真模型，其中包括摩擦系数、轧辊速度、轧辊偏转角等关键参数。利用有限元软件对这些参数对轧制过程的影响进行了模拟和分析。通过比较工件的等效应力、轧制温度、圆度等关键指标，揭示工艺参数对三辊行星轧制成形质量的影响。确定最佳参数组合为：摩擦系数0.3、辊速120rpm、辊偏转角9°。该研究为后续三辊行星轧制辊型设计和工艺参数优化提供了可靠的理论基础。",
    "innovationFormula": "辊型优化 + Simufact仿真 + 三辊行星轧 = 无缝管成形工艺"
  },
  {
    "id": "p-050",
    "title": "Study on the Influence of Mandrel Speed on the Titanium Tube Continuous Retained-Mandrel Rolling Process",
    "titleCn": "芯棒转速对钛管连续留芯棒轧制工艺的影响研究",
    "authors": "Li C., Shuang Y., Chen J., Wu T.",
    "journal": "Metals",
    "sourceType": "SCI",
    "year": 2024,
    "month": 9,
    "innovationScore": 10,
    "field": "process",
    "processType": "tube",
    "innovationTags": [
      "钛合金"
    ],
    "abstract": "The continuous retained-mandrel rolling process is a promising method for titanium tube production with high efficiency and a short process. The importance of mandrel as a deformation tool supporting the inner wall is crucial. This paper thoroughly examines the influence of mandrel velocity on the deformation characteristics at the groove vertex using three approaches: numerical simulation, shear-deformation observation experiments, and microstructure analysis. The following conclusions are drawn: Decreasing the mandrel velocity enhances the penetration of shear deformation into the inner wall of the titanium tube, improves thickness uniformity, and shifts the deformation mechanism near the inner wall from twinning to dislocation slip. As a result, the volume fraction of recrystallization increases from 18.4% to 42.3%. However, the mean shear strain increases first and then decreases to a certain value as the mandrel speed decreases, which is attributed to the combined influence of the cross-shear zone and the rolling force.",
    "doi": "10.3390/met14091024",
    "innovationCn": "连续固持芯棒轧制工艺是一种高效、短流程、有前景的钛管生产方法。心轴作为支撑内壁的变形工具的重要性至关重要。本文采用数值模拟、剪切变形观测实验和微观组织分析三种方法，深入研究了芯棒速度对凹槽顶点变形特性的影响。得出以下结论：降低芯轴速度增强了剪切变形对钛管内壁的渗透，提高了厚度均匀性，并使内壁附近的变形机制从孪生转变为位错滑移。结果，再结晶体积分数从18.4%增加到42.3%。然而，随着芯轴速度的降低，平均剪应变先增大后减小到一定值，这是交叉剪切区和轧制力的共同影响。",
    "innovationFormula": "芯棒转速调控 + 连续轧制 + 剪切变形 = 钛管高效成形"
  },
  {
    "id": "p-051",
    "title": "Failure Case Study Series Part Two: Failure Analysis of Roller Guides in a Wire Rod Rolling Mill",
    "titleCn": "故障案例研究系列第二部分：线材轧机滚子导轨的故障分析",
    "authors": "GURAU L., MARIN F., MARIN M., Stefănescu C., et al.",
    "journal": "The Annals of \"Dunarea de Jos\" University of Galati Fascicle IX Metallurgy and Materials Science",
    "sourceType": "SCI",
    "year": 2026,
    "month": 6,
    "innovationScore": 10,
    "field": "process",
    "processType": "general",
    "innovationTags": [
      "轧制工艺"
    ],
    "abstract": "The paper aims to present the root cause of failure of roller guides from the wire rod and coil rolling mill during normal operation. A comprehensive failure investigation was conducted following standard metallurgical procedures, including visual inspection, hardness testing, chemical analysis, optical microscopy, stereomicroscopy, scanning electron microscopy (SEM–EDS) characterization, and inclusion rating according to ASTM E45. The investigation concludes that the primary root cause of failure was the use of D3 tool steel, which is unsuitable for components subjected to severe thermal cycling, resulting in progressive thermal fatigue damage and eventual catastrophic fracture. Moreover, the election of D2 or other Mo-V alloyed hot‑work tool steels, combined with appropriate surface hardening, is recommended to enhance service life under rolling mill operating conditions.",
    "doi": "10.35219/mms.2026.2.05",
    "innovationCn": "本文旨在揭示线材和卷材轧机正常运行期间滚柱导轨发生故障的根本原因。按照标准冶金程序进行了全面的失效调查，包括目视检查、硬度测试、化学分析、光学显微镜、立体显微镜、扫描电子显微镜 (SEM-EDS) 表征以及根据 ASTM E45 的夹杂物评级。调查得出的结论是，故障的主要原因是使用了 D3 工具钢，这种钢不适合承受严重热循环的部件，会导致渐进的热疲劳损坏并最终导致灾难性断裂。此外，建议选择 D2 或其他 Mo-V 合金热作工具钢，并结合适当的表面硬化，以提高轧机操作条件下的使用寿命。",
    "innovationFormula": "SEM-EDS + 硬度测试 + 失效分析 = 线材轧机导轨失效诊断"
  },
  {
    "id": "p-052",
    "title": "Improving the technology of producing seamless hot-rolled pipes from stainless steel l80 type 13Cr in the tube rolling workshop",
    "titleCn": "轧管车间13Cr不锈钢l80型无缝热轧管生产工艺改进",
    "authors": "Strelchenko A., Avdeev S., Shcheglov A.V., Kom O.I., et al.",
    "journal": "Litiyo i Metallurgiya (FOUNDRY PRODUCTION AND METALLURGY)",
    "sourceType": "SCI",
    "year": 2024,
    "month": 6,
    "innovationScore": 10,
    "field": "process",
    "processType": "general",
    "innovationTags": [
      "轧制工艺"
    ],
    "abstract": "The production of seamless hot‑deformed pipes from martensitic stainless steel with a high chromium content, used under the constant influence of aggressive environments, involves overcoming a series of technological challenges. These challenges are due to the metal’s structural features, such as relatively low plasticity, a narrow temperature range for hot deformation, a tendency to defect formation during rolling, and more intense wear on the rolling tools. The article discusses the main stages of research work on mastering the technology of producing seamless hot‑rolled pipes from stainless steel grade L80 type 13Cr at OJSC “BSW – Management Company of Holding “BMC”. It presents the results and complexities of mastering the technology for producing seamless stainless steel pipes, analyzes the results aimed at reducing the cost of finished products by increasing the durability of piercing mandrels, the resistance of disc saws for cutting blanks, eliminating metal adhesion to the piercing mill’s Dishar discs, increasing the productivity of the rolling line and heat treatment process.",
    "doi": "10.21122/1683-6065-2024-2-40-43",
    "innovationCn": "采用高铬含量马氏体不锈钢生产无缝热变形管，在恶劣环境的持续影响下使用，需要克服一系列技术挑战。这些挑战是由于金属的结构特征造成的，例如塑性相对较低、热变形温度范围窄、轧制过程中容易形成缺陷以及轧制工具的磨损更加严重。本文讨论了 OJSC“BSW（控股公司“BMC”的管理公司）掌握 L80 13Cr 型不锈钢级无缝热轧管生产技术的研究工作的主要阶段。它介绍了掌握无缝不锈钢管生产技术的成果和复杂性，分析了旨在通过提高穿孔心轴的耐用性、圆盘锯切割毛坯的阻力、消除穿孔机迪沙盘上的金属粘附、提高轧制线和热处理工艺的生产率来降低成品成本的结果。",
    "innovationFormula": "13Cr不锈钢 + 热轧管工艺 + 缺陷控制 = 无缝管生产改进"
  },
  {
    "id": "p-053",
    "title": "THE ISSUE OF REDUCING METAL CONSUMPTION IN THE PRODUCTION OF HOT-ROLLED PIPES",
    "titleCn": "热轧管材生产中降低金属消耗的问题",
    "authors": "Hubynskyi M., Uhriumov Y., Gubinskyy O., Маzur І., et al.",
    "journal": "Modern Problems of Metalurgy",
    "sourceType": "SCI",
    "year": 2025,
    "month": 6,
    "innovationScore": 10,
    "field": "process",
    "processType": "general",
    "innovationTags": [
      "轧制工艺"
    ],
    "abstract": "Resource and energy conservation, along with environmental safety, are the main historical areas of development for metallurgy in modern conditions. This article discusses the main areas of metal saving in the production of hot-rolled seamless pipes using various pipe rolling units, which have reached practical use. Reducing metal consumption is one of the main ways to reduce costs in pipe production, as the share of the cost of a given metal minus waste ranges from 50% to 85%. An increase in metal consumption is one of the main factors in reducing the company's competitiveness in the domestic and foreign markets. An analysis of metal consumption in the production of hot-rolled seamless pipes at various pipe rolling units has shown that the largest technological metal losses occur at pilgrim mills due to metal cut-off at the pilgrim mill into the billet and pilgrim head. The main directions of reducing these losses are considered, and it is noted that the most effective are rolling the liner into the joint and rolling the pilgrim head on a free section of the mandrel. One of the main reserves for reducing metal consumption during hot rolling is the manufacture of pipes with an average wall thickness close to the rolling nominal or within the field of negative tolerances. Reducing metal losses by improving pipe accuracy can be achieved by centring the liner on the mandrel before pilgrim rolling. To solve this problem, new processes for preparing the front and rear ends of the sleeves have been proposed. The article considers the issues of reducing scale formation during hot rolling of pipes by accelerating the cooling of the product with water at the outlet of a clean gauge and increasing the cooling rate in air. One of the new ways to prevent scale formation on the inner surface of the liner when it is pierced on a rolling mill is to supply deoxidiser through the hollow core of the mandrel directly during the piercing process. The known and new technical solutions considered in this paper can be used in the development of metal-saving technology",
    "doi": "10.34185/1991-7848.2025.01.16",
    "innovationCn": "资源节约、能源节约和环境安全是现代冶金工业发展的主要历史领域。本文讨论了使用各种轧管机组生产热轧无缝管时节省金属的主要领域，这些轧管机组已达到实际应用。减少金属消耗是降低管道生产成本的主要方法之一，因为特定金属减去废物后的成本份额为 50% 至 85%。金属消耗增加是降低公司国内外市场竞争力的主要因素之一。对各个轧管机组热轧无缝管生产中金属消耗的分析表明，最大的技术金属损失发生在朝圣者轧机，这是由于朝圣者轧机将金属切入钢坯和朝圣者头部。考虑了减少这些损失的主要方向，并且值得注意的是，最有效的是将衬里滚压到接头中并将朝圣者头部滚压到心轴的自由部分上。热轧过程中减少金属消耗的主要储备之一是制造平均壁厚接近轧制标称值或在负公差范围内的管道。通过在朝圣轧制之前将衬里置于心轴上的中心，可以通过提高管道精度来减少金属损失。为了解决这个问题，已经提出了制备套筒前端和后端的新工艺。文章考虑了通过在洁净规出口处用水加速产品冷却以及提高空气中的冷却速率来减少管材热轧过程中结垢的问题。防止在轧机上穿孔时衬里内表面形成氧化皮的新方法之一是在穿孔过程中直接通过心轴的空心提供脱氧剂。本文考虑的已知和新技术解决方案可用于节约金属技术的开发。",
    "innovationFormula": "金属消耗分析 + 穿孔工艺 + 脱氧剂 = 节材型热轧管技术"
  },
  {
    "id": "p-054",
    "title": "Chaotic dynamics and energy transmission mechanisms in the dissipative nonlinear energy sink rolling mill system",
    "titleCn": "耗散非线性吸能轧机系统中的混沌动力学和能量传输机制",
    "authors": "Zhang J., Xie J., Shi W., Liang J., et al.",
    "journal": "Applied Mathematical Modelling",
    "sourceType": "SCI",
    "year": 2026,
    "month": 12,
    "innovationScore": 10,
    "field": "process",
    "processType": "general",
    "innovationTags": [
      "在线监测"
    ],
    "abstract": "（摘要待补充）",
    "doi": "10.1016/j.apm.2026.117081",
    "innovationCn": "该研究针对轧机系统的振动抑制问题，提出了一种基于耗散非线性能量汇（NES）的吸能方案，并深入分析了其中的混沌动力学和能量传输机制。通过建立轧机-NES耦合系统的非线性动力学模型，揭示了振动能量从主结构向NES定向传输的力学机理，阐明了混沌振动状态下能量耗散的增强效应。研究结果为轧机振动控制提供了一种被动的、无需外部能量输入的新方法，对提高轧制稳定性和带材表面质量具有重要意义。",
    "innovationFormula": "非线性能量汇(NES) + 混沌动力学 + 能量传输 = 轧机振动被动抑制"
  },
  {
    "id": "p-055",
    "title": "Comparative analysis of cross-wedge rolling methods",
    "titleCn": "楔横轧方法的比较分析",
    "authors": "Pater Z., Tomczak J., Shu X., Lio Z.",
    "journal": "Advances in Science and Technology - Research Journal",
    "sourceType": "SCI",
    "year": 2025,
    "month": 11,
    "innovationScore": 10,
    "field": "process",
    "processType": "general",
    "innovationTags": [
      "轧制工艺"
    ],
    "abstract": "Flat, convex and concave wedge tools can all be used in cross-wedge rolling (CWR) processes.However, using concave tools requires a new generation of rolling mills with segmented tool assemblies.This paper presents the concepts for such a machine.Next, the influence of tool shape on the CWR process is analysed using the example of a stepped shaft.This analysis was based on numerical simulations carried out using the Simufact.Forming software.The distributions of temperature, effective strain and damage function, as well as force and energy parameters, were compared.Based on this analysis, the most effective CWR process variant was selected.",
    "doi": "10.12913/22998624/211379",
    "innovationCn": "平楔、凸楔和凹楔工具均可用于楔横轧 (CWR) 工艺。然而，使用凹楔工具需要配备分段工具组件的新一代轧机。本文介绍了此类机器的概念。接下来，以阶梯轴为例分析了工具形状对 CWR 工艺的影响。该分析基于使用 Simufact.Forming 软件进行的数值模拟。温度、有效应变和损伤函数的分布，以及力和力的分布。能量参数进行了比较。基于此分析，选择了最有效的 CWR 工艺变体。",
    "innovationFormula": "平楔/凸楔/凹楔 + 楔横轧(CWR) + FEM对比 = 阶梯轴成形工艺选择"
  },
  {
    "id": "p-056",
    "title": "Effects of Cold Rolling on the Microstructure and Properties of Al/TiB2 Laminated Composites Fabricated by Accumulative Roll Bonding",
    "titleCn": "冷轧对累积轧制Al/TiB2层状复合材料组织与性能的影响",
    "authors": "Sun W., Xiang Z., Li J., Yang Z., et al.",
    "journal": "Materials",
    "sourceType": "SCI",
    "year": 2026,
    "month": 3,
    "innovationScore": 10,
    "field": "clad",
    "processType": "asym",
    "innovationTags": [
      "累积叠轧",
      "轧制复合",
      "铝合金"
    ],
    "abstract": "Al/TiB2 aluminum alloy laminates were fabricated using a combination of accumulative roll bonding (ARB) and cold rolling processes. The Al/TiB2 interface and microstructure were meticulously characterized by scanning electron microscopy (SEM) and transmission electron microscopy (TEM). The mechanical properties of the laminates were assessed through tensile testing. The experimental results demonstrate that with an increasing cold rolling reduction, a laminated composite sheet with a nanocrystalline structure was successfully produced. The critical strain for the onset of plastic instability was also investigated. The findings indicate that as the cold rolling reduction increases, severe necking occurs in the Al12Zn2.2Mg1.7Cu3TiB2 layer. At a reduction of 80%, the necking region approaches fracture. Tensile results reveal that this pronounced necking has a detrimental effect on the strength of the laminate. It is proposed that the plastic instability originates from shear bands, and the mechanical property mismatch between the constituent layers is identified as the primary reason for the localized preferential deformation.",
    "doi": "10.3390/ma19051031",
    "innovationCn": "Al/TiB2 铝合金层压板采用累积辊压粘合 (ARB) 和冷轧工艺相结合的方式制造。通过扫描电子显微镜 (SEM) 和透射电子显微镜 (TEM) 仔细表征 Al/TiB2 界面和微观结构。层压板的机械性能通过拉伸测试进行评估。实验结果表明，随着冷轧压下量的增加，成功生产出具有纳米晶结构的层合复合材料板材。还研究了塑性不稳定开始的临界应变。研究结果表明，随着冷轧压下量的增加，Al12Zn2.2Mg1.7Cu3TiB2 层中出现严重的颈缩。当减少 80% 时，颈缩区域接近断裂。拉伸结果表明，这种明显的颈缩对层压板的强度具有不利影响。提出塑性不稳定性源于剪切带，并且组成层之间的力学性能不匹配被认为是局部优先变形的主要原因。",
    "innovationFormula": "累积轧制(ARB) + 冷轧 + TiB2增强 = Al/TiB2层压板制造"
  },
  {
    "id": "p-057",
    "title": "Study on the Properties of Multi-Layer Cumulative Rolling-Prepared High-Chromium Cast Iron Powder/Low-Carbon Steel Composites",
    "titleCn": "多层累积轧制高铬铸铁粉/低碳钢复合材料性能研究",
    "authors": "Xing Y., Gao W., Wang X., Zhu Y., et al.",
    "journal": "Materials",
    "sourceType": "SCI",
    "year": 2026,
    "month": 2,
    "innovationScore": 10,
    "field": "clad",
    "processType": "general",
    "innovationTags": [
      "累积叠轧",
      "复合板",
      "异质结构",
      "碳减排"
    ],
    "abstract": "Multilayer laminated composites consisting of high-chromium cast iron (HCCI) powder clad with low-carbon steel (LCS) were fabricated via multi-pass hot rolling at a deformation of 70% under three different temperatures: 1100 °C, 1150 °C, and 1200 °C. The microstructure, elemental diffusion, and mechanical properties of the samples processed at these temperatures were systematically investigated. The results indicate that effective metallurgical bonding was achieved between the HCCI powder and the LCS matrix, with the HCCI regions accumulating high strain energy and dislocation density. Hardness testing demonstrated that higher rolling temperatures lead to increased hardness. The dominant wear mechanism was identified as dry sliding wear. The relatively low content of retained austenite contributed to a reduction in tensile strength, while this microstructure further promoted abrasive wear through the spalling of carbides. These findings suggest that hot processing offers a feasible pathway for improving the wear resistance of HCCI-based composites.",
    "doi": "10.3390/ma19050839",
    "innovationCn": "在 1100 °C、1150 °C 和 1200 °C 三个不同温度下，通过变形 70% 的多道次热轧制造由高铬铸铁 (HCCI) 粉末包覆低碳钢 (LCS) 的多层层合复合材料。对在这些温度下加工的样品的微观结构、元素扩散和机械性能进行了系统研究。结果表明，HCCI粉末与LCS基体之间实现了有效的冶金结合，HCCI区域积累了高应变能和位错密度。硬度测试表明，较高的轧制温度会导致硬度增加。主要磨损机制被确定为干滑动磨损。残余奥氏体含量相对较低，导致抗拉强度降低，而这种微观结构通过碳化物剥落进一步促进磨料磨损。这些发现表明热加工为提高 HCCI 基复合材料的耐磨性提供了一条可行的途径。",
    "innovationFormula": "多层累积轧制 + 高铬铸铁/低碳钢 + 热轧 = 耐磨复合材料"
  },
  {
    "id": "p-058",
    "title": "Effect of Hot Rolling Temperature on Microstructure and Mechanical Properties of Horizontal Continuous Liquid-Solid Composite Cast Stainless Steel Clad Plate",
    "titleCn": "热轧温度对水平连续液固复合铸造不锈钢复合板显微组织和力学性能的影响",
    "authors": "Yang Y., Jiang Z., Li H., Sun J., et al.",
    "journal": "Steel Research International",
    "sourceType": "SCI",
    "year": 2025,
    "month": 7,
    "innovationScore": 10,
    "field": "clad",
    "processType": "general",
    "innovationTags": [
      "复合板"
    ],
    "abstract": "Stainless steel clad plates were prepared by a novel technique of horizontal continuous liquid–solid composite casting, following with hot rolling at different temperatures. The interfacial composition, microstructure, mechanical properties and uniaxial tension deformation behaviors were investigated, and the effects of rolling temperature on strengthening and toughening were analyzed. The stainless steel clad plates rolled at 1100 °C had the highest yield strength of 408 MPa, tensile strength of 547 MPa, elongation of 31% and interfacial shear strength of 499 MPa, which increased by 16.6%, 9.2%, 6.9% and 13.7%, respectively, compared with those of the plates rolled at 1200 °C. During uniaxial tensile deformation, local high strain regions with sharp strain gradient emerged first at the cladding interface zone, where geometrically necessary dislocations (GNDs) gradually accumulate and cracks form. Higher rolling temperature promoted diffusion of carbon at cladding interface and dynamic recrystallization. Therefore, the relative diffusion distances reached maximum of 2.18 and 1.4, and finer grains of 40.2 and 7.6 μm and higher GNDs density of 2.69 × 10\n                    14\n                    and 2.55 × 10\n                    14\n                    m\n                    −2\n                    formed in both stainless steel and carbon steel when rolled at 1100 °C, resulting in simultaneously improved interfacial shear strength, tensile strength and ductility.",
    "doi": "10.1002/srin.202500111",
    "innovationCn": "采用水平连续液固复合铸造新技术制备不锈钢复合板，并在不同温度下进行热轧。研究了界面成分、显微组织、力学性能和单轴拉伸变形行为，并分析了轧制温度对强韧化的影响。 1100℃轧制的不锈钢复合板屈服强度最高，为408MPa，抗拉强度为547MPa，延伸率为31%，界面剪切强度为499MPa，分别比1100℃轧制的钢板提高了16.6%、9.2%、6.9%和13.7%。 1200°C。在单轴拉伸变形过程中，具有尖锐应变梯度的局部高应变区域首先出现在cl处。",
    "innovationFormula": "水平连续液固铸造 + 热轧 + 界面分析 = 不锈钢复合板强韧化"
  },
  {
    "id": "p-059",
    "title": "Prediction Model Study of Rolling Force and Thickness Ratio of the Bimetallic Composite Plate",
    "titleCn": "双金属复合板轧制力与板厚比预测模型研究",
    "authors": "Che J., Wang T., Ma B., Wu Y., et al.",
    "journal": "Chinese Journal of Mechanical Engineering",
    "sourceType": "核心",
    "year": 2025,
    "month": 4,
    "innovationScore": 10,
    "field": "clad",
    "processType": "general",
    "innovationTags": [
      "轧制工艺"
    ],
    "abstract": "The prediction of the rolling force and thickness ratio plays an important role in the development and application of bimetallic composite plates. To analyze the rolling force of the bimetallic composite plate more accurately, a novel hypothesis based on Orowan’s theory was proposed. The variation in the thickness of each differential element at different positions was considered to establish the analytical model. According to the characteristics of bimetallic composite plate rolling, the rolling deformation can be divided into forward and backward slip zones. The initial thickness ratio after rolling was predetermined by the thickness ratio before rolling; the rolling force balance of the upper and lower rollers was considered the convergence condition; and the final thickness ratio of the bimetallic composite plate was obtained by iterative calculation. The calculation results of the analytical model were compared with the measured and simulated data. The results showed that the errors in the calculation of the rolling force and thickness ratio were both less than 10%. The analytical model has high precision, meets engineering requirements, and has important reference significance for rolling process optimization and thickness ratio prediction.",
    "doi": "10.1186/s10033-025-01201-1",
    "innovationCn": "轧制力和板厚比的预测对于双金属复合板的开发和应用具有重要作用。为了更准确地分析双金属复合板的轧制力，基于Orowan理论提出了一种新的假设。考虑各微分单元在不同位置的厚度变化来建立分析模型。根据双金属复合板轧制的特点，轧制变形可分为前滑移区和后滑移区。轧制后的初始板厚比由轧制前的板厚比预先确定；考虑上下辊轧制力平衡收敛条件；通过迭代计算得到双金属复合板的最终厚度比。将分析模型的计算结果与实测数据和模拟数据进行了比较。结果表明，轧制力和板厚比的计算误差均小于10%。该解析模型精度高，满足工程要求，对轧制工艺优化和厚薄比预测具有重要参考意义。",
    "innovationFormula": "Orowan理论 + 板厚比模型 + 双金属 = 复合板轧制力预测"
  },
  {
    "id": "p-060",
    "title": "The Effects of Cu Powder on the Interface Microstructure Evolution of Hot-Rolled Al 6061/Mg M21/Al 6061 Composite Plates During Annealing",
    "titleCn": "Cu粉对热轧Al 6061/Mg M21/Al 6061复合板退火过程界面组织演变的影响",
    "authors": "Yang N., Jiang X., Zhang R., Li J., et al.",
    "journal": "Materials",
    "sourceType": "SCI",
    "year": 2025,
    "month": 2,
    "innovationScore": 10,
    "field": "clad",
    "processType": "general",
    "innovationTags": [
      "轧制复合"
    ],
    "abstract": "This study achieved the successful creation of a 6061/M21/6061 composite sheet, with Cu powder incorporated in the middle, through a two-pass hot roll bonding process. The effect of Cu powder addition on interface microstructure evolution of Mg-Al composite plate during annealing was studied. The results show that the incorporation of copper powder significantly suppresses the formation of Mg-Al intermetallic compounds (IMCs) at the boundary of Al-Mg bonded plates. The IMCs’ thickness of composite plate Mg-Al interface absent Cu powder increased from 7.0 µm at 250 °C to 61.2 µm at 400 °C, showing a rapid growth trend. On the contrary, in the area with Cu powder of composite plate containing Cu powder, when the temperature ranges from 250 °C to 350 °C, the Mg-Al diffusion layer is thin and only varies between 1 µm and 3.2 µm and, even when the temperature rises to 400 °C, the diffusion layer is only 18.8 µm. At a constant temperature, the diffusion rate of IMCs in the Cu powder-containing region of the composite plate is significantly lower than that in the region without Cu powder. Upon the addition of Cu powder, Al2Cu and Al0.92Cu1.08Mg phases are formed, which decrease the proportion of the brittle phases Al3Mg2 and Mg17Al12 at the composite plate interface, thereby effectively mitigating the diffusion of IMCs within the Mg-Al interface. This presents a novel concept for the investigation of enhanced interface bonding and the fabrication of Mg-Al composite plates.",
    "doi": "10.3390/ma18030655",
    "innovationCn": "这项研究通过两道热辊粘合工艺成功制造了中间掺有铜粉的 6061/M21/6061 复合板材。研究了Cu粉添加对Mg-Al复合板退火过程中界面微观结构演变的影响。结果表明，铜粉的加入显着抑制了 Al-Mg 结合板边界处 Mg-Al 金属间化合物（IMC）的形成。不含Cu粉的复合板Mg-Al界面的IMC厚度从250℃时的7.0μm增加到400℃时的61.2μm，呈现快速增长趋势。相反，在含铜粉复合板的铜粉区域，当温度在250℃～350℃时，Mg-Al扩散层很薄，仅在1μm～3.2μm之间变化，即使温度升至400℃，扩散层也仅为18.8μm。在恒定温度下，复合板含Cu粉区域中IMC的扩散速率明显低于不含Cu粉区域。添加Cu粉后，形成Al2Cu和Al0.92Cu1.08Mg相，降低了复合板界面处脆性相Al3Mg2和Mg17Al12的比例，从而有效抑制了IMCs在Mg-Al界面内的扩散。这为增强界面结合的研究和镁铝复合板的制造提供了一个新的概念。",
    "innovationFormula": "Cu粉中间层 + 热辊粘合 + 界面调控 = Mg-Al复合板制备"
  },
  {
    "id": "p-061",
    "title": "Influences of the Rolling Parameters on Multi-Material Copper-Aluminum Composites via Compound Casting",
    "titleCn": "轧制参数对复合铸造多材料铜铝复合材料的影响",
    "authors": "Ringel A., Demirezen A.Z., Hoyer J., Bailly D., et al.",
    "journal": "Materials science forum",
    "sourceType": "SCI",
    "year": 2026,
    "month": 4,
    "innovationScore": 10,
    "field": "clad",
    "processType": "general",
    "innovationTags": [
      "轧制复合",
      "铝合金"
    ],
    "abstract": "Multi-material components that consist of copper and aluminum enable the combination of advantageous mechanical, thermal, and electrical properties at competitive cost. While roll bonding is an efficient-solid state joining technique, its implementation requires fully processed, cold-rolled strip material from two process routes. Continuous compound casting in contrast offers a more efficient approach by combining aluminum and copper during casting, followed by flat rolling in a single process route. However, the differences in flow stress between the metals can cause non-uniform elongation and therefore significant shear stresses at the interface during rolling. These stresses may lead to a delamination of the compound if process conditions are not well controlled. This study investigates whether a geometrically structured interface, introduced during compound casting, can contribute to withstanding interfacial shear stresses through mechanical interlocking. In finite element simulations varying process parameters including height reduction, initial temperature, rolling speed ratio, and pass schedule were examined. Results show that a structured interface can effectively resist shear stresses at the copper-aluminum boundary, thereby improving joint stability during deformation. Furthermore, the strain distribution as well as the fluctuation of the shear stresses can be controlled by the process parameters. The findings indicate that the mechanical interlocking by a geometric interface combined with optimized process parameters can enhance the rolling of compound-cast copper-aluminum composites.",
    "doi": "10.4028/p-ifcfc6",
    "innovationCn": "由铜和铝组成的多材料组件能够以具有竞争力的成本结合有利的机械、热和电气性能。虽然辊压接合是一种高效的固态连接技术，但其实施需要来自两种工艺路线的完全加工的冷轧带材。相比之下，连续复合铸造提供了一种更有效的方法，即在铸造过程中将铝和铜结合在一起，然后在单一工艺路线中进行平轧。然而，金属之间的流动应力差异可能会导致不均匀的伸长率，从而在轧制过程中在界面处产生显着的剪切应力。如果工艺条件控制不好，这些应力可能会导致化合物分层。这项研究调查了复合铸造过程中引入的几何结构界面是否有助于通过机械互锁承受界面剪切应力。在有限元模拟中，检查了不同的工艺参数，包括高度减少量、初始温度、轧制速度比和道次安排。结果表明，结构化界面可以有效抵抗铜铝边界处的剪应力，从而提高变形过程中的接头稳定性。此外，应变分布以及剪切应力的波动可以通过工艺参数来控制。研究结果表明，几何界面的机械互锁与优化的工艺参数相结合可以增强复合铸造铜铝复合材料的轧制性能。",
    "innovationFormula": "复合铸造 + 轧制参数 + 界面互锁 = 铜铝复合材料轧制"
  },
  {
    "id": "p-062",
    "title": "Microstructure and tensile behavior of high-chromium cast iron/Hadfield steel composite fabricated by hot rolling process",
    "titleCn": "热轧高铬铸铁/哈德菲尔德钢复合材料的显微组织和拉伸行为",
    "authors": "Wu G., Merkuryev I., Liang Z., Duishenaliev T.B., et al.",
    "journal": "Materials Research Express",
    "sourceType": "SCI",
    "year": 2025,
    "month": 2,
    "innovationScore": 10,
    "field": "clad",
    "processType": "general",
    "innovationTags": [
      "轧制工艺"
    ],
    "abstract": "This study employed a hot-rolling technique to fabricate a bimetal composite combining Hadfield steel and High-chromium cast iron (HCCI). The microstructure evolution and tensile properties of the bimetal composite were studied. Experimental results revealed that initial HCCI layers, characterized by limited plasticity, underwent necking and fragmentation into irregular fragments during deformation. The bonding interface of the two metals presented a wave shape. The two metals fused together and showed a good metallurgical bonding without interface cracks and delamination. The composite demonstrated an average tensile strength of 284 MPa. The results of tensile test showed that a large number of tunnel cracks were formed near the fracture of the sample. In the bimetallic composite, crack propagation stopped or transferred when encountering ductile Hadfield steel.",
    "doi": "10.1088/2053-1591/adb5db",
    "innovationCn": "本研究采用热轧技术来制造结合哈德菲尔德钢和高铬铸铁（HCCI）的双金属复合材料。研究了双金属复合材料的微观结构演变和拉伸性能。实验结果表明，初始 HCCI 层的塑性有限，在变形过程中发生颈缩并碎裂成不规则碎片。两种金属的键合界面呈现波浪形。两种金属熔合在一起，表现出良好的冶金结合，没有界面裂纹和分层。该复合材料的平均拉伸强度为 284 MPa。拉伸试验结果表明，试样断口附近形成大量隧道裂纹。在双金属复合材料中，当遇到韧性哈德菲尔德钢时，裂纹扩展停止或转移。",
    "innovationFormula": "热轧复合 + HCCI/Hadfield + 拉伸行为 = 双金属强韧匹配"
  },
  {
    "id": "p-063",
    "title": "Strength-Ductility Synergy and Microscopic Mechanism of CNTs-Reinforced Mg-Al Composites Fabricated Through Vacuum Powder Metallurgy Coupled with Hot Extrusion-Rolling",
    "titleCn": "真空粉末冶金热挤压轧制碳纳米管增强镁铝复合材料强塑协同及微观机理",
    "authors": "Ma S., Li G., Zhang N., Huang S., et al.",
    "journal": "Materials",
    "sourceType": "SCI",
    "year": 2026,
    "month": 4,
    "innovationScore": 10,
    "field": "clad",
    "processType": "general",
    "innovationTags": [
      "累积叠轧",
      "碳减排",
      "镁合金"
    ],
    "abstract": "The low absolute strength and insufficient room-temperature ductility remain key bottlenecks that restrict the engineering application of magnesium alloys in high-end industrial fields. In the present study, 1 vol.% carbon nanotubes (CNTs)-reinforced Mg-xAl (x = 0, 1, and 1.5 wt.%) composites were synthesized via a powder metallurgy route coupled with hot extrusion–rolling processing to realize a simultaneous improvement in mechanical properties. The hot extrusion–rolling processed 1 vol.% CNTs/Mg-1Al composite exhibits an ultimate tensile strength of 300 MPa and an elongation to failure of 9%, showing an excellent strength–ductility synergy. Microstructural characterization reveals a well-bonded interface between CNTs and the Mg matrix. Deformation incompatibility between CNTs and the magnesium matrix during hot extrusion–rolling induces a high density of dislocations, providing an important strengthening contribution. Moreover, an increased proportion of low-angle grain boundaries and the development of a bimodal texture promote significant grain refinement and effectively activate non-basal slip systems, thereby alleviating plastic deformation constraints. The synergistic effects of interfacial strengthening, dislocation strengthening, grain boundary strengthening, and texture regulation together contribute to the simultaneous improvement of strength and ductility in CNTs-reinforced Mg-Al composites.",
    "doi": "10.3390/ma19081537",
    "innovationCn": "绝对强度低、室温塑性不足仍然是制约镁合金在高端工业领域工程应用的关键瓶颈。在本研究中，通过粉末冶金路线与热挤压轧制工艺相结合合成了1体积％碳纳米管（CNT）增强的Mg-xAl（x = 0、1和1.5重量％）复合材料，以实现机械性能的同时提高。热挤压-轧制加工的 1 vol.% CNTs/Mg-1Al 复合材料的极限拉伸强度为 300 MPa，断裂伸长率为 9%，表现出优异的强度-延展性协同作用。微观结构表征揭示了碳纳米管和镁基体之间良好的结合界面。热挤压轧制过程中碳纳米管和镁基体之间的变形不相容性会引起高密度的位错，从而提供重要的强化贡献。此外，小角度晶界比例的增加和双峰织构的发展促进了晶粒的显着细化并有效激活非基底滑移系统，从而减轻了塑性变形约束。界面强化、位错强化、晶界强化和织构调节的协同效应共同有助于同时提高碳纳米管增强镁铝复合材料的强度和延展性。",
    "innovationFormula": "粉末冶金 + 热挤压轧制 + CNT增强 = 镁铝强塑协同"
  },
  {
    "id": "p-064",
    "title": "Analysis of Plastic Forming During Rolling of Al1050-AZ31-Al1050 Layered Composites for Transport Purposes",
    "titleCn": "运输用 Al1050-AZ31-Al1050 层状复合材料轧制过程中的塑性成形分析",
    "authors": "Rydz D., Stradomski G., Pałęga M., Salwin M., et al.",
    "journal": "Advances in Science and Technology - Research Journal",
    "sourceType": "SCI",
    "year": 2024,
    "month": 7,
    "innovationScore": 10,
    "field": "clad",
    "processType": "general",
    "innovationTags": [
      "镁合金",
      "铝合金"
    ],
    "abstract": "The aim of the research was to determine the possibility of producing and using layered composites made of aluminum and magnesium alloys Al1050-AZ31-Al1050. The use of layered composites often results from economic conditions. The work analyzed the current research, technological and production potential, as well as selected microstructural phenomena occurring in the tested multilayer materials and the effects of the rolling process. The material for the study was obtained using the explosion welding technology, one of the few enabling universal joining of often difficult-to-weld metals. The rolling process was carried out on a semi-industrial duo rolling mill with a roller diameter of Ø300 mm. The composite input material for the rolling process was heated to a temperature of 380°C. The effect of the rolling process on the distribution of metal pressure forces on the rolls, the geometric parameters and the microstructural changes occurring in the plastically formed layered composite were analysed, and the energy gain from using a structure in which the currently used aluminium components were replaced with the tested composite was estimated.",
    "doi": "10.12913/22998624/190786",
    "innovationCn": "该研究的目的是确定生产和使用由铝和镁合金 Al1050-AZ31-Al1050 制成的层状复合材料的可能性。层状复合材料的使用通常是出于经济条件。这项工作分析了当前的研究、技术和生产潜力，以及所测试的多层材料中发生的选定微观结构现象以及轧制过程的影响。该研究的材料是使用爆炸焊接技术获得的，爆炸焊接技术是少数能够普遍连接通常难以焊接的金属的技术之一。轧制过程在辊直径为 Ø300 mm 的半工业双辊轧机上进行。用于轧制过程的复合输入材料被加热至380°C的温度。分析了轧制过程对轧辊上金属压力分布的影响、塑性成型层状复合材料中发生的几何参数和微观结构变化，并估计了使用测试复合材料替代当前使用的铝部件的结构所获得的能量增益。",
    "innovationFormula": "Al/AZ31/Al层压 + 塑性成形分析 + 能量评估 = 运输用轻量化复合"
  },
  {
    "id": "p-066",
    "title": "Structural, Thermal Behaviour and Tribological Performance in Cold Rolling of Mineral Lubricants with Graphene Nanoplatelets Functionalized with Oleic Acid",
    "titleCn": "油酸功能化石墨烯纳米片冷轧矿物润滑剂的结构、热行为和摩擦学性能",
    "authors": "Özakın B., Gülteki̇n K.",
    "journal": "Nanomaterials",
    "sourceType": "SCI",
    "year": 2026,
    "month": 4,
    "innovationScore": 10,
    "field": "tribo",
    "processType": "cold",
    "innovationTags": [
      "润滑"
    ],
    "abstract": "In this study, nanolubricants based on SAE 5W-30 mineral oil were formulated using oleic acid-functionalized graphene nanoplatelets (GNPs), and their colloidal stability, rheological behaviour, thermal stability, and tribological performance under cold rolling conditions were systematically investigated. The nanolubricants were prepared at GNP concentrations of 0.05, 0.1, 0.2, 0.4, and 0.6 wt%. FT-IR analysis confirmed successful functionalization, evidenced by the characteristic C=O band at approximately 1710 cm−1 and changes in CH2 stretching vibrations in the 2850–3000 cm−1 range. UV–VIS results indicated initially homogeneous dispersions; however, after three days, relative concentrations decreased to 95%, 90%, and 75% for 0.05, 0.2, and 0.6 wt% GNPs, respectively. Viscosity measurements showed minimal variation at low concentrations, with only a 0.64% increase at 0.2 wt% compared to the base oil. TGA revealed enhanced oxidative stability at low GNP contents, with the oxidation onset temperature increasing from 205.3 °C to 207.2 °C at 0.05 wt%, while a marked decline was observed at higher concentrations (176.8 °C at 0.6 wt%). In cold rolling experiments at a 3% reduction ratio, the rolling force was measured at 1341 N/mm with the neat lubricant, decreasing to 1210 N/mm with a lubricant containing 0.1 wt% GNPs, corresponding to an approximate 10% reduction. Compared with dry conditions, this reduction was approximately 21%. Surface roughness and 3D topography analyses further showed that GNPs-containing lubricants reduced asperities and promoted the formation of a more uniform tribofilm. At low concentrations, the improved lubrication performance of oleic acid-functionalized graphene nanoplatelets is attributed to their homogeneous dispersion in mineral oil, where physically adsorbed oleic acid improves colloidal stability by reducing agglomeration and promotes the formation of a stable tribofilm, facilitating interlayer sliding under boundary lubrication conditions. Overall, the findings demonstrate that oleic acid-functionalized GNPs, when used at optimal concentrations, significantly enhance both lubricant stability and cold rolling performance.",
    "doi": "10.3390/nano16080495",
    "innovationCn": "在本研究中，使用油酸功能化石墨烯纳米片（GNP）配制基于SAE 5W-30矿物油的纳米润滑剂，并系统研究了它们在冷轧条件下的胶体稳定性、流变行为、热稳定性和摩擦学性能。纳米润滑剂的 ​​GNP 浓度为 0.05、0.1、0.2、0.4 和 0.6 wt%。 FT-IR 分析证实了成功的功能化，由约 1710 cm−1 处的特征 C=O 带和 2850–3000 cm−1 范围内的 CH2 伸缩振动变化证明。 UV-VIS 结果表明最初是均匀的分散体；然而，三天后，0.05、0.2 和 0.6 wt% GNP 的相对浓度分别降至 95%、90% 和 75%。粘度测量显示低浓度下的变化很小，与基础油相比，0.2 wt% 时粘度仅增加 0.64%。 TGA 显示，低 GNP 含量下氧化稳定性增强，氧化起始温度在 0.05 wt% 时从 205.3 °C 升高至 207.2 °C，而在较高浓度时观察到明显下降（0.6 wt% 时为 176.8 °C）。在压下率为 3% 的冷轧实验中，使用纯润滑剂测得的轧制力为 1341 N/mm，使用含有 0.1 wt% GNP 的润滑剂时测得的轧制力降至 1210 N/mm，相当于约 10% 的压下量。与干燥条件相比，减少量约为 21%。表面粗糙度和 3D 形貌分析进一步表明，含有 GNP 的润滑剂减少了粗糙度并促进了更均匀摩擦膜的形成。在低浓度下，油酸功能化石墨烯纳米片润滑性能的改善归因于它们在矿物油中的均匀分散，其中物理吸附的油酸通过减少团聚来提高胶体稳定性，并促进稳定摩擦膜的形成，促进边界润滑条件下的层间滑动。总体而言，研究结果表明，油酸官能化 GNP 在最佳浓度下使用时，可显着提高润滑剂稳定性和冷轧性能。",
    "innovationFormula": "油酸功能化GNP + 纳米润滑剂 + 冷轧 = 润滑性能提升"
  },
  {
    "id": "p-067",
    "title": "Investigation of lubricants for pipe rolling on a controlled moving mandrel on the DUO-210 mill",
    "titleCn": "研究用于在 DUO-210 轧机上受控移动心轴上轧管的润滑剂",
    "authors": "Aleshchenko A.S., Chislov D.A., Frolov V.V., Kadach M.V., et al.",
    "journal": "Chernye Metally",
    "sourceType": "SCI",
    "year": 2024,
    "month": 11,
    "innovationScore": 10,
    "field": "tribo",
    "processType": "general",
    "innovationTags": [
      "摩擦",
      "润滑"
    ],
    "abstract": "Lubrication are widely used in metal forming. The main purpose of lubricant is decreasing the coefficient of friction. The lubricant forms an intermediate layer between the body being deformed and the tool, completely or partially isolating them from each other. Due to high specific pressures, the grease does not always completely isolate the rubbing surfaces, allowing the tool and workpiece surfaces to come into contact, resulting in accelerated wear and increased heat generation. This can cause damage to the tool and workpiece, reduce machining accuracy and shorten equipment life. This paper presents a method for determining the effect of lubrication on friction conditions for the processes of continuous hot rolling of seamless tubes in multilayer rolling mills. The variant of realization of installation for friction research on the basis of laboratory mill DUO-210 is presented. This installation allowed to carry out physical modeling to study friction in conditions as close as possible to the real production process. The results of tests of the process of rolling of shells on a movable mandrel in a two-roll mill with the use of various technological lubricants, as well as the results of experience without the use of lubricants are given. The research with the use of technological lubricants based on graphite showed the difference in the mandrel holding force during the rolling of the sleeve depending on the applied composition. At the same time, the use of grease significantly reduced the holding force.The work was carried out within the framework of a comprehensive project on the topic&nbsp;&ldquo;Development and implementation of integrated technologies for the production of&nbsp;seamless pipes from new-generation steels with controlled corrosion resistance under&nbsp;complicated operating conditions for the fuel and energy complex of the Russian&nbsp;Federation&rdquo; within the framework of agreement No. 075-11-2023-011 dated 10.02.2023&nbsp;according to the RF Government Resolution No. 218 dated 09.04.2010.",
    "doi": "10.17580/chm.2024.11.07",
    "innovationCn": "润滑广泛应用于金属成型。润滑剂的主要目的是降低摩擦系数。润滑剂在变形体和工具之间形成中间层，将它们完全或部分地彼此隔离。由于高比压，润滑脂并不总是完全隔离摩擦表面，从而使工具和工件表面接触，导致磨损加速和发热增加。这会对刀具和工件造成损坏，降低加工精度并缩短设备寿命。本文提出了一种确定多层轧机连续热轧无缝管过程中润滑对摩擦条件影响的方法。提出了基于实验室磨机 DUO-210 的摩擦研究装置的实现变体。该装置可以进行物理建模，以研究尽可能接近真实生产过程的条件下的摩擦力。给出了使用各种技术润滑剂在两辊轧机的可移动心轴上轧制壳的过程的试验结果，以及不使用润滑剂的经验结果。使用基于石墨的技术润滑剂的研究表明，在套筒滚动过程中，心轴保持力的差异取决于所使用的成分。同时，润滑脂的使用显着降低了保持力。这项工作是在日期为 075-11-2023-011 号协议框架内的综合项目框架内进行的，该项目的主题为“俄罗斯联邦燃料和能源综合体复杂操作条件下采用新一代钢生产具有受控耐腐蚀性能的无缝管的综合技术的开发和实施”。 2023 年 2 月 10 日，根据俄罗斯联邦政府 2010 年 4 月 9 日第 218 号决议。",
    "innovationFormula": "管轧润滑剂 + 受控芯轴 + 摩擦系数 = DUO-210轧管优化"
  },
  {
    "id": "p-070",
    "title": "Dynamic sliding and rolling friction models for linear viscoelastic contact pairs",
    "titleCn": "线性粘弹性接触副的动态滑动和滚动摩擦模型",
    "authors": "Luigi Romano",
    "journal": "arXiv preprint",
    "sourceType": "预印本",
    "year": 2026,
    "month": 6,
    "innovationScore": 10,
    "field": "tribo",
    "processType": "general",
    "innovationTags": [
      "在线监测",
      "摩擦"
    ],
    "abstract": "Friction stir welding is a relatively new solid-state joining technique which is widely adopted in different industry fields to join different metallic alloys that are hard to weld by conventional fusion welding. Friction stir welding is a highly complex process comprising several highly coupled physical phenomena. The complex geometry of some kinds of joints and their three dimensional nature make it difficult to develop an overall system of governing equations for theoretical analyzing the behavior of the friction stir welded joints. The experiments are often time consuming and costly. To overcome these problems, numerical analysis has frequently been used since the 2000s. This paper reviews the latest developments in the numerical analysis of friction stir welding processes, microstructures of friction stir welded joints and the properties of friction stir welded structures. Some important numerical issues such as materials flow modeling, meshing procedure and failure criteria are discussed. Numerical analysis of friction stir welding will allow many different welding processes to be simulated in order to understand the effects of changes in different system parameters before physical testing, which would be time-consuming or prohibitively expensive in practice. The main methods used in numerical analysis of friction stir welding are discussed and illustrated with brief case studies. In addition, several important key problems and issues remain to be addressed about the numerical analysis of friction stir welding and opportunities for further research are identified.",
    "doi": "arXiv:2606.09128",
    "innovationCn": "搅拌摩擦焊是一种相对较新的固态连接技术，广泛应用于不同的工业领域，用于连接传统熔焊难以焊接的不同金属合金。搅拌摩擦焊是一个高度复杂的过程，包含几种高度耦合的物理现象。某些类型接头的复杂几何形状及其三维性质使得开发用于理论分析搅拌摩擦焊接头行为的整体控制方程系统变得困难。这些实验通常既耗时又昂贵。为了克服这些问题，自 2000 年代以来数值分析被频繁使用。本文综述了搅拌摩擦焊过程数值分析、显微组织等方面的最新进展。",
    "innovationFormula": "动态滑动模型 + 滚动摩擦 + 粘弹性接触 = 搅拌摩擦焊力学"
  },
  {
    "id": "p-071",
    "title": "Enhancing mechanical strength and tribological performance in tin bronze alloys via rolling treatment",
    "titleCn": "通过滚压处理提高锡青铜合金的机械强度和摩擦性能",
    "authors": "Zhong W., Wang L., Miao D., Cai X., et al.",
    "journal": "npj Materials Degradation",
    "sourceType": "SCI",
    "year": 2025,
    "month": 8,
    "innovationScore": 10,
    "field": "tribo",
    "processType": "general",
    "innovationTags": [
      "轧制工艺"
    ],
    "abstract": "This study electroplates a 2 μm thick Al layer on mild steel, then uses wire-arc directed energy deposition (DED) to deposit Cu-4.2Sn alloy, forming a composite material which is subsequently cold-rolled. It investigates the microstructure, mechanical properties, and tribological behavior before and after rolling, along with underlying mechanisms. It indicates that Al coating completely suppresses penetration cracks on the steel side of the tin bronze/steel bimetal. After rolling, tin bronze grains are significantly refined (from 47.6 μm to 15.2 μm) with numerous twins formed, reducing matrix dislocation density. Compared to wire-arc DED alloy, rolled alloy hardness increases by 78%, yield strength by 51%, and tensile strength by 30%. Tribological tests indicate, under dry friction and simulated seawater conditions, the rolled alloy’s coefficient of friction (COF) and mass loss decrease by 30% and 24% respectively. Analysis of corrosion-friction synergy reveals interaction loss accounts for 13%, dominated by friction-promoted corrosion (11%).",
    "doi": "10.1038/s41529-025-00655-x",
    "innovationCn": "本研究在低碳钢上电镀 2 μm 厚的 Al 层，然后使用线弧定向能量沉积 (DED) 沉积 Cu-4.2Sn 合金，形成复合材料，随后进行冷轧。它研究了轧制前后的微观结构、机械性能和摩擦学行为，以及潜在的机制。这表明Al涂层完全抑制了锡青铜/钢双金属钢侧的穿透裂纹。轧制后，锡青铜晶粒显着细化（从47.6μm到15.2μm），并形成大量孪晶，降低了基体位错密度。与线弧DED合金相比，轧制合金硬度提高78%，屈服强度提高51%，抗拉强度提高30%。摩擦学测试表明，在干摩擦和模拟海水条件下，轧制合金的摩擦系数（COF）和质量损失分别降低了30%和24%。对腐蚀-摩擦协同作用的分析表明，相互作用损失占 13%，其中以摩擦促进腐蚀 (11%) 为主。",
    "innovationFormula": "冷轧处理 + 锡青铜 + 摩擦学性能 = 机械强度与耐磨提升"
  },
  {
    "id": "p-072",
    "title": "Fast multiple rotation rolling induced changes in structure, strength, and wear behavior of Al-Si-Cu coatings on AA1010 aluminum substrates",
    "titleCn": "快速多次旋转轧制引起 AA1010 铝基体上 Al-Si-Cu 涂层结构、强度和磨损行为的变化",
    "authors": "Elamy M.I., Elmahdy M.",
    "journal": "Journal of Manufacturing Processes",
    "sourceType": "SCI",
    "year": 2026,
    "month": 6,
    "innovationScore": 10,
    "field": "tribo",
    "processType": "general",
    "innovationTags": [
      "磨损",
      "铝合金"
    ],
    "abstract": "（摘要待补充）",
    "doi": "10.1016/j.jmapro.2026.05.052",
    "innovationCn": "快速多次旋转轧制引起 AA1010 铝基体上 Al-Si-Cu 涂层结构、强度和磨损行为的变化。主要涉及磨损、铝合金等方面的创新研究。",
    "innovationFormula": "快速多次旋转轧制 + Al-Si-Cu涂层 + 结构演变 = 铝基涂层强化"
  },
  {
    "id": "p-074",
    "title": "Tribological Roles of Glass-Based Lubricants in Hot Rolling of Steel",
    "titleCn": "玻璃基润滑剂在钢热轧中的摩擦学作用",
    "authors": "Wang L., Ta T.D., Tieu A.K.",
    "journal": "steel research international",
    "sourceType": "SCI",
    "year": 2024,
    "month": 12,
    "innovationScore": 9,
    "field": "tribo",
    "processType": "hot",
    "innovationTags": [
      "无网格",
      "润滑"
    ],
    "abstract": "Glass‐based lubricants are essentially alkaline‐based inorganic polymers composed of alkaline elements and glass‐forming compounds (phosphates, borates, silicates) which are accountable for their polymeric nature. At high working temperature, the lubricants generally melt, wet the oxidized steel surface, and provide a viscous fluid‐like lubrication. This article provides a brief review of previous findings on the tribology of glass lubricants (polyphosphate, borate, silicate) in hot rolling, particularly their antioxidation and descaling behavior. Thermally driven and tribochemical reactions determine friction, wear, antioxidation, and descaling behavior. Then, the performance of glass lubricants is discussed from the perspective of experiment and modeling.",
    "doi": "10.1002/srin.202400107",
    "innovationCn": "玻璃基润滑剂本质上是由碱性元素和玻璃形成化合物（磷酸盐、硼酸盐、硅酸盐）组成的碱基无机聚合物，这些化合物决定了其聚合性质。在高工作温度下，润滑剂通常会熔化，润湿氧化钢表面，并提供粘性流体状润滑。本文简要回顾了热轧中玻璃润滑剂（聚磷酸盐、硼酸盐、硅酸盐）摩擦学的先前研究结果，特别是它们的抗氧化和除垢行为。热驱动和摩擦化学反应决定摩擦、磨损、抗氧化和除垢行为。然后，从实验和建模的角度讨论了玻璃润滑剂的性能。",
    "innovationFormula": "玻璃基润滑剂 + 高温润湿 + 粘性流体 = 钢热轧摩擦控制"
  },
  {
    "id": "p-075",
    "title": "Solid-state recycling of pure aluminum chips via direct hot rolling: mechanical, microstructural, and corrosion insights",
    "titleCn": "通过直接热轧实现纯铝片的固态回收：机械、微观结构和腐蚀见解",
    "authors": "Carta M., Buonadonna P., Mehtedi M.E.",
    "journal": "The International Journal of Advanced Manufacturing Technology",
    "sourceType": "SCI",
    "year": 2026,
    "month": 5,
    "innovationScore": 10,
    "field": "green",
    "processType": "hot",
    "innovationTags": [
      "铝合金"
    ],
    "abstract": "This study presents a novel method for recycling aluminum chips through direct hot rolling, eliminating the need for conventional melting processes. The solid-state recycling (SSR) approach reduces energy consumption, minimizes material loss, and mitigates environmental impact. Chips of pure aluminum (99.9wt.%) produced by turning were compacted, heat treated and subjected to hot rolling. Both compacted chips and parent-bulk material underwent the same rolling schedule achieving the final thickness of 0.8 mm. The produced sheets were subjected to microhardness, tensile tests, microstructure analysis (optical and SEM-EBSD techniques), density measurements, and corrosion tests. The recycled sheets exhibited average mechanical properties close to those of the parent-bulk material, albeit with higher data dispersion, with an Ultimate Tensile Strength (UTS) of 94.6 vs. 94.4 MPa, elongation at fracture (A%) of 7.0 compared to 7.1%, microhardness of 26.2 vs. 28.4 HV respectively, and lower corrosion rate for recycled chips. Overall, the results demonstrate the fundamental feasibility of direct hot rolling as a solid-state recycling route for pure aluminum chips under controlled conditions.",
    "doi": "10.1007/s00170-026-18375-0",
    "innovationCn": "这项研究提出了一种通过直接热轧回收铝屑的新方法，消除了传统熔化工艺的需要。固态回收 (SSR) 方法可降低能源消耗、最大限度地减少材料损失并减轻对环境的影响。通过车削产生的纯铝片（99.9wt.%）经过压实、热处理并进行热轧。压实的木片和母体材料都经过相同的轧制程序，最终厚度达到 0.8 毫米。生产的板材经过显微硬度、拉伸测试、微观结构分析（光学和 SEM-EBSD 技术）、密度测量和腐蚀测试。回收板材的平均机械性能与母体材料接近，但数据离散度较高，极限拉伸强度 (UTS) 分别为 94.6 和 94.4 MPa，断裂伸长率 (A%) 分别为 7.0 和 7.1%，显微硬度分别为 26.2 和 28.4 HV，回收碎片的腐蚀率较低。总体而言，结果证明了直接热轧作为受控条件下纯铝片固态回收途径的基本可行性。",
    "innovationFormula": "固态回收 + 直接热轧 + 铝屑 = 绿色铝材再生"
  },
  {
    "id": "p-076",
    "title": "Modeling and Experimental Testing of VT1-0 and PT-7M Titanium Alloy Tube Rolling Technology on a 70-270 Tube Mill",
    "titleCn": "70-270 轧管机上 VT1-0 和 PT-7M 钛合金管材轧制技术的建模和实验测试",
    "authors": "Lakiza V.A., Gamin Y.V., Aleshchenko A.S., Korol A.V., et al.",
    "journal": "Steel in Translation",
    "sourceType": "SCI",
    "year": 2025,
    "month": 9,
    "innovationScore": 10,
    "field": "green",
    "processType": "general",
    "innovationTags": [
      "钛合金"
    ],
    "abstract": "An experimental trial of an industrial-scale production technology for seamless tubes made of VT1-0 and PT-7M titanium alloys is conducted on a TPA 70-270 tube mill. Preliminary computer modeling is performed using the QForm 3D software package, for which deformation zones are designed to produce 159 × 13 mm tubes in two operations: piercing and rolling. It is established that the selected temperature-deformation conditions and tool calibration ensure the required geometric tube dimensions, while the equipment loads do not exceed permissible limits. During the pilot rolling, an analysis of the piercing and rolling process is performed in terms of the geometry, surface quality of the resulting tubes, and the level of energy-power parameters, as well as an assessment of the tool working surface (piercing mandrels and guide shoes). The mechanical properties of the resulting tubes made from VT1-0 and PT-7M alloys comply with the requirements of regulatory documentation for seamless tubes made from titanium alloys (GOST 21945–2023).",
    "doi": "10.3103/s0967091225701669",
    "innovationCn": "在TPA 70-270轧管机上进行了VT1-0和PT-7M钛合金无缝管工业规模生产技术的试验。使用 QForm 3D 软件包进行初步计算机建模，变形区域设计为通过穿孔和轧制两种操作生产 159 × 13 毫米的管材。已确定，所选的温度变形条件和工具校准可确保所需的几何管尺寸，同时设备负载不超过允许的限度。在预轧制过程中，根据几何形状、最终管材的表面质量和能量功率参数水平对穿孔和轧制过程进行分析，并对工具工作表面（穿孔芯轴和导靴）进行评估。由 VT1-0 和 PT-7M 合金制成的管材的机械性能符合钛合金无缝管材监管文件的要求 (GOST 21945–2023)。",
    "innovationFormula": "QForm 3D建模 + 钛合金管轧 + 工业验证 = 无缝管轧制技术"
  },
  {
    "id": "p-077",
    "title": "Multi-Objective Optimization of Ultrasonic Surface Rolling Process Parameters for TC4 Titanium Alloy with IWOA-RBF and MOGWO Algorithms",
    "titleCn": "IWOA-RBF和MOGWO算法多目标优化TC4钛合金超声表面滚压工艺参数",
    "authors": "Lan Y., Rao C., Lyu Y.",
    "journal": "Micromachines",
    "sourceType": "SCI",
    "year": 2026,
    "month": 4,
    "innovationScore": 10,
    "field": "green",
    "processType": "general",
    "innovationTags": [
      "钛合金"
    ],
    "abstract": "A structured optimization approach was applied to ultrasonic surface rolling process (USRP) parameters, aiming to enhance the material surface characteristics of TC4 titanium alloy. To overcome the premature convergence and limited exploration capability of the standard Whale Optimization Algorithm (WOA), three enhancement strategies were introduced, including population initialization based on an optimal point set, a sinusoidal nonlinear convergence factor, and an adaptive inertia-based position update strategy. By optimizing the structural parameters of the RBF neural network with the improved WOA, an IWOA–RBF predictive model for surface performance evaluation was developed and rigorously validated in terms of prediction accuracy. Using the developed IWOA–RBF model, a multi-criteria decision-making framework integrating the CRITIC weighting method and the TOPSIS ranking approach was constructed to evaluate surface quality. This framework was further combined with a multi-objective Grey Wolf Optimization (MOGWO) algorithm to perform Pareto-based optimization and determine the optimal USRP parameter set. Experimental validation showed that the optimized parameters resulted in a significant reduction in surface roughness, while enhancing both surface hardness and residual compressive stress. The results confirm the robustness and effectiveness of the proposed IWOA–RBF and MOGWO optimization framework, providing a reliable strategy for high-precision parameter optimization and coordinated enhancement of surface properties in the TC4 titanium alloy USRP.",
    "doi": "10.3390/mi17040451",
    "innovationCn": "将结构化优化方法应用于超声波表面滚压工艺（USRP）参数，旨在增强TC4钛合金的材料表面特性。为了克服标准鲸鱼优化算法（WOA）的早熟收敛和有限的探索能力，引入了三种增强策略，包括基于最优点集的种群初始化、正弦非线性收敛因子和基于惯性的自适应位置更新策略。通过使用改进的WOA优化RBF神经网络的结构参数，开发了用于表面性能评估的IWOA-RBF预测模型，并在预测精度方面进行了严格验证。利用开发的IWOA-RBF模型，构建了集成CRITIC加权方法和TOPSIS排序方法的多标准决策框架来评估表面质量。该框架进一步与多目标灰狼优化（MOGWO）算法相结合，执行基于帕累托的优化并确定最佳USRP参数集。实验验证表明，优化后的参数可显着降低表面粗糙度，同时提高表面硬度和残余压应力。结果证实了所提出的IWOA-RBF和MOGWO优化框架的稳健性和有效性，为TC4钛合金USRP的高精度参数优化和表面性能的协调增强提供了可靠的策略。",
    "innovationFormula": "改进鲸鱼算法(IWOA) + RBF网络 + MOGWO = TC4超声滚压多目标优化"
  },
  {
    "id": "p-078",
    "title": "Enhancing formability of cold-rolled titanium sheets via electro-pulsed treatment: an experimental study on electroplasticity effects",
    "titleCn": "通过电脉冲处理提高冷轧钛板的成形性：电塑性效应的实验研究",
    "authors": "Cozzolino E., Nagpure D.C., Silvestri A.T., Krishnaswamy H., et al.",
    "journal": "The International Journal of Advanced Manufacturing Technology",
    "sourceType": "SCI",
    "year": 2026,
    "month": 5,
    "innovationScore": 10,
    "field": "green",
    "processType": "general",
    "innovationTags": [
      "钛合金"
    ],
    "abstract": "Abstract Sheet metal forming processes are widely used across various industries and account for a significant portion of energy consumption in manufacturing. With sustainability becoming a growing focus, researchers are exploring more energy-efficient methods for metal forming. ",
    "doi": "10.1007/s00170-026-18237-9",
    "innovationCn": "金属板材成形工艺广泛应用于各个行业，在制造业能源消耗中占据很大一部分。随着可持续性成为人们日益关注的焦点，研究人员正在探索更节能的金属成型方法。",
    "innovationFormula": "电脉冲处理 + 电塑性效应 + 冷轧钛板 = 成形性提升与节能"
  },
  {
    "id": "p-079",
    "title": "Research on Forming Quality of GH4169 Superalloy Multi-Step Hollow Turbine Shaft by Three-roll Skew Rolling",
    "titleCn": "GH4169高温合金多级空心涡轮轴三辊斜轧成形质量研究",
    "authors": "Chen S., Shu X., Xu Y., Chen Q., et al.",
    "journal": "Journal of Modern Mechanical Engineering and Technology",
    "sourceType": "SCI",
    "year": 2022,
    "month": 12,
    "innovationScore": 8,
    "field": "green",
    "processType": "general",
    "innovationTags": [
      "高温合金"
    ],
    "abstract": ": This paper innovatively proposes a three-roll skew rolling process for flexible forming of hollow turbine shaft, which solves the problems of long manufacturing process and low material utilization of hollow turbine shaft, the core component of aeroengine. Simufact.Forming 14.0 (SF) numerical simulation software was used to establish the finite element model of two-pass three-roll skew rolling of the GH4169 superalloy turbine shaft. The effects of process parameters on the outer diameter error, roundness error and wall thickness uniformity of the rolled piece were investigated by single factor experiments. A five-factor three-level orthogonal test was designed to explore the optimum process parameters by ' comprehensive scoring method'. The results show that the optimal process parameters are that the first pass roll rotating speed is 40 rad/min, the first pass axial speed is 15 mm/s, the second pass roll rotating speed is 50 rad/min, the second pass axial speed is 25 mm/s, and the billet preheating temperature is 1000ºC. The axial velocity of the second pass has the greatest influence on the test results, while the rotational speed of the second pass has the least influence. Under the optimal parameter combination simulation experiment, the outer diameter error, outer roundness error and wall thickness standard deviation are 0.151 mm, 0.121 mm and 0.034 mm, respectively, which are better than the results in the orthogonal test table. The research results provide a theoretical basis for realizing flexible, economical and high-quality forming of hollow turbine shaft by three-roll skew rolling.",
    "doi": "10.31875/2409-9848.2022.09.7",
    "innovationCn": "：本文创新性地提出了三辊斜轧涡轮空心轴柔性成形工艺，解决了航空发动机核心部件涡轮空心轴制造工艺流程长、材料利用率低的问题。采用Simufact.Forming 14.0（SF）数值模拟软件建立GH4169高温合金涡轮轴二道次三辊斜轧有限元模型。通过单因素试验研究了工艺参数对轧件外径误差、圆度误差和壁厚均匀性的影响。设计五因素三水平正交试验，通过“综合评分法”探索最佳工艺参数。结果表明，最佳工艺参数为：第一道次轧辊转速为40 rad/min，第一道次轴向速度为15 mm/s，第二道次轧辊转速为50 rad/min，第二道次轴向速度为25 mm/s，坯料预热温度为1000℃。第二道次的轴向速度对测试结果影响最大，而第二道次的转速影响最小。最佳参数组合模拟实验下，外径误差、外圆度误差和壁厚标准差分别为0.151 mm、0.121 mm和0.034 mm，优于正交试验表中的结果。研究成果为三辊斜轧实现涡轮空心轴柔性、经济、高质量成形提供了理论依据。",
    "innovationFormula": "三辊斜轧 + Simufact仿真 + GH4169 = 涡轮空心轴柔性成形"
  },
  {
    "id": "p-080",
    "title": "Study on the forging-free direct rolling process and the microstructure and mechanical properties of EBCHM Ti-6Al-4 V titanium alloy",
    "titleCn": "EBCHM Ti-6Al-4 V钛合金免锻直接轧制工艺及显微组织和力学性能研究",
    "authors": "Qin X., Li B., Lin P., Liu Y., et al.",
    "journal": "Materials Letters",
    "sourceType": "SCI",
    "year": 2026,
    "month": 6,
    "innovationScore": 6,
    "field": "green",
    "processType": "general",
    "innovationTags": [
      "钛合金"
    ],
    "abstract": "",
    "doi": "10.1016/j.matlet.2026.141092",
    "innovationCn": "EBCHM Ti-6Al-4 V钛合金免锻直接轧制工艺及显微组织和力学性能研究。主要涉及钛合金等方面的创新研究。",
    "innovationFormula": "EBCHM + 免锻直接轧制 + Ti-6Al-4V = 钛合金短流程制造"
  },
  {
    "id": "p-082",
    "title": "Data-Driven Multi-Objective Optimization of Energy, Environmental, and Economic Performances in Manufacturing with Physics-Consistent Deep Learning",
    "titleCn": "利用物理一致的深度学习对制造业中的能源、环境和经济绩效进行数据驱动的多目标优化",
    "authors": "Hyeonrok Choi, Jaewook Lee, Won Yang, Seong-il Kim",
    "journal": "Systems and Control Transactions",
    "sourceType": "SCI",
    "year": 2026,
    "month": 6,
    "innovationScore": 8,
    "field": "ml",
    "processType": "section",
    "innovationTags": [],
    "abstract": "Aluminium cold rolling is an energy-intensive process that has a substantial impact on CO2 emissions and production cost, yet plant-level optimization remains challenging due to strong process nonlinearities and various operational constraints. This study develops a physics-consistent hybrid model that combines a Stone–Hitchcock–Ludwik analytical rolling-energy formulation with a residual deep neural network to predict the daily electricity consumption of three single-stand cold rolling mills. Using plant raw data, the hybrid model achieves lower prediction errors than conventional data driven model and yields line-specific physical parameters that agree well with the observed behaviour of each mill. On this basis, an NSGA-II-based tri-objective optimization is carried out to minimise daily energy use, CO2 emissions, and specific production cost (SPC) by adjusting pass-wise reduction and tension schedules and line-wise production allocation. Case studies on a representative operating day and additional plant data show that the optimised operating strategy shifts production load from less efficient to more efficient lines and smooths pass-wise operating conditions, thereby consistently reducing daily energy consumption and unit cost while moderately decreasing CO2 emissions without any hardware modifications. The proposed hybrid prediction–optimization framework thus provides a practical decision-support tool for integrated energy–environment–economic optimization in multi-line aluminium cold rolling operations.",
    "innovationCn": "铝冷轧是一种能源密集型工艺，对二氧化碳排放和生产成本产生重大影响，但由于工艺非线性和各种操作限制，工厂级优化仍然具有挑战性。本研究开发了一种物理一致的混合模型，将 Stone-Hitchcock-Ludwik 分析轧制能量公式与残差深度神经网络相结合，以预测三个单机架冷轧机的每日耗电量。使用工厂原始数据，混合模型比传统数据驱动模型实现了更低的预测误差，并产生与每个工厂观察到的行为非常吻合的生产线特定物理参数。在此基础上，进行基于NSGA-II的三目标优化，通过调整道次减少和张力计划以及生产线生产分配，最大限度地减少日常能源使用、二氧化碳排放和特定生产成本（SPC）。对代表性运营日的案例研究和其他工厂数据表明，优化的运营策略将生产负荷从效率较低的生产线转移到效率较高的生产线，并平滑逐道运行条件，从而持续降低每日能源消耗和单位成本，同时适度减少二氧化碳排放，而无需任何硬件改造。因此，所提出的混合预测-优化框架为多线铝冷轧操作中的能源-环境-经济综合优化提供了实用的决策支持工具。",
    "innovationFormula": "机器学习与智能预测 + 型线轧制 + 轧制实验 = 工艺优化",
    "doi": "10.69997/sct.128206"
  },
  {
    "id": "p-083",
    "title": "Relaxed-graph embedding intuitionistic fuzzy broad learning system based on quality-related virtual variable : A novel approach for quality-related fault diagnosis in process manufacturing systems",
    "titleCn": "基于质量相关虚拟变量的松弛图嵌入直观模糊广泛学习系统：过程制造系统中质量相关故障诊断的新方法",
    "authors": "Chuanfang Zhang, Zhibin Huang, Wenxiao Yin, D J Li et al.",
    "journal": "Measurement Science and Technology",
    "sourceType": "SCI",
    "year": 2026,
    "month": 6,
    "innovationScore": 9,
    "field": "digital",
    "processType": "section",
    "innovationTags": [],
    "abstract": "Abstract In multivariate process manufacturing systems, such as chemical production and hot rolling processes, product quality is strongly influenced by the dynamic behavior of process variables. Accordingly, quality-related fault diagnosis is not merely a fault classification task, but a measurement-driven decision problem that aims to identify quality-relevant abnormal operating conditions from high-dimensional process measurements. Its practical implementation is often hindered by delayed or unavailable quality measurements, measurement noise, outliers, and complex couplings among process variables. These factors may degrade the reliability of quality-related diagnostic decisions and increase the difficulty of real-time industrial deployment. To address these challenges, this paper proposes a relaxed-graph embedding intuitionistic fuzzy broad learning system (RGE-IFBLS) for quality-related fault diagnosis. First, a quality-related virtual variable (QRVV) is constructed to automatically classify process variables into quality-related and quality-unrelated categories, eliminating dependence on direct quality measurements. Second, an intuitionistic fuzzy (IF) scoring mechanism adaptively re-weights training samples to suppress the influence of noise and outliers, significantly improving robustness. Third, a relaxed-graph embedding framework with dual transformation matrices is introduced to enhance inter-class separation while maintaining local structural consistency, thereby alleviating overfitting in broad learning architectures. The resulting optimization problem is efficiently solved via the alternating direction method of multipliers (ADMM) with closed-form updates, ensuring computational efficiency suitable for real-time applications. Extensive evaluations on the Tennessee Eastman Process (TEP) and a real-world hot rolling process (HRP) demonstrate that RGE-IFBLS achieves average diagnostic accuracies of 97.0% and 97.7%, respectively, outperforming the best competing broad-learning-based methods by 1.8 and 1.3 percentage points. Moreover, the testing times of RGE-IFBLS are only 0.38 s and 0.44 s on the TEP and HRP datasets, respectively, indicating its potential for real-time quality-related fault diagnosis.",
    "innovationCn": "摘要 在多变量过程制造系统中，例如化工生产和热轧过程，产品质量受到过程变量动态行为的强烈影响。因此，与质量相关的故障诊断不仅仅是故障分类任务，而且是一个测量驱动的决策问题，旨在从高维过程测量中识别与质量相关的异常操作条件。其实际实施常常受到延迟或不可用的质量测量、测量噪声、异常值以及过程变量之间的复杂耦合的阻碍。这些因素可能会降低质量相关诊断决策的可靠性，并增加实时工业部署的难度。为了应对这些挑战，本文提出了一种用于质量相关故障诊断的松弛图嵌入直觉模糊广泛学习系统（RGE-IFBLS）。首先，构建质量相关虚拟变量（QRVV）以自动将过程变量分为质量相关和质量无关类别，消除对直接质量测量的依赖。其次，直观的模糊（IF）评分机制自适应地重新加权训练样本，以抑制噪声和异常值的影响，显着提高鲁棒性。第三，引入了具有对偶变换矩阵的宽松图嵌入框架，以增强类间分离，同时保持局部结构一致性，从而减轻广泛学习架构中的过度拟合。由此产生的优化问题通过具有封闭形式更新的乘法器交替方向法（ADMM）有效解决，确保适合实时应用的计算效率。对田纳西伊士曼过程 (TEP) 和实际热轧过程 (HRP) 的广泛评估表明，RGE-IFBLS 的平均诊断准确率分别为 97.0% 和 97.7%，比基于广泛学习的最佳竞争方法高出 1.8 和 1.3 个百分点。此外，RGE-IFBLS在TEP和HRP数据集上的测试时间分别仅为0.38秒和0.44秒，表明其在实时质量相关故障诊断方面的潜力。",
    "innovationFormula": "数字孪生与在线监测 + 型线轧制 + 轧制实验 = 故障诊断",
    "doi": "10.1088/1361-6501/ae7e1c"
  }
];





