import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

interface MarkdownProps {
  children: string;
  className?: string;
  components?: Partial<Components>;
}

/**
 * Shared Markdown component with GFM support
 * Deduplicates react-markdown and remark-gfm imports across the app
 */
export function Markdown({ children, className, components }: MarkdownProps) {
  return (
    <ReactMarkdown
      className={className}
      remarkPlugins={[remarkGfm]}
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
}
