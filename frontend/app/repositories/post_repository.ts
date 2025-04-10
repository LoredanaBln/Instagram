import type {Post} from "~/entities/post";
import ObjectFlattener from "~/config/object_flattner";
import {ENDPOINTS} from "~/config/endpoint";
import {api} from "~/config/api";
import type {PostCreateRequestDTO} from "~/services/dtos/requests/post_create_request_dto";
import type {PostUpdateRequestDTO} from "~/services/dtos/requests/post_update_request_dto";

export class PostRepository {
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

    async find(id: string): Promise<Post> {
        try {
            const response = await api.get<Post>(ENDPOINTS.POSTS + `/${id}`);

            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch post: [${id}]`);
        }
    }

    async delete(id: string) {
        try {
            await api.delete<Post>(ENDPOINTS.POSTS + `/${id}`);
        } catch (error) {
            throw new Error(`Failed to delete post: [${id}]`);
        }
    }

    async update(data: PostUpdateRequestDTO) {
        const formData = new FormData();
        Object.entries(ObjectFlattener.handle(data)).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value as string | Blob);
            }
        });

        const response = await api.put<Post>(ENDPOINTS.POSTS + `/${data.id}`, formData);

        return response.data;
    }
}
