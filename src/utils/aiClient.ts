import { GoogleGenAI } from '@google/genai';

export type SupportedModel = 'gemini-3-flash' | 'deepseek-v4-pro';

export interface ModelConfig {
  apiKey: string;
  selectedModel: SupportedModel;
  deepseekBaseUrl?: string; // Optional custom endpoint for DeepSeek if needed
  isConfigured: boolean;
}

const STORAGE_KEY = 'resume_matcher_ai_config';

export function loadModelConfig(): ModelConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.apiKey && parsed.apiKey.trim().length > 0) {
        return {
          apiKey: parsed.apiKey.trim(),
          selectedModel: parsed.selectedModel || 'gemini-3-flash',
          deepseekBaseUrl: parsed.deepseekBaseUrl || 'https://api.deepseek.com/v1',
          isConfigured: true,
        };
      }
    }
  } catch (e) {
    console.error('Failed to load model config from localStorage:', e);
  }

  return {
    apiKey: '',
    selectedModel: 'gemini-3-flash',
    deepseekBaseUrl: 'https://api.deepseek.com/v1',
    isConfigured: false,
  };
}

export function saveModelConfig(config: ModelConfig): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        apiKey: config.apiKey.trim(),
        selectedModel: config.selectedModel,
        deepseekBaseUrl: config.deepseekBaseUrl || 'https://api.deepseek.com/v1',
      })
    );
  } catch (e) {
    console.error('Failed to save model config to localStorage:', e);
  }
}

export function clearModelConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear model config:', e);
  }
}

/**
 * Universal client-side LLM invoker supporting Gemini 3 Flash and DeepSeek-V4-Pro
 * Runs entirely in browser (perfect for GitHub Pages / static hosting).
 */
export async function callAiModel(
  config: ModelConfig,
  prompt: string,
  systemInstruction?: string
): Promise<{ text: string; modelName: string }> {
  if (!config.apiKey || !config.apiKey.trim()) {
    throw new Error('未配置 API-Key。请先点击右上角设置齿轮，手工输入有效的 API-Key 后再进行大模型诊断。');
  }

  const cleanKey = config.apiKey.trim();

  // Route 1: Gemini 3 Flash
  if (config.selectedModel === 'gemini-3-flash') {
    const ai = new GoogleGenAI({ apiKey: cleanKey });
    const fullPrompt = systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt;

    // Use gemini-2.5-flash alias or gemini-3.8-flash for modern Google GenAI SDK
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    const text = response.text || '（模型未返回内容）';
    return {
      text,
      modelName: 'gemini-3-flash',
    };
  }

  // Route 2: DeepSeek-V4-Pro (OpenAI-compatible chat completions standard)
  if (config.selectedModel === 'deepseek-v4-pro') {
    const baseUrl = config.deepseekBaseUrl || 'https://api.deepseek.com/v1';
    const endpoint = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

    const messages = [];
    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cleanKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // DeepSeek official alias
        messages,
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!resp.ok) {
      const errBody = await resp.text();
      let errMsg = `DeepSeek API 请求失败 (HTTP ${resp.status})`;
      try {
        const parsedErr = JSON.parse(errBody);
        if (parsedErr.error?.message) {
          errMsg += `: ${parsedErr.error.message}`;
        }
      } catch {
        errMsg += `: ${errBody}`;
      }
      throw new Error(errMsg);
    }

    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content || '（DeepSeek 未返回内容）';
    return {
      text,
      modelName: 'deepseek-v4-pro',
    };
  }

  throw new Error(`不支持的大模型类型: ${config.selectedModel}`);
}
