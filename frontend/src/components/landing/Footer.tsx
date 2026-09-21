import { Link } from "react-router-dom";

import { GithubIcon } from "@/components/icons/GithubIcon";
import { Logo } from "@/components/landing/Navbar";

const GROUPS: {
  title: string;
  links: { label: string; to: string; external?: boolean }[];
}[] = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "#features", external: true },
      { label: "Workflow", to: "#workflow", external: true },
      { label: "Platform", to: "#platform", external: true },
    ],
  },
  {
    title: "Workspace",
    links: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Repositories", to: "/dashboard/repositories" },
      { label: "Architecture", to: "/dashboard/architecture" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", to: "/login" },
      { label: "Create account", to: "/signup" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              A developer workspace for repositories,
              architecture and the decisions that connect them.
            </p>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex size-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="GitHub"
            >
              <GithubIcon className="size-4" />
            </a>
          </div>

          {GROUPS.map((group) => (
            <div key={group.title}>
              <div className="text-sm font-semibold">
                {group.title}
              </div>

              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DevSphere. All rights
            reserved.
          </p>

          <p className="text-xs text-muted-foreground">
            Built for developers who care about their systems.
          </p>
        </div>
      </div>
    </footer>
  );
}
