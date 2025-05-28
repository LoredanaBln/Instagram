import type { Post } from "~/entities/post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faHeart,
  faHeartBroken,
  faPen,
  faStar,
  faTrash,
  faLock,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";
import { DateFormatter } from "~/utils/date_formatter";
import React, { useState, useEffect } from "react";
import { PostsService } from "~/services/post_service";
import { AlertDestructiveEnum } from "~/components/alert_destructive";
import { VoteService } from "~/services/vote_service";
import type { VoteType } from "~/entities/vote";

interface PostCardProps {
    post: Post;
    setMessage: (error: string) => void;
    setType: (type: AlertDestructiveEnum) => void;
}

interface VoteCount {
  postId: number;
  count: number;
  upvotes: number;
  downvotes: number;
}

export function PostCard({ post, setMessage, setType }: PostCardProps) {
  const [currentPost, setCurrentPost] = useState(post);
  const [voteCount, setVoteCount] = useState<VoteCount>({
    postId: post.id,
    count: 0,
    upvotes: 0,
    downvotes: 0,
  });
  const [userVote, setUserVote] = useState<VoteType | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const voteService = new VoteService();

  useEffect(() => {
    new PostsService().find(post.id.toString()).then((freshPost) => {
      setCurrentPost(freshPost);
    });
  }, [post.id]);
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const freshPost = await new PostsService().find(post.id.toString());
        setCurrentPost(freshPost);

        // Get vote count
        const voteData = await voteService.getVoteCount(post.id);
        setVoteCount(voteData);

        // Check if user has voted
        const userVote = freshPost.votes?.find(
          (v) =>
            v.user.attributes.username === sessionStorage.getItem("username")
        );
        if (userVote) {
          setUserVote(userVote.type);
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchPostData();
  }, [post.id]);

  function deletePost(event: React.MouseEvent<HTMLSpanElement>, id: number) {
    event.preventDefault();

    new PostsService()
      .delete(id.toString())
      .then(() => {
        setType(AlertDestructiveEnum.success);
        setMessage("Post deleted successfully.");
      })
      .catch((err) => {
        setType(AlertDestructiveEnum.error);
        setMessage(
          err instanceof Error
            ? err.message
            : "An unknown error occurred. Hold tight!"
        );
      });
  }

  async function handleVote(type: VoteType) {
    if (isVoting) return;

    try {
      setIsVoting(true);
      const username = sessionStorage.getItem("username");
      if (!username) {
        setType(AlertDestructiveEnum.error);
        setMessage("Please login to vote");
        return;
      }

      if (
        currentPost.relationships?.author?.attributes?.username === username
      ) {
        setType(AlertDestructiveEnum.error);
        setMessage("You cannot vote on your own posts");
        return;
      }

      await voteService.vote(currentPost.id, type);

      // Update vote count
      const newVoteData = await voteService.getVoteCount(currentPost.id);
      setVoteCount(newVoteData);

      // Update user's vote
      setUserVote(userVote === type ? null : type);

      setType(AlertDestructiveEnum.success);
      setMessage("Vote recorded successfully");
    } catch (error) {
      setType(AlertDestructiveEnum.error);
      setMessage(
        error instanceof Error ? error.message : "Failed to record vote"
      );
    } finally {
      setIsVoting(false);
    }
  }

  async function handleToggleComments() {
    try {
      const updatedPost = await new PostsService().toggleCommentability(
        currentPost.id.toString()
      );
      setCurrentPost(updatedPost);
      setType(AlertDestructiveEnum.success);
      setMessage(
        updatedPost.attributes.status === "OUTDATED"
          ? "Comments disabled successfully"
          : "Comments enabled successfully"
      );
    } catch (error) {
      setType(AlertDestructiveEnum.error);
      setMessage(
        error instanceof Error ? error.message : "Failed to toggle comments"
      );
    }
  }

  function canEditPost(post: Post): boolean {
    const loggedUser = sessionStorage.getItem("username");
    const role = sessionStorage.getItem("role");
    const authorUsername = post.relationships?.author?.attributes?.username;

    if (role == "MODERATOR") return true;

    return authorUsername === loggedUser;
  }

  return (
    <div className="bg-gradient-to-br from-[#e74c3c] via-[#641e16] to-[#ec7063] p-[2px] rounded-lg">
      <div className="w-full bg-[#1E1E1E] text-white rounded-lg p-4">
        <div className="flex items-start mb-3">
          <div className="w-full">
            <div className="flex flex-col justify-start items-start w-full">
              <div className="flex items-center justify-between w-full">
                <span className="font-bold mr-1 flex">
                  {" "}
                  {currentPost.attributes.title}{" "}
                </span>
                {canEditPost(currentPost) && (
                  <div className="flex items-center justify-end">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleComments();
                      }}
                      className="text-orange-600 mr-4 text-sm cursor-pointer hover:underline"
                    >
                      {currentPost.attributes.status === "OUTDATED"
                        ? "Enable comments"
                        : "Disable comments"}
                      <FontAwesomeIcon
                        icon={
                          currentPost.attributes.status === "OUTDATED"
                            ? faLockOpen
                            : faLock
                        }
                        className="ml-2"
                      />
                    </button>
                    <button
                      onClick={() =>
                        (window.location.href = `/posts/${currentPost.id.toString()}/edit`)
                      }
                      className="text-orange-600 mr-4 text-sm cursor-pointer hover:underline"
                    >
                      Edit
                      <FontAwesomeIcon icon={faPen} className="ml-2" />
                    </button>
                    <span
                      className="text-orange-600 text-sm cursor-pointer hover:underline"
                      onClick={(e) => deletePost(e, currentPost.id)}
                    >
                      Delete
                      <FontAwesomeIcon icon={faTrash} className="ml-2" />
                    </span>
                  </div>
                )}
              </div>
              <span className="flex flex-wrap">
                {currentPost.attributes.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#A91D3A] py-1 px-2 mr-2 my-1 rounded-full text-xs shrink-0 text-[#EEEEEE]"
                  >
                    {tag}
                  </span>
                ))}
              </span>
              <span className="text-gray-400">
                {currentPost.relationships?.author?.attributes.username} ·{" "}
                {DateFormatter.formatDate(post.attributes.createdAt)} ·{" "}
                {currentPost.attributes.status === "NEW"
                  ? "New"
                  : currentPost.attributes.status === "ACTIVE"
                  ? "Active"
                  : currentPost.attributes.status === "FIRST_REACTION"
                  ? "First Reaction"
                  : currentPost.attributes.status === "OUTDATED"
                  ? "Outdated"
                  : currentPost.attributes.status}
              </span>
            </div>
          </div>
        </div>
        <p className="mb-3 leading-relaxed">{post.attributes.text}</p>
        {post.attributes.imagePath && (
          <div className="border border-gray-600 rounded-lg overflow-hidden mb-3">
            <img
              src={post.attributes.imagePath}
              alt={post.attributes.title}
              className="w-full h-auto"
            />
          </div>
        )}

        <div className="flex justify-between text-gray-400 text-sm mt-2">
          <div className="group flex items-center space-x-2 cursor-default transition-all duration-500">
            <div className="relative">
              <div className="absolute w-6 h-6 rounded-full group-hover:scale-100 bg-[#e74c3c] transition-all duration-200 opacity-20 scale-0 -translate-x-1/6 -translate-y-1/20" />
              <FontAwesomeIcon
                icon={faStar}
                className="text-gray-400 group-hover:text-[#e74c3c] relative transition-all duration-300"
              />
            </div>
            <span className="text-gray-400 group-hover:text-[#e74c3c] transition-all duration-300">
              {voteCount.count}
            </span>
          </div>
          <button
            className={`group flex items-center space-x-2 ${
              currentPost.attributes.status !== "OUTDATED"
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50"
            } transition-all duration-500`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (currentPost.attributes.status !== "OUTDATED") {
                window.location.href = `/posts/${currentPost.id}`;
              }
            }}
            disabled={currentPost.attributes.status === "OUTDATED"}
          >
            <div className="relative">
              <div className="absolute w-6 h-6 rounded-full group-hover:scale-100 bg-[#3498db] transition-all duration-200 opacity-20 scale-0 -translate-x-1/5 -translate-y-1/16" />
              <FontAwesomeIcon
                icon={faComment}
                className={`text-gray-400 ${
                  currentPost.attributes.status !== "OUTDATED"
                    ? "group-hover:text-[#3498db]"
                    : ""
                } relative transition-all duration-300`}
              />
            </div>
            <span
              className={`text-gray-400 ${
                currentPost.attributes.status !== "OUTDATED"
                  ? "group-hover:text-[#3498db]"
                  : ""
              } transition-all duration-300`}
            >
              {currentPost.relationships?.comments?.length ?? "0"}
            </span>
          </button>
          <div
            className="group flex items-center space-x-2 cursor-pointer transition-all duration-500"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleVote("UPVOTE");
            }}
          >
            <div className="relative">
              <div className="absolute w-6 h-6 rounded-full group-hover:scale-100 bg-[#2ecc71] transition-all duration-200 opacity-20 scale-0 -translate-x-1/5 -translate-y-1/16" />
              <FontAwesomeIcon
                icon={faHeart}
                className={`${
                  userVote === "UPVOTE"
                    ? "text-[#2ecc71]"
                    : "text-gray-400 group-hover:text-[#2ecc71]"
                } relative transition-all duration-300`}
              />
            </div>
            <span
              className={`${
                userVote === "UPVOTE"
                  ? "text-[#2ecc71]"
                  : "text-gray-400 group-hover:text-[#2ecc71]"
              } transition-all duration-300`}
            >
              {voteCount.upvotes} Upvotes
            </span>
          </div>
          <div
            className="group flex items-center space-x-2 cursor-pointer transition-all duration-500"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleVote("DOWN_VOTE");
            }}
          >
            <div className="relative">
              <div className="absolute w-6 h-6 rounded-full group-hover:scale-100 bg-[#d35400] transition-all duration-200 opacity-20 scale-0 -translate-x-1/5 -translate-y-1/16" />
              <FontAwesomeIcon
                icon={faHeartBroken}
                className={`${
                  userVote === "DOWN_VOTE"
                    ? "text-[#d35400]"
                    : "text-gray-400 group-hover:text-[#d35400]"
                } relative transition-all duration-300`}
              />
            </div>
            <span
              className={`${
                userVote === "DOWN_VOTE"
                  ? "text-[#d35400]"
                  : "text-gray-400 group-hover:text-[#d35400]"
              } transition-all duration-300`}
            >
              {voteCount.downvotes} Downvotes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
