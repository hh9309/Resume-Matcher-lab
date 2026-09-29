import { MatchAnalysisResult, TermWeight, SemanticPoint2D, Vector3DPoint } from '../types';

// Stopwords dictionary (Chinese & English common noise words)
export const STOPWORDS = new Set([
  '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到',
  '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '等', '及', '与', '并', '或',
  '针对', '基于', '负责', '熟练', '精通', '熟悉', '掌握', '具有', '具备', '参与', '主导', '能够', '相关',
  '以及', '进行', '完成', '提供', '要求', '岗位', '职责', '学历', '年限', '经验', '专业', '本科', '硕士',
  '工作', '团队', '项目', '能力', '优化', '提升', '保障', '维护', '设计', '研发', '开发', '实现', '系统',
  '平台', '业务', '技术', '以上', '良好', '优秀', '深入', '扎实', '探索', '加分项', '个人', '基本信息',
  'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is',
  'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'but', 'if',
  'or', 'because', 'as', 'until', 'while', 'about', 'against', 'between', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
  'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
  'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just'
]);

// Curated technical domain dictionary for accurate compound tokenization
export const TECHNICAL_DICTIONARY: { [key: string]: { category: 'ai' | 'backend' | 'data' | 'quant' | 'general' | 'tool'; importance: 'high' | 'medium' | 'low'; cluster: string } } = {
  // AI / LLM
  'pytorch': { category: 'ai', importance: 'high', cluster: 'AI_DeepLearning' },
  'python': { category: 'ai', importance: 'high', cluster: 'Language' },
  'transformer': { category: 'ai', importance: 'high', cluster: 'AI_DeepLearning' },
  'vllm': { category: 'ai', importance: 'high', cluster: 'AI_Inference' },
  'deepspeed': { category: 'ai', importance: 'high', cluster: 'AI_Training' },
  'megatron-lm': { category: 'ai', importance: 'high', cluster: 'AI_Training' },
  'tensorrt-llm': { category: 'ai', importance: 'high', cluster: 'AI_Inference' },
  'sft': { category: 'ai', importance: 'high', cluster: 'AI_Training' },
  'rlhf': { category: 'ai', importance: 'high', cluster: 'AI_Alignment' },
  'dpo': { category: 'ai', importance: 'high', cluster: 'AI_Alignment' },
  'pagedattention': { category: 'ai', importance: 'high', cluster: 'AI_Inference' },
  'flashattention': { category: 'ai', importance: 'high', cluster: 'AI_Inference' },
  'flashattention-2': { category: 'ai', importance: 'high', cluster: 'AI_Inference' },
  'lora': { category: 'ai', importance: 'high', cluster: 'AI_Training' },
  'qlora': { category: 'ai', importance: 'high', cluster: 'AI_Training' },
  'cuda': { category: 'ai', importance: 'high', cluster: 'LowLevel' },
  'rag': { category: 'ai', importance: 'high', cluster: 'AI_Agentic' },
  'agentic': { category: 'ai', importance: 'medium', cluster: 'AI_Agentic' },
  'bert': { category: 'ai', importance: 'medium', cluster: 'AI_DeepLearning' },
  'hugging face': { category: 'ai', importance: 'medium', cluster: 'AI_DeepLearning' },
  'langchain': { category: 'ai', importance: 'medium', cluster: 'AI_Agentic' },
  '自然语言处理': { category: 'ai', importance: 'high', cluster: 'AI_DeepLearning' },
  '深度学习': { category: 'ai', importance: 'high', cluster: 'AI_DeepLearning' },
  '大语言模型': { category: 'ai', importance: 'high', cluster: 'AI_DeepLearning' },
  '量化': { category: 'ai', importance: 'medium', cluster: 'AI_Inference' },
  '知识库': { category: 'ai', importance: 'medium', cluster: 'AI_Agentic' },
  '注意力机制': { category: 'ai', importance: 'high', cluster: 'AI_DeepLearning' },

  // Data / Analytics
  'sql': { category: 'data', importance: 'high', cluster: 'Data_Analytics' },
  'pandas': { category: 'data', importance: 'high', cluster: 'Data_Analytics' },
  'numpy': { category: 'data', importance: 'high', cluster: 'Data_Analytics' },
  'tableau': { category: 'data', importance: 'high', cluster: 'Data_BI' },
  'powerbi': { category: 'data', importance: 'high', cluster: 'Data_BI' },
  'finebi': { category: 'data', importance: 'medium', cluster: 'Data_BI' },
  'a/b测试': { category: 'data', importance: 'high', cluster: 'Data_Stats' },
  '假设检验': { category: 'data', importance: 'high', cluster: 'Data_Stats' },
  '统计学': { category: 'data', importance: 'high', cluster: 'Data_Stats' },
  '窗口函数': { category: 'data', importance: 'high', cluster: 'Data_Analytics' },
  'etl': { category: 'data', importance: 'medium', cluster: 'Data_Analytics' },
  '数据清洗': { category: 'data', importance: 'medium', cluster: 'Data_Analytics' },
  '数据透视表': { category: 'data', importance: 'medium', cluster: 'Data_BI' },
  '回归分析': { category: 'data', importance: 'medium', cluster: 'Data_Stats' },
  '漏斗分析': { category: 'data', importance: 'medium', cluster: 'Data_Analytics' },
  '留存分析': { category: 'data', importance: 'medium', cluster: 'Data_Analytics' },
  '归因分析': { category: 'data', importance: 'medium', cluster: 'Data_Analytics' },
  't检验': { category: 'data', importance: 'medium', cluster: 'Data_Stats' },
  '卡方检验': { category: 'data', importance: 'medium', cluster: 'Data_Stats' },
  'seaborn': { category: 'data', importance: 'medium', cluster: 'Data_Analytics' },

  // Backend / Fullstack / Cloud
  'react': { category: 'backend', importance: 'high', cluster: 'Web_Frontend' },
  'typescript': { category: 'backend', importance: 'high', cluster: 'Language' },
  'javascript': { category: 'backend', importance: 'medium', cluster: 'Language' },
  'next.js': { category: 'backend', importance: 'high', cluster: 'Web_Frontend' },
  'vue.js': { category: 'backend', importance: 'medium', cluster: 'Web_Frontend' },
  'node.js': { category: 'backend', importance: 'high', cluster: 'Web_Backend' },
  'go': { category: 'backend', importance: 'high', cluster: 'Web_Backend' },
  'golang': { category: 'backend', importance: 'high', cluster: 'Web_Backend' },
  'grpc': { category: 'backend', importance: 'high', cluster: 'Web_Backend' },
  'redis': { category: 'backend', importance: 'high', cluster: 'Web_Storage' },
  'mysql': { category: 'backend', importance: 'high', cluster: 'Web_Storage' },
  'postgresql': { category: 'backend', importance: 'high', cluster: 'Web_Storage' },
  'docker': { category: 'backend', importance: 'high', cluster: 'Cloud_DevOps' },
  'kubernetes': { category: 'backend', importance: 'high', cluster: 'Cloud_DevOps' },
  'k8s': { category: 'backend', importance: 'high', cluster: 'Cloud_DevOps' },
  'ci/cd': { category: 'backend', importance: 'high', cluster: 'Cloud_DevOps' },
  '微服务': { category: 'backend', importance: 'high', cluster: 'Web_Backend' },
  '高并发': { category: 'backend', importance: 'high', cluster: 'Web_Backend' },
  '分布式缓存': { category: 'backend', importance: 'high', cluster: 'Web_Storage' },
  '消息队列': { category: 'backend', importance: 'high', cluster: 'Web_Backend' },
  'prometheus': { category: 'backend', importance: 'medium', cluster: 'Cloud_DevOps' },
  'grafana': { category: 'backend', importance: 'medium', cluster: 'Cloud_DevOps' },
  'kafka': { category: 'backend', importance: 'high', cluster: 'Web_Backend' },

  // Quant / Finance
  'c++': { category: 'quant', importance: 'high', cluster: 'LowLevel' },
  'barra': { category: 'quant', importance: 'high', cluster: 'Quant_Model' },
  '多因子模型': { category: 'quant', importance: 'high', cluster: 'Quant_Model' },
  '时间序列': { category: 'quant', importance: 'high', cluster: 'Quant_Model' },
  '因子挖掘': { category: 'quant', importance: 'high', cluster: 'Quant_Strategy' },
  '高频回测': { category: 'quant', importance: 'high', cluster: 'Quant_Strategy' },
  '回测系统': { category: 'quant', importance: 'high', cluster: 'Quant_Strategy' },
  '夏普比率': { category: 'quant', importance: 'high', cluster: 'Quant_Metric' },
  '信息比率': { category: 'quant', importance: 'high', cluster: 'Quant_Metric' },
  'alpha': { category: 'quant', importance: 'high', cluster: 'Quant_Strategy' },
  'cta': { category: 'quant', importance: 'high', cluster: 'Quant_Strategy' },
  '凸优化': { category: 'quant', importance: 'high', cluster: 'Quant_Model' },
  '投资组合': { category: 'quant', importance: 'medium', cluster: 'Quant_Model' },
  'backtrader': { category: 'quant', importance: 'medium', cluster: 'Quant_Strategy' },
  'garch': { category: 'quant', importance: 'medium', cluster: 'Quant_Model' },
  'arima': { category: 'quant', importance: 'medium', cluster: 'Quant_Model' },
};

