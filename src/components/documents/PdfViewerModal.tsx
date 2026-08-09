import React from 'react';
import { X, Download, ExternalLink, FileText, Calendar, HardDrive } from 'lucide-react';
import { storageService } from '../../services/storageService';
import type { PdfDocument } from '../../types/database.types';

interface PdfViewerModalProps {
  document: PdfDocument | null;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ document, onClose }) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-red-500 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                {document.name}
              </h3>
              <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="flex items-center space-x-1">
                  <HardDrive className="w-3 h-3" />
                  <span>{storageService.formatBytes(document.size_bytes)}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(document.created_at).toLocaleDateString()}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={document.public_url}
              download={document.name}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / PDF Viewer Frame */}
        <div className="flex-1 bg-slate-950 p-2 sm:p-4 overflow-hidden relative flex flex-col items-center justify-center min-h-[450px]">
          {document.public_url ? (
            <iframe
              src={`${document.public_url}#toolbar=0`}
              title={document.name}
              className="w-full h-full rounded-2xl border border-slate-800 min-h-[450px]"
            />
          ) : (
            <div className="text-center space-y-3 p-8">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">PDF Preview unavailable directly in modal.</p>
              <a
                href={document.public_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                <span>Open PDF in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
