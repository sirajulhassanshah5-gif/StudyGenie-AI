import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language = 'code', code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="my-3 rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950 shadow-lg text-slate-100 font-mono text-xs sm:text-sm leading-relaxed">
      {/* Code Block Header */}
      <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-slate-400 select-none">
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-purple-400" />
          <span className="text-[11px] font-medium tracking-wide uppercase text-purple-300">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-600/30 hover:text-purple-300 text-slate-300 text-xs font-sans transition-all border border-slate-700/50 active:scale-95"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 overflow-x-auto bg-slate-950/80">
        <pre className="m-0 font-mono text-slate-200 selection:bg-purple-500/30">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
