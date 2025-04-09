import {PostRepository} from "~/repositories/post_repository";
import type {Post} from "~/entities/post";
import type {PostDTO} from "~/services/dtos/responses/post_dto";
import type {PostCreateRequestDTO} from "~/services/dtos/requests/post_create_request_dto";

export class PostsService {
    private postsRepository: PostRepository;

    constructor() {
        this.postsRepository = new PostRepository();
    }

    async get() : Promise<Post[]> {
        return this.postsRepository.get();
    }

    async create(
        title: string,
        text: string,
        image: Blob | null,
    ) : Promise<Post> {
        const newPost: PostCreateRequestDTO = {
            title,
            text,
            image,
            parentId: null,
        };

        return this.postsRepository.create(newPost);
    }
}
