import React from 'react';
import {PostForm} from "~/pages/posts/components/post_form";
import type {Post} from "~/entities/post";
import {PostCard} from "~/pages/posts/components/post_card";
import {AlertDestructive, AlertDestructiveEnum} from "~/components/alert_destructive";

interface PostIndexProps {
    posts: Post[];
}

export function PostIndex({ posts }: PostIndexProps) {
    const [message, setMessage] = React.useState("");
    const [alertType, setAlertType] = React.useState(AlertDestructiveEnum.error);

    return (
        <div className="my-4 max-w-xl mx-auto px-4">
            <PostForm setMessage={setMessage} setType={setAlertType} />

            <div className="flex flex-col w-full gap-4 mt-4">
                {posts.map((post) => <PostCard post={post} />)}
            </div>

            <AlertDestructive className="fixed bottom-4 right-0 w-[95%] mr-[2.5%] md:w-80 md:mr-0 md:right-4" message={message} type={alertType}/>
        </div>
    );
}
