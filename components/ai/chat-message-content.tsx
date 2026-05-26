"use client";

type ChatMessageContentProps = {
  content: string;
};

export function ChatMessageContent({ content }: ChatMessageContentProps) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-sm leading-relaxed text-emerald-900/90">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;

        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="font-bold text-emerald-900">
              {line.replace(/\*\*/g, "")}
            </p>
          );
        }

        if (line.startsWith("`") && line.endsWith("`")) {
          const formula = line.replace(/`/g, "");
          return (
            <div
              key={i}
              className="my-3 rounded-xl bg-emerald-50/90 border border-emerald-100 px-4 py-3 text-center font-mono text-xs sm:text-sm text-emerald-800 tracking-wide"
            >
              {formula}
            </div>
          );
        }

        if (/^\d+\.\s/.test(line)) {
          const text = line.replace(/^\d+\.\s/, "");
          const boldParts = text.split(/\*\*(.*?)\*\*/g);
          return (
            <p key={i} className="pl-1 flex gap-2">
              <span className="text-emerald-500 font-medium shrink-0">
                {line.match(/^\d+/)?.[0]}.
              </span>
              <span>
                {boldParts.map((part, j) =>
                  j % 2 === 1 ? (
                    <strong key={j} className="font-semibold text-emerald-900">
                      {part}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </span>
            </p>
          );
        }

        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <strong key={j} className="font-semibold text-emerald-900">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      })}
    </div>
  );
}
