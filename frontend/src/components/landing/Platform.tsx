import { Check } from "lucide-react";

import { GithubIcon } from "@/components/icons/GithubIcon";

const POINTS = [
  "OAuth sign-in with Google and GitHub",
  "Encrypted, revocable GitHub access tokens",
  "Role-aware workspaces for owners, managers and developers",
  "Free and premium plans scoped per organization",
];

const INTEGRATIONS = [
  "GitHub",
  "Google",
  "Excalidraw",
  "MongoDB",
  "Express",
  "React",
];

export default function Platform() {
  return (
    <section id="platform" className="border-t py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Built for real teams
          </p>

          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Secure integrations, wired into your workflow.
          </h2>

          <p className="mt-4 text-pretty leading-7 text-muted-foreground">
            Sign in with the accounts you already use and give
            DevSphere exactly the access it needs — nothing
            more.
          </p>

          <ul className="mt-8 space-y-3">
            {POINTS.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-sm"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                  <Check className="size-3" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-foreground/[0.03] blur-2xl" />

          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">
                Integrations
              </span>

              <GithubIcon className="size-4 text-muted-foreground" />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {INTEGRATIONS.map((item) => (
                <span
                  key={item}
                  className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2.5 text-xs">
                <span className="text-muted-foreground">
                  Token encryption
                </span>
                <span className="font-medium">AES-256-GCM</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-background px-3 py-2.5 text-xs">
                <span className="text-muted-foreground">
                  Session
                </span>
                <span className="font-medium">JWT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
