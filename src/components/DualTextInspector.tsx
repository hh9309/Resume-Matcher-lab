import React, { useState, useMemo } from 'react';
import { MatchAnalysisResult, TermWeight } from '../types';
import { FileText, CheckCircle2, AlertTriangle, Eye, Sparkles, Upload, Copy, RotateCcw, Search } from 'lucide-react';

interface Props {
  jdText: string;
  resumeText: string;
  onJdChange: (text: string) => void;
  onResumeChange: (text: string) => void;
  analysis: MatchAnalysisResult;
  roleTitle: string;
}

export const DualTextInspector: React.FC<Props> = ({
  jdText,
  resumeText,
  onJdChange,
  onResumeChange,
  analysis,
  roleTitle,
}) => {
  const [highlightMode, setHighlightMode] = useState<'all' | 'matched' | 'missing' | 'none'>('all');
  const [isEditingJd, setIsEditingJd] = useState(false);
  const [isEditingResume, setIsEditingResume] = useState(false);
  const [hoveredTerm, setHoveredTerm] = useState<TermWeight | null>(null);

  // Term lookup maps
  const termMap = useMemo(() => {
    const map = new Map<string, TermWeight>();
    for (const tw of analysis.termWeights) {
      map.set(tw.term.toLowerCase(), tw);
    }
    return map;
  }, [analysis.termWeights]);

  // Render text with interactive spans
  const renderHighlightedText = (text: string, isJd: boolean) => {
    if (highlightMode === 'none') {
      return <div className="whitespace-pre-wrap font-sans text-xs text-slate-700 leading-relaxed">{text}</div>;
    }

    // Split text into tokens / segments
    const regex = /([a-zA-Z0-9+#.-]{2,}|[\u4e00-\u9fa5]{2,6})/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const rawWord = match[0];
      const lower = rawWord.toLowerCase();
      const termInfo = termMap.get(lower);

      if (termInfo) {
        const isMatched = termInfo.status === 'matched';
        const isMissing = termInfo.status === 'missing';
        const isSurplus = termInfo.status === 'surplus';

        let showHighlight = false;
        if (highlightMode === 'all') showHighlight = true;
        else if (highlightMode === 'matched' && isMatched) showHighlight = true;
        else if (highlightMode === 'missing' && (isMissing || isMatched)) showHighlight = true;

        if (showHighlight) {
          let styleClass = '';
          if (isMatched) {
            styleClass = 'bg-emerald-100/90 text-emerald-950 font-semibold px-1 py-0.5 rounded border-b-2 border-emerald-500 shadow-2xs hover:bg-emerald-200 transition-colors cursor-pointer';
          } else if (isMissing && isJd) {
            styleClass = 'bg-rose-100/90 text-rose-950 font-semibold px-1 py-0.5 rounded border-b-2 border-rose-400 shadow-2xs hover:bg-rose-200 transition-colors cursor-pointer';
          } else if (isSurplus && !isJd) {
            styleClass = 'bg-sky-100/90 text-sky-950 font-semibold px-1 py-0.5 rounded border-b-2 border-sky-400 shadow-2xs hover:bg-sky-200 transition-colors cursor-pointer';
          }

          parts.push(
            <span
              key={`${match.index}-${rawWord}`}
              className={styleClass || 'font-medium'}
              onMouseEnter={() => setHoveredTerm(termInfo)}
              onMouseLeave={() => setHoveredTerm(null)}
              title={`${termInfo.term} (状态: ${termInfo.status === 'matched' ? '已命中' : termInfo.status === 'missing' ? 'JD缺失' : '简历扩展'}, 权重: ${termInfo.jdWeight})`}
            >
              {rawWord}
            </span>
          );
        } else {
          parts.push(rawWord);
        }
      } else {
        parts.push(rawWord);
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return (
      <div className="whitespace-pre-wrap font-sans text-xs text-slate-700 leading-relaxed selection:bg-emerald-200">
        {parts}
      </div>
    );
  };

  // Handle file uploads (txt / md / pdf-like text files)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isJd: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        if (isJd) onJdChange(content);
        else onResumeChange(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              双向文本实时分词与高亮演播器
            </h3>
            <p className="text-xs text-slate-500">
              左侧职位需求与右侧简历双向对齐，绿光为已对齐技能，红线为失分缺口。
            </p>
          </div>
        </div>

        {/* Highlight Mode Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setHighlightMode('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              highlightMode === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            全部高亮 ({analysis.matchedCount + analysis.missingCount})
          </button>
          <button
            onClick={() => setHighlightMode('matched')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              highlightMode === 'matched'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            仅看绿光命中 ({analysis.matchedCount})
          </button>
          <button
            onClick={() => setHighlightMode('missing')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              highlightMode === 'missing'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            仅看核心缺口 ({analysis.missingCount})
          </button>
          <button
            onClick={() => setHighlightMode('none')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              highlightMode === 'none'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            纯文本
          </button>
        </div>
      </div>

      {/* Floating Hover Card */}
      {hoveredTerm && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 text-xs font-mono animate-fade-in">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold text-sm">{hoveredTerm.term}</span>
            <span className="text-slate-400 font-sans">
              ({hoveredTerm.status === 'matched' ? '✅ 双向命中' : hoveredTerm.status === 'missing' ? '❌ JD缺失' : '🔷 简历扩展'})
            </span>
          </div>
          <div className="border-l border-slate-700 pl-3 flex gap-3 text-slate-300">
            <span>JD频次: <strong className="text-indigo-400">{hoveredTerm.jdTf}</strong></span>
            <span>简历频次: <strong className="text-emerald-400">{hoveredTerm.resumeTf}</strong></span>
            <span>IDF: <strong>{hoveredTerm.jdIdf}</strong></span>
            <span>内积贡献: <strong className="text-amber-400">+{hoveredTerm.dotProduct}</strong></span>
          </div>
        </div>
      )}

      {/* Dual Pane Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Pane: Job Description (JD) */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-xs flex flex-col h-[560px]">
          <div className="p-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span className="text-xs font-bold text-slate-800">
                职位需求 (Job Description)
              </span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                {roleTitle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-stone-200">
                <Upload className="w-3 h-3" />
                <span>导入JD文本</span>
                <input
                  type="file"
                  accept=".txt,.md,.json"
                  onChange={(e) => handleFileUpload(e, true)}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setIsEditingJd(!isEditingJd)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                  isEditingJd
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {isEditingJd ? '完成编辑' : '直接修改'}
              </button>
            </div>
          </div>

          {/* JD Content Body */}
          <div className="flex-1 p-4 overflow-y-auto font-sans leading-relaxed">
            {isEditingJd ? (
              <textarea
                value={jdText}
                onChange={(e) => onJdChange(e.target.value)}
                className="w-full h-full p-2 text-xs font-mono border border-stone-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="粘贴或输入职位需求文本..."
              />
            ) : (
              renderHighlightedText(jdText, true)
            )}
          </div>

          {/* JD Bottom Status */}
          <div className="p-3 border-t border-stone-100 bg-stone-50/50 rounded-b-2xl flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>字符总数: {jdText.length}</span>
            <span>抽取特征: {analysis.termWeights.filter(t => t.jdTf > 0).length} 维</span>
          </div>
        </div>

        {/* Right Pane: Candidate Resume */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/80 shadow-xs flex flex-col h-[560px]">
          <div className="p-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="text-xs font-bold text-slate-800">
                候选人简历 (Candidate Resume)
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                匹配度: {analysis.hybridScore}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-stone-200">
                <Upload className="w-3 h-3" />
                <span>导入简历文本</span>
                <input
                  type="file"
                  accept=".txt,.md,.json"
                  onChange={(e) => handleFileUpload(e, false)}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setIsEditingResume(!isEditingResume)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                  isEditingResume
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {isEditingResume ? '完成编辑' : '直接修改'}
              </button>
            </div>
          </div>

          {/* Resume Content Body */}
          <div className="flex-1 p-4 overflow-y-auto font-sans leading-relaxed">
            {isEditingResume ? (
              <textarea
                value={resumeText}
                onChange={(e) => onResumeChange(e.target.value)}
                className="w-full h-full p-2 text-xs font-mono border border-stone-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="粘贴或输入简历文本..."
              />
            ) : (
              renderHighlightedText(resumeText, false)
            )}
          </div>

          {/* Resume Bottom Status */}
          <div className="p-3 border-t border-stone-100 bg-stone-50/50 rounded-b-2xl flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>字符总数: {resumeText.length}</span>
            <span>
              已命中: <strong className="text-emerald-700">{analysis.matchedCount} 项</strong> | 缺失: <strong className="text-rose-600">{analysis.missingCount} 项</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
