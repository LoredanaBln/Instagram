import {PostsRepository} from "~/repositories/post_repository";
import type {Post} from "~/entities/post";
import type {PostDTO} from "~/services/dtos/post_dto";

export class PostsService {
    private postsRepository: PostsRepository;

    constructor() {
        this.postsRepository = new PostsRepository();
    }

    async get() : Promise<Post[]> {
        return this.postsRepository.get();
    }

    async create(
        title: string,
        text: string,
        image: Blob | null,
    ) : Promise<Post> {
        const newPost: PostDTO = {
            type: 'posts',
            attributes: {
                title,
                text,
            },
            relationships: {
                author: {
                    type: "users",
                    id: "1"
                },
            },
            image: image
        };

        return this.postsRepository.create(newPost);
    }
}
