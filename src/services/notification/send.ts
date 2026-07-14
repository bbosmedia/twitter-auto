import { db } from "@/lib/db";
import { notifications } from "@/db/schema";

export async function sendNotification(input: {
  userId: string;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
}) {
  const [row] = await db
    .insert(notifications)
    .values({
      userId: input.userId,
      title: input.title,
      message: input.message,
      type: input.type ?? "info",
    })
    .returning();

  return row;
}
