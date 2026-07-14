export type PostStatus = "draft" | "scheduled" | "publishing" | "published" | "failed";
export type PostAccountStatus = "pending" | "publishing" | "published" | "failed";
export type MediaType = "image" | "video" | "gif";
export type NotificationType = "info" | "success" | "warning" | "error";

export interface Post {
  id: string;
  userId: string;
  content: string;
  status: PostStatus;
  scheduledAt: Date | null;
  publishedAt: Date | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostAccount {
  id: string;
  postId: string;
  twitterAccountId: string;
  status: PostAccountStatus;
  tweetId: string | null;
  error: string | null;
  createdAt: Date;
}

export interface TwitterAccount {
  id: string;
  userId: string;
  xUserId: string;
  username: string;
  displayName: string | null;
  avatar: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  userId: string;
  name: string;
  content: string;
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Hashtag {
  id: string;
  userId: string;
  tag: string;
  usageCount: number;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: Date;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
