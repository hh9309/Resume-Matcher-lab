import React, { useState, useRef, useEffect } from 'react';
import { MatchAnalysisResult, ChatMessage } from '../types';
import {
  loadModelConfig,
  saveModelConfig,
  callAiModel,
  ModelConfig,
  SupportedModel,
} from '../utils/aiClient';
import {
  Bot,
  Send,
  Sparkles,
  X,
  Minimize2,
  Maximize2,
  RefreshCw,
  Settings,
  Key,
  Cpu,
  Check,
  AlertCircle,
  ShieldCheck,
  Lock,
  ExternalLink,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  analysis: MatchAnalysisResult;
  roleTitle: string;
  jdText: string;
  resumeText: string;
}

export const AiChatDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  analysis,
  roleTitle,
  jdText,
  resumeText,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Model Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [modelConfig, setModelConfig] = useState<ModelConfig>(() => loadModelConfig());
  const [inputApiKey, setInputApiKey] = useState(modelConfig.apiKey);
  const [selectedModel, setSelectedModel] = useState<SupportedModel>(modelConfig.selectedModel);
  const [saveToast, setSaveToast] = useState(false);

  // Initialize messages lazily
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const isConfigured = modelConfig.isConfigured;
    return [
      {
        id: 'welcome_1',
        sender: 'assistant',
        content: isConfigured
          ? `👋 你好！我是 **Resume Matcher 智能随诊专家**。\n\n当前已就绪【**${modelConfig.selectedModel}**】大模型。\n针对【**${roleTitle}**】的职位需求与简历，综合匹配度为 **${analysis.hybridScore}%**（空间夹角 **${analysis.angleDegrees}°**）。\n\n你可以点击下方快捷诊断，或直接向我提问如何针对性修改简历与应对技术面试。`
          : `👋 你好！我是 **Resume Matcher 智能随诊专家**。\n\n⚠️ **提示**：为支持直接部署到 GitHub 及纯浏览器安全调用，所有大模型调用**必须输入 API-Key 后才能调用**。\n\n请点击右上角【⚙️ 设置】图标，手工输入您的 **Gemini** 或 **DeepSeek** API-Key，确认选择后即可开始高保真诊断！`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: isConfigured
          ? [
              '🚀 生成全维度深度诊断报告',
              '📝 用STAR法则润色核心项目经历',
              '🎯 预测面试官可能追问的2道短板问题',
              '⚠️ 检查简历是否有关键词堆砌惩罚风险',
            ]
          : ['⚙️ 打开大模型设置窗口输入 Key'],
      },
    ];
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isSettingsOpen]);

  // Save Model Settings
  const handleSaveSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputApiKey.trim()) {
      alert('请输入有效的 API-Key 后再进行确认保存！');
      return;
    }

    const newCfg: ModelConfig = {
      apiKey: inputApiKey.trim(),
      selectedModel: selectedModel,
      isConfigured: true,
      deepseekBaseUrl: 'https://api.deepseek.com/v1',
    };

    saveModelConfig(newCfg);
    setModelConfig(newCfg);
    setSaveToast(true);

    setTimeout(() => {
      setSaveToast(false);
      setIsSettingsOpen(false);
    }, 1200);

    // Append confirmation notice in chat
    const confirmMsg: ChatMessage = {
      id: `sys_${Date.now()}`,
      sender: 'assistant',
      content: `✅ 大模型配置已更新成功！\n- **当前选用大模型**: \`${selectedModel}\`\n- **API-Key 状态**: 已保存于本地浏览器安全隔离存储 (Local Storage)\n- **运行模式**: 浏览器直连调用（支持 GitHub Pages / 任何静态服务部署）\n\n现在您可以随时向我发起匹配诊断与简历润色提问。`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        '🚀 生成全维度深度诊断报告',
        '📝 用STAR法则润色核心项目经历',
        '🎯 预测面试官可能追问的2道短板问题',
      ],
    };
    setMessages((prev) => [...prev, confirmMsg]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query || isLoading) return;

    if (query === '⚙️ 打开大模型设置窗口输入 Key') {
      setIsSettingsOpen(true);
      return;
    }

    // Strict Enforcement: API Key is required
    if (!modelConfig.apiKey || !modelConfig.apiKey.trim()) {
      setIsSettingsOpen(true);
      const reminderMsg: ChatMessage = {
        id: `remind_${Date.now()}`,
        sender: 'assistant',
        content: `🔒 **请先配置 API-Key**\n\n项目专为 GitHub 独立部署设计，浏览器调用大模型前必须先手工输入对应大模型的 API-Key。\n已自动为您打开上方设置面板，输入 Key 并点击【确认大模型】即可继续。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, reminderMsg]);
      return;
    }

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    const systemInstruction = `你是资深技术HR总监与自然语言处理算法专家。请根据目标职位、综合匹配分与已命中/缺失技能，给出条理清晰、有深度且可落地的解答。多用切片化小标题，包含具体STAR法则修改建议或面试应对策略。`;

    const prompt = query.startsWith('🚀 生成全维度深度诊断报告')
      ? `请对当前候选人的简历与职位需求进行全维度深度诊断与简历润色建议。
【目标职位】: ${roleTitle || '技术岗位'}
【综合匹配度】: ${analysis.hybridScore}% (空间夹角: ${analysis.angleDegrees}°)
【已命中技术栈】: ${analysis.matchedKeywords.slice(0, 15).join(', ')}
【缺失核心技能】: ${analysis.missingKeywords.slice(0, 15).join(', ')}
【职位JD摘要】:
${jdText.slice(0, 1200)}
【简历文本摘要】:
${resumeText.slice(0, 1200)}

请输出一份切片式深度诊断报告，格式包含以下结构：
### 1. 匹配度瓶颈与核心断层 (Skill Gap Analysis)
### 2. 简历针对性润色方案 (Actionable Resume Polishing)
### 3. 面试针对性考察预测 (Predictive Technical Questions)
### 4. 算法防踩坑提醒 (NLP Screening Advisory)`
      : `【目标职位】: ${roleTitle}
【综合匹配度】: ${analysis.hybridScore}%
【已命中技术栈】: ${analysis.matchedKeywords.slice(0, 15).join(', ')}
【缺失核心技能】: ${analysis.missingKeywords.slice(0, 15).join(', ')}
【职位JD】:
${jdText.slice(0, 1000)}
【简历摘要】:
${resumeText.slice(0, 1000)}

【用户提问】:
${query}`;

    try {
      // Direct client-side browser call with user's configured API-Key
      const res = await callAiModel(modelConfig, prompt, systemInstruction);

      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        content: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: `${res.modelName} (Browser Live Call)`,
        suggestions: [
          '🎯 预测面试官技术深挖问题',
          '✨ 给出更具体的技术选型量化表述',
          '📊 了解稠密向量对这段经历的评分预估',
        ],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Model execution error:', err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'assistant',
        content: `❌ **调用失败**: ${err.message || '网络异常或 API-Key 无效'}\n\n请点击右上角小齿轮 ⚙️ 检查您的 API-Key 是否正确无误，或切换另一款模型重试。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isMinimized ? 'w-80 h-14' : 'w-96 md:w-[500px] h-[660px] max-h-[88vh]'
      } bg-white rounded-2xl shadow-2xl border border-stone-200/90 flex flex-col overflow-hidden backdrop-blur-md`}
    >
      {/* Drawer Header with Settings Gear Icon */}
      <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold">AI 随诊专家 & 简历润色</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-mono">
                {modelConfig.selectedModel}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[210px]">
              对标：{roleTitle} (当前匹配 {analysis.hybridScore}%)
            </p>
          </div>
        </div>

        {/* Action icons on right: Settings Gear, Minimize, Close */}
        <div className="flex items-center gap-1">
          {/* Settings Gear Icon (小齿轮设置大模型图标) */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isSettingsOpen || !modelConfig.isConfigured
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="设置大模型与 API-Key"
          >
            <Settings className={`w-4 h-4 ${!modelConfig.isConfigured ? 'animate-spin-slow' : ''}`} />
          </button>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            title={isMinimized ? '展开' : '折叠'}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            title="关闭窗口"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Drawer Body (when expanded) */}
      {!isMinimized && (
        <>
          {/* Settings Modal Drawer Panel (When Gear Icon Clicked) */}
          {isSettingsOpen && (
            <div className="p-4 bg-slate-900 border-b border-slate-800 text-white animate-fade-in shadow-inner">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold">大模型配置与 API-Key 授权</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  GitHub 纯前端安全运行模式
                </span>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-3.5">
                {/* 1. Model Selector (Two Models Required: gemini 3 flash & deepseek-v4-pro) */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    <span>选择大模型 (Select Model):</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedModel('gemini-3-flash')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        selectedModel === 'gemini-3-flash'
                          ? 'bg-indigo-950/80 border-indigo-500 text-white ring-1 ring-indigo-400 shadow-xs'
                          : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-indigo-300 font-mono text-[11px]">
                          gemini 3 flash
                        </span>
                        {selectedModel === 'gemini-3-flash' && (
                          <Check className="w-3 h-3 text-indigo-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block">Google GenAI 旗舰推理</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedModel('deepseek-v4-pro')}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        selectedModel === 'deepseek-v4-pro'
                          ? 'bg-emerald-950/80 border-emerald-500 text-white ring-1 ring-emerald-400 shadow-xs'
                          : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-emerald-300 font-mono text-[11px]">
                          deepseek-v4-pro
                        </span>
                        {selectedModel === 'deepseek-v4-pro' && (
                          <Check className="w-3 h-3 text-emerald-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block">DeepSeek 深度代码与诊断</span>
                    </button>
                  </div>
                </div>

                {/* 2. Manual API Key Input (手工输入 API-Key) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-amber-400" />
                      <span>手工输入 API-Key:</span>
                    </label>
                    <span className="text-[10px] text-amber-400/90 font-mono">
                      * 必填后方可调用
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      type="password"
                      value={inputApiKey}
                      onChange={(e) => setInputApiKey(e.target.value)}
                      placeholder={
                        selectedModel === 'gemini-3-flash'
                          ? '输入 Google AI Studio API-Key (如 AIzaSy...)'
                          : '输入 DeepSeek API-Key (如 sk-...)'
                      }
                      className="w-full text-xs font-mono px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-slate-100 placeholder:text-slate-600"
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Key 仅保存在您本地浏览器 LocalStorage，纯前端调用不经过第三方中转。</span>
                  </p>
                </div>

                {/* 3. Confirm Model & Action Button (确认大模型) */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>确认大模型 (Confirm Model)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(false)}
                    className="px-3 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-medium cursor-pointer"
                  >
                    收起
                  </button>
                </div>

                {saveToast && (
                  <div className="p-2 bg-emerald-950/80 border border-emerald-800 rounded-lg text-emerald-300 text-[11px] flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>大模型配置已生效！可以发起对话。</span>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Key Missing Banner Prompt if not configured */}
          {!modelConfig.isConfigured && !isSettingsOpen && (
            <div className="p-2.5 bg-amber-500/10 border-b border-amber-500/20 text-amber-900 flex items-center justify-between text-xs px-4">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-[11px]">未配置大模型 API-Key，调用前请点击右侧齿轮配置</span>
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
              >
                立即设置
              </button>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-stone-200/80 rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                  {msg.mode && (
                    <div className="mt-2 pt-1 border-t border-stone-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>引擎: {msg.mode}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                  )}
                </div>

                {/* Quick suggestions chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(sug)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200 transition-all text-left shadow-2xs cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-stone-200 text-xs text-slate-500 w-fit">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span>
                  {modelConfig.selectedModel} 正在对标 JD 与简历向量断层并生成诊断...
                </span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-stone-200/80 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  modelConfig.isConfigured
                    ? `输入提问，由 ${modelConfig.selectedModel} 诊断...`
                    : '请先点击右上角 ⚙️ 输入 API-Key 激活模型...'
                }
                className="flex-1 text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-sans"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-40 transition-colors shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
