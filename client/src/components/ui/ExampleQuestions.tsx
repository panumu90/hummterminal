import React from 'react';
import { PulseButton } from '@/components/ui/pulse-button';
import { Star } from 'lucide-react';

interface ExampleQuestionsProps {
  suggestions: string[];
  onSelect: (s: string) => void;
  loading?: boolean;
}

export const ExampleQuestions: React.FC<ExampleQuestionsProps> = ({ suggestions, onSelect, loading }) => {
  return (
    <div className="border-t border-slate-600/50 pt-4 mb-4">
      <p className="text-sm font-medium mb-3 text-slate-200 flex items-center gap-2">
        <Star className="h-4 w-4 text-yellow-400" />
        Esimerkkikysymykset:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => (
          <PulseButton
            key={index}
            variant="outline"
            size="sm"
            pulse="subtle"
            className="text-left h-auto py-3 px-4 justify-start text-slate-200 bg-slate-700/30 hover:bg-slate-600/50 border-slate-600 hover:border-blue-500 transition-all duration-200"
            onClick={() => onSelect(suggestion)}
            loading={loading}
          >
            <span className="text-xs">{suggestion}</span>
          </PulseButton>
        ))}
      </div>
    </div>
  );
};

export default ExampleQuestions;
