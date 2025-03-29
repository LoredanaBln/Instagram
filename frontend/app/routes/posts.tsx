import type {Route} from "./+types/posts";
import {PostIndex} from "~/pages/posts/post_index";
import {PostsService} from "~/services/post_service";
import {useLoaderData} from "react-router";
import type {Post} from "~/entities/post";

export async function loader({ params }: Route.LoaderArgs) {
    return (await new PostsService().get()).sort((a: Post, b:Post) => {
        const dateA = new Date(a.attributes.createdAt).getTime();
        const dateB = new Date(b.attributes.createdAt).getTime();
        return dateB - dateA;
    });
}

export default function Posts() {
    let posts = useLoaderData<typeof loader>();

    return <PostIndex posts={posts} />;
}