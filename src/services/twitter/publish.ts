import { getValidAccessToken } from "./token";

const TWEET_URL = "https://api.x.com/2/tweets";

export interface TweetResult {
  success: boolean;
  tweetId?: string;
  error?: string;
}

export async function publishTweet(
  content: string,
  accountId: string,
  userId: string
): Promise<TweetResult> {
  try {
    const accessToken = await getValidAccessToken(accountId, userId);

    const response = await fetch(TWEET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ text: content }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.title || "Failed to post tweet");
    }

    return { success: true, tweetId: data.data.id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
