import type {Post} from "~/entities/post";
import type {PostDTO} from "~/services/dtos/responses/post_dto";
import ObjectFlattener from "~/config/object_flattner";
import {ENDPOINTS} from "~/config/endpoint";
import {api} from "~/config/api";
import type {PostCreateRequestDTO} from "~/services/dtos/requests/post_create_request_dto";

export class PostsRepository {
    async get(): Promise<Post[]> {
        try {
            const response = await api.get<Post[]>(ENDPOINTS.POSTS);

            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch posts');
        }
    }

async create(data: PostCreateRequestDTO) {
        const formData = new FormData();
        Object.entries(ObjectFlattener.handle(data)).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value as string | Blob);
            }
        });

        const response = await api.post<Post>(ENDPOINTS.POSTS, formData, {

        });
        return response.data;
    }
}
