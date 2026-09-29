import React, { useState } from 'react';
import { MatchAnalysisResult } from '../types';
import { FileInput, Filter, Cpu, CheckCircle2, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { InlineMath } from './KatexMath';

interface Props {
  analysis: MatchAnalysisResult;
  roleTitle: string;
  onNavigateToTab: (tab: any) => void;
}

export const PipelineWorkflow: React.FC<Props> = ({ analysis, roleTitle, onNavigateToTab }) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      step: 1,
      title: '文本输入与数据清洗',
      subtitle: 'PDF/文本解析与噪声滤除',
      icon: <FileInput className="w-5 h-5 text-indigo-600" />,
      tag: 'Step 1: Ingestion',
      details: [
        '支持粘贴文本或上传纯文本/Markdown/PDF文本',
        '正则清洗无意义标点、特殊符号与空格换行',
        '中英混合技术短语精准切词 (保留 PyTorch, vLLM, C++ 等连字符)',
      ],
      metric: `分词特征: ${analysis.totalTermsInVocab} 维`,
    },
    {
      step: 2,
      title: '特征提取与停用词过滤',
      subtitle: 'Stopwords 剪枝与词频统计',
      icon: <Filter className="w-5 h-5 text-cyan-600" />,
      tag: 'Step 2: Filtering',
      details: [
        '过滤高频虚词（如“负责、熟练、工作、的、了”）',
        '计算各词在职位需求中的 TF_JD 与简历中的 TF_Resume',
        '专业技术词典实体识别与加权分级 (核心 / 重要 / 基础)',
      ],
      metric: `双向重合: ${analysis.matchedCount} 项命中`,
    },
    {
      step: 3,
      title: '高维向量化与空间映射',
      subtitle: 'TF-IDF 逆文档频率与 L2 归一化',
      icon: <Cpu className="w-5 h-5 text-emerald-600" />,
      tag: 'Step 3: Vectorization',
      details: [
        '计算逆文档频率: IDF(t) = ln((1+N)/(1+DF)) + 1',
        '采用对数平滑 1 + ln(tf)，消除关键词重复堆砌作弊',
        '投影至单位超球面，模长 ||v||₂ = 1.0，消除篇幅长短偏差',
      ],
      metric: `模长积: ${(analysis.jdNorm * analysis.resumeNorm).toFixed(2)}`,
    },
    {
      step: 4,
      title: '余弦度量与综合诊断报告',
      subtitle: '多维综合评分与差距报告导出',
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      tag: 'Step 4: Evaluation',
      details: [
        '求解内积与夹角: cos(θ) = (u · v)/(||u|| · ||v||)',
        '融合稠密嵌入语义评分，生成最终置信度得分',
        '定位核心缺失技术栈 (Skill Gap)，生成优化与导出报告',
      ],
      metric: `综合匹配分: ${analysis.hybridScore}%`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              全流程流水线导引
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
              <span>文本清洗</span>
              <span className="text-slate-400 font-mono text-sm">
                <InlineMath math="\rightarrow" />
              </span>
              <span>特征抽取</span>
              <span className="text-slate-400 font-mono text-sm">
                <InlineMath math="\rightarrow" />
              </span>
              <span>向量化投影</span>
              <span className="text-slate-400 font-mono text-sm">
                <InlineMath math="\rightarrow" />
              </span>
              <span>综合评估全链路</span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              工业级简历解析与职位匹配的标准工程流水线，每阶段均可点击深入检验中间算子产物。
            </p>
          </div>

          <div className="bg-stone-50 px-4 py-2.5 rounded-xl border border-stone-200/60 text-right">
            <span className="text-[11px] text-slate-400 block font-medium">当前全流程状态</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 4/4 全链路执行完毕
            </span>
          </div>
        </div>

        {/* 4 Interactive Process Steps Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-5">
          {steps.map((st) => {
            const isActive = activeStep === st.step;
            return (
              <div
                key={st.step}
                onClick={() => setActiveStep(st.step)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/50'
                    : 'bg-white hover:bg-stone-50 border-stone-200/80 text-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                        isActive ? 'bg-slate-800 text-emerald-400' : 'bg-stone-100 text-slate-500'
                      }`}
                    >
                      {st.tag}
                    </span>
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-slate-800' : 'bg-stone-50'}`}>
                      {st.icon}
                    </div>
                  </div>
                  <h4 className="text-xs font-bold leading-snug">{st.title}</h4>
                  <p
                    className={`text-[11px] mt-1 ${
                      isActive ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {st.subtitle}
                  </p>
                </div>

                <div
                  className={`mt-3 pt-2 border-t text-[11px] font-mono font-semibold ${
                    isActive ? 'border-slate-800 text-emerald-400' : 'border-stone-100 text-slate-600'
                  }`}
                >
                  {st.metric}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Step Detailed Inspection Panel */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  阶段一深入检视
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  非结构化文本清洗与复合实体分词
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('dual_text')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                前往双向文本高亮视窗 <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              在传统招聘解析中，直接按空格或单字符分割会导致 “PyTorch” 被拆分为 “Py” 和 “Torch”，或者 “A/B测试” 中的斜杠被误作为标点切断。本实验室内置专业词典优先贪婪匹配，先抽取复合词再进行 n-gram 细化。
            </p>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/60 font-mono text-xs space-y-2">
              <div className="text-slate-500">// 抽取到的前 15 个代表性复合特征词</div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.termWeights.slice(0, 15).map(t => (
                  <span key={t.term} className="px-2 py-0.5 bg-white border border-stone-200 rounded-md text-slate-700">
                    {t.term}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">
                  阶段二深入检视
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  停用词过滤 (Stopwords) 与技术实体对齐
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('algebra')}
                className="text-xs text-cyan-600 hover:text-cyan-800 font-semibold flex items-center gap-1"
              >
                前往代数空间特征表 <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              若不过滤“负责”、“熟练”、“具备”等通用动词与连词，其超高频次将主导整个向量内积，使得任何两篇完全不相干的简历都能测出 70%+ 的虚假匹配分。本阶段剔除 100+ 噪声词，保留核心专业实体。
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-xs font-bold text-emerald-800 block mb-1">
                  ✅ 已成功对齐的核心技能 ({analysis.matchedKeywords.length}项)
                </span>
                <div className="flex flex-wrap gap-1">
                  {analysis.matchedKeywords.slice(0, 8).map(k => (
                    <span key={k} className="text-[11px] bg-white text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                <span className="text-xs font-bold text-rose-800 block mb-1">
                  ❌ 缺失的硬性核心技能 ({analysis.missingKeywords.length}项)
                </span>
                <div className="flex flex-wrap gap-1">
                  {analysis.missingKeywords.slice(0, 8).map(k => (
                    <span key={k} className="text-[11px] bg-white text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  阶段三深入检视
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  TF-IDF 逆文档频次与 L2 范数几何正交投影
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('3d_vector')}
                className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                前往 3D 向量空间演播器 <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              将每个词项按对数频次 <InlineMath math="1 + \ln(\text{tf})" /> 乘以逆文档频率 <InlineMath math="\text{IDF}(t)" /> 得到无界坐标，接着施行 L2 范数除法：<InlineMath math="\hat{\mathbf{v}} = \frac{\mathbf{v}}{\|\mathbf{v}\|_2}" />。这一几何约束使得简历向量与职位向量被投射在同等半径的单位超球面上。
            </p>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 font-mono text-xs flex flex-wrap items-center justify-between gap-2">
              <span>JD 向量初始范数 <InlineMath math="\|\mathbf{v}_{\text{JD}}\|_2" />: {analysis.jdNorm}</span>
              <span>简历向量初始范数 <InlineMath math="\|\mathbf{v}_{\text{Resume}}\|_2" />: {analysis.resumeNorm}</span>
              <span className="text-emerald-700 font-bold">归一化后模长 = 1.000 (单位超球面)</span>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  阶段四深入检视
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>综合度量、ATS 通过率预估与报告导出</span>
                  <span className="text-xs font-mono text-amber-700 font-normal">
                    <InlineMath math="\cos(\theta)" />
                  </span>
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('report')}
                className="text-xs text-amber-600 hover:text-amber-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                前往数据报告导出引擎 <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              终极余弦内积由分子 <InlineMath math="\sum (w_{i,\text{JD}} \cdot w_{i,\text{Resume}})" /> 与分母范数积计算获得，结合 Transformer 稠密语义空间加权，生成具有工业可解释性的综合匹配率、经验年限及 ATS 筛查通关概率。
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-stone-50 rounded-xl border text-center">
                <span className="text-[10px] text-slate-400 block">稀疏余弦分</span>
                <span className="text-lg font-bold font-mono text-slate-800">{analysis.sparseCosineScore}%</span>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                <span className="text-[10px] text-indigo-500 block">稠密语义分</span>
                <span className="text-lg font-bold font-mono text-indigo-700">{analysis.denseEmbeddingScore}%</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                <span className="text-[10px] text-emerald-600 block">综合置信分</span>
                <span className="text-lg font-bold font-mono text-emerald-700">{analysis.hybridScore}%</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center">
                <span className="text-[10px] text-amber-600 block">ATS 初筛通关率</span>
                <span className="text-lg font-bold font-mono text-amber-700">{analysis.atsPassRate}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