// 2D Cluster Positions for Dense Embedding Projection
export const SEMANTIC_CLUSTER_COORDINATES: { [cluster: string]: { cx: number; cy: number; label: string; color: string } } = {
  AI_DeepLearning: { cx: 220, cy: 160, label: '深度学习 & 基础架构', color: '#6366f1' },
  AI_Training: { cx: 180, cy: 220, label: '大模型训练与微调', color: '#8b5cf6' },
  AI_Inference: { cx: 280, cy: 190, label: '推理加速 & 显存优化', color: '#a855f7' },
  AI_Alignment: { cx: 200, cy: 280, label: '偏好对齐 (RLHF/DPO)', color: '#ec4899' },
  AI_Agentic: { cx: 320, cy: 260, label: 'Agentic & RAG 检索', color: '#d946ef' },

  Data_Analytics: { cx: 580, cy: 150, label: '数据分析 & 处理 (Pandas/SQL)', color: '#0ea5e9' },
  Data_BI: { cx: 650, cy: 190, label: '商业智能看板 (BI/Tableau)', color: '#06b6d4' },
  Data_Stats: { cx: 530, cy: 230, label: '统计理论与 A/B 测试', color: '#14b8a6' },

  Web_Frontend: { cx: 480, cy: 420, label: '前端架构 (React/Next)', color: '#10b981' },
  Web_Backend: { cx: 380, cy: 460, label: '后端高并发 (Go/Node/gRPC)', color: '#059669' },
  Web_Storage: { cx: 440, cy: 520, label: '存储与中间件 (Redis/MySQL)', color: '#047857' },
  Cloud_DevOps: { cx: 300, cy: 440, label: '云原生与运维 (Docker/K8s)', color: '#3b82f6' },

  Quant_Model: { cx: 720, cy: 420, label: '量化模型与风控 (Barra/多因子)', color: '#f59e0b' },
  Quant_Strategy: { cx: 780, cy: 470, label: 'Alpha策略与回测 (C++/CTA)', color: '#d97706' },
  Quant_Metric: { cx: 680, cy: 490, label: '量化指标 (Sharpe/IC/IR)', color: '#b45309' },

  Language: { cx: 450, cy: 300, label: '通用编程语言 (Python/TS)', color: '#64748b' },
  LowLevel: { cx: 360, cy: 340, label: '底层系统与并行 (CUDA/C++)', color: '#475569' },
};

