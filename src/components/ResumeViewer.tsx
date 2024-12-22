'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

interface ResumeViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeViewer({ isOpen, onClose }: ResumeViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
      setPageNumber(1);
    }
  }, [isOpen]);

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
  };

  const handleLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setIsLoading(false);
    setError('Failed to load PDF. Please try again later.');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'mandip_adhikari_resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div 
            className="relative w-full h-[95vh] flex items-center justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
          >
            {/* Central PDF Container */}
            <div className="w-full max-w-4xl bg-neutral-900/80 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-neutral-900/80 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-light text-white/90">Resume</h2>
                  <div className="h-6 w-px bg-white/10" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sky-500/50 animate-pulse" />
                    <span className="text-white/50 text-sm">PDF</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <motion.button
                    onClick={handleDownload}
                    className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors duration-300
                      px-4 py-2 rounded-lg border border-white/10 hover:border-sky-500/30 hover:bg-sky-500/10"
                    whileHover={{ y: -2 }}
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </motion.button>
                  <motion.button
                    onClick={onClose}
                    className="text-white/70 hover:text-white transition-colors duration-300
                      w-10 h-10 rounded-lg border border-white/10 hover:border-sky-500/30 hover:bg-sky-500/10
                      flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* PDF Viewer */}
              <div className="relative h-[calc(95vh-5rem)] bg-neutral-950/50 overflow-auto flex flex-col items-center py-8 px-4">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(56,189,248,0.05),transparent)]" />

                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                    <motion.div
                      className="flex flex-col items-center gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="relative"
                      >
                        <div className="w-12 h-12 rounded-full border-2 border-sky-500/20" />
                        <div className="absolute inset-0 rounded-full border-t-2 border-sky-500" />
                      </motion.div>
                      <p className="text-white/50 text-sm">Loading PDF...</p>
                    </motion.div>
                  </div>
                )}

                {error ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                        <X className="w-8 h-8 text-red-500/80" />
                      </div>
                      <p className="text-red-500/90 text-lg">{error}</p>
                      <motion.button
                        onClick={() => {
                          setIsLoading(true);
                          setError(null);
                          setPageNumber(pageNumber);
                        }}
                        className="text-white/70 hover:text-white transition-colors duration-300 
                          border border-white/10 hover:border-sky-500/30 hover:bg-sky-500/10
                          px-6 py-3 rounded-lg inline-flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowRight className="w-4 h-4" />
                        Try Again
                      </motion.button>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    <Document
                      file="/resume.pdf"
                      onLoadSuccess={handleLoadSuccess}
                      onLoadError={handleLoadError}
                      loading={null}
                      className="max-w-full"
                    >
                      <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        loading={null}
                        className="max-w-full shadow-2xl rounded-lg overflow-hidden
                          ring-1 ring-white/10 hover:ring-sky-500/30 transition-all duration-300"
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />
                    </Document>

                    {/* Page Indicator */}
                    {!isLoading && !error && numPages > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4"
                      >
                        {[...Array(numPages)].map((_, i) => (
                          <motion.button
                            key={i}
                            onClick={() => setPageNumber(i + 1)}
                            className={`w-1.5 h-8 rounded-full transition-all duration-300 ${
                              pageNumber === i + 1 
                                ? 'bg-sky-500 scale-y-100' 
                                : 'bg-white/20 scale-y-75 hover:scale-y-100'
                            }`}
                            whileHover={{ scale: 1.2 }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Navigation Controls */}
                {!isLoading && !error && numPages > 1 && (
                  <motion.div 
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-3 
                      bg-neutral-900/90 backdrop-blur-sm rounded-xl border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <motion.button
                      onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                      disabled={pageNumber === 1}
                      className="text-white/70 hover:text-white disabled:text-white/30 transition-colors duration-300
                        w-10 h-10 rounded-lg border border-white/10 hover:border-sky-500/30 hover:bg-sky-500/10
                        disabled:border-white/5 disabled:hover:bg-transparent
                        flex items-center justify-center"
                      whileHover={{ x: -2 }}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </motion.button>
                    <div className="flex items-center gap-3">
                      <span className="text-white/90 text-lg font-light">{pageNumber}</span>
                      <span className="text-white/30">/</span>
                      <span className="text-white/50 text-lg font-light">{numPages}</span>
                    </div>
                    <motion.button
                      onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                      disabled={pageNumber === numPages}
                      className="text-white/70 hover:text-white disabled:text-white/30 transition-colors duration-300
                        w-10 h-10 rounded-lg border border-white/10 hover:border-sky-500/30 hover:bg-sky-500/10
                        disabled:border-white/5 disabled:hover:bg-transparent
                        flex items-center justify-center"
                      whileHover={{ x: 2 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                )}

                {/* Zoom Controls */}
                {!isLoading && !error && (
                  <motion.div 
                    className="fixed right-8 bottom-8 flex flex-col gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <motion.button
                      onClick={() => setScale(s => Math.min(2, s + 0.1))}
                      className="w-10 h-10 flex items-center justify-center 
                        bg-neutral-900/90 backdrop-blur-sm rounded-lg border border-white/10 
                        text-white/70 hover:text-white hover:border-sky-500/30 hover:bg-sky-500/10
                        transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      +
                    </motion.button>
                    <motion.button
                      onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                      className="w-10 h-10 flex items-center justify-center 
                        bg-neutral-900/90 backdrop-blur-sm rounded-lg border border-white/10 
                        text-white/70 hover:text-white hover:border-sky-500/30 hover:bg-sky-500/10
                        transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      -
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 