import { z } from "zod";

const architectureDocumentSchema = z.object({
  elements: z.array(z.unknown()).max(20000),
  appState: z.record(z.string(), z.unknown()),
  files: z.record(z.string(), z.unknown()),
});

export const createArchitectureSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional(),
  repositoryId: z
    .string()
    .trim()
    .min(1)
    .nullable()
    .optional(),
});

export const updateArchitectureSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(500).optional(),
  repositoryId: z
    .string()
    .trim()
    .min(1)
    .nullable()
    .optional(),
  document: architectureDocumentSchema.optional(),
});

export type CreateArchitectureInput = z.infer<
  typeof createArchitectureSchema
>;

export type UpdateArchitectureInput = z.infer<
  typeof updateArchitectureSchema
>;
