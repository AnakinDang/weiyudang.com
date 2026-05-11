import ReactMarkdown from "react-markdown";

export function MarkdownBody({ body }: { body: string }) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => <h2 className="mt-10 text-2xl font-semibold text-white">{children}</h2>,
        p: ({ children }) => <p className="mt-5 text-base leading-8 text-slate-300">{children}</p>,
        ul: ({ children }) => <ul className="mt-5 space-y-3 text-slate-300">{children}</ul>,
        li: ({ children }) => <li className="ml-5 list-disc leading-7">{children}</li>
      }}
    >
      {body}
    </ReactMarkdown>
  );
}
