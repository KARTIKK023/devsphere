import {
  BrainCircuit,
  Code2,
  GitBranch,
  LayoutDashboard,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const SECONDARY_FEATURES: Feature[] = [
  {
    icon: BrainCircuit,
    title: "AI development agent",
    description:
      "An agent that reasons about your project and responds with real context.",
  },
  {
    icon: Code2,
    title: "Code & architecture",
    description:
      "Read files in place and map systems into living architecture boards.",
  },
  {
    icon: Rocket,
    title: "Deployment pipeline",
    description:
      "Keep shipping connected to the code it comes from.",
  },
  {
    icon: ShieldCheck,
    title: "Role-aware access",
    description:
      "Owners, managers and developers each see exactly what they should.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative border-t py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-muted-foreground">
            One workspace
          </p>

          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything your team needs to move from commit to
            architecture.
          </h2>

          <p className="mt-4 text-pretty text-muted-foreground">
            DevSphere brings repositories, code context and design
            together so your decisions stay grounded in reality.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {/* Feature — large */}
          <FeatureCard className="lg:col-span-2" tall>
            <div className="flex items-start justify-between gap-6">
              <div className="max-w-md">
                <span className="inline-flex size-10 items-center justify-center rounded-xl border bg-muted/40">
                  <GitBranch className="size-5" />
                </span>

                <h3 className="mt-5 text-xl font-semibold">
                  Repository intelligence
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Connect any GitHub repository and browse its
                  full tree, files and branches without leaving
                  the workspace.
                </p>
              </div>

              <div className="hidden w-52 shrink-0 flex-col gap-2 sm:flex">
                {["components", "pages", "api", "lib"].map(
                  (folder, index) => (
                    <div
                      key={folder}
                      className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2"
                      style={{
                        marginLeft: `${index * 12}px`,
                      }}
                    >
                      <span className="size-3 rounded-sm border border-current opacity-40" />
                      <span className="text-[11px] text-muted-foreground">
                        {folder}/
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </FeatureCard>

          {/* Feature — dashboard */}
          <FeatureCard tall>
            <span className="inline-flex size-10 items-center justify-center rounded-xl border bg-muted/40">
              <LayoutDashboard className="size-5" />
            </span>

            <h3 className="mt-5 text-xl font-semibold">
              Live dashboard
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Track repositories, private projects,
              architectures and members at a glance.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {["01", "12", "08", "24"].map((value, index) => (
                <div
                  key={index}
                  className="rounded-lg border bg-background p-3"
                >
                  <div className="text-lg font-semibold">
                    {value}
                  </div>
                  <div className="mt-1 h-1.5 w-10 rounded-full bg-foreground/10" />
                </div>
              ))}
            </div>
          </FeatureCard>

          {SECONDARY_FEATURES.map((feature) => (
            <FeatureCard key={feature.title}>
              <span className="inline-flex size-10 items-center justify-center rounded-xl border bg-muted/40">
                <feature.icon className="size-5" />
              </span>

              <h3 className="mt-5 text-base font-semibold">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </FeatureCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  children,
  className,
  tall,
}: {
  children: ReactNode;
  className?: string;
  tall?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-card p-6 transition-colors hover:border-foreground/20 ${
        tall ? "min-h-[220px]" : ""
      } ${className ?? ""}`}
    >
      <div className="relative z-10 flex h-full flex-col">
        {children}
      </div>
    </div>
  );
}
