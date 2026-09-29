/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ActiveTab, BenchmarkCase } from './types';
import { BENCHMARK_CASES } from './data/benchmarks';
import { calculateMatchAnalysis } from './utils/nlpEngine';
import { Header } from './components/Header';
import { AlgebraSpaceModule } from './components/AlgebraSpaceModule';
import { ThreeDVectorCanvas } from './components/ThreeDVectorCanvas';
import { DenseEmbeddingsView } from './components/DenseEmbeddingsView';
import { DualTextInspector } from './components/DualTextInspector';
import { BenchmarkCasesSelector } from './components/BenchmarkCasesSelector';
import { PythonCodeEngine } from './components/PythonCodeEngine';
import { PipelineWorkflow } from './components/PipelineWorkflow';
import { DataReportModule } from './components/DataReportModule';
import { NlpKnowledgeSlices } from './components/NlpKnowledgeSlices';
import { AiChatDrawer } from './components/AiChatDrawer';
import { Bot, Sparkles, HelpCircle, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('algebra');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case_llm_engineer');
  const [selectedTier, setSelectedTier] = useState<'high' | 'medium' | 'low'>('high');

  // Text inputs
  const initialCase = BENCHMARK_CASES[0];
  const [jdText, setJdText] = useState<string>(initialCase.jdText);
  const [resumeText, setResumeText] = useState<string>(initialCase.resumes.high.text);
  const [roleTitle, setRoleTitle] = useState<string>(initialCase.title);

  // AI Chat Drawer state
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);

  // Re-calculate analysis in real-time as text changes
  const analysis = useMemo(() => {
    return calculateMatchAnalysis(jdText, resumeText, true);
  }, [jdText, resumeText]);

  // Handle case & tier selection
  const handleSelectCase = (caseItem: BenchmarkCase, tier: 'high' | 'medium' | 'low') => {
    setSelectedCaseId(caseItem.id);
    setSelectedTier(tier);
    setRoleTitle(caseItem.title);
    setJdText(caseItem.jdText);
    setResumeText(caseItem.resumes[tier].text);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Sticky Top Header with Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        analysis={analysis}
        roleTitle={roleTitle}
        onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'algebra' && (
          <AlgebraSpaceModule analysis={analysis} roleTitle={roleTitle} />
        )}

        {activeTab === '3d_vector' && (
          <ThreeDVectorCanvas analysis={analysis} />
        )}

        {activeTab === 'embeddings' && (
          <DenseEmbeddingsView analysis={analysis} />
        )}

        {activeTab === 'dual_text' && (
          <DualTextInspector
            jdText={jdText}
            resumeText={resumeText}
            onJdChange={setJdText}
            onResumeChange={setResumeText}
            analysis={analysis}
            roleTitle={roleTitle}
          />
        )}

        {activeTab === 'cases' && (
          <BenchmarkCasesSelector
            selectedCaseId={selectedCaseId}
            selectedTier={selectedTier}
            onSelectCase={handleSelectCase}
          />
        )}

        {activeTab === 'code_engine' && (
          <PythonCodeEngine
            analysis={analysis}
            roleTitle={roleTitle}
            jdText={jdText}
            resumeText={resumeText}
          />
        )}

        {activeTab === 'pipeline' && (
          <PipelineWorkflow
            analysis={analysis}
            roleTitle={roleTitle}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'report' && (
          <DataReportModule
            analysis={analysis}
            roleTitle={roleTitle}
            jdText={jdText}
            resumeText={resumeText}
            onJdUpload={setJdText}
            onResumeUpload={setResumeText}
            onSelectCase={handleSelectCase}
          />
        )}

        {activeTab === 'knowledge' && (
          <NlpKnowledgeSlices />
        )}
      </main>

      {/* Floating AI Consultation Trigger (if drawer closed) */}
      {!isAiDrawerOpen && (
        <button
          onClick={() => setIsAiDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer group"
        >
          <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold block leading-none">AI 随诊专家</span>
            <span className="text-[10px] text-slate-400 font-mono">Gemini 3.8 Flash</span>
          </div>
        </button>
      )}

      {/* AI Chat & Diagnosis Drawer (Module 7) */}
      <AiChatDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        analysis={analysis}
        roleTitle={roleTitle}
        jdText={jdText}
        resumeText={resumeText}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white/70 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">
              简历与职位需求智能匹配实验室 (Resume Matcher Lab)
            </span>
            <span className="text-stone-300">|</span>
            <span>代数建模 · TF-IDF 3D · 稠密语义 · 大模型诊断</span>
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            © 2026 Resume Matcher Lab · All algorithms aligned with Scikit-learn VSM
          </div>
        </div>
      </footer>
    </div>
  );
}
