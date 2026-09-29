import React, { useState } from 'react';
import { MatchAnalysisResult } from '../types';
import { Calculator, Compass, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { InlineMath, BlockMath } from './KatexMath';

interface Props {
  analysis: MatchAnalysisResult;
  roleTitle: string;
}

export const AlgebraSpaceModule: React.FC<Props> = ({ analysis, roleTitle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFormulaTab, setActiveFormulaTab] = useState<'cosine' | 'tfidf' | 'l2'>('cosine');

  const filteredWeights = analysis.termWeights.filter(t =>
    t.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card: High Level Derivation */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
              <Calculator className="w-3.5 h-3.5 text-emerald-600" />
              代数与空间解析模块
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 flex-wrap">
              <span>高维向量空间余弦相似度代数推导</span>
              <span className="text-sm font-normal text-emerald-800 bg-emerald-50/80 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                <InlineMath math="\cos(\theta) = \frac{\mathbf{v}_{\text{JD}} \cdot \mathbf{v}_{\text{Resume}}}{\|\mathbf{v}_{\text{JD}}\|_2 \|\mathbf{v}_{\text{Resume}}\|_2}" />
              </span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              形式化将职位需求与求职简历映射为 <InlineMath math="N" /> 维正交词频特征向量，利用内积空间夹角量化语义与技能的一致性。
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-3 bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
            <div className="text-center px-3 border-r border-stone-200">
              <span className="text-[11px] text-slate-400 block font-medium">余弦相似度</span>
              <span className="text-lg font-bold text-emerald-600 font-mono">
                {(analysis.sparseCosineScore / 100).toFixed(4)}
              </span>
            </div>
            <div className="text-center px-3 border-r border-stone-200">
              <span className="text-[11px] text-slate-400 block font-medium">
                空间夹角 <InlineMath math="\theta" />
              </span>
              <span className="text-lg font-bold text-indigo-600 font-mono">
                {analysis.angleDegrees}°
              </span>
            </div>
            <div className="text-center px-3">
              <span className="text-[11px] text-slate-400 block font-medium">特征字典维度</span>
              <span className="text-lg font-bold text-slate-700 font-mono">
                {analysis.totalTermsInVocab} 维
              </span>
            </div>
          </div>
        </div>

        {/* Formula Switcher Slices */}
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setActiveFormulaTab('cosine')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeFormulaTab === 'cosine'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
              }`}
            >
              ① 核心公式：余弦夹角与内积归一化
            </button>
            <button
              onClick={() => setActiveFormulaTab('tfidf')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeFormulaTab === 'tfidf'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
              }`}
            >
              ② 词权重建模：TF-IDF 逆文档频次
            </button>
            <button
              onClick={() => setActiveFormulaTab('l2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeFormulaTab === 'l2'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
              }`}
            >
              ③ 长度偏斜消除：L2 范数几何约束
            </button>
          </div>

          {/* Mathematical Card */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-stone-900 to-slate-900 text-white font-sans text-sm leading-relaxed shadow-inner">
            {activeFormulaTab === 'cosine' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-sans border-b border-slate-700/60 pb-2">
                  <span>形式化余弦度量定理 (Cosine Metric Theorem)</span>
                  <span>取值范围: [0, 1]（正数词频空间）</span>
                </div>
                <div className="py-2 text-stone-100 overflow-x-auto">
                  <BlockMath math="\text{Similarity} = \cos(\theta) = \frac{\mathbf{v}_{\text{JD}} \cdot \mathbf{v}_{\text{Resume}}}{\|\mathbf{v}_{\text{JD}}\|_2 \|\mathbf{v}_{\text{Resume}}\|_2} = \frac{\sum_{i=1}^N (w_{i,\text{JD}} \cdot w_{i,\text{Resume}})}{\sqrt{\sum_{i=1}^N w_{i,\text{JD}}^2} \cdot \sqrt{\sum_{i=1}^N w_{i,\text{Resume}}^2}}" />
                </div>
                <div className="text-xs text-stone-300 font-sans pt-2 border-t border-slate-700/60 flex items-center justify-between">
                  <span>当前分子内积累加和 <InlineMath math="\sum" /> = {analysis.dotProductSum}</span>
                  <span>分母范数积 <InlineMath math="\|\mathbf{v}_{\text{JD}}\|_2 \times \|\mathbf{v}_{\text{Resume}}\|_2" /> = {(analysis.jdNorm * analysis.resumeNorm).toFixed(3)}</span>
                </div>
              </div>
            )}

            {activeFormulaTab === 'tfidf' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-indigo-400 font-sans border-b border-slate-700/60 pb-2">
                  <span>对数词频与平滑逆文档频率 (Sublinear TF & Smooth IDF)</span>
                  <span>Scikit-Learn 标准对齐</span>
                </div>
                <div className="py-2 text-stone-100 overflow-x-auto">
                  <BlockMath math="w(t, d) = \text{TF}(t, d) \times \text{IDF}(t) = [1 + \ln(\text{count}_{t,d})] \times \left[\ln\left(\frac{1 + N}{1 + \text{DF}(t)}\right) + 1\right]" />
                </div>
                <p className="text-xs text-stone-300 font-sans pt-2 border-t border-slate-700/60">
                  机理：通用高频词（如“系统/工作”）在所有文档出现时 <InlineMath math="\text{DF}(t) \to N" />，其 <InlineMath math="\text{IDF}" /> 权重降低；关键专有名词（如“vLLM/Barra”）仅在目标文档出现，权重倍增。
                </p>
              </div>
            )}

            {activeFormulaTab === 'l2' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-cyan-400 font-sans border-b border-slate-700/60 pb-2">
                  <span>欧氏距离与长度偏斜陷阱消除 (Length Bias Invariance)</span>
                  <span>单位超球面映射</span>
                </div>
                <div className="py-2 text-stone-100 overflow-x-auto">
                  <BlockMath math="\hat{\mathbf{v}} = \frac{\mathbf{v}}{\|\mathbf{v}\|_2} \implies \cos(\theta) = \hat{\mathbf{v}}_{\text{JD}} \cdot \hat{\mathbf{v}}_{\text{Resume}} = 1 - \frac{1}{2}\|\hat{\mathbf{v}}_{\text{JD}} - \hat{\mathbf{v}}_{\text{Resume}}\|_2^2" />
                </div>
                <p className="text-xs text-stone-300 font-sans pt-2 border-t border-slate-700/60">
                  机理：一份10页长简历与一份1页精炼简历，即便技能完全一致，在欧氏距离空间会产生巨大几何间距；归一化为单位向量后，仅考察方向夹角，彻底消除了篇幅偏见。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Geometric Gauge & Angle Slices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Angle Gauge Visualizer */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">几何夹角测度</span>
              <Compass className="w-4 h-4 text-indigo-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <span>向量方向偏转度</span>
              <span className="text-xs text-indigo-600 font-mono font-normal">
                <InlineMath math="\theta" />
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              高维空间中两向量夹角 <InlineMath math="\theta = \arccos(\text{Similarity})" />
            </p>
          </div>

          {/* Semi-circular gauge rendering */}
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="relative w-48 h-28 flex items-end justify-center">
              {/* Background Arc */}
              <svg className="w-48 h-24 overflow-visible" viewBox="0 0 100 50">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Active Colored Arc */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="8"
                  strokeDasharray="125.6"
                  strokeDashoffset={125.6 * (1 - analysis.sparseCosineScore / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Angle needle & text */}
              <div className="absolute bottom-0 flex flex-col items-center">
                <span className="text-2xl font-black text-slate-800 font-mono">
                  {analysis.angleDegrees}°
                </span>
                <span className="text-[11px] font-semibold text-emerald-600">
                  {analysis.angleDegrees < 30 ? '极高契合度' : analysis.angleDegrees < 55 ? '中度契合度' : '存在显著差异'}
                </span>
              </div>
            </div>

            <div className="w-full flex justify-between text-[11px] text-slate-400 font-mono mt-3 px-2">
              <span>0° (完全重合)</span>
              <span>45° (折半)</span>
              <span>90° (完全正交)</span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl text-xs text-slate-600 space-y-1.5 border border-stone-200/60">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">
                JD 向量 L2 模长 <InlineMath math="\|\mathbf{v}_{\text{JD}}\|_2" />:
              </span>
              <span className="font-mono font-semibold text-slate-700">{analysis.jdNorm}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">
                简历向量 L2 模长 <InlineMath math="\|\mathbf{v}_{\text{Resume}}\|_2" />:
              </span>
              <span className="font-mono font-semibold text-slate-700">{analysis.resumeNorm}</span>
            </div>
            <div className="flex justify-between items-center border-t border-stone-200/60 pt-1">
              <span className="text-slate-500">
                归一化内积 <InlineMath math="\hat{\mathbf{v}}_1 \cdot \hat{\mathbf{v}}_2" />:
              </span>
              <span className="font-mono font-bold text-emerald-700">
                {(analysis.sparseCosineScore / 100).toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Top Positive Contributors Slice */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">正向贡献核心</span>
              <Sparkles className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mt-1">最大得分贡献特征 (Top Dot)</h3>
            <p className="text-xs text-slate-500 mt-0.5">两向量乘积中拉近距离的最大正向分量</p>
          </div>

          <div className="space-y-2.5 my-4">
            {analysis.topContributors.slice(0, 4).map((term, idx) => (
              <div
                key={term.term}
                className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{term.term}</span>
                    <span className="text-[10px] text-slate-400">
                      JD:{term.jdTf}次 × 简历:{term.resumeTf}次
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-600 block">
                    +{term.dotProduct}
                  </span>
                  <span className="text-[10px] text-slate-400">权重乘积贡献</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100 flex items-center gap-1.5">
            <span className="font-bold text-emerald-800">💡 代数观察：</span>
            <span>高贡献项兼备了高职位词频与稀缺度，是决定余弦偏角的关键支柱。</span>
          </div>
        </div>

        {/* Penalized Missing Skill Slice */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">正交阻断损耗</span>
              <HelpCircle className="w-4 h-4 text-rose-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mt-1">最大失分缺口 (Zero Dimension)</h3>
            <p className="text-xs text-slate-500 mt-0.5">JD高权重但简历为0，导致内积贡献归零</p>
          </div>

          <div className="space-y-2.5 my-4">
            {analysis.termWeights
              .filter(t => t.status === 'missing')
              .slice(0, 4)
              .map((term, idx) => (
                <div
                  key={term.term}
                  className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold flex items-center justify-center">
                      !
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{term.term}</span>
                      <span className="text-[10px] text-rose-600">JD频次 {term.jdTf} 次 | IDF: {term.jdIdf}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-rose-600 block">
                      乘积 = 0.00
                    </span>
                    <span className="text-[10px] text-slate-400">JD权重 {term.jdWeight}</span>
                  </div>
                </div>
              ))}
          </div>

          <div className="text-[11px] text-slate-500 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 flex items-center gap-1.5">
            <span className="font-bold text-amber-800">⚠️ 诊断建议：</span>
            <span>此类技术词在简历中完全断层，只需在对应项目中实事求是补充即可提升分数。</span>
          </div>
        </div>
      </div>

      {/* Numerical Matrix Expansion Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">高维特征矩阵乘积数值展开明细表</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              逐行呈现各特征分量在目标岗位与候选人简历中的代数计算值
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="搜索特征词汇 (如: pytorch / sql)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
            />
            <span className="text-xs text-slate-400 font-mono">
              共 {filteredWeights.length} 维
            </span>
          </div>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-slate-600 font-semibold border-b border-stone-200/80 sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-4">特征词 (Term)</th>
                <th className="py-2.5 px-3">状态</th>
                <th className="py-2.5 px-3 font-mono">JD TF</th>
                <th className="py-2.5 px-3 font-mono">
                  <InlineMath math="\text{IDF}(t)" />
                </th>
                <th className="py-2.5 px-3 font-mono text-indigo-700">
                  JD 权重 <InlineMath math="w_{\text{JD}}" />
                </th>
                <th className="py-2.5 px-3 font-mono">简历 TF</th>
                <th className="py-2.5 px-3 font-mono text-emerald-700">
                  简历权重 <InlineMath math="w_{\text{Res}}" />
                </th>
                <th className="py-2.5 px-4 font-mono text-right">
                  分量内积 <InlineMath math="w_1 \cdot w_2" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredWeights.slice(0, 30).map((row) => (
                <tr
                  key={row.term}
                  className={`hover:bg-stone-50/80 transition-colors ${
                    row.status === 'matched' ? 'bg-emerald-50/20' : row.status === 'missing' ? 'bg-rose-50/15' : ''
                  }`}
                >
                  <td className="py-2.5 px-4 font-bold text-slate-800 flex items-center gap-1.5">
                    {row.term}
                    {row.importance === 'high' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-indigo-50 text-indigo-700 font-medium">
                        核心
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    {row.status === 'matched' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        已命中
                      </span>
                    )}
                    {row.status === 'missing' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800">
                        缺失扣分
                      </span>
                    )}
                    {row.status === 'surplus' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-800">
                        简历独有
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{row.jdTf}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{row.jdIdf}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-indigo-700">{row.jdWeight}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{row.resumeTf}</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-emerald-700">{row.resumeWeight}</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-right">
                    {row.dotProduct > 0 ? (
                      <span className="text-emerald-600">+{row.dotProduct}</span>
                    ) : (
                      <span className="text-slate-300">0.00</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
