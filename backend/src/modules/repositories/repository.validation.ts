import { z } from "zod";

export const connectRepositorySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(
      /^[^/\s]+\/[^/\s]+$/,
      "Repository must be in the owner/name format"
    ),
});

export const repositoryTreeQuerySchema = z.object({
  ref: z.string().trim().min(1).max(200).optional(),
});

export const repositoryFileQuerySchema = z.object({
  path: z.string().trim().min(1).max(1000),
  ref: z.string().trim().min(1).max(200).optional(),
});

export type ConnectRepositoryInput = z.infer<
  typeof connectRepositorySchema
>;
