import {PostIndex} from "~/pages/posts/post_index";
import {PostsService} from "~/services/post_service";
import type {Post} from "~/entities/post";
import {FutureLoader} from "~/components/future_loader";
import {useNavigate} from "react-router";

const loadPosts = async (navigate: (path: string) => void) => {
    try {
        const posts = await new PostsService().get();
        return posts.sort((a, b) => {
            const dateA = new Date(a.attributes.createdAt).getTime();
            const dateB = new Date(b.attributes.createdAt).getTime();
            return dateB - dateA;
        });
    } catch (error) {
        navigate("/login");
    }
};

export default function Posts() {
    const navigate = useNavigate();

    return (
        // @ts-ignore
        <FutureLoader<Post[]> future={() => loadPosts(navigate)} >
            {(posts) => <PostIndex posts={posts} />}
        </FutureLoader>
    );
}