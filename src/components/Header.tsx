import React from 'react';
import { BrainCircuit } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-surface flex items-center px-6 bg-background/50 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-2 text-primary">
        <BrainCircuit className="w-8 h-8" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          MathsCare
        </h1>
      </div>
    </header>
  );
};
