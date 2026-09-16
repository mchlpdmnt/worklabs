import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownDocumentProps {
  content: string;
}

export function MarkdownDocument({ content }: MarkdownDocumentProps) {
  return (
    <article className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => <pre tabIndex={0} aria-label="Code example" data-lenis-prevent>{children}</pre>,
          table: ({ children }) => <table tabIndex={0} aria-label="Documentation table" data-lenis-prevent>{children}</table>,
          a: ({ href, children }) => (
            <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              {children}
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const block = Boolean(className);
            return block ? (
              <code className={className} {...props}>{children}</code>
            ) : (
              <code className="inline-code" {...props}>{children}</code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
