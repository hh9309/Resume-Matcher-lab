import React, { useMemo } from 'react';
import katex from 'katex';

interface InlineMathProps {
  math: string;
  className?: string;
}

export const InlineMath: React.FC<InlineMathProps> = ({ math, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: false,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
    } catch {
      return math;
    }
  }, [math]);

  return (
    <span
      className={`inline-block align-baseline mx-0.5 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface BlockMathProps {
  math: string;
  className?: string;
}

export const BlockMath: React.FC<BlockMathProps> = ({ math, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: true,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
    } catch {
      return math;
    }
  }, [math]);

  return (
    <div
      className={`my-2 overflow-x-auto text-center py-1 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface KatexTextProps {
  content: string;
  className?: string;
}

/**
 * Parses a string containing mixed text and math expressions:
 * - $$ ... $$ (display math)
 * - $ ... $ (inline math)
 * and renders KaTeX for mathematical segments while preserving text and line breaks.
 */
export const KatexText: React.FC<KatexTextProps> = ({ content, className = '' }) => {
  const parts = useMemo(() => {
    if (!content) return [];

    // Regex to capture $$...$$ or $...$
    // $$([^$]+)$$ or \$([^$\n]+)\$
    const tokens: React.ReactNode[] = [];
    const regex = /(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      const matchIndex = match.index;
      // Add text before match
      if (matchIndex > lastIndex) {
        tokens.push(content.substring(lastIndex, matchIndex));
      }

      const raw = match[0];
      if (raw.startsWith('$$') && raw.endsWith('$$')) {
        const math = raw.slice(2, -2).trim();
        tokens.push(
          <BlockMath key={`bm-${matchIndex}`} math={math} />
        );
      } else if (raw.startsWith('$') && raw.endsWith('$')) {
        const math = raw.slice(1, -1).trim();
        tokens.push(
          <InlineMath key={`im-${matchIndex}`} math={math} />
        );
      }

      lastIndex = matchIndex + raw.length;
    }

    if (lastIndex < content.length) {
      tokens.push(content.substring(lastIndex));
    }

    return tokens;
  }, [content]);

  return <span className={className}>{parts}</span>;
};
