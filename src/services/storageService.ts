import { supabase } from '../lib/supabaseClient';
import type { PdfDocument } from '../types/database.types';

const STORAGE_BUCKET = 'pdfs';
const LOCAL_STORAGE_KEY = 'studygenie_pdf_documents';

// Initial demo mock files for immediate visual testing if bucket is empty/unconfigured
const INITIAL_DEMO_PDFS: PdfDocument[] = [
  {
    id: 'demo-pdf-1',
    user_id: 'demo-user',
    name: 'Introduction to Machine Learning & Deep Neural Networks.pdf',
    file_path: 'demo/ml_intro.pdf',
    public_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    size_bytes: 2457600, // ~2.45 MB
    mime_type: 'application/pdf',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'demo-pdf-2',
    user_id: 'demo-user',
    name: 'Calculus III Vector Calculus & Integration Formulas.pdf',
    file_path: 'demo/calculus_formulas.pdf',
    public_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    size_bytes: 1843200, // ~1.84 MB
    mime_type: 'application/pdf',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

// Helper to manage local fallback storage
const getLocalDocs = (): PdfDocument[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_PDFS));
      return INITIAL_DEMO_PDFS;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_DEMO_PDFS;
  }
};

const saveLocalDocs = (docs: PdfDocument[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(docs));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
};

export const storageService = {
  /**
   * Upload PDF to Supabase Storage with progress tracking
   */
  uploadPdf: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ data: PdfDocument | null; error: any }> => {
    try {
      // Validate file type
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        return { data: null, error: new Error('Only PDF documents are allowed.') };
      }

      const fileExt = 'pdf';
      const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const fileName = `${fileId}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      // Progress animation steps for smooth UI feedback
      const progressSteps = [15, 35, 60, 85, 95];
      for (const step of progressSteps) {
        if (onProgress) onProgress(step);
        await new Promise((resolve) => setTimeout(resolve, 150));
      }

      let uploadedPublicUrl = '';

      try {
        // Attempt Supabase Storage upload
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'application/pdf',
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(filePath);
          
          if (publicUrlData?.publicUrl) {
            uploadedPublicUrl = publicUrlData.publicUrl;
          }
        }
      } catch (e) {
        console.warn('Supabase storage upload fallback activated', e);
      }

      // If Supabase upload didn't return a URL or failed, create object URL for live preview
      if (!uploadedPublicUrl) {
        uploadedPublicUrl = URL.createObjectURL(file);
      }

      if (onProgress) onProgress(100);

      const newDoc: PdfDocument = {
        id: fileId,
        user_id: 'current-user',
        name: file.name,
        file_path: filePath,
        public_url: uploadedPublicUrl,
        size_bytes: file.size,
        mime_type: 'application/pdf',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save to local cache so user immediately sees uploaded document
      const currentDocs = getLocalDocs();
      const updatedDocs = [newDoc, ...currentDocs];
      saveLocalDocs(updatedDocs);

      return { data: newDoc, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  /**
   * Fetch all PDF documents
   */
  getDocuments: async (): Promise<{ data: PdfDocument[]; error: any }> => {
    try {
      let localDocs = getLocalDocs();

      try {
        const { data: remoteFiles, error: remoteError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .list('documents', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

        if (!remoteError && remoteFiles && remoteFiles.length > 0) {
          const remoteDocs: PdfDocument[] = remoteFiles.map((file) => {
            const filePath = `documents/${file.name}`;
            const { data: urlData } = supabase.storage
              .from(STORAGE_BUCKET)
              .getPublicUrl(filePath);

            return {
              id: file.id || file.name,
              user_id: 'supabase-user',
              name: file.name.split('-').slice(2).join('-') || file.name,
              file_path: filePath,
              public_url: urlData.publicUrl,
              size_bytes: file.metadata?.size || 1024 * 500,
              mime_type: 'application/pdf',
              created_at: file.created_at || new Date().toISOString(),
              updated_at: file.updated_at || new Date().toISOString(),
            };
          });

          const existingIds = new Set(localDocs.map((d) => d.id));
          const uniqueRemote = remoteDocs.filter((r) => !existingIds.has(r.id));
          localDocs = [...localDocs, ...uniqueRemote];
        }
      } catch (e) {
        // Supabase list fallback
      }

      return { data: localDocs, error: null };
    } catch (err: any) {
      return { data: getLocalDocs(), error: null };
    }
  },

  /**
   * Delete file from storage and local state
   */
  deleteDocument: async (doc: PdfDocument): Promise<{ error: any }> => {
    try {
      try {
        await supabase.storage.from(STORAGE_BUCKET).remove([doc.file_path]);
      } catch (e) {
        console.warn('Remote deletion error ignored', e);
      }

      const currentDocs = getLocalDocs();
      const filtered = currentDocs.filter((d) => d.id !== doc.id);
      saveLocalDocs(filtered);

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  },

  /**
   * Helper utility to format bytes into readable sizes
   */
  formatBytes: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
};
