import { z } from "zod";

export const postSchema = z.object({
  content: z
    .string()
    .min(1, "Post cannot be empty")
    .max(280, "Post exceeds 280 characters"),
  accountIds: z.array(z.string().uuid()).min(1, "Select at least one account"),
  scheduledAt: z.string().datetime().optional(),
});

export const updatePostSchema = z.object({
  content: z
    .string()
    .min(1, "Post cannot be empty")
    .max(280, "Post exceeds 280 characters")
    .optional(),
  accountIds: z.array(z.string().uuid()).optional(),
  scheduledAt: z.string().datetime().optional(),
});

export type PostInput = z.infer<typeof postSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
