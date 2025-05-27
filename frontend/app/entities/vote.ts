import type { User } from "./user";
import type { Post } from "./post";

export type VoteType = "UPVOTE" | "DOWN_VOTE";

export type Vote = {
  id: number;
  user: User;
  post: Post;
  type: VoteType;
};