import type {Post} from "~/entities/post";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faHeart, faHeartBroken, faStar} from "@fortawesome/free-solid-svg-icons";
import {DateFormatter} from "~/utils/date_formatter";

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    return (
        <div className="bg-gradient-to-br from-[#e74c3c] via-[#641e16] to-[#ec7063] p-[2px] rounded-lg">
        <div className="w-full bg-[#1E1E1E] text-white rounded-lg p-4">
            <div className="flex items-start mb-3">
                <div>
                    <div className="flex flex-col justify-start items-start">
                        <span className="font-bold mr-1">{post.relationships.author?.attributes.username}</span>
                        <span className="text-gray-400">{post.attributes.title} · {DateFormatter.formatDate(post.attributes.createdAt)}</span>
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
                    <span className="text-gray-400 group-hover:text-[#3498db] transition-all duration-300">596</span>
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