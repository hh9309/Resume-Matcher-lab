import React from 'react';
import { ActiveTab, MatchAnalysisResult } from '../types';
import {
  Calculator,
  Rotate3d,
  Network,
  FileText,
  Briefcase,
  Code2,
  GitMerge,
  Download,
  BookOpen,
  Bot,
  Sparkles,
} from 'lucide-react';

interface Props {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  analysis: MatchAnalysisResult;
  roleTitle: string;
  onOpenAiDrawer: () => void;
}

export const Header: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  analysis,
  roleTitle,
  onOpenAiDrawer,
}) => {
  const tabs = [
    { id: 'algebra', label: '1. 代数与空间', icon: <Calculator className="w-3.5 h-3.5" /> },
    { id: '3d_vector', label: '2. TF-IDF 3D', icon: <Rotate3d className="w-3.5 h-3.5" /> },
    { id: 'embeddings', label: '3. Embeddings', icon: <Network className="w-3.5 h-3.5" /> },
    { id: 'dual_text', label: '4. 关键词高亮', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'cases', label: '5. 四大案例', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'code_engine', label: '6. 代码引擎', icon: <Code2 className="w-3.5 h-3.5" /> },
    { id: 'pipeline', label: '7. 全流程导引', icon: <GitMerge className="w-3.5 h-3.5" /> },
    { id: 'report', label: '8. 数据报告', icon: <Download className="w-3.5 h-3.5" /> },
    { id: 'knowledge', label: '9. 知识导引', icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding Bar */}
        <div className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  简历与职位需求智能匹配实验室
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                  Resume Matcher Lab
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                基于代数内积、TF-IDF 向量空间、稠密语义 Embeddings 与大模型诊断的综合匹配系统
              </p>
            </div>
          </div>

          {/* Quick Score Badge & AI trigger */}
          <div className="flex items-center gap-2.5">
            <div className="bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/70 flex items-center gap-3 text-xs">
              <span className="text-slate-400 font-medium">当前岗位:</span>
              <span className="font-bold text-slate-800 truncate max-w-[140px] sm:max-w-none">
                {roleTitle}
              </span>
              <div className="h-4 w-px bg-stone-200" />
              <div className="flex items-center gap-1.5 font-mono">
                <span className="text-slate-400">综合匹配:</span>
                <span className={`font-black ${analysis.hybridScore >= 80 ? 'text-emerald-600' : analysis.hybridScore >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                  {analysis.hybridScore}%
                </span>
                <span className="text-slate-400 text-[10px]">({analysis.angleDegrees}°)</span>
              </div>
            </div>

            {/* AI Floating Chatbot Trigger Button (Module 7) */}
            <button
              onClick={onOpenAiDrawer}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-emerald-100" />
              <span>AI 随诊专家</span>
            </button>
          </div>
        </div>

        {/* 9 Tab Navigation Strip */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none text-xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id as ActiveTab)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
