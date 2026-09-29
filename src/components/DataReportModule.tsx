import React, { useState } from 'react';
import { MatchAnalysisResult, BenchmarkCase } from '../types';
import { BENCHMARK_CASES } from '../data/benchmarks';
import { InlineMath, KatexText } from './KatexMath';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Check,
  Eye,
  FileDown,
  Layers,
  Sparkles,
  Database,
  ArrowRight,
  ShieldCheck,
  Filter,
  Cpu,
  Calculator,
  Compass,
  FileCheck2,
  FileCode,
  Award,
} from 'lucide-react';

interface Props {
  analysis: MatchAnalysisResult;
  roleTitle: string;
  jdText: string;
  resumeText: string;
  onJdUpload: (text: string) => void;
  onResumeUpload: (text: string) => void;
  onSelectCase?: (caseItem: BenchmarkCase, tier: 'high' | 'medium' | 'low') => void;
}

export const DataReportModule: React.FC<Props> = ({
  analysis,
  roleTitle,
  jdText,
  resumeText,
  onJdUpload,
  onResumeUpload,
  onSelectCase,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'report' | 'katex' | 'markdown'>('report');
  const [selectedCaseDownload, setSelectedCaseDownload] = useState<string>(BENCHMARK_CASES[0].id);

  // Helper download trigger
  const handleDownload = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(filename);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  // Download raw dataset files for specific benchmark cases
  const handleDownloadBenchmarkRaw = (caseItem: BenchmarkCase, type: 'all' | 'jd' | 'resume_high' | 'resume_med' | 'resume_low' | 'json') => {
    if (type === 'jd') {
      handleDownload(caseItem.jdText, `Raw_JD_${caseItem.id}.txt`, 'text/plain;charset=utf-8');
      return;
    }
    if (type === 'resume_high') {
      handleDownload(caseItem.resumes.high.text, `Raw_Resume_HighFit_${caseItem.id}.txt`, 'text/plain;charset=utf-8');
      return;
    }
    if (type === 'resume_med') {
      handleDownload(caseItem.resumes.medium.text, `Raw_Resume_MidFit_${caseItem.id}.txt`, 'text/plain;charset=utf-8');
      return;
    }
    if (type === 'resume_low') {
      handleDownload(caseItem.resumes.low.text, `Raw_Resume_LowFit_${caseItem.id}.txt`, 'text/plain;charset=utf-8');
      return;
    }
    if (type === 'json' || type === 'all') {
      const fullJson = JSON.stringify(
        {
          caseId: caseItem.id,
          roleTitle: caseItem.title,
          industry: caseItem.industry,
          level: caseItem.level,
          description: caseItem.description,
          jobDescriptionText: caseItem.jdText,
          benchmarkResumes: {
            highMatch: {
              name: caseItem.resumes.high.name,
              scoreEstimate: caseItem.resumes.high.expectedScore,
              highlights: caseItem.resumes.high.highlights,
              resumeText: caseItem.resumes.high.text,
            },
            mediumMatch: {
              name: caseItem.resumes.medium.name,
              scoreEstimate: caseItem.resumes.medium.expectedScore,
              highlights: caseItem.resumes.medium.highlights,
              resumeText: caseItem.resumes.medium.text,
            },
            lowMatch: {
              name: caseItem.resumes.low.name,
              scoreEstimate: caseItem.resumes.low.expectedScore,
              highlights: caseItem.resumes.low.highlights,
              resumeText: caseItem.resumes.low.text,
            },
          },
        },
        null,
        2
      );
      handleDownload(fullJson, `Benchmark_Dataset_${caseItem.id}.json`, 'application/json;charset=utf-8');
    }
  };

  // Generate 6-part full-pipeline structured Markdown report
  const generateMarkdownReport = () => {
    return `# 简历与职位需求智能匹配全流程评估与诊断报告 (Resume Matcher Lab)

**目标职位 (Target Role)**: ${roleTitle}  
**评估报告生成时间**: ${new Date().toLocaleString()}  
**综合匹配度 (Hybrid Confidence)**: ${analysis.hybridScore}%  
**ATS 智能初筛通过概率**: ${analysis.atsPassRate}%  

---

## 阶段一：文本输入与语料清洗 (Ingestion & Preprocessing)
- **职位需求字符总数**: ${jdText.length} 字符
- **简历正文字符总数**: ${resumeText.length} 字符
- **正则清洗与分词规整**: 剔除无意义特殊符号、统一连字符标准（保留 PyTorch, vLLM, C++ 等复合实体），消除大小写与段落格式粘连。
- **全集词汇正交空间维度**: ${analysis.totalTermsInVocab} 维

---

## 阶段二：特征工程与停用词过滤 (Feature Extraction & Stopword Pruning)
- **通用口水停用词过滤**: 剔除“负责、精通、熟练、项目、系统、具有、主导”等 100+ 高频虚词，消除通用词虚假膨胀。
- **技术实体特征有效命中项**: ${analysis.matchedCount} 项
- **缺失硬性技能缺口 (Skill Gap)**: ${analysis.missingCount} 项
- **简历独有盈余拓展项**: ${analysis.surplusCount} 项

### 双向命中核心技术栈前列清单 (Top Matched Features):
| 序号 | 技术栈 / 实体词 | JD 频次 | 简历频次 | IDF 稀缺度 | 内积分量贡献 |
| :--- | :--- | :--- | :--- | :--- | :--- |
${analysis.topContributors
  .slice(0, 8)
  .map(
    (t, idx) =>
      `| ${idx + 1} | ${t.term} | ${t.jdTf} | ${t.resumeTf} | ${t.jdIdf} | +${t.dotProduct} |`
  )
  .join('\n')}

---

## 阶段三：高维向量化与平滑加权 (Vectorization & TF-IDF Modeling)
- **对数词频平滑 (Sublinear TF)**: $w(t, d) = (1 + \\ln(tf)) \\times \\text{IDF}(t)$，防止恶意重复堆砌技术词作弊。
- **逆文档频率平滑公式 (Smooth IDF)**: $\\text{IDF}(t) = \\ln((1 + N) / (1 + \\text{DF}(t))) + 1.0$。
- **原始矩阵模长 (L2 Norm)**:
  - 职位需求特征模长 $\|\\mathbf{v}_{\\text{JD}}\\|_2$: **${analysis.jdNorm}**
  - 候选人简历特征模长 $\|\\mathbf{v}_{\\text{Resume}}\\|_2$: **${analysis.resumeNorm}**
  - 归一化内积投影和 $\\sum (w_{i,\\text{JD}} \\cdot w_{i,\\text{Resume}})$: **${analysis.dotProductSum}**

---

## 阶段四：空间投影与几何余弦度量 (Unit Sphere Projection & Cosine Metric)
- **单位超球面投影**: $\\hat{\\mathbf{v}} = \\mathbf{v} / \\|\\mathbf{v}\\|_2$（模长严格归一为 $1.000$，彻底消解篇幅长短偏斜）。
- **几何偏转角 $\\theta$**: **${analysis.angleDegrees}°**
- **稀疏 TF-IDF 余弦匹配得分**: **${analysis.sparseCosineScore}%** (取值: ${(analysis.sparseCosineScore / 100).toFixed(4)})
- **稠密语义隐空间得分 (Dense Embeddings)**: **${analysis.denseEmbeddingScore}%** (近义亲和加权)
- **双模复合最终匹配分 (Hybrid Score)**: **${analysis.hybridScore}%**

---

## 阶段五：失分缺口诊断与技术短板 (Skill Gap & ATS Penalty Diagnosis)
以下硬技能在职位需求中赋予高权重，但在简历中内积分量归零：
${analysis.missingKeywords.slice(0, 8).map((k, i) => `${i + 1}. **${k}** (JD权重显著，简历无关联经历)`).join('\n')}

- **硬性技能覆盖度**: **${analysis.hardSkillScore}%**
- **ATS 初筛通关率评估**: **${analysis.atsPassRate}%** (若缺失 > 3 项核心词可能面临算法首轮机筛淘汰)

---

## 阶段六：针对性优化与 STAR 法则润色方案 (Actionable Polishing & ATS Advisory)
1. **显性化融入核心技能**:
   - 针对缺失的 **${analysis.missingKeywords[0] || '核心技能'}** 与 **${analysis.missingKeywords[1] || '重要技术栈'}**，在【核心项目经历】中结合实际研发场景补全。
2. **STAR 叙事原则重构示范**:
   - **情境 (Situation)**: 业务面临何种负载、瓶颈或核心指标挑战。
   - **任务 (Task)**: 负责主导哪个技术子模块或优化链路。
   - **行动 (Action)**: 运用该框架进行底层调优、并发控制或数据建模。
   - **结果 (Result)**: 明确给出“吞吐提升 X% / 耗时降低 Y% / 召回提高 Z%”等可量化成果。
3. **排版格式合规指南**:
   - 杜绝多栏混排或复杂文本框，保证标准 ATS 解析器能准确提取分词。
`;
  };

  // Generate CSV Matrix
  const generateCsvMatrix = () => {
    const headers = [
      'Term',
      'Category',
      'JD_TF',
      'JD_IDF',
      'JD_Weight',
      'Resume_TF',
      'Resume_Weight',
      'Dot_Product',
      'Status',
      'Importance',
    ];
    const rows = analysis.termWeights.map((t) => [
      `"${t.term}"`,
      t.category,
      t.jdTf,
      t.jdIdf,
      t.jdWeight,
      t.resumeTf,
      t.resumeWeight,
      t.dotProduct,
      t.status,
      t.importance,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedBenchmark = BENCHMARK_CASES.find((c) => c.id === selectedCaseDownload) || BENCHMARK_CASES[0];

  return (
    <div className="space-y-6">
      {/* Top Banner & Export Actions */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-semibold mb-2">
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              数据报告与全流程导出引擎
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
              <span>全流程六阶段评估报告与案例原始数据集导出</span>
            </h2>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
              <span>提供四大案例各梯队原始语料下载，报告严格对标</span>
              <span className="font-semibold text-slate-700 font-mono inline-flex items-center gap-1">
                <span>输入</span>
                <InlineMath math="\to" />
                <span>抽取</span>
                <InlineMath math="\to" />
                <span>向量化</span>
                <InlineMath math="\to" />
                <span>投影</span>
                <InlineMath math="\to" />
                <span>缺口</span>
                <InlineMath math="\to" />
                <span>润色</span>
              </span>
              <span>全链路 6 大阶段。</span>
            </p>
          </div>

          {/* Quick Action Export Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() =>
                handleDownload(
                  generateMarkdownReport(),
                  `Resume_Match_Report_${roleTitle.split(' ')[0]}.md`,
                  'text/markdown;charset=utf-8'
                )
              }
              className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              导出 6 阶段 Markdown 报告
            </button>

            <button
              onClick={() =>
                handleDownload(
                  generateCsvMatrix(),
                  `Vector_Matrix_${roleTitle.split(' ')[0]}.csv`,
                  'text/csv;charset=utf-8'
                )
              }
              className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-white" />
              导出 CSV 特征矩阵
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-white text-slate-700 border border-stone-200 rounded-xl text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              打印 / 存为 PDF
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>成功下载导出文件：<strong>{downloadSuccess}</strong></span>
          </div>
        )}
      </div>

      {/* Benchmark Cases Raw Data Download Options Slice */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">四大案例原始数据集下载专区</h3>
              <p className="text-xs text-slate-500">
                支持分别下载各真实岗位的原始 JD 与高/中/低三档简历文本或一体化 JSON 格式
              </p>
            </div>
          </div>

          {/* Case Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">选择案例:</span>
            <select
              value={selectedCaseDownload}
              onChange={(e) => setSelectedCaseDownload(e.target.value)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
            >
              {BENCHMARK_CASES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Cards for the Selected Benchmark Case */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Card 1: Job Description Raw Text */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-indigo-700 uppercase block mb-1">
                Raw Job Description (JD)
              </span>
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{selectedBenchmark.title}</h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                包含岗位职责与任职要求的完整原始招聘文本
              </p>
            </div>
            <button
              onClick={() => handleDownloadBenchmarkRaw(selectedBenchmark, 'jd')}
              className="mt-3 w-full py-1.5 px-2 bg-white hover:bg-stone-100 text-slate-700 border border-stone-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-indigo-600" />
              下载 JD 纯文本 (.txt)
            </button>
          </div>

          {/* Card 2: High Match Resume */}
          <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">
                  High Fit Resume
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                  ~{selectedBenchmark.resumes.high.expectedScore}%
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{selectedBenchmark.resumes.high.name}</h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                高匹配梯队候选人完整背景、技能栈与 STAR 项目经历
              </p>
            </div>
            <button
              onClick={() => handleDownloadBenchmarkRaw(selectedBenchmark, 'resume_high')}
              className="mt-3 w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              下载高匹配简历 (.txt)
            </button>
          </div>

          {/* Card 3: Medium Match Resume */}
          <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase">
                  Mid Fit Resume
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                  ~{selectedBenchmark.resumes.medium.expectedScore}%
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{selectedBenchmark.resumes.medium.name}</h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                具备基础能力但缺乏部分高级核心技能的中度匹配简历
              </p>
            </div>
            <button
              onClick={() => handleDownloadBenchmarkRaw(selectedBenchmark, 'resume_med')}
              className="mt-3 w-full py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              下载中匹配简历 (.txt)
            </button>
          </div>

          {/* Card 4: Low Match Resume or Complete JSON */}
          <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-200/80 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-indigo-800 uppercase">
                  Full Dataset Package
                </span>
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.2 rounded">
                  JSON All-in-1
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">完整案例语料包</h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                包含该案例 JD + 三档简历结构化数据的完整 JSON
              </p>
            </div>
            <button
              onClick={() => handleDownloadBenchmarkRaw(selectedBenchmark, 'json')}
              className="mt-3 w-full py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              下载完整案例 JSON
            </button>
          </div>
        </div>
      </div>

      {/* Six-Part Full Pipeline Structured Report Preview Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-6">
        {/* Header Preview Bar */}
        <div className="border-b border-stone-200/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 font-semibold">
                RESUME MATCHER LAB // 6-STAGE PIPELINE REPORT
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                在线预览模式 (Preview)
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              全流程导引结构化综合评测报告
            </h3>
          </div>

          {/* Mode Switcher: Visual Report View vs KaTeX Markdown vs Raw Markdown */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setPreviewMode('report')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                previewMode === 'report'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-indigo-600" />
              <span>排版视图 (Visual)</span>
            </button>
            <button
              onClick={() => setPreviewMode('katex')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                previewMode === 'katex'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>KaTeX 报告渲染</span>
            </button>
            <button
              onClick={() => setPreviewMode('markdown')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                previewMode === 'markdown'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-slate-600" />
              <span>Markdown 源码</span>
            </button>
          </div>
        </div>

        {/* Dynamic Display: Visual 6-Stage View OR KaTeX Rendered OR Markdown Source */}
        {previewMode === 'markdown' ? (
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-200 font-mono text-xs max-h-[600px] overflow-y-auto leading-relaxed">
            <pre className="whitespace-pre-wrap">{generateMarkdownReport()}</pre>
          </div>
        ) : previewMode === 'katex' ? (
          <div className="p-6 bg-white rounded-xl border border-stone-200 text-slate-800 text-xs max-h-[600px] overflow-y-auto leading-relaxed space-y-4 shadow-inner">
            <div className="pb-3 border-b border-stone-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                Markdown + KaTeX 形式化公式渲染预览
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono font-semibold">
                KaTeX Engine Active
              </span>
            </div>
            <div className="space-y-3 font-sans">
              {generateMarkdownReport()
                .split('\n\n')
                .map((paragraph, pIdx) => {
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h1 key={pIdx} className="text-base font-black text-slate-900 border-b border-stone-200 pb-2 mt-4">
                        <KatexText content={paragraph.replace(/^#\s*/, '')} />
                      </h1>
                    );
                  }
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={pIdx} className="text-sm font-bold text-emerald-800 border-b border-stone-100 pb-1.5 mt-3">
                        <KatexText content={paragraph.replace(/^##\s*/, '')} />
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={pIdx} className="text-xs font-bold text-slate-800 mt-2">
                        <KatexText content={paragraph.replace(/^###\s*/, '')} />
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('|')) {
                    const lines = paragraph.split('\n').filter(l => l.trim().length > 0);
                    const headerLine = lines[0];
                    const dataLines = lines.slice(2);
                    const parseCols = (l: string) => l.split('|').slice(1, -1).map(c => c.trim());
                    return (
                      <div key={pIdx} className="overflow-x-auto my-2 border border-stone-200 rounded-lg">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-stone-50 font-bold text-slate-700 border-b border-stone-200">
                            <tr>
                              {parseCols(headerLine).map((col, cIdx) => (
                                <th key={cIdx} className="py-1.5 px-3">
                                  <KatexText content={col} />
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100 font-mono">
                            {dataLines.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-stone-50">
                                {parseCols(row).map((cell, cIdx) => (
                                  <td key={cIdx} className="py-1.5 px-3">
                                    <KatexText content={cell} />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  return (
                    <div key={pIdx} className="whitespace-pre-line text-slate-700">
                      <KatexText content={paragraph} />
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stage 1: Ingestion & Preprocessing */}
            <div className="p-5 bg-stone-50/70 rounded-xl border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center justify-center font-mono">
                    01
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    阶段一：非结构化文本抽取与清洗 (Ingestion & Cleaning)
                  </h4>
                </div>
                <span className="text-xs font-mono text-slate-400">词汇维度: {analysis.totalTermsInVocab} 维</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                完成了职位需求与候选人简历的文本标准化处理，消除段落连带格式粘连，利用专业词典优先抽取 PyTorch、vLLM、CUDA 等中英混合专有名词。
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                  <span className="text-slate-400 block text-[10px]">JD 字符长度</span>
                  <span className="font-bold text-slate-700">{jdText.length} 字符</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                  <span className="text-slate-400 block text-[10px]">简历字符长度</span>
                  <span className="font-bold text-slate-700">{resumeText.length} 字符</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                  <span className="text-slate-400 block text-[10px]">正交词典基底</span>
                  <span className="font-bold text-slate-700">{analysis.totalTermsInVocab} features</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                  <span className="text-slate-400 block text-[10px]">分词抽取算法</span>
                  <span className="font-bold text-indigo-600">Regex + Tech Dict</span>
                </div>
              </div>
            </div>

            {/* Stage 2: Feature Extraction & Stopwords */}
            <div className="p-5 bg-stone-50/70 rounded-xl border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-800 text-xs font-bold flex items-center justify-center font-mono">
                    02
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    阶段二：特征工程与停用词过滤 (Feature Filtering)
                  </h4>
                </div>
                <span className="text-xs font-mono text-emerald-700 font-semibold">
                  命中率: {((analysis.matchedCount / Math.max(1, analysis.matchedCount + analysis.missingCount)) * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                剔除无区分度的通用动词和虚词，保留目标领域硬技能。已命中核心技术栈与未命中扣分项呈现如下：
              </p>
              <div className="overflow-x-auto border border-stone-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100/70 text-slate-600 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-2 px-3">核心特征</th>
                      <th className="py-2 px-3 font-mono">JD TF</th>
                      <th className="py-2 px-3 font-mono">简历 TF</th>
                      <th className="py-2 px-3 font-mono">IDF 稀缺度</th>
                      <th className="py-2 px-3 font-mono text-right text-emerald-700">内积得分贡献</th>
                      <th className="py-2 px-3">对齐状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono">
                    {analysis.topContributors.slice(0, 5).map((t) => (
                      <tr key={t.term} className="hover:bg-stone-50">
                        <td className="py-1.5 px-3 font-sans font-bold text-slate-800">{t.term}</td>
                        <td className="py-1.5 px-3 text-slate-600">{t.jdTf}</td>
                        <td className="py-1.5 px-3 text-slate-600">{t.resumeTf}</td>
                        <td className="py-1.5 px-3 text-slate-500">{t.jdIdf}</td>
                        <td className="py-1.5 px-3 text-right font-bold text-emerald-600">+{t.dotProduct}</td>
                        <td className="py-1.5 px-3 font-sans">
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-medium">
                            已命中
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stage 3: TF-IDF Vectorization */}
            <div className="p-5 bg-stone-50/70 rounded-xl border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center font-mono">
                    03
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    阶段三：高维向量化与平滑加权 (Vectorization & Weighting)
                  </h4>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Sublinear TF: <InlineMath math="1 + \ln(\text{tf})" />
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                利用对数平滑与平滑逆文档频率对特征向量进行坐标赋值，削弱字面刷频作弊，凸显稀缺硬技术栈权重。
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <span className="text-slate-400 block text-[10px] font-sans">
                    JD 向量模长 <InlineMath math="\|\mathbf{v}_{\text{JD}}\|_2" />
                  </span>
                  <span className="text-base font-bold text-indigo-700">{analysis.jdNorm}</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <span className="text-slate-400 block text-[10px] font-sans">
                    简历向量模长 <InlineMath math="\|\mathbf{v}_{\text{Resume}}\|_2" />
                  </span>
                  <span className="text-base font-bold text-emerald-700">{analysis.resumeNorm}</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <span className="text-slate-400 block text-[10px] font-sans">
                    分子内积累加和 <InlineMath math="\sum" />
                  </span>
                  <span className="text-base font-bold text-slate-800">{analysis.dotProductSum}</span>
                </div>
              </div>
            </div>

            {/* Stage 4: Cosine & Geometric Evaluation */}
            <div className="p-5 bg-stone-50/70 rounded-xl border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center font-mono">
                    04
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    阶段四：空间投影与几何余弦度量 (Cosine Space Metric)
                  </h4>
                </div>
                <span className="text-xs font-mono text-amber-700 font-bold">
                  <InlineMath math={`\\theta = ${analysis.angleDegrees}^\\circ`} />
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                通过单位超球面约束消除篇幅长短偏斜，结合稀疏字面与稠密语义空间加权计算综合匹配得分。
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <span className="text-[10px] text-slate-400 block">稀疏余弦分</span>
                  <span className="text-lg font-bold text-slate-800">{analysis.sparseCosineScore}%</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <span className="text-[10px] text-slate-400 block">稠密语义分</span>
                  <span className="text-lg font-bold text-indigo-600">{analysis.denseEmbeddingScore}%</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 block font-semibold">综合置信分</span>
                  <span className="text-lg font-bold text-emerald-800">{analysis.hybridScore}%</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <span className="text-[10px] text-slate-400 block">
                    空间夹角 <InlineMath math="\theta" />
                  </span>
                  <span className="text-lg font-bold text-amber-700">{analysis.angleDegrees}°</span>
                </div>
              </div>
            </div>

            {/* Stage 5: Skill Gap & Risk Diagnosis */}
            <div className="p-5 bg-stone-50/70 rounded-xl border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center font-mono">
                    05
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    阶段五：失分缺口诊断与断层分析 (Skill Gap & ATS Penalty)
                  </h4>
                </div>
                <span className="text-xs font-mono text-rose-600 font-bold">缺失: {analysis.missingCount} 项</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                以下为目标岗位要求严苛、但候选人简历中未建立特征连接的核心短板，是造成余弦方向偏角偏大的主要失分源：
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.slice(0, 10).map((term) => (
                  <span
                    key={term}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs font-medium flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    {term}
                  </span>
                ))}
              </div>
            </div>

            {/* Stage 6: Actionable Polishing Advice */}
            <div className="p-5 bg-stone-50/70 rounded-xl border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center font-mono">
                    06
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">
                    阶段六：简历润色建议与 STAR 落地示范 (Actionable Polishing)
                  </h4>
                </div>
                <span className="text-xs font-mono text-purple-700 font-semibold">ATS通过率预估: {analysis.atsPassRate}%</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-stone-200 space-y-2 text-xs text-slate-700 leading-relaxed">
                <div>
                  <strong className="text-slate-900">1. 技术词沉浸化融入</strong>：切忌在末尾空白处单调罗列关键词，建议将【{analysis.missingKeywords[0] || '核心缺失技能'}】写入具体业务模块的架构重构或调优链路中。
                </div>
                <div>
                  <strong className="text-slate-900">2. STAR 叙事量化</strong>：按“情境-任务-行动-结果”组织表述，重点补充性能指标（例如：QPS 提升 40%、首字延迟缩短 120ms、降本增效指标）。
                </div>
                <div>
                  <strong className="text-slate-900">3. 规避双栏 PDF 排版坑</strong>：坚持清晰的单列流水排版，避免开源解析器跨栏拼错损坏专业词提取。
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
