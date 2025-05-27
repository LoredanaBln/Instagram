import React, { useEffect, useState } from "react";
import { PostForm } from "~/pages/posts/components/post_form";
import type { Post } from "~/entities/post";
import { PostCard } from "~/pages/posts/components/post_card";
import {
  AlertDestructive,
  AlertDestructiveEnum,
} from "~/components/alert_destructive";
import MainLayout from "~/pages/layouts/main_layouts";
import { sortCommentsByVoteCount } from "~/utils/sort_comments";
import { PostsService } from "~/services/post_service";
import { VoteService } from "~/services/vote_service";

interface PostShowProps {
    post: Post;
}

export function PostShow({ post }: PostShowProps) {
    const [message, setMessage] = React.useState("");
    const [alertType, setAlertType] = React.useState(AlertDestructiveEnum.error);
    const [currentPost, setCurrentPost] = useState(post);
    const voteService = new VoteService();

    useEffect(() => {
      const fetchPostData = async () => {
        try {
          const freshPost = await new PostsService().find(post.id.toString());

          const commentsWithVotes = await Promise.all(
            (freshPost.relationships.comments || []).map(async (comment) => {
              const voteData = await voteService.getVoteCount(comment.id);
              return {
                ...comment,
                votes: Array(voteData.upvotes)
                  .fill({ type: "UPVOTE" })
                  .concat(Array(voteData.downvotes).fill({ type: "DOWN_VOTE" })),
              };
            })
          );

          setCurrentPost({
            ...freshPost,
            relationships: {
              ...freshPost.relationships,
              comments: commentsWithVotes,
            },
          });
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
      };

      fetchPostData();
    }, [post.id]);

    const sortedComments = sortCommentsByVoteCount(
      currentPost.relationships.comments || []
    );

    return (
        <MainLayout>
            <div className="my-4 max-w-xl mx-auto px-4">
                <PostCard post={currentPost} key={currentPost.id} setMessage={setMessage} setType={setAlertType}/>

                <div className="mt-4"></div>

                <PostForm setMessage={setMessage} setType={setAlertType} titlePlaceholder="Post your reply" textareaSize={1} submitButtonText="Comment" postParentId={currentPost.id}/>

                <div className="flex flex-col w-full gap-4 mt-4">
                    {sortedComments.map((comment) => (
                    <a href={"/posts/" + comment.id} key={comment.id}>
                        <PostCard post={comment} setMessage={setMessage} setType={setAlertType}/>
                    </a>))}
                </div>

                <AlertDestructive className="fixed bottom-4 right-0 w-[95%] mr-[2.5%] md:w-80 md:mr-0 md:right-4" message={message} type={alertType}/>
            </div>
        </MainLayout>
    );
}
