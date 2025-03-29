import React from 'react';
import {PostForm} from "~/pages/posts/components/post_form";
import type {Post} from "~/entities/post";
import {PostCard} from "~/pages/posts/components/post_card";

interface PostIndexProps {
    posts: Post[];
}

export function PostIndex({ posts }: PostIndexProps) {
    return (
        <div className="my-4 max-w-xl mx-auto">
            <PostForm />

            <div className="flex flex-col w-full gap-4 mt-4">
                {posts.map((post) => <PostCard post={post} />)}
            </div>
        </div>
    );
}
