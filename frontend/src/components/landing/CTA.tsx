import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="px-6 pb-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border bg-foreground px-8 py-16 text-background sm:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--background)_1px,transparent_1px),linear-gradient(to_bottom,var(--background)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.06]"
        />

        <div className="relative max-w-2xl">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Bring your codebase into focus today.
          </h2>

          <p className="mt-4 text-pretty leading-7 opacity-70">
            Create a workspace, connect a repository and start
            mapping your architecture in minutes.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto"
              render={<Link to="/signup" />}
            >
              Get started free
              <ArrowRight className="size-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background sm:w-auto"
              render={<Link to="/login" />}
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
