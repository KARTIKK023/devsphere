const STEPS = [
  {
    step: "01",
    title: "Connect your GitHub",
    description:
      "Link your account once. DevSphere reads your repositories, branches and files with a token you can revoke anytime.",
  },
  {
    step: "02",
    title: "Explore the codebase",
    description:
      "Browse any connected repository with a live file tree, syntax-aware viewer and README preview.",
  },
  {
    step: "03",
    title: "Design the architecture",
    description:
      "Drop systems onto an infinite canvas, connect them, and save boards that your whole team can revisit.",
  },
];

export default function Workflow() {
  return (
    <section id="workflow" className="border-t py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-muted-foreground">
            How it works
          </p>

          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            From connected repo to clear architecture in three
            steps.
          </h2>
        </div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-6 hidden h-px bg-border md:block"
          />

          {STEPS.map((item) => (
            <div key={item.step} className="relative">
              <div className="relative z-10 flex size-12 items-center justify-center rounded-xl border bg-background text-sm font-semibold shadow-sm">
                {item.step}
              </div>

              <h3 className="mt-6 text-lg font-semibold">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
