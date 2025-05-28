import React, { useState, useRef, useEffect } from "react";
import MainLayout from "~/pages/layouts/main_layouts";
import type { User } from "~/entities/user";
import { UserService } from "~/services/user_service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faImage } from "@fortawesome/free-solid-svg-icons";
import type { UpdateProfileDTO } from "~/services/dtos/requests/update_profile_dto";

interface ProfileProps {
  user: User;
}

export function Profile({ user }: ProfileProps) {
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState<"error" | "success">("error");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UpdateProfileDTO>({
    id: user.id,
    username: user.attributes.username,
    phoneNumber: user.attributes.phoneNumber || "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.attributes.imagePath || null
  );

  // Update local state when user prop changes
  useEffect(() => {
    setEditedUser({
      id: user.id,
      username: user.attributes.username,
      phoneNumber: user.attributes.phoneNumber || "",
    });
    setImagePreview(user.attributes.imagePath || null);
  }, [user]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const userService = new UserService();
      const updateData: UpdateProfileDTO = {
        id: user.id,
        username: editedUser.username,
        phoneNumber: editedUser.phoneNumber,
        imagePath: selectedImage || undefined,
      };

      const updatedUser = await userService.updateProfile(updateData);

      setEditedUser({
        id: updatedUser.id,
        username: updatedUser.attributes.username,
        phoneNumber: updatedUser.attributes.phoneNumber || "",
      });
      setImagePreview(updatedUser.attributes.imagePath || null);
      setSelectedImage(null);

      setMessage("Profile updated successfully");
      setAlertType("success");
      setIsEditing(false);
      sessionStorage.setItem("username", editedUser.username);
    } catch (error) {
      setMessage("Failed to update profile");
      setAlertType("error");
    }
  };

  const handleCancel = () => {
    setEditedUser({
      id: user.id,
      username: user.attributes.username,
      phoneNumber: user.attributes.phoneNumber || "",
    });
    setSelectedImage(null);
    setImagePreview(user.attributes.imagePath || null);
    setIsEditing(false);
  };

  return (
    <MainLayout>
      <div className="my-4 max-w-xl mx-auto px-4">
        <div className="bg-gradient-to-br from-[#e74c3c] via-[#641e16] to-[#ec7063] p-[2px] rounded-lg mb-8">
          <div className="bg-[#1E1E1E] rounded-lg p-6">
            <div className="flex items-center space-x-4">
              {isEditing ? (
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-[#2c2c2c] flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt={editedUser.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-[#e74c3c]">
                        {editedUser.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-[#e74c3c] text-white p-2 rounded-full hover:bg-[#c0392b] transition-colors"
                  >
                    <FontAwesomeIcon icon={faImage} />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
              ) : imagePreview ? (
                <img
                  src={imagePreview}
                  alt={editedUser.username}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#2c2c2c] flex items-center justify-center">
                  <span className="text-4xl text-[#e74c3c]">
                    {editedUser.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editedUser.username}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          username: e.target.value,
                        })
                      }
                      className="w-full bg-transparent text-white text-2xl font-bold border-b border-gray-600 focus:border-[#e74c3c] outline-none"
                    />
                    <p className="text-gray-400">{user.attributes.email}</p>
                    <input
                      type="tel"
                      value={editedUser.phoneNumber}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          phoneNumber: e.target.value,
                        })
                      }
                      placeholder="Phone Number"
                      className="w-full bg-transparent text-gray-400 border-b border-gray-600 focus:border-[#e74c3c] outline-none mt-2"
                    />
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-sm text-gray-400">
                        Score: {user.attributes.score}
                      </span>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-[#e74c3c] text-white rounded hover:bg-[#c0392b] transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl font-bold">
                        {editedUser.username}
                      </h1>
                      <button
                        onClick={handleEdit}
                        className="text-gray-400 hover:text-[#e74c3c] transition-colors"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                    </div>
                    <p className="text-gray-400">{user.attributes.email}</p>
                    <p className="text-gray-400">
                      Phone: {editedUser.phoneNumber || "Not set"}
                    </p>
                    <div className="mt-2 flex items-center space-x-4">
                      <span className="text-sm text-gray-400">
                        Score: {user.attributes.score}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`fixed bottom-4 right-4 p-4 rounded-lg ${
              alertType === "error" ? "bg-red-500" : "bg-green-500"
            } text-white`}
          >
            {message}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
