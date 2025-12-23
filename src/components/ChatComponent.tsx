import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Send, Bot, User, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatComponentProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string, file: File | null) => void;
}

export const ChatComponent: React.FC<ChatComponentProps> = ({ messages, isLoading, onSend }) => {
  const [input, setInput] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !file) || isLoading) return;
    onSend(input, file);
    setInput('');
    setFile(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const pastedFile = items[i].getAsFile();
        if (pastedFile) {
           setFile(pastedFile);
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface/50 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm relative">
        {/* Messages */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6 scroll-smooth">
            <AnimatePresence initial={false}>
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-50">
                    <Bot size={48} />
                    <p>Ask anything about the math content!</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg
                      ${msg.role === 'assistant' 
                        ? 'bg-gradient-to-br from-primary to-blue-600 text-white' 
                        : 'bg-gradient-to-br from-secondary to-purple-600 text-white'}
                    `}>
                        {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                    </div>
                    <div className={`
                        max-w-[85%] rounded-2xl px-5 py-3 shadow-md
                        ${msg.role === 'user'
                          ? 'bg-primary text-white rounded-tr-sm'
                          : 'bg-surface/90 text-slate-100 rounded-tl-sm border border-white/10'
                        }
                    `}>
                        <div className="markdown-content text-sm md:text-base leading-relaxed">
                            <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                  p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                                  h1: ({children}) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                                  h2: ({children}) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                                  ul: ({children}) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                                  ol: ({children}) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                                  li: ({children}) => <li className="mb-1">{children}</li>,
                                  code: ({children}) => <code className="bg-black/30 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                                }}
                            >
                                {msg.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </motion.div>
              ))}
              {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4"
                  >
                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Bot size={18} />
                       </div>
                       <div className="bg-surface/90 rounded-2xl rounded-tl-sm px-5 py-4 border border-white/10 flex items-center gap-1.5 shadow-md">
                          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
                       </div>
                  </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-surface/30 backdrop-blur-md border-t border-white/5 space-y-2">
            {/* File Preview */}
            <AnimatePresence>
              {file && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg w-fit border border-white/10"
                >
                  <div className="w-10 h-10 rounded bg-slate-700 overflow-hidden flex items-center justify-center">
                    {file.type.startsWith('image/') ? (
                      <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={20} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-200 truncate max-w-[150px]">{file.name}</span>
                    <span className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <button 
                    onClick={() => setFile(null)}
                    type="button"
                    className="p-1 hover:bg-slate-700 rounded-full transition-colors ml-2"
                  >
                    <X size={14} className="text-slate-400 hover:text-white" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="relative group flex gap-2">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden" 
                  accept="image/*"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative p-4 bg-slate-900/80 text-slate-400 border border-white/10 rounded-xl hover:text-white hover:border-primary/50 transition-all focus:outline-none focus:ring-1 focus:ring-primary/50"
                  title="Upload image"
                >
                  <ImageIcon size={20} />
                </button>

                <div className="relative flex-1">
                  <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onPaste={handlePaste}
                      placeholder="Ask a doubt..."
                      className="w-full bg-slate-900/80 text-white placeholder-slate-400 rounded-xl pl-5 pr-14 py-4 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 focus:outline-none transition-all shadow-inner"
                  />
                  <button
                      type="submit"
                      disabled={(!input.trim() && !file) || isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                  >
                      <Send size={18} />
                  </button>
                </div>
            </form>
            <div className="mt-1 text-center">
                <span className="text-xs text-slate-500">
                    MathsCare AI can make mistakes. Verify important information.
                </span>
            </div>
        </div>
    </div>
  );
};
