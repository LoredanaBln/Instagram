import React from 'react';
import type {Post} from "~/entities/post";
import {AlertDestructive, AlertDestructiveEnum} from "~/components/alert_destructive";
import MainLayout from "~/pages/layouts/main_layouts";
import {UpdatePostForm} from "~/pages/posts/components/update_post_form";

interface PostUpdateProps {
    post: Post;
}

export function PostUpdate({ post }: PostUpdateProps) {
    const [message, setMessage] = React.useState("");
    const [alertType, setAlertType] = React.useState(AlertDestructiveEnum.error);

    return (
        <MainLayout>
            <div className="my-4 max-w-xl mx-auto px-4">
                <UpdatePostForm
                    post={post}
                    setMessage={setMessage}
                    setType={setAlertType}
                    submitButtonText="Post"
                    textareaSize={3}
                />

                <AlertDestructive className="fixed bottom-4 right-0 w-[95%] mr-[2.5%] md:w-80 md:mr-0 md:right-4" message={message} type={alertType}/>
            </div>
        </MainLayout>
    );
}
