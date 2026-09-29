export interface TermWeight {
  term: string;
  category?: 'ai' | 'backend' | 'data' | 'quant' | 'general' | 'tool';
  jdTf: number;
  jdIdf: number;
  jdWeight: number;
  resumeTf: number;
  resumeIdf: number;
  resumeWeight: number;
  dotProduct: number;
  status: 'matched' | 'missing' | 'surplus';
  importance: 'high' | 'medium' | 'low';
}

export interface Vector3DPoint {
  term: string;
  x: number; // JD weight
  y: number; // Resume weight
  z: number; // Global IDF / depth
  color: string;
  status: 'matched' | 'missing' | 'surplus';
  weight: number;
}

export interface SemanticPoint2D {
  id: string;
  term: string;
  category: string;
  cluster: string;
  x: number;
  y: number;
  inJd: boolean;
  inResume: boolean;
  similarityToCenter: number;
}

export interface BenchmarkCase {
  id: string;
  title: string;
  industry: string;
  level: string;
  icon: string;
  description: string;
  jdText: string;
  resumes: {
    high: {
      name: string;
      expectedScore: number;
      text: string;
      highlights: string[];
    };
    medium: {
      name: string;
      expectedScore: number;
      text: string;
      highlights: string[];
    };
    low: {
      name: string;
      expectedScore: number;
      text: string;
      highlights: string[];
    };
  };
}

export interface MatchAnalysisResult {
  sparseCosineScore: number; // 0 - 100
  denseEmbeddingScore: number; // 0 - 100
  hybridScore: number; // 0 - 100
  angleRadians: number;
  angleDegrees: number;
  matchedCount: number;
  missingCount: number;
  surplusCount: number;
  totalTermsInVocab: number;
  jdNorm: number;
  resumeNorm: number;
  dotProductSum: number;
  termWeights: TermWeight[];
  matchedKeywords: string[];
  missingKeywords: string[];
  surplusKeywords: string[];
  topContributors: TermWeight[];
  hardSkillScore: number;
  experienceScore: number;
  atsPassRate: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode?: string;
  suggestions?: string[];
}

export type ActiveTab =
  | 'algebra'
  | '3d_vector'
  | 'embeddings'
  | 'dual_text'
  | 'cases'
  | 'code_engine'
  | 'pipeline'
  | 'report'
  | 'knowledge';
