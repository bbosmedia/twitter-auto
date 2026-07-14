import { z } from "zod";

export const templateSchema = z.object({
  name: z.string().min(1, "Template name is required").max(100),
  content: z.string().min(1, "Content is required").max(280),
  category: z.string().max(100).optional(),
});

export const hashtagSchema = z.object({
  tag: z
    .string()
    .min(1, "Hashtag is required")
    .max(100)
    .regex(/^#?[\w]+$/, "Invalid hashtag format"),
});

export type TemplateInput = z.infer<typeof templateSchema>;
export type HashtagInput = z.infer<typeof hashtagSchema>;