/**
 * Robust Tokenizer for bilingual technical texts
 */
export function tokenizeText(text: string): string[] {
  if (!text) return [];
  const normalized = text.toLowerCase();
  const tokens: string[] = [];

  // Match known technical compound phrases first
  const knownKeys = Object.keys(TECHNICAL_DICTIONARY).sort((a, b) => b.length - a.length);
  let workingText = normalized;

  for (const key of knownKeys) {
    // Regex for word boundary or Chinese characters
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'gi');
    let match;
    while ((match = regex.exec(workingText)) !== null) {
      tokens.push(key);
    }
    // Replace matched with spaces to avoid double counting
    workingText = workingText.replace(regex, ' '.repeat(key.length));
  }

  // Then extract English words, numbers, and Chinese 2-4 character n-grams
  const englishWords = workingText.match(/[a-z0-9+#.-]{2,}/g) || [];
  for (const word of englishWords) {
    const clean = word.trim().replace(/^[-.]+|[-.]+$/g, '');
    if (clean.length > 1 && !STOPWORDS.has(clean)) {
      tokens.push(clean);
    }
  }

  // Extract Chinese characters/words
  const chineseChunks = workingText.match(/[\u4e00-\u9fa5]{2,6}/g) || [];
  for (const chunk of chineseChunks) {
    if (!STOPWORDS.has(chunk)) {
      tokens.push(chunk);
    }
    // Also split into 2-character bi-grams if length >= 4
    if (chunk.length >= 4) {
      for (let i = 0; i < chunk.length - 1; i += 2) {
        const sub = chunk.slice(i, i + 2);
        if (!STOPWORDS.has(sub)) {
          tokens.push(sub);
        }
      }
    }
  }

  return tokens.filter(t => !STOPWORDS.has(t) && t.length > 1);
}

/**
 * Calculates full TF-IDF, Cosine Similarity, Dense Projection and detailed metrics
 */
export function calculateMatchAnalysis(
  jdText: string,
  resumeText: string,
  sublinearTf: boolean = true
): MatchAnalysisResult {
  const jdTokens = tokenizeText(jdText);
  const resumeTokens = tokenizeText(resumeText);

  // Frequency count maps
  const jdTfRaw: { [term: string]: number } = {};
  for (const t of jdTokens) {
    jdTfRaw[t] = (jdTfRaw[t] || 0) + 1;
  }

  const resumeTfRaw: { [term: string]: number } = {};
  for (const t of resumeTokens) {
    resumeTfRaw[t] = (resumeTfRaw[t] || 0) + 1;
  }

  // Joint vocabulary
  const vocabSet = new Set<string>([...Object.keys(jdTfRaw), ...Object.keys(resumeTfRaw)]);
  const vocab = Array.from(vocabSet);

  // Compute Document Frequency (DF) across the 2 documents + pseudo-corpus prior
  const N = 2; // Total docs in active pair
  const termWeights: TermWeight[] = [];

  let dotProductSum = 0;
  let jdSumSquares = 0;
  let resumeSumSquares = 0;

  for (const term of vocab) {
    const jCount = jdTfRaw[term] || 0;
    const rCount = resumeTfRaw[term] || 0;

    // Document Frequency DF(t)
    let df = 0;
    if (jCount > 0) df += 1;
    if (rCount > 0) df += 1;

    // Standard Scikit-learn smooth IDF formula: ln((1 + N) / (1 + DF)) + 1
    const idf = Math.log((1 + N) / (1 + df)) + 1;

    // Term Frequency (TF): sublinear: 1 + ln(tf) if tf > 0 else 0
    let jdTfVal = jCount;
    let resumeTfVal = rCount;

    if (sublinearTf) {
      jdTfVal = jCount > 0 ? 1 + Math.log(jCount) : 0;
      resumeTfVal = rCount > 0 ? 1 + Math.log(rCount) : 0;
    } else {
      jdTfVal = jdTokens.length > 0 ? jCount / jdTokens.length : 0;
      resumeTfVal = resumeTokens.length > 0 ? rCount / resumeTokens.length : 0;
    }

    const jdWeight = jdTfVal * idf;
    const resumeWeight = resumeTfVal * idf;

    jdSumSquares += jdWeight * jdWeight;
    resumeSumSquares += resumeWeight * resumeWeight;

    const termDot = jdWeight * resumeWeight;
    dotProductSum += termDot;

    let status: 'matched' | 'missing' | 'surplus' = 'matched';
    if (jCount > 0 && rCount > 0) {
      status = 'matched';
    } else if (jCount > 0 && rCount === 0) {
      status = 'missing';
    } else {
      status = 'surplus';
    }

    const techInfo = TECHNICAL_DICTIONARY[term];

    termWeights.push({
      term,
      category: techInfo?.category || 'general',
      jdTf: jCount,
      jdIdf: Number(idf.toFixed(3)),
      jdWeight: Number(jdWeight.toFixed(3)),
      resumeTf: rCount,
      resumeIdf: Number(idf.toFixed(3)),
      resumeWeight: Number(resumeWeight.toFixed(3)),
      dotProduct: Number(termDot.toFixed(3)),
      status,
      importance: techInfo?.importance || (jCount > 1 ? 'high' : 'medium'),
    });
  }

  // Calculate L2 norms
  const jdNorm = Math.sqrt(jdSumSquares);
  const resumeNorm = Math.sqrt(resumeSumSquares);

  // Sparse Cosine Similarity = (u · v) / (||u|| * ||v||)
  let sparseCosine = 0;
  if (jdNorm > 0 && resumeNorm > 0) {
    sparseCosine = dotProductSum / (jdNorm * resumeNorm);
  }
  // Clamp between 0 and 1
  sparseCosine = Math.max(0, Math.min(1, sparseCosine));

  // Cosine Angle theta
  const angleRadians = Math.acos(sparseCosine);
  const angleDegrees = (angleRadians * 180) / Math.PI;

  // Filter matched, missing, surplus keywords
  const matchedKeywords = termWeights
    .filter(t => t.status === 'matched')
    .sort((a, b) => b.dotProduct - a.dotProduct)
    .map(t => t.term);

  const missingKeywords = termWeights
    .filter(t => t.status === 'missing')
    .sort((a, b) => b.jdWeight - a.jdWeight)
    .map(t => t.term);

  const surplusKeywords = termWeights
    .filter(t => t.status === 'surplus')
    .sort((a, b) => b.resumeWeight - a.resumeWeight)
    .map(t => t.term);

  // Calculate Hard Skill Coverage (weight of matched required skills / total required skill weight)
  const requiredTerms = termWeights.filter(t => t.jdTf > 0);
  const requiredWeightSum = requiredTerms.reduce((acc, cur) => acc + cur.jdWeight, 0);
  const matchedWeightSum = requiredTerms.filter(t => t.status === 'matched').reduce((acc, cur) => acc + cur.jdWeight, 0);
  const hardSkillScore = requiredWeightSum > 0 ? (matchedWeightSum / requiredWeightSum) * 100 : 0;

  // Dense Embedding Score simulation (synthesizing deep semantic closeness)
  const denseEmbeddingScore = calculateDenseSemanticScore(jdTokens, resumeTokens, matchedKeywords, missingKeywords);

  // Hybrid Composite Score (40% Sparse Lexical + 60% Dense Semantic)
  const sparseCosineScore = Math.round(sparseCosine * 100);
  const hybridScore = Math.round(0.4 * sparseCosineScore + 0.6 * denseEmbeddingScore);

  // Experience Score estimate based on text mentions of years and seniority keywords
  const expMatch = resumeText.match(/(\d+)\s*年/);
  const expYears = expMatch ? parseInt(expMatch[1], 10) : 3;
  const experienceScore = Math.min(100, Math.max(50, expYears * 18));

  // ATS Pass Rate: heuristic based on missing critical high-importance keywords
  const missingHighCount = termWeights.filter(t => t.status === 'missing' && t.importance === 'high').length;
  const atsPassRate = Math.max(15, Math.min(99, Math.round(hybridScore * 0.9 - missingHighCount * 4)));

  const topContributors = [...termWeights]
    .filter(t => t.status === 'matched')
    .sort((a, b) => b.dotProduct - a.dotProduct)
    .slice(0, 10);

  return {
    sparseCosineScore,
    denseEmbeddingScore: Math.round(denseEmbeddingScore),
    hybridScore,
    angleRadians,
    angleDegrees: Number(angleDegrees.toFixed(1)),
    matchedCount: matchedKeywords.length,
    missingCount: missingKeywords.length,
    surplusCount: surplusKeywords.length,
    totalTermsInVocab: vocab.length,
    jdNorm: Number(jdNorm.toFixed(3)),
    resumeNorm: Number(resumeNorm.toFixed(3)),
    dotProductSum: Number(dotProductSum.toFixed(3)),
    termWeights: termWeights.sort((a, b) => (b.jdWeight + b.resumeWeight) - (a.jdWeight + a.resumeWeight)),
    matchedKeywords,
    missingKeywords,
    surplusKeywords,
    topContributors,
    hardSkillScore: Math.round(hardSkillScore),
    experienceScore,
    atsPassRate,
  };
}

/**
 * Dense Semantic Similarity Calculation:
 * Evaluates semantic relatedness through domain clusters
 */
function calculateDenseSemanticScore(
  jdTokens: string[],
  resumeTokens: string[],
  matched: string[],
  missing: string[]
): number {
  if (jdTokens.length === 0 || resumeTokens.length === 0) return 0;

  // Check cluster overlap
  const jdClusters = new Set<string>();
  const resumeClusters = new Set<string>();

  for (const t of jdTokens) {
    if (TECHNICAL_DICTIONARY[t]) {
      jdClusters.add(TECHNICAL_DICTIONARY[t].cluster);
    }
  }

  for (const t of resumeTokens) {
    if (TECHNICAL_DICTIONARY[t]) {
      resumeClusters.add(TECHNICAL_DICTIONARY[t].cluster);
    }
  }

  let clusterIntersection = 0;
  for (const c of jdClusters) {
    if (resumeClusters.has(c)) {
      clusterIntersection++;
    }
  }

  const clusterCoverage = jdClusters.size > 0 ? (clusterIntersection / jdClusters.size) : 0.5;

  // Base ratio
  const exactRatio = (matched.length + 1) / (matched.length + missing.length + 1);

  // Dense semantic adds cross-term proximity (e.g. PyTorch and 深度学习)
  const denseVal = exactRatio * 0.45 + clusterCoverage * 0.55;
  return Math.min(98, Math.max(12, Math.round(denseVal * 100)));
}

/**
 * Generate 3D Vector Points for Canvas 3D visualizer
 */
export function getVector3DPoints(termWeights: TermWeight[]): Vector3DPoint[] {
  return termWeights.slice(0, 35).map((tw, idx) => {
    const x = tw.jdWeight * 30; // X axis = JD weight
    const y = tw.resumeWeight * 30; // Y axis = Resume weight
    const z = (tw.jdIdf + tw.resumeIdf) * 15 - 30; // Z axis = IDF depth

    let color = '#10b981'; // green for matched
    if (tw.status === 'missing') color = '#ef4444'; // red for missing
    if (tw.status === 'surplus') color = '#0ea5e9'; // blue for surplus

    return {
      term: tw.term,
      x,
      y,
      z,
      color,
      status: tw.status,
      weight: Math.max(tw.jdWeight, tw.resumeWeight),
    };
  });
}

/**
 * Generate 2D semantic embedding landscape points
 */
export function getSemantic2DLandscape(termWeights: TermWeight[]): SemanticPoint2D[] {
  const result: SemanticPoint2D[] = [];
  const processed = new Set<string>();

  for (const tw of termWeights) {
    if (processed.has(tw.term)) continue;
    processed.add(tw.term);

    const tech = TECHNICAL_DICTIONARY[tw.term];
    const clusterKey = tech ? tech.cluster : 'General';
    const clusterCoord = SEMANTIC_CLUSTER_COORDINATES[clusterKey] || { cx: 450, cy: 300, label: '通用词', color: '#64748b' };

    // Deterministic pseudo-random offset within cluster based on string hash
    let hash = 0;
    for (let i = 0; i < tw.term.length; i++) {
      hash = (hash << 5) - hash + tw.term.charCodeAt(i);
      hash |= 0;
    }
    const angle = (Math.abs(hash) % 360) * (Math.PI / 180);
    const radius = 15 + (Math.abs(hash * 7) % 55);

    const x = clusterCoord.cx + Math.cos(angle) * radius;
    const y = clusterCoord.cy + Math.sin(angle) * radius;

    result.push({
      id: tw.term,
      term: tw.term,
      category: tech?.category || 'general',
      cluster: clusterCoord.label,
      x: Math.round(x),
      y: Math.round(y),
      inJd: tw.jdTf > 0,
      inResume: tw.resumeTf > 0,
      similarityToCenter: Math.max(0.2, 1 - radius / 70),
    });
  }

  return result;
}
