import {PostShow as PostShowPage} from "~/pages/posts/post_show"
import type {Post} from "~/entities/post";
import {FutureLoader} from "~/components/future_loader";
import {PostsService} from "~/services/post_service";
import {useNavigate, useParams} from "react-router";

const loadPost = async (navigate: (path: string) => void, id: string) => {
    try {
        return await new PostsService().find(id);
    } catch (error) {
        navigate("/login");
    }
};

export default function PostShow() {
    const navigate = useNavigate();
    const { postId } = useParams<{ postId: string }>();

    return (
        // @ts-ignore
        <FutureLoader<Post> future={() => loadPost(navigate, postId)} >
            {(post) => <PostShowPage post={post} />}
        </FutureLoader>
    )
}