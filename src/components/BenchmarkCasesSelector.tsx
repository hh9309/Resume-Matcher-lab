import React from 'react';
import { BENCHMARK_CASES } from '../data/benchmarks';
import { BenchmarkCase } from '../types';
import { BrainCircuit, BarChart3, Layers, TrendingUp, Sparkles, Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  selectedCaseId: string;
  selectedTier: 'high' | 'medium' | 'low';
  onSelectCase: (caseItem: BenchmarkCase, tier: 'high' | 'medium' | 'low') => void;
}

export const BenchmarkCasesSelector: React.FC<Props> = ({
  selectedCaseId,
  selectedTier,
  onSelectCase,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BrainCircuit':
        return <BrainCircuit className="w-5 h-5 text-indigo-600" />;
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5 text-cyan-600" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-emerald-600" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-amber-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
    }
  };

  const currentCase = BENCHMARK_CASES.find(c => c.id === selectedCaseId) || BENCHMARK_CASES[0];

  const handleTierChange = (tier: 'high' | 'medium' | 'low') => {
    if (tier === 'high') {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
    onSelectCase(currentCase, tier);
  };

  return (
    <div className="space-y-6">
      {/* Module Banner */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              四大实战基准案例库
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              招聘场景基准预设库 (Benchmark Cases)
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              一键切换行业代表性岗位，对比高、中、低多梯度候选人特征向量与匹配落差。
            </p>
          </div>

          {/* Current Active Case Badge */}
          <div className="bg-stone-50 px-4 py-2.5 rounded-xl border border-stone-200/60 flex items-center gap-3">
            {getIcon(currentCase.icon)}
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">当前实验对象</span>
              <span className="text-xs font-bold text-slate-800">{currentCase.title}</span>
            </div>
          </div>
        </div>

        {/* 4 Job Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {BENCHMARK_CASES.map((item) => {
            const isSelected = item.id === selectedCaseId;
            return (
              <div
                key={item.id}
                onClick={() => onSelectCase(item, selectedTier)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500/50'
                    : 'bg-white hover:bg-stone-50 border-stone-200/80 text-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-slate-800' : 'bg-stone-100'}`}>
                      {getIcon(item.icon)}
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-stone-100 text-slate-600'
                      }`}
                    >
                      {item.level}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold leading-snug">{item.title}</h3>
                  <p
                    className={`text-xs mt-2 line-clamp-2 leading-relaxed ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/20 flex items-center justify-between text-xs">
                  <span className={`${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                    {item.industry}
                  </span>
                  <span className="font-semibold flex items-center gap-1 text-emerald-400">
                    {isSelected ? '实验中' : '点击载入'}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Tier Candidates Selector for the active job */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              三档梯度简历对标对比
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              观察同一职位下，不同匹配度候选人在分词特征、余弦偏角与语义嵌入维度的显著区别
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            所属职位: {currentCase.title}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* High Match */}
          <div
            onClick={() => handleTierChange('high')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedTier === 'high'
                ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500 shadow-xs'
                : 'bg-stone-50 hover:bg-white border-stone-200/70'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                高匹配梯队 (High Fit)
              </span>
              <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                ~{currentCase.resumes.high.expectedScore}%
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-800">{currentCase.resumes.high.name}</h4>
            <div className="mt-3 space-y-1.5">
              {currentCase.resumes.high.highlights.map((h, i) => (
                <div key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Medium Match */}
          <div
            onClick={() => handleTierChange('medium')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedTier === 'medium'
                ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500 shadow-xs'
                : 'bg-stone-50 hover:bg-white border-stone-200/70'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                中度匹配梯队 (Mid Fit)
              </span>
              <span className="text-xs font-mono font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                ~{currentCase.resumes.medium.expectedScore}%
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-800">{currentCase.resumes.medium.name}</h4>
            <div className="mt-3 space-y-1.5">
              {currentCase.resumes.medium.highlights.map((h, i) => (
                <div key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Match */}
          <div
            onClick={() => handleTierChange('low')}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              selectedTier === 'low'
                ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-500 shadow-xs'
                : 'bg-stone-50 hover:bg-white border-stone-200/70'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                跨界/低匹配梯队 (Low Fit)
              </span>
              <span className="text-xs font-mono font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                ~{currentCase.resumes.low.expectedScore}%
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-800">{currentCase.resumes.low.name}</h4>
            <div className="mt-3 space-y-1.5">
              {currentCase.resumes.low.highlights.map((h, i) => (
                <div key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
