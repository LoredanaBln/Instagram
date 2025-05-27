import type { Post } from "~/entities/post";

export function sortCommentsByVoteCount(comments: Post[]): Post[] {
    return [...comments].sort((a, b) => {
        const voteCountA = a.votes?.reduce((sum, vote) => sum + (vote.type === "UPVOTE" ? 1 : -1), 0) || 0;
        const voteCountB = b.votes?.reduce((sum, vote) => sum + (vote.type === "UPVOTE" ? 1 : -1), 0) || 0;
        return voteCountB - voteCountA;
    });
}