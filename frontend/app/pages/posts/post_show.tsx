import React from 'react';
import {PostForm} from "~/pages/posts/components/post_form";
import type {Post} from "~/entities/post";
import {PostCard} from "~/pages/posts/components/post_card";
import {AlertDestructive, AlertDestructiveEnum} from "~/components/alert_destructive";
import MainLayout from "~/pages/layouts/main_layouts";

interface PostShowProps {
    post: Post;
}

export function PostShow({ post }: PostShowProps) {
    const [message, setMessage] = React.useState("");
    const [alertType, setAlertType] = React.useState(AlertDestructiveEnum.error);

    return (
        <MainLayout>
            <div className="my-4 max-w-xl mx-auto px-4">
                <PostCard post={post} key={post.id} setMessage={setMessage} setType={setAlertType} />

                <div className="mt-4"></div>

                <PostForm setMessage={setMessage} setType={setAlertType} titlePlaceholder="Post your reply" textareaSize={1} submitButtonText="Comment" postParentId={post.id} />

                <div className="flex flex-col w-full gap-4 mt-4">
                    {post.relationships.comments?.map((post) => <a href={"/posts/" + post.id} key={post.id}>
                        <PostCard post={post} setMessage={setMessage} setType={setAlertType}  />
                    </a>)}
                </div>

                <AlertDestructive className="fixed bottom-4 right-0 w-[95%] mr-[2.5%] md:w-80 md:mr-0 md:right-4" message={message} type={alertType}/>
            </div>
        </MainLayout>
    );
}
