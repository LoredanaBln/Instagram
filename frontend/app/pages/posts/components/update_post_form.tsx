import React, {useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {PostsService} from "~/services/post_service";
import {AlertDestructiveEnum} from "~/components/alert_destructive";
import {faImage} from "@fortawesome/free-solid-svg-icons";
import type {Post} from "~/entities/post";

type UpdatePostFormProps = {
    post: Post;
    textareaSize: number;
    submitButtonText: string;
    setMessage: (error: string) => void;
    setType: (type: AlertDestructiveEnum) => void;
};

export function UpdatePostForm({
       post,
       submitButtonText,
       textareaSize,
       setMessage,
       setType
   }: UpdatePostFormProps) {
    const [postTitle, setPostTitle] = useState('');
    const [postText, setPostText] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setPostTitle(post.attributes.title);
        setPostText(post.attributes.text);
        setImagePreview(post.attributes.imagePath);
    }, [post.id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const validateData = () => {
        if (!postTitle.trim()) {
            throw new Error('Please enter a valid post title.');
        }
        if (!postText.trim()) {
            throw new Error('Please enter a valid post text.');
        }
    };

    const handleUpdate = () => {
        try {
            validateData();
            new PostsService().update(post.id, postTitle, postText, selectedImage, post.relationships.post?.id).then(() => {
                setType(AlertDestructiveEnum.success);
                setMessage("Post updated successfully.");
            });
        } catch (err) {
            setType(AlertDestructiveEnum.error);
            setMessage(err instanceof Error ? err.message : "An unknown error occurred.");
        }
    };

    return (
        <div className="flex flex-col bg-[#1c1c1c] text-white p-4 rounded-lg mx-auto">
            <input
                type="text"
                placeholder="Enter post title"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full font-bold mb-2 bg-transparent text-lg outline-none placeholder:text-gray-500 resize-none transition"
            />

            <textarea
                className="w-full text-gray-200 bg-transparent text-lg outline-none placeholder:text-gray-500 resize-none transition"
                rows={textareaSize}
                placeholder="Tell us more..."
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
            />

            {imagePreview && (
                <div className="mt-4">
                    <img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded" />
                </div>
            )}

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
            />

            <div className="flex items-center justify-between mt-6 border-gray-500">
                <div className="flex items-center space-x-4 text-[#e74c3c]">
                    <button type="button" className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <FontAwesomeIcon icon={faImage} />
                    </button>
                </div>

                <button
                    onClick={handleUpdate}
                    className="cursor-pointer relative uppercase group border-2 border-[#e74c3c] overflow-clip bg-[#140c13] rounded-full px-10 py-1 shadow-[0_0_7px_#e74c3c]"
                >
                    <span className="relative z-10 flex items-center font-bold">
                        {submitButtonText}
                    </span>
                    <span className="absolute top-0 bottom-0 left-[-10%] w-[200%] bg-[#e74c3c] transform -translate-x-full skew-x-[-20deg] transition-transform duration-300 ease-in-out group-hover:translate-x-0"></span>
                </button>
            </div>
        </div>
    );
}
