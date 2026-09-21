import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Repository } from "@/types/repository";

export type CreateArchitectureInput = {
  title: string;
  description: string;
  repositoryId: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repositories: Repository[];
  creating: boolean;
  onCreate: (data: CreateArchitectureInput) => void;
};

export default function CreateArchitectureDialog({
  open,
  onOpenChange,
  repositories,
  creating,
  onCreate,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repository, setRepository] = useState("none");

  const handleCreate = () => {
    if (!title.trim() || creating) {
      return;
    }

    onCreate({
      title: title.trim(),
      description: description.trim(),
      repositoryId:
        repository === "none" ? null : repository,
    });

    setTitle("");
    setDescription("");
    setRepository("none");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create architecture</DialogTitle>

          <DialogDescription>
            Create a new architecture diagram and optionally
            associate it with a repository.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Name
            </label>

            <Input
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="DevSphere System Architecture"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description
            </label>

            <Input
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe this architecture..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Repository
            </label>

            <Select
              value={repository}
              onValueChange={(value) =>
                setRepository(value ?? "none")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="none">
                  No repository
                </SelectItem>

                {repositories.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={creating}
          >
            Cancel
          </Button>

          <Button
            disabled={!title.trim() || creating}
            onClick={handleCreate}
          >
            {creating && (
              <Loader2 className="size-4 animate-spin" />
            )}
            Create architecture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
