import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const HIGHLIGHTS = [
  "Connect and browse GitHub repositories",
  "Design shareable architecture boards",
  "Role-aware workspaces for your whole team",
];

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-foreground text-background lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--background)_1px,transparent_1px),linear-gradient(to_bottom,var(--background)_1px,transparent_1px)] bg-[size:56px_56px] opacity-[0.07]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-background/10 blur-3xl"
        />

        <Link to="/" className="relative flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-background text-foreground">
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 2 3 7v10l9 5 9-5V7l-9-5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="m7 9 5 3 5-3M12 12v5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <span className="text-lg font-semibold tracking-tight">
            DevSphere
          </span>
        </Link>

        <div className="relative max-w-md">
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight">
            Your codebase, architecture and team in one
            place.
          </h2>

          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm opacity-80"
              >
                <span className="flex size-5 items-center justify-center rounded-full bg-background text-foreground">
                  <Check className="size-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs opacity-60">
          © {new Date().getFullYear()} DevSphere. All rights
          reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-10 flex items-center gap-2 lg:hidden"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 2 3 7v10l9 5 9-5V7l-9-5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="m7 9 5 3 5-3M12 12v5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <span className="text-lg font-semibold tracking-tight">
              DevSphere
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">
              {title}
            </h1>

            <p className="mt-2 text-muted-foreground">
              {subtitle}
            </p>
          </div>

          {children}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
