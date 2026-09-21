import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const CODE_LINES = [
  "width-1",
  "width-3",
  "width-2",
  "width-4",
  "width-2",
  "width-3",
  "width-1",
  "width-4",
];

const WIDTH_CLASSES: Record<string, string> = {
  "width-1": "w-1/3",
  "width-2": "w-1/2",
  "width-3": "w-2/3",
  "width-4": "w-5/6",
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-36">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-foreground/[0.04] blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-in fade-in slide-in-from-bottom-2 mb-6 inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="size-3.5" />
            Repository intelligence, reimagined
          </div>

          <h1 className="animate-in fade-in slide-in-from-bottom-3 text-balance text-5xl font-semibold leading-[1.05] tracking-tight duration-700 sm:text-6xl lg:text-7xl">
            Understand your code.
            <span className="block bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
              Architect with confidence.
            </span>
          </h1>

          <p className="animate-in fade-in slide-in-from-bottom-4 mx-auto mt-6 max-w-xl text-pretty text-lg leading-8 text-muted-foreground duration-700">
            Connect your GitHub repositories, explore every
            file, and design architecture boards that stay in
            sync with the systems you build.
          </p>

          <div className="animate-in fade-in slide-in-from-bottom-5 mt-10 flex flex-col items-center justify-center gap-3 duration-700 sm:flex-row">
            <Button
              size="lg"
              className="w-full sm:w-auto"
              render={<Link to="/signup" />}
            >
              Start building free
              <ArrowRight className="size-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              render={<Link to="/login" />}
            >
              Sign in
            </Button>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            No credit card required · Connect GitHub in seconds
          </p>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 relative mx-auto mt-16 max-w-5xl duration-1000">
      <div className="absolute -inset-x-8 -top-8 bottom-0 -z-10 rounded-[2rem] bg-gradient-to-b from-foreground/10 to-transparent blur-2xl" />

      <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-foreground/10">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-3">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />

          <div className="mx-auto hidden items-center rounded-md border bg-background px-3 py-1 text-[11px] text-muted-foreground sm:flex">
            devsphere.app/dashboard/repositories
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
          {/* Sidebar */}
          <div className="hidden flex-col gap-1 border-r p-3 md:flex">
            <div className="mb-2 flex items-center gap-2 px-2 py-1">
              <span className="flex size-6 items-center justify-center rounded-md bg-foreground text-background">
                <span className="text-[10px] font-bold">D</span>
              </span>
              <span className="h-3 w-20 rounded bg-foreground/10" />
            </div>

            {[
              "Overview",
              "Repositories",
              "Architecture",
              "Agent",
              "Settings",
            ].map((label, index) => (
              <div
                key={label}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs ${
                  index === 1
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <span className="size-3.5 rounded border border-current opacity-40" />
                {label}
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="min-w-0 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">
                  Repositories
                </div>
                <div className="text-xs text-muted-foreground">
                  3 connected
                </div>
              </div>

              <div className="rounded-md bg-foreground px-2.5 py-1 text-[11px] font-medium text-background">
                Connect repository
              </div>
            </div>

            <div className="space-y-2">
              {["DevSphere", "VibeChat", "Agent-Lab"].map(
                (repo) => (
                  <div
                    key={repo}
                    className="flex items-center justify-between gap-3 rounded-lg border p-2.5"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md border bg-muted/40">
                        <span className="size-3 rounded-full border border-current opacity-40" />
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-medium">
                          {repo}
                        </div>
                        <div className="truncate text-[10px] text-muted-foreground">
                          kartik/{repo.toLowerCase()}
                        </div>
                      </div>
                    </div>

                    <span className="hidden rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground sm:inline">
                      Connected
                    </span>
                  </div>
                )
              )}
            </div>

            {/* Code + architecture strip */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <div className="mb-2 text-[11px] font-medium text-muted-foreground">
                  src/App.tsx
                </div>
                <div className="space-y-1.5">
                  {CODE_LINES.map((width, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full bg-foreground/10 ${WIDTH_CLASSES[width]}`}
                      style={{
                        marginLeft: `${(index % 3) * 8}px`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-lg border p-3">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:16px_16px] opacity-60" />

                <div className="relative flex h-full items-center justify-center gap-1.5">
                  <span className="rounded border bg-background px-2 py-1 text-[9px] shadow-sm">
                    Client
                  </span>
                  <span className="h-px w-4 bg-border" />
                  <span className="rounded border bg-background px-2 py-1 text-[9px] shadow-sm">
                    API
                  </span>
                  <span className="h-px w-4 bg-border" />
                  <span className="rounded border bg-background px-2 py-1 text-[9px] shadow-sm">
                    DB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
