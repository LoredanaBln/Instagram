// tests/posts_service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {PostsService} from "~/services/post_service";
import {PostRepository} from "~/repositories/post_repository";

vi.mock('~/repositories/post_repository');

describe('PostsService', () => {
    let service: PostsService;
    // @ts-ignore
    let mockRepo: jest.Mocked<PostRepository>;

    beforeEach(() => {
        service = new PostsService();
        mockRepo = (PostRepository as any).mock.instances[0];
    });

    it('fetches posts', async () => {
        mockRepo.get.mockResolvedValue([{ id: 1, title: 'Hello' }]);

        const posts = await service.get();
        expect(mockRepo.get).toHaveBeenCalled();
        expect(posts).toHaveLength(1);
    });
});
