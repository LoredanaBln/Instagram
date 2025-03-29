// postsRepository.ts
import type {Post} from "~/entities/post";
import axios from "axios";
import type {PostDTO} from "~/services/dtos/post_dto";

export class PostsRepository {
    async get(): Promise<Post[]> {
        try {
            const response = await axios.get<Post[]>('http://localhost:8080/api/posts', {
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
        try {
            const flattened = this.flattenObject(data);

            const formData = new FormData();
            Object.entries(flattened).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const response = await axios.post<Post>('http://localhost:8080/api/posts', formData);

            return response.data;
        } catch (error) {
            console.error('Error creating post via API:', error);
            throw error;
        }
    }

    flattenObject(obj, prefix = '', result = {}) {
        for (const key in obj) {
            const value = obj[key];
            const prefixedKey = prefix ? `${prefix}${key}` : key;

            if (typeof value === 'object' && value !== null && !(value instanceof File)) {
                this.flattenObject(value, `${prefixedKey}.`, result);
            } else {
                result[prefixedKey] = value;
            }
        }
        return result;
    }
}
