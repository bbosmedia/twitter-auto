import { db } from "@/lib/db";
import { twitterAccounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { decrypt, encrypt } from "@/lib/crypto";
import { refreshAccessToken } from "./auth";

export async function getValidAccessToken(
  accountId: string,
  userId: string
): Promise<string> {
  const account = await db.query.twitterAccounts.findFirst({
    where: and(
      eq(twitterAccounts.id, accountId),
      eq(twitterAccounts.userId, userId)
    ),
  });

  if (!account) {
    throw new Error("Twitter account not found");
  }

  if (!account.isActive) {
    throw new Error("Twitter account is disconnected");
  }

  const expiresWithBuffer = new Date(account.expiresAt.getTime() - 5 * 60 * 1000);

  if (expiresWithBuffer > new Date()) {
    return decrypt(account.accessToken);
  }

  const refreshToken = decrypt(account.refreshToken);
  const tokens = await refreshAccessToken(refreshToken);

  await db
    .update(twitterAccounts)
    .set({
      accessToken: encrypt(tokens.access_token),
      refreshToken: encrypt(tokens.refresh_token || refreshToken),
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      updatedAt: new Date(),
    })
    .where(eq(twitterAccounts.id, accountId));

  return tokens.access_token;
}
