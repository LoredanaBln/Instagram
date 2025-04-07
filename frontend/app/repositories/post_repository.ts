import type {Post} from "~/entities/post";
import axios from "axios";
import type {PostDTO} from "~/services/dtos/post_dto";
import ObjectFlattener from "~/config/object_flattner";
import {ENDPOINTS} from "~/config/endpoint";

export class PostsRepository {
    async get(): Promise<Post[]> {
        try {
            console.log(ENDPOINTS.POSTS);
            const response = await axios.get<Post[]>(ENDPOINTS.POSTS, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });

            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch posts');
        }
    }

    async create(data: PostDTO) {
        const formData = new FormData();
        Object.entries(ObjectFlattener.handle(data)).forEach(([key, value]) => {
            formData.append(key, value as string|Blob);
        });

        const response = await axios.post<Post>(ENDPOINTS.POSTS, formData);
        return response.data;
    }
}
