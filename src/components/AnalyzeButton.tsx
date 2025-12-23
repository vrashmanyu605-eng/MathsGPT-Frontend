import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AnalyzeButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({ onClick, isLoading, disabled }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative overflow-hidden group w-full py-4 rounded-xl font-bold text-lg
        flex items-center justify-center gap-2 transition-all duration-300
        ${disabled
          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          : 'bg-gradient-to-r from-primary via-secondary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40'
        }
      `}
    >
      {/* Animated background shine */}
      {!disabled && !isLoading && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
      )}
      
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Analyzing Content...</span>
        </div>
      ) : (
        <>
          <Sparkles className="w-5 h-5" />
          <span>Analyze Content</span>
        </>
      )}
    </motion.button>
  );
};
