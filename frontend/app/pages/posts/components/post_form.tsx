import React, {useRef, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {PostsService} from "~/services/post_service";
import {AlertDestructiveEnum} from "~/components/alert_destructive";
import {faImage} from "@fortawesome/free-solid-svg-icons";

type PostFormProps = {
    titlePlaceholder: string;
    textareaSize: number;
    postParentId: number | null;
    submitButtonText: string;
    setMessage: (error: string) => void;
    setType: (type: AlertDestructiveEnum) => void;
};

export function PostForm({ setMessage, setType, submitButtonText, titlePlaceholder, textareaSize, postParentId = null }: PostFormProps) {
    const [postText, setPostText] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [tags, setTags] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    function clearInputs (){
        setPostText('');
        setPostTitle('');
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setTags("");
    }

    function validateData(){
        if (!postTitle.trim()) {
            throw new Error('Please enter a valid post title.');
        }

        if (!postText.trim()) {
            throw new Error('Please enter a valid post text.' );
        }
    }

      const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
          validateData();
          const tagArray = tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
            .map((tag) => {
              const cleanTag = tag.replace(/^#+/, "").trim();
              return `#${cleanTag}`;
            });

          await new PostsService().create(
            postTitle,
            postText,
            selectedImage,
            postParentId,
            tagArray
          );
          clearInputs();
          setType(AlertDestructiveEnum.success);
          setMessage("Post created successfully.");
        } catch (err) {
          setType(AlertDestructiveEnum.error);
          setMessage(
            err instanceof Error
              ? err.message
              : "An unknown error occurred. Hold tight!"
          );
        } finally {
          setIsSubmitting(false);
        }
      };

      return (
        <form
          onSubmit={handlePost}
          className="flex flex-col bg-[#1c1c1c] text-white p-4 rounded-lg mx-auto"
        >
          <input
            type="text"
            placeholder={titlePlaceholder}
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


            {/* Icon row + Post button */}
            <div className="flex items-center justify-between mt-6 border-gray-500">
                {/* Icons */}
                <div className="flex items-center space-x-4 text-[#e74c3c]">
                    <button type="button" className="cursor-pointer"
                            onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                        <FontAwesomeIcon icon={faImage} />
                    </button>
                </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer relative uppercase group border-2 border-[#e74c3c] overflow-clip bg-[#140c13] rounded-full px-10 py-1 shadow-[0_0_7px_#e74c3c] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center font-bold">
            {isSubmitting ? "Posting..." : submitButtonText}
          </span>
          <span className="absolute top-0 bottom-0 left-[-10%] w-[200%] bg-[#e74c3c] transform -translate-x-full skew-x-[-20deg] transition-transform duration-300 ease-in-out group-hover:translate-x-0"></span>
        </button>
      </div>

      <div>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Add tags (comma separated, e.g. #tech, #news)"
          className="w-full p-2 rounded-lg border border-[#2a1f29] bg-[#140c13] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#e74c3c] focus:border-[#e74c3c] transition-colors"
        />
      </div>
    </form>
  );
}
