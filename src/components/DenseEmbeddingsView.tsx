import React, { useState, useMemo } from 'react';
import { MatchAnalysisResult, SemanticPoint2D } from '../types';
import { getSemantic2DLandscape, SEMANTIC_CLUSTER_COORDINATES } from '../utils/nlpEngine';
import { Network, Sparkles, Sliders, Info, CheckCircle2, ArrowRightLeft } from 'lucide-react';
import { InlineMath } from './KatexMath';

interface Props {
  analysis: MatchAnalysisResult;
}

export const DenseEmbeddingsView: React.FC<Props> = ({ analysis }) => {
  const [selectedPoint, setSelectedPoint] = useState<SemanticPoint2D | null>(null);
  const [denseWeightSlider, setDenseWeightSlider] = useState<number>(60); // 60% Dense, 40% Sparse
  const [activeFilter, setActiveFilter] = useState<'all' | 'both' | 'jd_only' | 'resume_only'>('all');

  // Generate 2D landscape points
  const points = useMemo(() => {
    return getSemantic2DLandscape(analysis.termWeights);
  }, [analysis.termWeights]);

  const filteredPoints = useMemo(() => {
    if (activeFilter === 'both') return points.filter(p => p.inJd && p.inResume);
    if (activeFilter === 'jd_only') return points.filter(p => p.inJd && !p.inResume);
    if (activeFilter === 'resume_only') return points.filter(p => !p.inJd && p.inResume);
    return points;
  }, [points, activeFilter]);

  // Dynamic blended score based on slider
  const blendedScore = Math.round(
    (1 - denseWeightSlider / 100) * analysis.sparseCosineScore +
    (denseWeightSlider / 100) * analysis.denseEmbeddingScore
  );

  return (
    <div className="space-y-6">
      {/* Header Slice */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-semibold mb-2">
              <Network className="w-3.5 h-3.5 text-indigo-600" />
              稠密语义嵌入投影
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
              <span>Dense Embeddings 低维隐空间语义聚类投影</span>
              <span className="text-xs font-normal text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                <InlineMath math="\text{Sim}_{\text{dense}} = \cos(\mathbf{e}_{\text{JD}}, \mathbf{e}_{\text{Resume}})" />
              </span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              演示 Transformer / BERT 稠密语义向量如何化解 TF-IDF 的字面孤岛，捕捉“PyTorch”与“深度学习”近义聚类。
            </p>
          </div>

          {/* Interactive Weight Slider Bar */}
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60 min-w-[280px]">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
              <span>混合权重调配</span>
              <span className="font-mono text-indigo-600">{100 - denseWeightSlider}% 稀疏 : {denseWeightSlider}% 稠密</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={denseWeightSlider}
              onChange={(e) => setDenseWeightSlider(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>0% (纯TF-IDF硬匹配)</span>
              <span>100% (纯语义近义)</span>
            </div>
          </div>
        </div>

        {/* 3 Metric Score Comparisons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70">
            <span className="text-xs text-slate-400 block font-medium">① 稀疏 TF-IDF 匹配得分</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-mono text-slate-800">
                {analysis.sparseCosineScore}%
              </span>
              <span className="text-xs text-slate-400">严格字面共现</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
            <span className="text-xs text-indigo-600 block font-medium">② 稠密 Embedding 语义得分</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-mono text-indigo-700">
                {analysis.denseEmbeddingScore}%
              </span>
              <span className="text-xs text-indigo-500">语义连带召回</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-xs text-emerald-800 block font-medium">③ 当前实时动态混合加权分</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-mono text-emerald-700">
                {blendedScore}%
              </span>
              <span className="text-xs text-emerald-600 font-semibold">企业级推荐</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2D Semantic Canvas Landscape */}
      <div className="relative bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        {/* Top Filter Chips */}
        <div className="p-4 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 bg-stone-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">实体过滤:</span>
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              全部特征词 ({points.length})
            </button>
            <button
              onClick={() => setActiveFilter('both')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeFilter === 'both'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              双向命中 ({points.filter(p => p.inJd && p.inResume).length})
            </button>
            <button
              onClick={() => setActiveFilter('jd_only')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeFilter === 'jd_only'
                  ? 'bg-rose-700 text-white'
                  : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
              }`}
            >
              JD 独有缺失 ({points.filter(p => p.inJd && !p.inResume).length})
            </button>
            <button
              onClick={() => setActiveFilter('resume_only')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeFilter === 'resume_only'
                  ? 'bg-sky-700 text-white'
                  : 'bg-white text-sky-700 border border-sky-200 hover:bg-sky-50'
              }`}
            >
              简历盈余扩展 ({points.filter(p => !p.inJd && p.inResume).length})
            </button>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>点击图中圆点查看详细嵌入坐标与语义亲和度</span>
          </div>
        </div>

        {/* The 2D SVG Semantic Landscape */}
        <div className="relative w-full h-[520px] bg-slate-950 overflow-hidden cursor-crosshair">
          {/* Subtle Grid Lines */}
          <svg className="w-full h-full" viewBox="0 0 960 560" preserveAspectRatio="xMidYMid meet">
            {/* Grid Pattern */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Semantic Cluster Regions */}
            {Object.entries(SEMANTIC_CLUSTER_COORDINATES).map(([key, cluster]) => (
              <g key={key}>
                {/* Cluster boundary halo */}
                <circle
                  cx={cluster.cx}
                  cy={cluster.cy}
                  r="70"
                  fill={cluster.color}
                  fillOpacity="0.05"
                  stroke={cluster.color}
                  strokeOpacity="0.25"
                  strokeDasharray="3 3"
                />
                <text
                  x={cluster.cx}
                  y={cluster.cy - 78}
                  fill={cluster.color}
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                  className="opacity-75 tracking-wider select-none font-sans"
                >
                  {cluster.label}
                </text>
              </g>
            ))}

            {/* Connective Semantic Affinity Lines between close points */}
            {filteredPoints.slice(0, 18).map((p1, idx) => {
              const p2 = filteredPoints[(idx + 3) % filteredPoints.length];
              if (!p2) return null;
              const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
              if (dist > 140) return null;

              return (
                <line
                  key={`${p1.id}-${p2.id}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="rgba(99, 102, 241, 0.2)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              );
            })}

            {/* Term Nodes */}
            {filteredPoints.map((pt) => {
              const isSelected = selectedPoint?.id === pt.id;
              const isMatched = pt.inJd && pt.inResume;
              const isMissing = pt.inJd && !pt.inResume;

              let nodeColor = '#38bdf8'; // sky
              if (isMatched) nodeColor = '#10b981'; // emerald
              else if (isMissing) nodeColor = '#f43f5e'; // rose

              return (
                <g
                  key={pt.id}
                  onClick={() => setSelectedPoint(pt)}
                  className="cursor-pointer group"
                >
                  {/* Outer pulsating ring for selected */}
                  {isSelected && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="16"
                      fill="none"
                      stroke={nodeColor}
                      strokeWidth="2"
                      className="animate-ping opacity-60"
                    />
                  )}

                  {/* Halo */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 10 : 6}
                    fill={nodeColor}
                    fillOpacity={isSelected ? 0.9 : 0.75}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2 : 1}
                    className="transition-all duration-300 group-hover:scale-125"
                  />

                  {/* Label */}
                  <text
                    x={pt.x + 10}
                    y={pt.y + 4}
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    fontSize={isSelected ? '12' : '10'}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="select-none font-mono group-hover:fill-white group-hover:font-semibold transition-colors"
                  >
                    {pt.term}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Node Detail Float Drawer */}
          {selectedPoint && (
            <div className="absolute bottom-4 right-4 bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-700 text-white w-72 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-sm font-bold font-mono text-emerald-400">
                  {selectedPoint.term}
                </span>
                <button
                  onClick={() => setSelectedPoint(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="mt-2.5 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">所属语义簇:</span>
                  <span className="font-semibold text-indigo-300">{selectedPoint.cluster}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">出现状态:</span>
                  <span>
                    {selectedPoint.inJd && selectedPoint.inResume ? (
                      <span className="text-emerald-400 font-bold">双向匹配</span>
                    ) : selectedPoint.inJd ? (
                      <span className="text-rose-400 font-bold">JD 需求但简历缺失</span>
                    ) : (
                      <span className="text-sky-400 font-bold">简历自发掌握</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">隐空间坐标:</span>
                  <span className="font-mono text-slate-300">
                    ({selectedPoint.x}, {selectedPoint.y})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">簇心亲和度:</span>
                  <span className="font-mono text-indigo-400">
                    {(selectedPoint.similarityToCenter * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                💡 在深度学习 Embeddings 中，即使候选人未写出完全相同的字面词，只要位于同一几何半径邻域内，模型亦能保留语义亲和得分。
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mechanism Comparison Slice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-white/90 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-slate-800" />
            <h3 className="text-sm font-bold text-slate-900">TF-IDF 稀疏词袋的“字面绝壁”</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            TF-IDF 依赖正交基底假设：每个单词自成一维。若职位写“PyTorch”，而简历写“深度学习框架开发”，在代数上由于两词字面不同，内积直接判定为 <InlineMath math="\mathbf{u} \cdot \mathbf{v} = 0.00" />（完全正交无匹配）。这常常导致经验丰富的候选人因行文措辞略异而在初筛中冤枉出局。
          </p>
        </div>

        <div className="p-5 bg-white/90 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Dense Embeddings 稠密语义空间的“通感弥合”</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            基于 Transformer 预训练模型（如 text-embedding-3 / Gemini Embedding），所有词汇被映射至数百维连续紧密向量中。由于在大规模语料中“PyTorch”与“深度学习”共处相似上下文，它们的向量余弦夹角通常仅为 <InlineMath math="12^\circ \sim 25^\circ" />，模型可敏锐感知近义关系并赋予高达 85%+ 的语义认可。
          </p>
        </div>
      </div>
    </div>
  );
};
