import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { storageService } from '../../services/storageService';
import type { PdfDocument } from '../../types/database.types';

interface PdfUploaderProps {
  onUploadSuccess: (newDoc: PdfDocument) => void;
  className?: string;
}

export const PdfUploader: React.FC<PdfUploaderProps> = ({ onUploadSuccess, className = '' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    // PDF validation
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Invalid file format. Please select a valid PDF file (.pdf).');
      return;
    }

    // 25MB max size validation
    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('File size exceeds maximum limit of 25 MB.');
      return;
    }

    setCurrentFile(file);
    setUploading(true);
    setProgress(5);

    const { data, error } = await storageService.uploadPdf(file, (pct) => {
      setProgress(pct);
    });

    setUploading(false);

    if (error || !data) {
      setErrorMsg(error?.message || 'Failed to upload PDF. Please try again.');
      setCurrentFile(null);
    } else {
      setSuccessMsg(`"${file.name}" uploaded successfully!`);
      onUploadSuccess(data);
      setTimeout(() => {
        setSuccessMsg(null);
        setCurrentFile(null);
        setProgress(0);
      }, 3500);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {/* Dropzone Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 backdrop-blur-xl flex flex-col items-center justify-center space-y-3 group
          ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700/80 bg-white/60 dark:bg-slate-900/60 hover:border-indigo-500/60 hover:bg-slate-50 dark:hover:bg-slate-800/40'
          }
          ${uploading ? 'pointer-events-none opacity-90' : ''}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          accept="application/pdf,.pdf"
          className="hidden"
        />

        {/* Dynamic Upload Icon / Status Graphic */}
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
          {uploading ? (
            <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
          ) : (
            <UploadCloud className="w-7 h-7" />
          )}
        </div>

        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {uploading
              ? `Uploading ${currentFile?.name}...`
              : 'Click to upload or drag & drop PDF'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supports PDF files up to 25 MB
          </p>
        </div>

        {/* Upload Progress Bar */}
        {uploading && (
          <div className="w-full max-w-xs space-y-1.5 pt-2">
            <div className="flex justify-between items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Storing in Supabase</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-indigo-500/20">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Feedback Message */}
      {errorMsg && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs animate-fadeIn">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="p-1 hover:opacity-80">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Success Feedback Message */}
      {successMsg && (
        <div className="flex items-center space-x-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
};
