import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faChartBar, faImage} from "@fortawesome/free-solid-svg-icons";

export function PostForm() {
    const [postText, setPostText] = useState('');

    const handlePost = () => {
        if (postText.trim()) {
            // Handle the post submission (e.g., send to an API)
            console.log('Posting:', postText);
            setPostText(''); // Clear the input
        }
    };

    return (
        <div className="flex flex-col bg-[#1c1c1c] text-white p-4 rounded-lg mx-auto">

            <textarea
                className="w-full bg-transparent text-lg outline-none placeholder:text-gray-500 resize-none transition"
                rows={!postText.trim() ? 2 : 4}
                placeholder="What's happening?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
            />

            {/* Icon row + Post button */}
            <div className="flex items-center justify-between mt-6 border-gray-500">
                {/* Icons */}
                <div className="flex items-center space-x-4 text-[#e74c3c]">
                    <button type="button" className="cursor-pointer">
                        <FontAwesomeIcon icon={faImage} />
                    </button>
                    <button type="button" className="cursor-pointer">
                        <FontAwesomeIcon icon={faChartBar} />
                    </button>

                </div>

                {/* Post button */}
                <button
                    onClick={handlePost}
                    className="cursor-pointer relative uppercase group border-2 border-[#e74c3c] overflow-clip bg-[#140c13] rounded-full px-10 py-1 shadow-[0_0_7px_#e74c3c]"
                    disabled={!postText.trim()}
                >

                    {/* Button text (kept above the overlay) */}
                    <span className="relative z-10 flex items-center font-bold">
              post
            </span>

                    {/* Overlay that slides in on hover */}
                    <span className="absolute top-0 bottom-0 left-[-10%] w-[200%] bg-[#e74c3c] transform -translate-x-full skew-x-[-20deg] transition-transform duration-300 ease-in-out group-hover:translate-x-0"></span>

                </button>
            </div>
        </div>
    );
}
