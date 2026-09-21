import { GitBranch, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

type Props = {
  canConnect: boolean;
  onConnect: () => void;
};

export default function EmptyRepositories({
  canConnect,
  onConnect,
}: Props) {
  return (
    <Card>
      <CardContent className="flex min-h-[360px] flex-col items-center justify-center text-center">
        <div className="mb-5 flex size-14 items-center justify-center rounded-2xl border bg-muted/40">
          <GitBranch className="size-7 text-muted-foreground" />
        </div>

        <h2 className="text-lg font-semibold">
          No repositories yet
        </h2>

        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Connect a GitHub repository to start exploring
          your codebase with DevSphere.
        </p>

        {canConnect && (
          <Button className="mt-6" onClick={onConnect}>
            <Plus className="size-4" />
            Connect repository
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
