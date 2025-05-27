import { api } from "~/config/api";
import { ENDPOINTS } from "~/config/endpoint";
import type { VoteType } from "~/entities/vote";

interface VoteCount {
  postId: number;
  count: number;
  upvotes: number;
  downvotes: number;
}

export class VoteService {
  async vote(postId: number, type: VoteType): Promise<void> {
    await api.post(`${ENDPOINTS.VOTES}/${postId}?type=${type}`, null);
  }

  async getVoteCount(postId: number): Promise<VoteCount> {
    const response = await api.get<VoteCount>(
      `${ENDPOINTS.VOTES}/${postId}/count`
    );
    return response.data;
  }
}