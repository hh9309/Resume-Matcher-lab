import React from 'react';
import { BookOpen, AlertTriangle, Compass, CheckCircle2, SplitSquareVertical, Sparkles, Scale, FileWarning } from 'lucide-react';
import { InlineMath, BlockMath } from './KatexMath';

export const NlpKnowledgeSlices: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Knowledge Intro Header */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              NLP 原理与初筛算法深度切片
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              文本匹配机理、数学空间与四大避坑指南
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              深入剖析工业界 ATS 匹配器底层原理，透视向量内积、词频平滑与近义语义的数学物理边界。
            </p>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            4 大核心切片导引
          </span>
        </div>
      </div>

      {/* Slice 1: Two Vector Mechanisms */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
            <SplitSquareVertical className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">切片一</span>
            <h3 className="text-base font-bold text-slate-900">
              两大向量算法机理差异：稀疏 TF-IDF vs 稠密 Dense Embeddings
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          文本匹配由早期的字面符号模型演进至现代的深度表征学习，理解两者的代数本质是掌握算法行为的关键：
        </p>

        {/* Side by side comparison table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/70 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">TF-IDF 稀疏词袋模型 (Sparse VSM)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-stone-200 text-slate-700 font-mono">字面硬匹配</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed">
              <li><strong>正交正基底</strong>：每个独立词汇视为几何空间中的一个正交轴（维度达数万维）。</li>
              <li><strong>硬字面匹配</strong>：职位写 “PyTorch”，简历写 “深度学习框架”，两向量点积严格为 0。</li>
              <li><strong>优点</strong>：极低延迟（&lt;1ms）、算力开销极小、结果 100% 可解释（可明确溯源哪个词贡献多少分）。</li>
              <li><strong>缺点</strong>：无法理解近义词、同义词，对一词多义与上下文完全盲目。</li>
            </ul>
          </div>

          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900">Dense Embeddings 稠密语义模型 (Deep Semantic)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono">语义软亲和</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed">
              <li><strong>连续隐空间</strong>：通过预训练大模型将文本压缩进 512~1536 维实数向量。</li>
              <li><strong>近义感知</strong>：“PyTorch”、“TensorFlow” 与 “深度学习” 具有极高的余弦亲和度。</li>
              <li><strong>优点</strong>：能捕捉高阶抽象能力与领域上下文关联，容错率极高。</li>
              <li><strong>缺点</strong>：算力开销大、易受黑盒不可解释性困扰，可能因上下文过度联想导致无关词汇虚假亲近。</li>
            </ul>
          </div>
        </div>

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span><strong>工业界黄金标准</strong>：40% TF-IDF（保障关键资质硬条件对齐）+ 60% Dense Embeddings（弥补措辞差异）。</span>
        </div>
      </div>

      {/* Slice 2: Applicable Conditions & Spatial Representation */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">切片二</span>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
              <span>适用条件与空间表示：为什么度量角度</span>
              <span className="text-emerald-700 font-mono">
                <InlineMath math="\theta" />
              </span>
              <span>而非欧氏距离？</span>
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          为什么所有文本匹配系统均采用<strong>余弦相似度 (Cosine Similarity)</strong>，而坚决禁用常见的欧氏几何距离 (Euclidean Distance)？答案在于<strong>“长度偏斜定理” (Length Bias Problem)</strong>。
        </p>

        <div className="p-4 bg-slate-950 text-white rounded-xl text-xs space-y-3 border border-slate-800">
          <div className="text-emerald-400 font-bold">// 几何数学原理推导与严格守恒性证明：</div>
          <div className="text-slate-300">
            设一份精炼简历特征向量为 <InlineMath math="\mathbf{v}" />，另一份将同样内容详尽复述两遍的冗长简历为 <InlineMath math="2\mathbf{v}" />。
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-rose-900/40 text-amber-200">
            <span className="text-rose-400 font-bold block mb-1">❌ 欧氏距离空间 (长简历惨遭严重惩罚)：</span>
            <BlockMath math="\|\mathbf{v}_{\text{JD}} - 2\mathbf{v}\|_2 \gg \|\mathbf{v}_{\text{JD}} - \mathbf{v}\|_2" />
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-900/40 text-emerald-200">
            <span className="text-emerald-400 font-bold block mb-1">✅ 余弦夹角空间 (几何方向与专业资质完全守恒)：</span>
            <BlockMath math="\cos(\theta) = \frac{\mathbf{v}_{\text{JD}} \cdot 2\mathbf{v}}{\|\mathbf{v}_{\text{JD}}\|_2 \|2\mathbf{v}\|_2} = \frac{2(\mathbf{v}_{\text{JD}} \cdot \mathbf{v})}{2\|\mathbf{v}_{\text{JD}}\|_2 \|\mathbf{v}\|_2} = \frac{\mathbf{v}_{\text{JD}} \cdot \mathbf{v}}{\|\mathbf{v}_{\text{JD}}\|_2 \|\mathbf{v}\|_2} = \cos(\theta)" />
          </div>
        </div>

        <p className="text-xs text-slate-500">
          余弦度量聚焦于<strong>技术要素相对配比的方向一致性</strong>，使 1 页纸精练简历与 3 页详实经历在算法面前享有平等基准。
        </p>
      </div>

      {/* Slice 3: 3 Deadly Matching Traps */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">切片三</span>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
              <span>三大致命匹配陷阱：停用词、对数平滑</span>
              <span className="text-amber-800 font-mono text-sm">
                <InlineMath math="1 + \ln(\text{TF})" />
              </span>
              <span>与近义归零</span>
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/70">
            <span className="text-xs font-bold text-slate-800 block mb-1">
              1. 停用词未除导致虚高
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              若未清洗“负责、具备、良好”等口水词，高频虚词的积和将占据内积分子的 60% 以上，两份毫不相干的文本也能跑出 80% 的荒唐相似度。
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/70">
            <span className="text-xs font-bold text-slate-800 block mb-1 flex items-center gap-1">
              <span>2. 关键词堆砌</span>
              <span className="text-[10px] text-amber-700 font-mono font-normal">
                <InlineMath math="1 + \ln(\text{TF})" />
              </span>
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              部分求职者在末尾以白字小字堆砌上百个技术词。现代 ATS 采用对数平滑 <InlineMath math="1 + \ln(\text{TF})" /> 及密度反作弊惩罚，无上下文关联的堆砌会直接触发丢弃。
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/70">
            <span className="text-xs font-bold text-slate-800 block mb-1">
              3. 近义词字面脱节归零
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              职位写“高并发分布式缓存”，简历若只写“Redis 主从集群哨兵”，在纯 TF-IDF 下字面正交为 <InlineMath math="\mathbf{u} \cdot \mathbf{v} = 0" />。必须在简历中明确点出母体概念。
            </p>
          </div>
        </div>
      </div>

      {/* Slice 4: Pitfalls & Diagnosis Traps */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
            <FileWarning className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">切片四</span>
            <h3 className="text-base font-bold text-slate-900">
              误区警示：高匹配得分不等于高胜任力
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100">
            <h4 className="text-xs font-bold text-rose-900 mb-1">
              警惕一：名词堆砌与项目深度脱节
            </h4>
            <p className="text-xs text-rose-700 leading-relaxed">
              初筛算法仅评估“特征空间重合度”，无法验证业务真实产出。技术面试官重点追问的是在极端负载或业务瓶颈下，候选人如何排障调优（STAR法则中的 Action 与 Result）。
            </p>
          </div>

          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
            <h4 className="text-xs font-bold text-amber-900 mb-1">
              警惕二：复杂多列 PDF 导致 ATS 文本乱序
            </h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              花哨的双栏/三栏简历在被开源 PDF 解析器（如 pdfminer）抽取时，往往发生左右内容交错拼接，直接破坏分词连贯性。求职务必优先选择结构整洁的单栏排版。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
