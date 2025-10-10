import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatBubbleProps {
  content: string;
  isUser?: boolean;
  agent?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ content, isUser = false, agent }) => {
  const bg = isUser ? 'bg-blue-600 text-white' : 'bg-slate-700/50 text-slate-100';
  return (
    <div className={`rounded-lg p-3 ${bg}`}>
      {isUser ? (
        <span className="text-sm">{content}</span>
      ) : (
        <div className="text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
