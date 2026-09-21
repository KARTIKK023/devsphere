import {
  CircleDot,
  Code2,
  GitPullRequest,
  PlayCircle,
} from "lucide-react";

const tabs = [
  {
    label: "Code",
    icon: Code2,
    active: true,
  },
  {
    label: "Issues",
    icon: CircleDot,
    count: 3,
  },
  {
    label: "Pull requests",
    icon: GitPullRequest,
    count: 1,
  },
  {
    label: "Actions",
    icon: PlayCircle,
  },
];

export default function RepositoryDetailTabs() {
  return (
    <div className="border-b px-6 lg:px-8">
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.label}
              type="button"
              className={`
                relative flex h-12 shrink-0 items-center gap-2
                border-b-2 px-3 text-sm font-medium
                transition-colors
                ${
                  tab.active
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }
              `}
            >
              <Icon className="size-4" />

              {tab.label}

              {tab.count !== undefined && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}