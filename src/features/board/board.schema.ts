import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(500, { message: "Description cannot exceed 500 characters" }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"], {
    errorMap: () => ({ message: "Please select a valid priority level" }),
  }),
  columnId: z
    .string()
    .min(1, { message: "Target column selection is required" }),
  assigneeName: z
    .string()
    .min(2, { message: "Assignee identity tag is required" }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
