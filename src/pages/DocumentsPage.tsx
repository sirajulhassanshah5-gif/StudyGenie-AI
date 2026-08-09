import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Search, 
  Trash2, 
  Eye, 
  Download, 
  LayoutGrid, 
  List, 
  HardDrive, 
  Calendar,
  CloudUpload,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { PdfUploader } from '../components/documents/PdfUploader';
import { PdfViewerModal } from '../components/documents/PdfViewerModal';
import type { PdfDocument } from '../types/database.types';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<PdfDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modals state
  const [selectedDoc, setSelectedDoc] = useState<PdfDocument | null>(null);
  const [deletingDoc, setDeletingDoc] = useState<PdfDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDocs = async () => {
    setLoading(true);
    const { data } = await storageService.getDocuments();
    setDocuments(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUploadSuccess = (newDoc: PdfDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDoc) return;
    setIsDeleting(true);
    await storageService.deleteDocument(deletingDoc);
    setDocuments((prev) => prev.filter((d) => d.id !== deletingDoc.id));
    setIsDeleting(false);
    setDeletingDoc(null);
  };

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSize = documents.reduce((acc, d) => acc + d.size_bytes, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20 text-white">
              <FileText className="w-4 h-4" />
            </div>
            PDF Library & Supabase Storage
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload, store, view, and manage your PDF study resources in cloud storage.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center space-x-3 bg-white/70 dark:bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
          <div className="flex items-center space-x-2 text-xs">
            <HardDrive className="w-4 h-4 text-indigo-500" />
            <span className="text-slate-500 dark:text-slate-400">Total Storage:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {storageService.formatBytes(totalSize)}
            </span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {documents.length} File{documents.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* PDF Upload Zone */}
      <div className="bg-white/70 dark:bg-slate-900/80 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <CloudUpload className="w-4 h-4 text-indigo-500" />
            <span>Upload New PDF Document</span>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
            Supabase Storage Connected
          </span>
        </div>

        <PdfUploader onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Control Bar: Search & View Switcher */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/70 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search uploaded PDFs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div className="flex items-center space-x-1.5 self-end sm:self-center">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl text-xs transition-colors ${
              viewMode === 'grid'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl text-xs transition-colors ${
              viewMode === 'list'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Documents Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-xs text-slate-400">Loading documents from Supabase Storage...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <FileText className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {searchTerm ? 'No matching PDF files found.' : 'No PDF files uploaded yet.'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Upload your lecture slides, notes, or textbooks above to get started.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-3xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/10 dark:bg-red-500/20 text-red-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
                    {storageService.formatBytes(doc.size_bytes)}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-500 transition-colors">
                    {doc.name}
                  </h3>
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mt-2">
                    <Calendar className="w-3 h-3" />
                    <span>Uploaded {new Date(doc.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="p-2 rounded-xl text-slate-500 hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors flex items-center space-x-1 text-xs font-semibold"
                    title="Preview PDF"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>

                  <a
                    href={doc.public_url}
                    download={doc.name}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl text-slate-500 hover:text-purple-500 hover:bg-purple-500/10 transition-colors flex items-center space-x-1 text-xs font-semibold"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                </div>

                <button
                  onClick={() => setDeletingDoc(doc)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Delete file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white/70 dark:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-lg overflow-hidden divide-y divide-slate-200/60 dark:divide-slate-800">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 dark:bg-red-500/20 text-red-500 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {doc.name}
                  </p>
                  <div className="flex items-center space-x-3 text-[10px] text-slate-400 mt-0.5">
                    <span>{storageService.formatBytes(doc.size_bytes)}</span>
                    <span>•</span>
                    <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="p-2 rounded-xl text-slate-500 hover:text-indigo-500 hover:bg-indigo-500/10 text-xs font-medium flex items-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">View</span>
                </button>
                <a
                  href={doc.public_url}
                  download={doc.name}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl text-slate-500 hover:text-purple-500 hover:bg-purple-500/10 text-xs font-medium flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </a>
                <button
                  onClick={() => setDeletingDoc(doc)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF View Modal */}
      <PdfViewerModal document={selectedDoc} onClose={() => setSelectedDoc(null)} />

      {/* Delete Confirmation Dialog */}
      {deletingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-2xl max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Delete PDF Document?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-300">"{deletingDoc.name}"</span> from storage?
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setDeletingDoc(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center space-x-2"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Delete</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
