import React, { useState } from 'react';
import { Youtube, FileText, Upload, Link as LinkIcon, CheckCircle } from 'lucide-react';
import { AnalyzeButton } from './AnalyzeButton';
import { motion } from 'framer-motion';

interface InputSectionProps {
  onAnalyze: (type: 'youtube' | 'pdf', content: string | File) => void;
  isAnalyzing: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [activeTab, setActiveTab] = useState<'youtube' | 'pdf'>('youtube');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleAnalyze = () => {
    if (activeTab === 'youtube' && url) {
      onAnalyze('youtube', url);
    } else if (activeTab === 'pdf' && file) {
      onAnalyze('pdf', file);
    }
  };

  const getYoutubeId = (url: string) => {
    try {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('v');
    } catch {
        return null;
    }
  }

  const videoId = getYoutubeId(url);

  return (
    <div className="bg-surface/30 rounded-2xl border border-white/10 p-6 flex flex-col gap-6 h-full backdrop-blur-sm">
      <div className="flex flex-col gap-2">
         <h2 className="text-xl font-bold text-white">Input Source</h2>
         <p className="text-slate-400 text-sm">Provide content for the AI to analyze and tutor you on.</p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-900/50 rounded-xl border border-white/5">
        <button
            onClick={() => setActiveTab('youtube')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'youtube' ? 'bg-surface shadow-lg text-white' : 'text-slate-400 hover:text-white'}`}
        >
            <Youtube size={18} />
            <span>YouTube Video</span>
        </button>
        <button
            onClick={() => setActiveTab('pdf')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'pdf' ? 'bg-surface shadow-lg text-white' : 'text-slate-400 hover:text-white'}`}
        >
            <FileText size={18} />
            <span>PDF Document</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'youtube' ? (
             <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-4"
             >
                <label className="text-sm font-medium text-slate-300">Video URL</label>
                <div className="relative group">
                     <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18}/>
                     <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full bg-slate-900 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                     />
                </div>
                {videoId && (
                    <div className="relative aspect-video rounded-xl bg-black/50 border border-white/5 flex items-center justify-center overflow-hidden">
                        <img 
                          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                          alt="Video Thumbnail"
                          className="w-full h-full object-cover opacity-60"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer bg-black/20 hover:bg-black/10">
                            <Youtube size={48} />
                        </div>
                    </div>
                )}
             </motion.div>
        ) : (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-4"
            >
                 <label className="text-sm font-medium text-slate-300">Upload Document</label>
                 <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-slate-900/50 transition-all cursor-pointer relative h-64">
                    <input 
                        type="file" 
                        accept=".pdf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {file ? (
                        <>
                            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                                <CheckCircle size={32} />
                            </div>
                            <div className="text-center">
                                <p className="text-white font-medium break-all max-w-[200px] truncate">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <p className="text-xs text-primary mt-2">Click to change</p>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 rounded-full bg-surface text-slate-400 flex items-center justify-center">
                                <Upload size={32} />
                            </div>
                            <div className="text-center">
                                <p className="text-slate-300 font-medium">Click to upload PDF</p>
                                <p className="text-xs text-slate-500">or drag and drop</p>
                            </div>
                        </>
                    )}
                 </div>
            </motion.div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-white/5">
        <AnalyzeButton 
            onClick={handleAnalyze} 
            isLoading={isAnalyzing} 
            disabled={activeTab === 'youtube' ? !url : !file}
        />
      </div>
    </div>
  );
};
