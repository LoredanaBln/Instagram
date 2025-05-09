import {PostRepository} from "~/repositories/post_repository";
import type {Post} from "~/entities/post";
import type {PostCreateRequestDTO} from "~/services/dtos/requests/post_create_request_dto";
import type {PostUpdateRequestDTO} from "~/services/dtos/requests/post_update_request_dto";

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
        postParentId: number | null,
    ) : Promise<Post> {
        const newPost: PostCreateRequestDTO = {
            title,
            text,
            image,
            parentId: postParentId,
        };

        return this.postsRepository.create(newPost);
    }

    async find(id: string) {
        return this.postsRepository.find(id);
    }

    async delete(id: string) {
        await this.postsRepository.delete(id);
    }

    async update(
        id: number,
        title: string,
        text: string,
        image: Blob | null,
        postParentId: number | null,
    ) : Promise<Post> {
        const newPost: PostUpdateRequestDTO = {
            id,
            title,
            text,
            imagePath: image,
            parentId: postParentId,
        };

        return this.postsRepository.update(newPost);
    }

}
