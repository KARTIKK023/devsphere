import { z } from "zod";

export const createInvitationSchema =
  z.object({
    email: z
      .string()
      .trim()
      .email()
      .toLowerCase(),

    role: z.enum([
      "OWNER",
      "MANAGER",
      "DEVELOPER",
    ]),
  });