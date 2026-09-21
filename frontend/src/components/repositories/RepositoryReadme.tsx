import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

import { getRepositoryFile } from "@/api/repositories";

type Props = {
  repositoryId: string;
  branch: string;
};

export default function RepositoryReadme({
  repositoryId,
  branch,
}: Props) {
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setContent(null);

    getRepositoryFile(repositoryId, "README.md", branch)
      .then((file) => {
        if (active) {
          setContent(file.content);
        }
      })
      .catch(() => {
        if (active) {
          setContent(null);
        }
      });

    return () => {
      active = false;
    };
  }, [repositoryId, branch]);

  if (!content) {
    return null;
  }

  return (
    <section className="mt-6 overflow-hidden rounded-xl border bg-background">
      <div className="flex items-center gap-2 border-b px-5 py-4">
        <BookOpen className="size-4 text-muted-foreground" />

        <h2 className="text-sm font-semibold">README.md</h2>
      </div>

      <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap p-6 font-mono text-[13px] leading-6 text-muted-foreground">
        {content}
      </pre>
    </section>
  );
}
