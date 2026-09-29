import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get Gemini client if key is configured
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// AI Diagnostic & Consultation Endpoint
app.post('/api/ai-diagnose', async (req, res) => {
  const { jdText, resumeText, roleTitle, matchScore, missingKeywords, matchedKeywords, userQuestion } = req.body;

  const ai = getGeminiClient();

  // If no Gemini API key configured, use high-fidelity analytical fallback
  if (!ai) {
    const fallbackResponse = generateLocalAnalysis(roleTitle, matchScore, missingKeywords, matchedKeywords, userQuestion);
    return res.json({
      success: true,
      mode: 'heuristic_nlp_engine',
      response: fallbackResponse,
    });
  }

  try {
    const prompt = userQuestion
      ? `你是资深技术HR总监与自然语言处理算法专家。用户就以下职位需求(JD)与简历(Resume)向你提问。
【目标职位】: ${roleTitle || '技术岗位'}
【综合匹配度】: ${matchScore || 0}%
【已命中技术栈】: ${(matchedKeywords || []).slice(0, 15).join(', ')}
【缺失核心技能】: ${(missingKeywords || []).slice(0, 15).join(', ')}
【职位JD摘要】:
${(jdText || '').slice(0, 1000)}
【简历文本摘要】:
${(resumeText || '').slice(0, 1000)}

【用户提问】:
${userQuestion}

请以专业、客观、富有建设性的语气，结合自然语言处理匹配机制（TF-IDF、语义相关性、关键词权重）与实际招聘考量，给出条理清晰、深度深刻的解答。多用切片化小标题，包含具体可落地的简历修改建议或面试应对策略。`
      : `你是资深技术HR总监与自然语言处理算法专家。请对当前候选人的简历与职位需求进行全维度深度诊断与简历润色建议。
【目标职位】: ${roleTitle || '技术岗位'}
【当前综合匹配度】: ${matchScore || 0}%
【已命中技术栈】: ${(matchedKeywords || []).slice(0, 15).join(', ')}
【缺失核心技能】: ${(missingKeywords || []).slice(0, 15).join(', ')}
【职位JD摘要】:
${(jdText || '').slice(0, 1200)}
【简历文本摘要】:
${(resumeText || '').slice(0, 1200)}

请输出一份切片式深度诊断报告，格式包含以下结构：
### 1. 匹配度瓶颈与核心断层 (Skill Gap Analysis)
分析为何未能达到更高匹配分，哪些核心硬技能缺失对得分产生了重大负向权重。
### 2. 简历针对性润色方案 (Actionable Resume Polishing)
给出2~3处具体的项目或技能经历重构示范（STAR法则示例），教候选人如何合规且有深度地融入未命中但实际掌握的技能。
### 3. 面试针对性考察预测 (Predictive Technical Questions)
基于缺失技术栈，预测面试官最可能追问的2个硬核问题及高分应答思路。
### 4. 算法防踩坑提醒 (NLP Screening Advisory)
提醒候选人如何避免关键词堆砌被反作弊规则惩罚，并确保简历解析器(ATS)能准确识别。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({
      success: true,
      mode: 'gemini_flash_live',
      response: response.text || '诊断完成。',
    });
  } catch (error: any) {
    console.error('Gemini API execution error:', error);
    const fallbackResponse = generateLocalAnalysis(roleTitle, matchScore, missingKeywords, matchedKeywords, userQuestion);
    return res.json({
      success: true,
      mode: 'heuristic_nlp_fallback',
      response: fallbackResponse,
    });
  }
});

function generateLocalAnalysis(roleTitle?: string, score?: number, missing?: string[], matched?: string[], query?: string) {
  const missingList = (missing && missing.length > 0) ? missing.slice(0, 6).join('、') : '无明显硬性缺失';
  const matchedList = (matched && matched.length > 0) ? matched.slice(0, 6).join('、') : '基础能力';
  const sc = score || 65;

  if (query) {
    return `### 💡 针对提问「${query}」的专家解答

1. **核心定位分析**：
   在针对【${roleTitle || '当前职位'}】的匹配中，已成功命中 **${matchedList}** 等关键维度。但算法特征向量在 **${missingList}** 维度上权重大幅偏低，这也是导致余弦夹角变大的主要原因。

2. **实操改进落地**：
   - **量化成果**：在项目经验中采用 STAR 法则，避免泛泛而谈“熟悉/了解”，建议改为“主导/研发...，将吞吐/召回率提升 X%”。
   - **技术语义对齐**：补充相关生态技术栈的联动描述（例如在提到框架时补充底层调优或部署监控）。

3. **应对面试官提问**：
   如果面试官针对【${missingList.split('、')[0] || '核心技能'}】深入提问，可先坦承主导深度，重点阐述技术原理迁移理解与快速攻坚验证能力。`;
  }

  return `### 1. 匹配度瓶颈与核心断层 (Skill Gap)
当前综合匹配得分为 **${sc}%**。
- **高权重命中项**：已稳定对齐 **${matchedList}**，构成基础技术画像。
- **失分扣分核**：JD在 **${missingList}** 赋予了较高的 IDF 逆文档频率权重。由于简历中未检测到强相关词汇或对应工程沉淀，特征向量投影发生偏移。

### 2. 简历针对性润色方案 (STAR法则示例)
建议在【核心项目经历】中针对性补充 **${missingList.split('、')[0] || '缺失技能'}** 的应用场景：
- **修改前**：“参与系统后端开发与维护，配合团队完成日常迭代。”
- **修改后**：“主导基于 **${missingList.split('、')[0] || '核心技能'}** 的核心子模块重构，运用分布式缓存与异步队列降低接口响应耗时 38%，保障千万级流量稳定运行。”

### 3. 面试针对性考察预测 (Predictive Q&A)
- **预测追问 1**：“你在项目中如何权衡架构性能与技术选型，特别是在遇到 ${missingList.split('、')[0] || '并发瓶颈'} 时的排障链路？”
  - *高分思路*：从监控指标（APM、GC停顿、IO瓶颈）切入，阐明自顶向下的系统化排查路径。
- **预测追问 2**：“对于团队技术栈中涉及的 ${matchedList.split('、')[0] || '框架'}，底层通信或生命周期机制是如何实现的？”

### 4. 算法防踩坑提醒 (ATS Screening Advisory)
- **切忌机械堆词**：ATS 算法有近义密度惩罚机制，务必将技术词自然穿插在业务背景与产出成果中。
- **文本层可读性**：尽量采用标准技术命名（如 PyTorch 而非 pytorch/Pytorch 混写），保障分词器精准提取。`;
}

async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Resume Matcher Lab server running on http://0.0.0.0:${PORT}`);
  });
}

start();
