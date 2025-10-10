import React from 'react';
import { Input } from '@/components/ui/input';
import { PulseButton } from '@/components/ui/pulse-button';
import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
  inputId?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, disabled, inputId }) => {
  return (
    <div className="flex items-center space-x-3">
      <Input
        type="text"
        id={inputId}
        data-testid={inputId}
        placeholder="Kysy minulta mitä tahansa..."
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        className="flex-1 bg-slate-700/50 border-slate-600 focus:border-blue-500 text-slate-100 placeholder:text-slate-400"
        disabled={disabled}
      />
      <PulseButton onClick={onSend} disabled={!value.trim()} pulse="subtle" className="px-4 bg-blue-600 hover:bg-blue-700">
        <Send className="h-4 w-4" />
      </PulseButton>
    </div>
  );
};

export default ChatInput;
