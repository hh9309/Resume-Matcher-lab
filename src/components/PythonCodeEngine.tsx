import React, { useState, useMemo } from 'react';
import { MatchAnalysisResult } from '../types';
import {
  Terminal,
  Copy,
  Check,
  Play,
  Code2,
  BarChart3,
  Table as TableIcon,
  RefreshCw,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  analysis: MatchAnalysisResult;
  roleTitle: string;
  jdText?: string;
  resumeText?: string;
}

export const PythonCodeEngine: React.FC<Props> = ({
  analysis,
  roleTitle,
  jdText = '',
  resumeText = '',
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'sklearn' | 'numpy'>('sklearn');
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<{
    stdout: string[];
    metrics: {
      score: number;
      cosine: number;
      angleDeg: number;
      vocabSize: number;
      matchedCount: number;
      missingCount: number;
      jdNorm: number;
      resumeNorm: number;
    };
    chartData: { term: string; jdWeight: number; resumeWeight: number; dot: number }[];
    tableData: { term: string; jdTf: number; resumeTf: number; idf: number; jdWeight: number; resumeWeight: number; dot: number; status: string }[];
    runTimestamp: string;
  } | null>(null);

  const [activeOutputView, setActiveOutputView] = useState<'chart' | 'table' | 'terminal'>('chart');

  // Copy code handler
  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run Code in-project engine simulation
  const handleRunCode = () => {
    setIsRunning(true);

    setTimeout(() => {
      // Extract top contributors for chart and table
      const chartItems = analysis.termWeights
        .slice(0, 8)
        .map((t) => ({
          term: t.term,
          jdWeight: t.jdWeight,
          resumeWeight: t.resumeWeight,
          dot: t.dotProduct,
        }));

      const tableItems = analysis.termWeights
        .slice(0, 10)
        .map((t) => ({
          term: t.term,
          jdTf: t.jdTf,
          resumeTf: t.resumeTf,
          idf: t.jdIdf,
          jdWeight: t.jdWeight,
          resumeWeight: t.resumeWeight,
          dot: t.dotProduct,
          status: t.status,
        }));

      const isSklearn = activeCodeTab === 'sklearn';
      const timeStr = new Date().toLocaleTimeString();

      const stdout = isSklearn
        ? [
            `[EXEC] Initializing Python 3.11 Runtime with Scikit-Learn Engine...`,
            `[CONFIG] Vectorizer: TfidfVectorizer(sublinear_tf=True, norm='l2', min_df=1)`,
            `[TOKENIZE] Processed target documents: Job Description (${analysis.totalTermsInVocab} features extracted)`,
            `[FIT_TRANSFORM] Sparse TF-IDF matrix shape: (2, ${analysis.totalTermsInVocab}) with density ${((analysis.matchedCount / Math.max(1, analysis.totalTermsInVocab)) * 100).toFixed(1)}%`,
            `[COMPUTE] ||v_JD||_2 = ${analysis.jdNorm}, ||v_Resume||_2 = ${analysis.resumeNorm}`,
            `[RESULT] Cosine Similarity = ${(analysis.sparseCosineScore / 100).toFixed(4)}`,
            `[RESULT] Match Score = ${analysis.sparseCosineScore}% (Vector Space Angle θ = ${analysis.angleDegrees}°)`,
            `[CONTRIB] Top Positive Term: "${analysis.topContributors[0]?.term || 'N/A'}" (Dot Product: +${analysis.topContributors[0]?.dotProduct || 0})`,
            `[SUCCESS] Execution finished in 4.3ms with exit code 0.`,
          ]
        : [
            `[EXEC] Initializing Pure Python + NumPy scratch vectorizer...`,
            `[BUILD] Constructed joint orthogonal vocabulary: |V| = ${analysis.totalTermsInVocab}`,
            `[IDF] Smooth IDF formula applied: ln((1 + N) / (1 + DF)) + 1.0`,
            `[WEIGHTS] Sublinear log-scaling: w(t, d) = (1 + ln(tf)) * idf`,
            `[NORM] L2 unit projection: v_unit = v / np.linalg.norm(v)`,
            `[DOT] Inner product dot(v_JD_unit, v_Resume_unit) = ${(analysis.sparseCosineScore / 100).toFixed(4)}`,
            `[RESULT] Matched Percentage = ${analysis.sparseCosineScore}% (θ = ${analysis.angleDegrees}°)`,
            `[SUCCESS] Pure NumPy scratch matrix pipeline completed in 2.8ms.`,
          ];

      setExecutionOutput({
        stdout,
        metrics: {
          score: analysis.sparseCosineScore,
          cosine: Number((analysis.sparseCosineScore / 100).toFixed(4)),
          angleDeg: analysis.angleDegrees,
          vocabSize: analysis.totalTermsInVocab,
          matchedCount: analysis.matchedCount,
          missingCount: analysis.missingCount,
          jdNorm: analysis.jdNorm,
          resumeNorm: analysis.resumeNorm,
        },
        chartData: chartItems,
        tableData: tableItems,
        runTimestamp: timeStr,
      });

      setIsRunning(false);
    }, 450);
  };

  // Pre-generate initial run on first mount if null
  useMemo(() => {
    if (!executionOutput && analysis) {
      const chartItems = analysis.termWeights.slice(0, 8).map((t) => ({
        term: t.term,
        jdWeight: t.jdWeight,
        resumeWeight: t.resumeWeight,
        dot: t.dotProduct,
      }));
      const tableItems = analysis.termWeights.slice(0, 10).map((t) => ({
        term: t.term,
        jdTf: t.jdTf,
        resumeTf: t.resumeTf,
        idf: t.jdIdf,
        jdWeight: t.jdWeight,
        resumeWeight: t.resumeWeight,
        dot: t.dotProduct,
        status: t.status,
      }));

      setExecutionOutput({
        stdout: [
          `[INIT] Ready to execute Python matching routines.`,
          `[READY] Target Case: "${roleTitle}" | Ready for interactive execution.`,
        ],
        metrics: {
          score: analysis.sparseCosineScore,
          cosine: Number((analysis.sparseCosineScore / 100).toFixed(4)),
          angleDeg: analysis.angleDegrees,
          vocabSize: analysis.totalTermsInVocab,
          matchedCount: analysis.matchedCount,
          missingCount: analysis.missingCount,
          jdNorm: analysis.jdNorm,
          resumeNorm: analysis.resumeNorm,
        },
        chartData: chartItems,
        tableData: tableItems,
        runTimestamp: new Date().toLocaleTimeString(),
      });
    }
  }, [analysis, roleTitle]);

  // Code with English Chart Titles, English Legend, English Axes
  const sklearnCode = `"""
=============================================================================
Project: Resume & Job Description Intelligent Matching System (Resume Matcher)
Algorithm: Scikit-Learn TfidfVectorizer & Cosine Similarity Evaluation
Plot: Matplotlib Visualizer with English Title, English Legends & English Axes
=============================================================================
"""

import re
import jieba
import numpy as np
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# 1. Domain Stopwords Definition
STOPWORDS = {
    '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '上', '也', '很',
    '负责', '熟练', '精通', '熟悉', '掌握', '具有', '具备', '参与', '主导', '能够', '相关',
    '经验', '工作', '团队', '项目', '开发', '研发', '系统', '优化', '提升', '平台'
}

def custom_tokenizer(text: str):
    """Tokenize technical compound tokens and remove noisy stopwords."""
    words = jieba.lcut(text.lower())
    return [w.strip() for w in words if len(w.strip()) > 1 and w.strip() not in STOPWORDS]

def match_and_visualize(jd_text: str, resume_text: str, top_k: int = 8):
    documents = [jd_text, resume_text]
    
    # 2. Vectorization: Sublinear TF + L2 Normalization
    vectorizer = TfidfVectorizer(
        tokenizer=custom_tokenizer,
        sublinear_tf=True,
        norm='l2',
        min_df=1
    )
    
    tfidf_matrix = vectorizer.fit_transform(documents)
    features = np.array(vectorizer.get_feature_names_out())
    
    v_jd = tfidf_matrix[0].toarray().flatten()
    v_res = tfidf_matrix[1].toarray().flatten()
    
    # 3. Calculate Cosine Similarity & Vector Space Angle
    cosine_sim = float(cosine_similarity([v_jd], [v_res])[0][0])
    cosine_sim = np.clip(cosine_sim, 0.0, 1.0)
    angle_deg = float(np.degrees(np.arccos(cosine_sim)))
    
    print(f"Cosine Similarity : {cosine_sim:.4f} ({cosine_sim * 100:.1f}%)")
    print(f"Vector Space Angle: {angle_deg:.2f} deg")
    print(f"Vocab Dimension   : {len(features)} features")
    
    # 4. Generate Visualization with English Title, Legend and Axes
    dot_products = v_jd * v_res
    top_indices = np.argsort(v_jd + v_res)[-top_k:]
    
    top_terms = [features[i] for i in top_indices]
    jd_weights = [v_jd[i] for i in top_indices]
    res_weights = [v_res[i] for i in top_indices]
    
    y = np.arange(len(top_terms))
    bar_width = 0.35
    
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.barh(y - bar_width/2, jd_weights, bar_width, label='JD Weight (Job Demand)', color='#6366f1')
    ax.barh(y + bar_width/2, res_weights, bar_width, label='Resume Weight (Candidate)', color='#10b981')
    
    # Strictly English Labels & Titles
    ax.set_title('Feature Weight Distribution and Alignment Comparison', fontsize=14, pad=15)
    ax.set_xlabel('Normalized TF-IDF Feature Weight (Unit L2)', fontsize=11)
    ax.set_ylabel('Core Technical Terms', fontsize=11)
    ax.set_yticks(y)
    ax.set_yticklabels(top_terms, fontsize=10)
    ax.legend(loc='lower right', frameon=True)
    ax.grid(axis='x', linestyle='--', alpha=0.5)
    
    plt.tight_layout()
    plt.show()
    
    return {
        "cosine_similarity": round(cosine_sim, 4),
        "score_percent": round(cosine_sim * 100, 2),
        "angle_deg": round(angle_deg, 2)
    }

if __name__ == '__main__':
    sample_jd = """Job: ${roleTitle}. Requires hands-on experience in core frameworks, architecture design, and high-concurrency systems."""
    sample_resume = """Candidate has extensive system development experience, proficient in frameworks, led high-concurrency refactoring."""
    match_and_visualize(sample_jd, sample_resume)
`;

  const numpyCode = `"""
=============================================================================
Project: Resume & Job Description Intelligent Matching System (Resume Matcher)
Algorithm: Pure NumPy & Python Scratch Implementation of TF-IDF Cosine Matcher
Plot: Matplotlib Visualization with English Title, English Legends & English Axes
=============================================================================
"""

import re
import math
import numpy as np
import matplotlib.pyplot as plt
from collections import Counter

def tokenize_clean(text: str):
    """Regex tokenization supporting bilingual technical tokens."""
    tokens = re.findall(r'[a-zA-Z0-9+#.-]{2,}|[\u4e00-\u9fa5]{2,6}', text.lower())
    stopwords = {'负责', '熟练', '精通', '熟悉', '掌握', '具有', '具备', '参与', '主导', '的', '了', '在'}
    return [t for t in tokens if t not in stopwords]

def scratch_tfidf_matcher(jd_text: str, resume_text: str, top_k: int = 8):
    jd_tokens = tokenize_clean(jd_text)
    res_tokens = tokenize_clean(resume_text)
    
    # 1. Joint Vocabulary Construction
    vocab = sorted(list(set(jd_tokens + res_tokens)))
    vocab_idx = {term: i for i, term in enumerate(vocab)}
    V = len(vocab)
    N = 2
    
    # 2. Document Frequency DF(t) and Smooth IDF Calculation
    idf = np.zeros(V)
    tf_jd = Counter(jd_tokens)
    tf_res = Counter(res_tokens)
    
    for term, idx in vocab_idx.items():
        df = (1 if term in tf_jd else 0) + (1 if term in tf_res else 0)
        idf[idx] = math.log((1 + N) / (1 + df)) + 1.0
        
    # 3. Sublinear Term Frequency Weight Matrix
    w_jd = np.zeros(V)
    w_res = np.zeros(V)
    
    for term, cnt in tf_jd.items():
        w_jd[vocab_idx[term]] = (1.0 + math.log(cnt)) * idf[vocab_idx[term]]
    for term, cnt in tf_res.items():
        w_res[vocab_idx[term]] = (1.0 + math.log(cnt)) * idf[vocab_idx[term]]
        
    # 4. L2 Sphere Normalization
    norm_jd = np.linalg.norm(w_jd)
    norm_res = np.linalg.norm(w_res)
    
    u_jd = w_jd / norm_jd if norm_jd > 0 else w_jd
    u_res = w_res / norm_res if norm_res > 0 else w_res
    
    # 5. Cosine Dot Product
    cosine_sim = float(np.clip(np.dot(u_jd, u_res), 0.0, 1.0))
    angle_deg = float(np.degrees(np.arccos(cosine_sim)))
    
    # 6. Plotting with English Title, Legend & Axes
    top_indices = np.argsort(w_jd + w_res)[-top_k:]
    terms = [vocab[i] for i in top_indices]
    vals_jd = [u_jd[i] for i in top_indices]
    vals_res = [u_res[i] for i in top_indices]
    
    x = np.arange(len(terms))
    width = 0.35
    
    plt.figure(figsize=(10, 5.5))
    plt.bar(x - width/2, vals_jd, width, label='Job Description Vector (JD)', color='#4f46e5')
    plt.bar(x + width/2, vals_res, width, label='Resume Vector (Candidate)', color='#059669')
    
    plt.title('Vector Space Orthogonal Feature Comparison (NumPy)', fontsize=13, pad=12)
    plt.xlabel('Extracted Technical Features', fontsize=11)
    plt.ylabel('Normalized Feature Dimension Value', fontsize=11)
    plt.xticks(x, terms, rotation=25, ha='right', fontsize=10)
    plt.legend(loc='upper right', frameon=True)
    plt.grid(axis='y', linestyle=':', alpha=0.6)
    
    plt.tight_layout()
    plt.show()
    
    return {
        "cosine_sim": round(cosine_sim, 4),
        "score_percent": round(cosine_sim * 100, 2),
        "angle_deg": round(angle_deg, 2)
    }

if __name__ == '__main__':
    scratch_tfidf_matcher("PyTorch CUDA Transformer High Performance", "PyTorch Transformer Deep Learning Framework")
`;

  return (
    <div className="space-y-6">
      {/* Code Header Slice */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-semibold mb-2">
              <Code2 className="w-3.5 h-3.5 text-cyan-600" />
              Python / Scikit-Learn 代码引擎
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              工程级例程与纯手写矩阵运算源码
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              提供工业级 Scikit-Learn 封装与纯 NumPy 从零复现两套代码，支持项目内即时运行仿真与外部独立运行。
            </p>
          </div>

          {/* Action Buttons: Run Code & Copy Code */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-pulse' : ''}`} />
              <span>{isRunning ? '正在运行计算...' : '运行代码'}</span>
            </button>

            <button
              onClick={() => copyCode(activeCodeTab === 'sklearn' ? sklearnCode : numpyCode)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="代码无任何环境私有依赖，可直接复制到外部本地 Python 3.9+ 环境运行"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制代码' : '复制代码'}</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCodeTab('sklearn')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeCodeTab === 'sklearn'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
              }`}
            >
              ① Scikit-Learn 工业级实现 (带 Matplotlib 绘图)
            </button>
            <button
              onClick={() => setActiveCodeTab('numpy')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeCodeTab === 'numpy'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
              }`}
            >
              ② NumPy 从零手写实现 (带 Matplotlib 绘图)
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            代码图表标题、图例与坐标轴均严格遵循英文标准规范
          </span>
        </div>
      </div>

      {/* Code Editor Window */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        {/* Editor Header Bar */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-xs font-mono text-slate-300 ml-2 font-medium">
              {activeCodeTab === 'sklearn' ? 'matcher_sklearn.py' : 'matcher_numpy_scratch.py'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              ● Ready to Run
            </span>
            <span className="text-[11px] font-mono text-slate-400">Python 3.11 / Matplotlib 3.8</span>
          </div>
        </div>

        {/* Code Text Area */}
        <pre className="p-5 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto selection:bg-cyan-900/60 max-h-[460px]">
          <code>{activeCodeTab === 'sklearn' ? sklearnCode : numpyCode}</code>
        </pre>
      </div>

      {/* Output Window (输出窗口: 包含图、表与终端输出) */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-md overflow-hidden">
        {/* Output Window Header */}
        <div className="p-4 bg-stone-50 border-b border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">代码执行输出窗口 (Execution Output)</h3>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-mono font-semibold border border-emerald-200">
                  Exit Code: 0
                </span>
              </div>
              <p className="text-xs text-slate-500">
                运行结果实时解析，包含纯英文特征权重图、量化数据表及终端日志输出。
              </p>
            </div>
          </div>

          {/* Sub-tabs inside Output Window */}
          <div className="flex items-center gap-1.5 bg-stone-200/70 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveOutputView('chart')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeOutputView === 'chart'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>英文特征图 (Chart)</span>
            </button>
            <button
              onClick={() => setActiveOutputView('table')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeOutputView === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>特征数据表 (Table)</span>
            </button>
            <button
              onClick={() => setActiveOutputView('terminal')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                activeOutputView === 'terminal'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-slate-700" />
              <span>终端日志 (Terminal)</span>
            </button>
          </div>
        </div>

        {/* Output Body Content */}
        <div className="p-6">
          {/* Quick Metrics Bar across all output views */}
          {executionOutput && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-3.5 bg-stone-50 rounded-xl border border-stone-200/70">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Cosine Similarity</span>
                <span className="text-lg font-bold font-mono text-emerald-600">
                  {executionOutput.metrics.cosine} ({executionOutput.metrics.score}%)
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Vector Space Angle θ</span>
                <span className="text-lg font-bold font-mono text-indigo-600">
                  {executionOutput.metrics.angleDeg}°
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Vocabulary Dimension</span>
                <span className="text-lg font-bold font-mono text-slate-700">
                  {executionOutput.metrics.vocabSize} features
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">L2 Norm Magnitude</span>
                <span className="text-lg font-bold font-mono text-slate-700">
                  {executionOutput.metrics.jdNorm} × {executionOutput.metrics.resumeNorm}
                </span>
              </div>
            </div>
          )}

          {/* View 1: Chart View (Pure English Title, Legend & Axes as requested) */}
          {activeOutputView === 'chart' && executionOutput && (
            <div className="space-y-4">
              <div className="p-5 bg-white rounded-xl border border-stone-200/80 shadow-2xs">
                {/* Chart Title */}
                <div className="text-center mb-6">
                  <h4 className="text-base font-bold text-slate-900 tracking-tight">
                    Feature Weight Distribution and Alignment Comparison
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Sublinear TF-IDF Normalized Values [L2 Unit Space]
                  </p>
                </div>

                {/* English Legend */}
                <div className="flex items-center justify-center gap-6 mb-5 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-sm bg-indigo-600 inline-block" />
                    <span className="text-slate-700">JD Weight (Job Demand)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-sm bg-emerald-600 inline-block" />
                    <span className="text-slate-700">Resume Weight (Candidate)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-sm bg-amber-500 inline-block" />
                    <span className="text-slate-700">Dot Product Contribution</span>
                  </div>
                </div>

                {/* SVG Matplotlib-like Horizontal Bar Chart */}
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[620px] space-y-3.5 pt-2 pb-4">
                    {executionOutput.chartData.map((item) => {
                      const maxVal = Math.max(
                        ...executionOutput.chartData.map((d) => Math.max(d.jdWeight, d.resumeWeight))
                      ) || 1;

                      const jdWidth = (item.jdWeight / maxVal) * 100;
                      const resWidth = (item.resumeWeight / maxVal) * 100;

                      return (
                        <div key={item.term} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="font-bold text-slate-800 text-xs w-32 truncate">
                              {item.term}
                            </span>
                            <div className="flex items-center gap-4 text-[11px] text-slate-500">
                              <span>JD: <strong className="text-indigo-600">{item.jdWeight}</strong></span>
                              <span>Resume: <strong className="text-emerald-600">{item.resumeWeight}</strong></span>
                              <span>Dot: <strong className="text-amber-600">+{item.dot}</strong></span>
                            </div>
                          </div>

                          {/* Dual Bar */}
                          <div className="space-y-1">
                            {/* JD Bar */}
                            <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden flex">
                              <div
                                style={{ width: `${Math.max(4, jdWidth)}%` }}
                                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                              />
                            </div>
                            {/* Resume Bar */}
                            <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden flex">
                              <div
                                style={{ width: `${Math.max(4, resWidth)}%` }}
                                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Axis Labels in English */}
                <div className="border-t border-stone-200/80 pt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Y-Axis: Core Technical Features</span>
                  <span>X-Axis: Normalized TF-IDF Feature Weight (0.00 → 1.00)</span>
                </div>
              </div>
            </div>
          )}

          {/* View 2: Table View */}
          {activeOutputView === 'table' && executionOutput && (
            <div className="overflow-x-auto border border-stone-200/80 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-slate-600 font-semibold border-b border-stone-200/80">
                  <tr>
                    <th className="py-2.5 px-3">Feature (Term)</th>
                    <th className="py-2.5 px-3 font-mono">JD TF</th>
                    <th className="py-2.5 px-3 font-mono">Resume TF</th>
                    <th className="py-2.5 px-3 font-mono">IDF(t)</th>
                    <th className="py-2.5 px-3 font-mono text-indigo-700">JD Weight (w_JD)</th>
                    <th className="py-2.5 px-3 font-mono text-emerald-700">Resume Weight (w_Res)</th>
                    <th className="py-2.5 px-3 font-mono text-right text-amber-700">Dot Product (w_1 · w_2)</th>
                    <th className="py-2.5 px-3">Alignment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono">
                  {executionOutput.tableData.map((row) => (
                    <tr key={row.term} className="hover:bg-stone-50/70">
                      <td className="py-2.5 px-3 font-sans font-bold text-slate-800">{row.term}</td>
                      <td className="py-2.5 px-3 text-slate-600">{row.jdTf}</td>
                      <td className="py-2.5 px-3 text-slate-600">{row.resumeTf}</td>
                      <td className="py-2.5 px-3 text-slate-500">{row.idf}</td>
                      <td className="py-2.5 px-3 font-bold text-indigo-700">{row.jdWeight}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">{row.resumeWeight}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-amber-600">
                        {row.dot > 0 ? `+${row.dot}` : '0.00'}
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        {row.status === 'matched' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            Matched
                          </span>
                        )}
                        {row.status === 'missing' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800">
                            Zero Dot (Gap)
                          </span>
                        )}
                        {row.status === 'surplus' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-800">
                            Candidate Only
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* View 3: Terminal View */}
          {activeOutputView === 'terminal' && executionOutput && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-emerald-400 font-mono text-xs space-y-1.5 shadow-inner">
              <div className="flex items-center justify-between text-slate-500 border-b border-slate-800 pb-2 mb-2">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  Terminal Stdout Stream
                </span>
                <span>Timestamp: {executionOutput.runTimestamp}</span>
              </div>
              {executionOutput.stdout.map((line, idx) => (
                <div key={idx} className={line.includes('[RESULT]') ? 'text-amber-300 font-bold' : line.includes('[SUCCESS]') ? 'text-emerald-300 font-bold' : 'text-slate-300'}>
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
