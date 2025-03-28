import {PostsRepository} from "~/repositories/post_repository";
import type {Post} from "~/entities/post";

export class PostsService {
    private postsRepository: PostsRepository;

    constructor() {
        this.postsRepository = new PostsRepository();
    }

    async get() : Promise<Post[]> {
        return this.postsRepository.get();
    }
}
