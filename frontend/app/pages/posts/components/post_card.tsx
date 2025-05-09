import type {Post} from "~/entities/post";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faHeart, faHeartBroken, faPen, faStar, faTrash} from "@fortawesome/free-solid-svg-icons";
import {DateFormatter} from "~/utils/date_formatter";
import React, {useState, useEffect} from "react";
import {PostsService} from "~/services/post_service";
import {AlertDestructiveEnum} from "~/components/alert_destructive";

interface PostCardProps {
    post: Post;
    setMessage: (error: string) => void;
    setType: (type: AlertDestructiveEnum) => void;
}

export function PostCard({ post, setMessage, setType }: PostCardProps) {
    const tags = ["#Biserica", "#me2", "#Ibiza",]
    const [currentPost, setCurrentPost] = useState(post);

    useEffect(() => {
        new PostsService().find(post.id.toString()).then(freshPost => { setCurrentPost(freshPost); })
    }, [post.id]);

    function deletePost(event: React.MouseEvent<HTMLSpanElement>, id: number) {
        event.preventDefault();

        new PostsService().delete(id.toString()).then(() => {
            setType(AlertDestructiveEnum.success);
            setMessage("Post deleted successfully.");
        }).catch((err) => {
            setType(AlertDestructiveEnum.error);
            setMessage(err instanceof Error ? err.message : "An unknown error occurred. Hold tight!")
        });
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
                            <span className="font-bold mr-1 flex"> {post.attributes.title} </span>
                            {canEditPost(currentPost)  &&  (
                                <div className="flex items-center justify-end">
                                <a className="text-orange-600 mr-4 text-sm cursor-pointer hover:underline" href={`/posts/${post.id.toString()}/edit`}>
                                    Edit
                                     <FontAwesomeIcon icon={faPen} className="ml-2" />
                                </a>

                                    <span className="text-red-700 text-sm cursor-pointer hover:underline" onClick={(e) => deletePost(e, post.id)}>
                                    Delete
                                     <FontAwesomeIcon icon={faTrash} className="ml-2" />
                                </span>
                                </div>
                            )}
                        </div>
                        <span
                            className="flex flex-wrap"
                        >
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-600 py-1 px-2 mr-2 my-1 rounded-full text-xs shrink-0"
                                >
                                    {tag}
                                </span>
                            ))}
                          </span>
                        <span className="text-gray-400">{currentPost.relationships?.author?.attributes.username} · {DateFormatter.formatDate(post.attributes.createdAt)} · DRAFT </span>
                    </div>
                </div>
            </div>
            <p className="mb-3 leading-relaxed">
                {post.attributes.text}
            </p>
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
                    <span className="text-gray-400 group-hover:text-[#e74c3c] transition-all duration-300">1,600</span>
                </div>
                <div className="group flex items-center space-x-2 cursor-pointer transition-all duration-500">
                    <div className="relative">
                        <div className="absolute w-6 h-6 rounded-full group-hover:scale-100 bg-[#3498db] transition-all duration-200 opacity-20 scale-0 -translate-x-1/5 -translate-y-1/16" />
                        <FontAwesomeIcon
                            icon={faComment}
                            className="text-gray-400 group-hover:text-[#3498db] relative transition-all duration-300"
                        />
                    </div>
                    <span className="text-gray-400 group-hover:text-[#3498db] transition-all duration-300">{currentPost.relationships?.comments?.length ?? "0"}</span>
                </div>
                <div className="group flex items-center space-x-2 cursor-pointer transition-all duration-500">
                    <div className="relative">
                        <div className="absolute w-6 h-6 rounded-full group-hover:scale-100 bg-[#2ecc71] transition-all duration-200 opacity-20 scale-0 -translate-x-1/5 -translate-y-1/16" />
                        <FontAwesomeIcon
                            icon={faHeart}
                            className="text-gray-400 group-hover:text-[#2ecc71] relative transition-all duration-300"
                        />
                    </div>
                    <span className="text-gray-400 group-hover:text-[#2ecc71] transition-all duration-300">21.0K</span>
                </div>
                <div className="group flex items-center space-x-2 cursor-pointer transition-all duration-500">
                    <div className="relative">
                        <div className="absolute w-6 h-6 rounded-full group-hover:scale-100 bg-[#d35400] transition-all duration-200 opacity-20 scale-0 -translate-x-1/5 -translate-y-1/16" />
                        <FontAwesomeIcon
                            icon={faHeartBroken}
                            className="text-gray-400 group-hover:text-[#d35400] relative transition-all duration-300"
                        />
                    </div>
                    <span className="text-gray-400 group-hover:text-[#d35400] transition-all duration-300">19.4K</span>
                </div>
            </div>
        </div>
        </div>
    );
}