import React from 'react';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // Split content by code blocks (```lang ... ```)
  const codeBlockRegex = /```([a-zA-Z0-9_+-]*)\n([\s\S]*?)```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Process text before the code block
    if (match.index > lastIndex) {
      const textBefore = content.substring(lastIndex, match.index);
      parts.push(renderFormattedText(textBefore, `text_${lastIndex}`));
    }

    const language = match[1]?.trim() || 'code';
    const code = match[2]?.replace(/\n$/, '') || '';
    parts.push(<CodeBlock key={`code_${match.index}`} language={language} code={code} />);

    lastIndex = match.index + match[0].length;
  }

  // Process trailing text
  if (lastIndex < content.length) {
    const textAfter = content.substring(lastIndex);
    parts.push(renderFormattedText(textAfter, `text_${lastIndex}`));
  }

  return <div className="space-y-2 text-slate-800 dark:text-slate-200 font-sans leading-relaxed">{parts}</div>;
};

// Helper function to render formatted text with headers, lists, bold, italics, inline code
function renderFormattedText(text: string, keyPrefix: string): React.ReactNode {
  const lines = text.split('\n');
  const renderedElements: React.ReactNode[] = [];

  lines.forEach((line, idx) => {
    const lineKey = `${keyPrefix}_line_${idx}`;

    // Headings
    if (line.startsWith('### ')) {
      renderedElements.push(
        <h3 key={lineKey} className="text-base font-bold text-slate-900 dark:text-slate-100 mt-3 mb-1">
          {parseInlineFormatting(line.slice(4))}
        </h3>
      );
      return;
    }
    if (line.startsWith('## ')) {
      renderedElements.push(
        <h2 key={lineKey} className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-4 mb-1.5 border-b border-slate-200 dark:border-slate-700/60 pb-1">
          {parseInlineFormatting(line.slice(3))}
        </h2>
      );
      return;
    }
    if (line.startsWith('# ')) {
      renderedElements.push(
        <h1 key={lineKey} className="text-xl font-black text-slate-900 dark:text-slate-100 mt-4 mb-2">
          {parseInlineFormatting(line.slice(2))}
        </h1>
      );
      return;
    }

    // Bullet lists
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const listContent = line.trim().slice(2);
      renderedElements.push(
        <div key={lineKey} className="flex items-start space-x-2 my-0.5 pl-2">
          <span className="text-purple-500 font-bold text-sm select-none">•</span>
          <span>{parseInlineFormatting(listContent)}</span>
        </div>
      );
      return;
    }

    // Numbered lists (e.g. "1. ")
    const numListMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
    if (numListMatch) {
      renderedElements.push(
        <div key={lineKey} className="flex items-start space-x-2 my-0.5 pl-2">
          <span className="text-indigo-400 font-semibold text-xs select-none min-w-[1.25rem]">
            {numListMatch[1]}.
          </span>
          <span>{parseInlineFormatting(numListMatch[2])}</span>
        </div>
      );
      return;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      renderedElements.push(
        <blockquote key={lineKey} className="pl-3 border-l-4 border-purple-500 italic my-2 text-slate-600 dark:text-slate-300 bg-purple-500/5 py-1 rounded-r-lg">
          {parseInlineFormatting(line.slice(2))}
        </blockquote>
      );
      return;
    }

    // Empty line
    if (!line.trim()) {
      renderedElements.push(<div key={lineKey} className="h-2" />);
      return;
    }

    // Normal paragraph
    renderedElements.push(
      <p key={lineKey} className="my-0.5">
        {parseInlineFormatting(line)}
      </p>
    );
  });

  return <div key={keyPrefix}>{renderedElements}</div>;
}

// Parses **bold**, *italic*, `inline code`
function parseInlineFormatting(str: string): React.ReactNode[] {
  // Regex pattern matching **bold**, `inline code`, *italic*
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }

    const val = match[0];
    if (val.startsWith('**') && val.endsWith('**')) {
      parts.push(
        <strong key={`b_${match.index}`} className="font-bold text-slate-900 dark:text-slate-50">
          {val.slice(2, -2)}
        </strong>
      );
    } else if (val.startsWith('`') && val.endsWith('`')) {
      parts.push(
        <code
          key={`c_${match.index}`}
          className="px-1.5 py-0.5 rounded-md bg-purple-500/10 dark:bg-purple-400/15 text-purple-600 dark:text-purple-300 font-mono text-xs border border-purple-500/20"
        >
          {val.slice(1, -1)}
        </code>
      );
    } else if (val.startsWith('*') && val.endsWith('*')) {
      parts.push(
        <em key={`i_${match.index}`} className="italic">
          {val.slice(1, -1)}
        </em>
      );
    }

    lastIndex = match.index + val.length;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  return parts;
}
