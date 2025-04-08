import {PostIndex} from "~/pages/posts/post_index";
import {PostsService} from "~/services/post_service";
import type {Post} from "~/entities/post";
import {FutureLoader} from "~/components/future_loader";

const loadPosts = async () => {
    const posts = await new PostsService().get();
    return posts.sort((a, b) => {
        const dateA = new Date(a.attributes.createdAt).getTime();
        const dateB = new Date(b.attributes.createdAt).getTime();
        return dateB - dateA;
    });
}
export default function Posts() {

    return (
        <FutureLoader<Post[]> future={loadPosts} >
            {(posts) => <PostIndex posts={posts} />}
        </FutureLoader>
    );
}