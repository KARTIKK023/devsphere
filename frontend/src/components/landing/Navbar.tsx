import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAuthStore } from "@/store/auth.store";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Platform", href: "#platform" },
];

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className ?? ""}`}>
      <span className="relative flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
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
    </span>
  );
}

export default function Navbar() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll();
    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border px-4 transition-all duration-300 ${
          scrolled
            ? "border-border bg-background/80 shadow-lg shadow-foreground/5 backdrop-blur-xl"
            : "border-transparent bg-background/0"
        }`}
      >
        <Link to="/">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <Button render={<Link to="/dashboard" />}>
              Dashboard
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                render={<Link to="/login" />}
              >
                Sign in
              </Button>

              <Button render={<Link to="/signup" />}>
                Get started
                <ArrowRight className="size-4" />
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </Button>
      </nav>

      {menuOpen && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border bg-background/95 p-3 shadow-lg backdrop-blur-xl md:hidden">
          <div className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-2 grid gap-2 border-t pt-3">
            {isAuthenticated ? (
              <Button render={<Link to="/dashboard" />}>
                Go to dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  render={<Link to="/login" />}
                >
                  Sign in
                </Button>

                <Button render={<Link to="/signup" />}>
                  Get started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
