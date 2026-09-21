import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  email: z
    .string()
    .trim()
    .email()
    .toLowerCase(),

  password: z
    .string()
    .min(8)
    .max(100),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .toLowerCase(),

  password: z
    .string()
    .min(1),
});

export type SignupInput =
  z.infer<typeof signupSchema>;

export type LoginInput =
  z.infer<typeof loginSchema>;

export const switchOrganizationSchema =
  z.object({
    organizationId: z
      .string()
      .min(1),
  });

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    avatar: z
      .string()
      .trim()
      .url()
      .nullish(),
  })
  .refine(
    (value) =>
      value.name !== undefined ||
      value.avatar !== undefined,
    {
      message:
        "Provide a name or avatar to update",
    }
  );

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1),

  newPassword: z
    .string()
    .min(8)
    .max(100),
});

export type UpdateProfileInput =
  z.infer<typeof updateProfileSchema>;

export type ChangePasswordInput =
  z.infer<typeof changePasswordSchema>;