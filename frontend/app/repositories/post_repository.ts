// postsRepository.ts
import type {Post} from "~/entities/post";
import axios from "axios";

export class PostsRepository {
    async get(): Promise<Post[]> {
        // return [];
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
}
