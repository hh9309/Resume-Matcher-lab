import { BenchmarkCase } from '../types';

export const BENCHMARK_CASES: BenchmarkCase[] = [
  {
    id: 'case_llm_engineer',
    title: '大模型算法工程师 (LLM Algorithm Engineer)',
    industry: '人工智能 / AIGC',
    level: '资深 (Senior / Tech Lead)',
    icon: 'BrainCircuit',
    description: '负责千亿参数大语言模型预训练、SFT指令微调、RLHF对齐与vLLM/TensorRT-LLM高性能推理部署。',
    jdText: `【岗位职责】
1. 负责开源大模型（Llama-3、Qwen、DeepSeek等）的持续预训练、指令微调（SFT）与人类偏好对齐（RLHF/DPO）。
2. 主导分布式训练框架调优，熟练运用 DeepSpeed、Megatron-LM 进行流水线并行、张量并行及混合精度训练，解决显存瓶颈与梯度同步延迟。
3. 负责大模型推理加速与高并发部署，基于 vLLM、TensorRT-LLM、TGI 完成 PagedAttention、量化（AWQ/GPTQ/FP8）调优，降低 TTFT 与首字延迟。
4. 探索 Agentic Workflow、Function Calling 及 RAG 检索增强生成架构，提升大模型在垂直业务场景的准确率与幻觉抑制。

【任职要求】
1. 计算机、人工智能或相关专业硕士及以上学历，3年以上深度学习或自然语言处理（NLP）研发经验。
2. 熟练掌握 Python、PyTorch、CUDA 编程基础，深入理解 Transformer 核心架构与注意力机制。
3. 具备扎实的分布式训练实战经验，熟练掌握 DeepSpeed (ZeRO-1/2/3)、Megatron-LM 或 FSDP。
4. 熟练掌握 SFT 数据清洗配比、LoRA/QLoRA 高效微调、DPO/PPO 对齐算法。
5. 掌握 vLLM、PagedAttention、FlashAttention-2/3 等底层算子优化技术。
6. 加分项：在顶级会议（ACL、EMNLP、NeurIPS、ICLR）发表论文或开源大模型项目核心贡献者。`,
    resumes: {
      high: {
        name: '张晨 (92% 高匹配候选人)',
        expectedScore: 92,
        highlights: ['精通 PyTorch 与 Transformer 架构', '主导 DeepSpeed/Megatron 分布式微调', '深入掌握 vLLM 与 PagedAttention 显存优化', '有 ACL 论文与开源贡献'],
        text: `【个人基本信息】
张晨 | 硕士 | 5年工作经验 | 意向岗位：大模型算法专家 / 架构师

【专业技能】
- 核心语言与框架：精通 Python、PyTorch、CUDA，深入掌握 C++、Linux 环境开发。
- 架构与模型机理：深刻理解 Transformer、RoPE位置编码、RMSNorm、SwiGLU 激活函数及 FlashAttention-2 算子优化。
- 训练与微调：熟练掌握 Megatron-LM、DeepSpeed (ZeRO-3) 分布式训练，具备千卡集群训练稳定性保障经验；精通 SFT 全参微调、LoRA/QLoRA、DPO 对齐算法与数据配比工程。
- 推理与加速：深度实战 vLLM、TensorRT-LLM 部署落地，精通 PagedAttention 机制、KV Cache 压缩、AWQ 与 FP8 量化技术，TTFT 优化 45%。
- 业务落地：主导企业级 RAG 检索增强生成与 Agentic 工作流落地，结合向量数据库与重排模型抑制幻觉率。

【项目经历】
1. 百亿大语言模型领域微调与对齐优化（项目负责人）
- 带领团队针对 Qwen-72B 及 DeepSeek 架构进行行业领域持续预训练与 SFT，构建 150 万高质量多轮对话指令数据集。
- 基于 DeepSpeed ZeRO-3 与 FlashAttention 搭建训练流水线，单步迭代吞吐提升 32%；引入 DPO 算法优化安全对齐，模型在专业问答评测胜率达到 84.6%。
2. 企业级高并发大模型推理加速引擎研发
- 针对生产环境吞吐瓶颈，引入 vLLM 与 TensorRT-LLM 双引擎架构，结合 AWQ-4bit 量化与 PagedAttention 动态分配机制。
- 将模型首字延迟降低至 120ms，服务并发吞吐量（Tokens/sec）提升 3.8 倍，单机 GPU 显存占用下降 42%。

【学术与荣誉】
- 在 EMNLP 发表预训练模型领域适配论文一篇，GitHub 大模型微调工具库获 2.1k Star。`
      },
      medium: {
        name: '刘伟 (68% 中度匹配候选人)',
        expectedScore: 68,
        highlights: ['具备 Python 与 PyTorch 基础', '熟悉传统 NLP 与 BERT 文本分类', '掌握基础 LoRA 微调与 LangChain RAG', '缺乏千卡分布式训练与 vLLM 底层源码优化经验'],
        text: `【个人基本信息】
刘伟 | 本科 | 3年工作经验 | 意向岗位：算法工程师

【专业技能】
- 编程语言：熟练掌握 Python、SQL，了解 C++。
- 机器学习与NLP：熟悉 PyTorch、Scikit-Learn、Hugging Face Transformers 库，熟悉 BERT、TextCNN 等文本分类与实体识别模型。
- 大模型技术：了解大语言模型基本原理，曾使用 Hugging Face PEFT 库完成 LoRA 微调实验；熟悉 LangChain 框架与 Milvus 向量检索搭建知识库 RAG 系统。
- 工程工具：熟悉 Docker 容器化、Linux 操作、Git 版本控制。

【项目经历】
1. 企业智能客服知识库问答系统（NLP工程师）
- 基于 LangChain 与开源 ChatGLM 模型构建企业内部知识问答助手。
- 使用 BGE-large 稠密向量嵌入模型对内部文档进行切片分块与向量化存储，配合 Elasticsearch 实现混合检索。
- 采用 LoRA 对百川模型进行轻量级微调，提升特定业务术语匹配准确率。
2. 自动化文本分类与情感分析流水线
- 使用 BERT 预训练模型针对数十万条电商评论进行多标签文本分类，F1-score 达到 91.2%。
- 搭建 FastAPI 服务并使用 Docker 完成上线部署，支撑业务团队日常舆情监测。`
      },
      low: {
        name: '王小敏 (35% 跨界/低匹配候选人)',
        expectedScore: 35,
        highlights: ['前端与全栈开发背景', '使用过 OpenAI API 与前端 Prompt 编排', '完全缺乏 PyTorch、底层 CUDA、分布式训练与大模型算法经验'],
        text: `【个人基本信息】
王小敏 | 本科 | 4年工作经验 | 意向岗位：AI产品研发 / 算法工程师

【专业技能】
- 编程语言：精通 JavaScript、TypeScript、Node.js，熟悉 Python 基础语法。
- 前端技术栈：精通 React、Vue.js、Next.js、Tailwind CSS、WebGL。
- AI应用集成：熟练调用 OpenAI GPT-4 API、Claude API 与 百度千帆大模型 SDK，熟悉前端 Prompt 工程与流式打字机效果实现。
- 后端开发：熟悉 Express、Koa、MongoDB、MySQL，具备 RESTful API 设计能力。

【项目经历】
1. AIGC 智能图文创作 Web 平台
- 负责产品端到端设计与研发，接入 Midjourney 与 GPT-4 接口，支持多模态提示词自动扩写。
- 使用 React + Zustand 构建响应式前端界面，集成 Monaco Editor 实现提示词结构化高亮编辑。
2. 内部协同办公机器人
- 基于 Node.js 与飞书开放平台搭建对话机器人，根据用户输入意图调用第三方 AI 接口返回总结性摘要。`
      }
    }
  },
  {
    id: 'case_data_analyst',
    title: 'Python 数据分析师 (Data Analyst)',
    industry: '互联网 / 电商运营',
    level: '中高级 (Mid-Senior)',
    icon: 'BarChart3',
    description: '深度负责电商业务埋点归因、A/B测试实验设计、用户留存漏斗与 Tableau / PowerBI 商业智能看板看板构建。',
    jdText: `【岗位职责】
1. 深入业务线，构建用户全生命周期生命周期运营指标体系，负责核心电商业务大盘监控、漏斗转化与留存分析。
2. 负责 A/B 测试全流程，包括样本量估计、正交实验分流设计、统计假设检验（T检验/卡方检验）及显著性分析。
3. 熟练运用 Python (Pandas, NumPy) 与 SQL 进行海量行为日志清洗、ETL 数据抽取与复杂归因建模。
4. 搭建企业级商业智能看板（Tableau / PowerBI），为运营与管理层提供敏锐的商业决策支持与异常异动归因。

【任职要求】
1. 本科及以上学历，统计学、数学、计算机或信息管理相关专业，2年以上数据分析经验。
2. 精通 SQL 复杂查询（窗口函数、多表关联、CTE子查询、调优），熟练掌握 Python 数据分析库（Pandas, NumPy, Matplotlib, Seaborn）。
3. 深入理解统计学理论，熟练掌握假设检验、置信区间、回归分析与相关系数检验。
4. 熟练使用 Tableau、PowerBI 或 FineBI 制作交互式可视化仪表盘。
5. 具备敏锐的商业洞察力与沟通协调能力，能独立完成高质量数据分析报告与专项复盘。`,
    resumes: {
      high: {
        name: '赵子轩 (91% 高匹配候选人)',
        expectedScore: 91,
        highlights: ['精通 SQL 窗口函数与海量数据 ETL', '熟练运用 Pandas/NumPy 统计建模', '主导过 50+ 场 A/B 测试与假设检验', '精通 Tableau 动态看板与归因分析'],
        text: `【个人基本信息】
赵子轩 | 统计学学士 | 3年经验 | 意向岗位：高级数据分析师

【专业技能】
- 数据查询与处理：精通 SQL（熟练编写复杂窗口函数 ROW_NUMBER/RANK、CTE 递归、GROUPING SETS，具备 Hive/Presto 查询调优经验）。
- 统计分析与编程：精通 Python (Pandas, NumPy, Scipy, Statsmodels)，熟练进行数据清洗、缺失值处理、特征工程与描述性统计。
- 实验设计：精通 A/B 测试统计理论，熟练计算最小样本量（MDE/Power分析），熟练运用 T检验、卡方检验、Mann-Whitney U非参数检验评估实验显著性。
- 可视化与BI：精通 Tableau、PowerBI 高级建模（LOD 表达式、动态度量），熟练使用 Seaborn 绘制热力图、小提琴图。

【项目经历】
1. 电商大促用户转化漏斗与流量归因分析（主导分析师）
- 使用 SQL 对千万级用户浏览、加购、结算链路进行漏斗建模，定位移动端在支付环节的掉单异动。
- 运用 Python 编写生命周期归因算法，重新核算各渠道投入产出比（ROI），协助运营优化预算投放分配，带动整体 GMV 提升 14.2%。
2. 推荐算法改版 A/B 实验设计与效果评估
- 负责双十一首页千人千面推荐算法迭代的 A/B 实验分流方案设计，计算功效为 80% 时的样本量。
- 进行双样本 T 检验与方差分析（ANOVA），验证改版后次日留存率提升 1.87%（p < 0.01 具有统计显著性）。
3. 全渠道运营 Tableau 核心指标自动化看板
- 建立涵盖活跃度、客单价、复购率的标准化数据字典与指标矩阵，实现每日数据增量自动刷新。`
      },
      medium: {
        name: '孙敏 (66% 中度匹配候选人)',
        expectedScore: 66,
        highlights: ['熟练掌握 SQL 与 Excel 报表制作', '掌握基础 Python 语法', '缺乏严谨的 A/B 测试假设检验实战与复杂 Tableau 建模经验'],
        text: `【个人基本信息】
孙敏 | 管理学学士 | 2年经验 | 意向岗位：数据分析师

【专业技能】
- 数据工具：熟练掌握 SQL（SELECT、JOIN、GROUP BY、HAVING），精通 Excel（VLOOKUP、数据透视表、基础 VBA 宏）。
- 编程语言：熟悉 Python 基础语法，曾使用 Pandas 读取 CSV 文件进行简单的汇总过滤。
- 报表工具：了解 PowerBI 与 FineBI 基础图表拖拽配置。
- 业务理解：熟悉电商日常销售日报、周报跟踪，了解留存率与转化率基本概念。

【项目经历】
1. 销售运营数据日常监控与周报自动化
- 负责提取每日订单数据并录入 Excel，通过数据透视表跟踪销售达成进度与缺货预警。
- 编写 SQL 脚本提取每月用户复购频次，制作简单折线图向部门主管汇报。
2. 用户问卷调研与满意度统计
- 整理 3000 份售后问卷调查数据，利用 Excel 图表进行百分比结构拆解与文字归纳。`
      },
      low: {
        name: '韩磊 (32% 跨界/低匹配候选人)',
        expectedScore: 32,
        highlights: ['偏硬件运维与网络工程', '仅在大学学习过基础 C 语言与 Access 数据库', '完全无电商业务分析、Pandas 统计与 A/B 测试经验'],
        text: `【个人基本信息】
韩磊 | 网络工程专科 | 3年经验 | 意向岗位：IT支持 / 数据专员

【专业技能】
- 运维技能：精通局域网组网、交换机配置、Windows Server / CentOS 服务器维护。
- 软件工具：熟练使用 Office 办公套件、Visio 拓扑绘制、MySQL 简单数据库备份。
- 编程能力：了解基础 Shell 脚本自动化编写与 HTML 静态页面搭建。

【项目经历】
1. 办公局域网改造与防火墙策略配置
- 负责公司 200 台终端设备的网络巡检与 IP 地址规划，配置 VLAN 隔离研发网络。
2. 企业资产管理数据库日常维护
- 定期对 IT 固定资产进行编号归档与数据库状态变更录入。`
      }
    }
  },
  {
    id: 'case_fullstack_architect',
    title: '全栈开发架构师 (Full Stack Architect)',
    industry: '企业级 SaaS / 云计算',
    level: '架构师 (Staff / Principal)',
    icon: 'Layers',
    description: '负责高并发、微服务架构设计，前后端深度融合（React 19 / TypeScript / Go / Node / Redis / Docker / K8s）。',
    jdText: `【岗位职责】
1. 主导企业级高可用 SaaS 平台的前后端架构设计与演进，保障系统在万级 QPS 下的低延迟与 99.99% 可用性。
2. 前端架构：精通 React、TypeScript、Next.js 现代化服务端渲染（SSR）与前端性能调优（Lighthouse 核心指标）。
3. 后端架构：深入掌握 Go / Node.js 微服务架构，熟练设计 gRPC 通信协议、分布式缓存（Redis）、异步消息队列（Kafka/RabbitMQ）。
4. 基础设施：熟练掌握 Docker 容器化、Kubernetes (K8s) 编排部署、CI/CD 流水线与可观测性监控体系（Prometheus, Grafana）。

【任职要求】
1. 计算机相关专业本科及以上，5年以上全栈开发及系统架构设计经验。
2. 前端精通 React、TypeScript、状态管理（Zustand/Redux）与工程化打包工具（Vite, Webpack）。
3. 后端精通 Go 或 Node.js 高并发编程，深入理解并发模型、Goroutine、Event Loop 与内存泄露排查。
4. 精通 MySQL / PostgreSQL 事务隔离级别、索引优化与分库分表；熟练掌握 Redis 分布式锁与缓存穿透/雪崩防护。
5. 具备云原生架构理念，熟练运用 Docker、K8s、Nginx 反向代理与 CI/CD 自动化构建。`,
    resumes: {
      high: {
        name: '林昊 (93% 高匹配候选人)',
        expectedScore: 93,
        highlights: ['精通 React/TypeScript 与 Next.js SSR', '精通 Go/Node.js 高并发微服务与 gRPC', '深度掌握 Redis 缓存防护与 MySQL 调优', '精通 Docker/K8s 云原生部署与 CI/CD'],
        text: `【个人基本信息】
林昊 | 计算机硕士 | 7年全栈与架构经验 | 意向岗位：全栈架构师 / 技术专家

【专业技能】
- 前端体系：精通 React (Hooks/Fiber/Concurrent)、TypeScript、Next.js、Tailwind CSS，深入掌握前端性能调优（FCP/LCP/CLS），构建微前端底座。
- 后端架构：精通 Go (Gin, gRPC, Goroutine/Channel 并发控制)、Node.js (NestJS, Event Loop 优化)，熟练实现分布式跟踪（OpenTelemetry）。
- 数据库与中间件：深入掌握 PostgreSQL / MySQL 事务隔离、B+树索引调优、读写分离与分库分表；精通 Redis 高可用架构（哨兵/集群、分布式锁 Redlock、布隆过滤器防击穿）。
- 云原生与DevOps：熟练掌握 Docker、Kubernetes (Pod/Service/Ingress 拓扑)、GitLab CI/CD、Helm 编排与 Prometheus/Grafana 监控告警。

【项目经历】
1. 千万级用户 SaaS 平台微服务架构重构（核心架构师）
- 主导平台由单体架构向微服务解耦演进，采用 Go + gRPC 构建服务间高速通信链路，核心接口吞吐量提升 280%，P99 延迟降至 35ms。
- 前端采用 React 19 + TypeScript 重构后台控制台，实现动态路由懒加载与组件级代码分割，首屏包体积减少 55%。
2. 高并发抢购与分布式库存一致性方案
- 设计基于 Redis Lua 脚本与消息队列解耦的库存扣减引擎，有效抵御瞬时 15,000 QPS 流量洪峰，实现零超卖与数据最终一致性。
- 配置 Kubernetes HPA 弹性伸缩策略与 Ingress 流量限流，保障线上 99.99% 高可用。`
      },
      medium: {
        name: '陈宇 (67% 中度匹配候选人)',
        expectedScore: 67,
        highlights: ['熟练掌握 Vue.js 与 React 前端技术', '具备 Express/Node.js 基础开发经验', '熟悉 MySQL 与单机 Docker', '缺乏大型 Go 微服务架构、K8s 编排与高并发调优经验'],
        text: `【个人基本信息】
陈宇 | 软件工程学士 | 3年经验 | 意向岗位：全栈工程师

【专业技能】
- 前端开发：熟练掌握 React、Vue 3、JavaScript、CSS3，熟悉 Webpack 与 Vite 构建工具。
- 后端开发：熟练使用 Node.js (Express, Koa) 进行后端 RESTful API 接口开发，了解 Python 脚本编写。
- 数据库：熟悉 MySQL 基本增删改查、外键关联，了解 Redis 键值缓存基本用法。
- 工程工具：熟悉 Git 操作，能编写基本 Dockerfile 镜像打包，熟悉 Linux 基础指令。

【项目经历】
1. 企业官网与内容管理后台（全栈工程师）
- 使用 Vue 3 + Element Plus 构建管理后台，配合 Node.js (Express) 与 MySQL 实现文章发布、角色权限认证。
- 编写 RESTful 接口支持多图上传与分类检索，使用 Docker 将服务部署在单台腾讯云轻量服务器。
2. 移动端 H5 营销活动页面
- 基于 React 封装通用转盘抽奖与表单填写组件，解决 iOS 软键盘遮挡兼容性问题。`
      },
      low: {
        name: '周斌 (34% 跨界/低匹配候选人)',
        expectedScore: 34,
        highlights: ['传统桌面客户端开发背景', '主要使用 C# / WinForms / .NET', '缺乏现代化 React 前端生态、微服务与云原生技术栈'],
        text: `【个人基本信息】
周斌 | 信息工程学士 | 4年经验 | 意向岗位：软件开发工程师

【专业技能】
- 桌面开发：精通 C#、.NET Framework、WinForms、WPF 客户端程序研发。
- 数据库：熟练使用 SQL Server 数据库，熟悉存储过程编写与视图设计。
- 其他技能：了解网络 Socket 通信编程、多线程操作与串口通信协议。

【项目经历】
1. 工厂产线仓储条码扫描上位机软件
- 使用 C# WinForms 研发仓储管理客户端，对接条码扫描枪与电子秤串口读取称重数据。
- 通过 ADO.NET 将扫描记录批量存入 SQL Server 数据库，支持 Excel 报表打印。`
      }
    }
  },
  {
    id: 'case_quant_researcher',
    title: '量化策略研究员 (Quantitative Strategy Researcher)',
    industry: '量化私募 / 对冲基金',
    level: '研究员 (Quant Researcher)',
    icon: 'TrendingUp',
    description: '负责股票多头、多因子选股、CTA时间序列预测、Barra风险模型构建与高性能 C++/Python 回测框架开发。',
    jdText: `【岗位职责】
1. 负责中高频股票/期货量化策略的研发，包括量价特征工程、基本面因子挖掘、另类数据分析与超额收益（Alpha）预测。
2. 构建并维护严谨的多因子选股框架与组合优化系统，深入运用 Barra 风险模型进行风格因子暴露度约束与最大回撤控制。
3. 负责高仿真策略回测系统设计，精确模拟滑点、冲击成本、涨跌停限制与交易费用，杜绝前视偏差（Look-ahead Bias）。
4. 熟练运用 C++ 进行策略执行层性能调优与低延迟订单路由，结合 Python (NumPy, SciPy, Pandas) 进行科学统计建模。

【任职要求】
1. 985/海外名校硕士及以上学历，数学、物理、金融工程、计算机相关专业，具备扎实的数理统计与随机过程功底。
2. 精通 Python 科学计算（NumPy, SciPy, Pandas, Statsmodels）与 C++ 现代语法（C++17/20, STL, 多线程）。
3. 深入理解现代投资组合理论（MPT）、多因子模型、Fama-French三因子/五因子模型与 Barra 风险结构。
4. 熟练掌握时间序列分析（ARIMA, GARCH）、机器学习预测模型（LightGBM, XGBoost, LSTM）与夏普比率/信息比率（IC/IR）评估。
5. 严谨求实，具备强抗压能力与独立研究自驱力，有实盘 Alpha 策略盈利记录者优先。`,
    resumes: {
      high: {
        name: '宋若曦 (94% 高匹配候选人)',
        expectedScore: 94,
        highlights: ['数学系硕博背景，精通随机过程与统计推断', '精通 Python 因子挖掘与 C++ 高性能回测', '深入掌握 Barra 风险模型与组合优化凸优化求解', '具备实盘 Alpha 策略盈利与高 IC/IR 指标'],
        text: `【个人基本信息】
宋若曦 | 金融工程硕士 / 数学学士 | 4年量化投研经验 | 意向岗位：中频股票量化策略研究员

【专业技能】
- 编程语言：精通 Python (NumPy, SciPy, Pandas, Polars)、现代 C++ (C++17, 模板元编程, 多线程高并发回测框架)。
- 因子挖掘与特征工程：精通量价因子挖掘（成交量分布、微观结构流动性因子、订单簿微观不平衡度），累计挖掘有效因子 200+，Rank IC 均值 0.082，ICIR > 2.4。
- 组合优化与风控：精通 Barra 结构化风险模型，熟练使用 CVXPY / Gurobi 求解具有换手率与行业风格中性化约束的凸优化投资组合问题。
- 回测工程：独立使用 C++ / Python 构建事件驱动型（Event-driven）高仿真回测引擎，严格防范前视偏差与幸存者偏差。

【实盘与项目经历】
1. A股全市场中频量化多因子选股策略研发（实盘资金 1.2 亿元）
- 基于高频 Level-2 行情快照数据提炼分钟级微观价量特征，运用残差回归剔除市值、行业与动量风格暴露。
- 引入正交化施密特变换消除因子多重共线性，组合经过 Barra 风险中性化后，实盘年化超额收益率 21.6%，信息比率（IR）达 2.85，最大回撤控制在 5.4% 以内。
2. 跨品种期货 CTA 动量与期限结构套利策略
- 建立基于 GARCH 波动率自适应滤波的时间序列动量模型，结合展期收益率进行仓位动态加权，在震荡市中表现出优异抗跌属性。`
      },
      medium: {
        name: '马俊 (65% 中度匹配候选人)',
        expectedScore: 65,
        highlights: ['金融学硕士，熟悉金融学理论与股票指标', '熟练掌握 Python Pandas 数据清洗', '熟悉技术指标（MACD/KDJ）回测', '缺乏深度数理统计建模、Barra 风险归因与 C++ 底层底层框架经验'],
        text: `【个人基本信息】
马俊 | 金融硕士 | 2年经验 | 意向岗位：量化研究员 / 投资助理

【专业技能】
- 编程语言：熟练使用 Python、SQL，了解 R 语言基础。
- 数据分析：熟练掌握 Pandas、NumPy，熟悉 Tushare、AkShare 开源金融数据接口拉取。
- 策略开发：熟悉基于 Backtrader 的技术指标双均线、MACD 突破与布林带通道策略回测。
- 金融理论：通过 CFA 二级，熟悉股票基本面财务报表分析与市盈率（PE/PB）估值模型。

【项目经历】
1. 基于 Backtrader 的行业轮动与双均线策略回测
- 抓取沪深300指数过去5年历史日K线数据，编写双均线金叉死叉交易逻辑，统计胜率与最大回撤。
- 尝试加入行业景气度评分进行简单的选股过滤，年化收益率达到 12.3%。
2. 券商研报金股组合跟踪与收益归因分析
- 每月整理券商金股推荐清单，计算组合相对大盘的超额收益率，制作 PPT 研报向投资经理汇报。`
      },
      low: {
        name: '吴凯 (31% 跨界/低匹配候选人)',
        expectedScore: 31,
        highlights: ['银行柜面及理财销售背景', '持有基金从业资格', '缺乏 Python/C++ 编程能力与严谨量化策略研发经验'],
        text: `【个人基本信息】
吴凯 | 经济学学士 | 3年经验 | 意向岗位：投资顾问 / 理财经理

【专业技能】
- 业务能力：精通公募基金、固收理财产品销售话术与高净值客户资产配置方案制定。
- 办公技能：精通 Excel 制作客户资产流水账目、PPT 演讲路演。
- 专业证书：持有证券从业资格证、基金从业资格证、AFP 金融理财师认证。

【工作经历】
1. 商业银行零售客户经理
- 维护辖区 300+ 贵宾客户，达成年度基金代销指标 4500 万元，荣获分行优秀销售标兵称号。
- 组织线上财富沙龙活动，向客户宣讲宏观经济走势与资产分散配置理念。`
      }
    }
  }
];
