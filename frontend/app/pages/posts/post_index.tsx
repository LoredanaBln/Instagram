import React, { useState, useMemo, useEffect } from "react";
import {PostForm} from "~/pages/posts/components/post_form";
import type {Post} from "~/entities/post";
import {PostCard} from "~/pages/posts/components/post_card";
import {AlertDestructive, AlertDestructiveEnum} from "~/components/alert_destructive";
import MainLayout from "~/pages/layouts/main_layouts";
import {PostsService} from "~/services/post_service";

interface PostIndexProps {
    posts: Post[];
}

export function PostIndex({ posts }: PostIndexProps) {
    const [message, setMessage] = React.useState("");
    const [alertType, setAlertType] = React.useState(AlertDestructiveEnum.error);

  const [searchText, setSearchText] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [showOwnPosts, setShowOwnPosts] = useState(false);

  const currentUsername = sessionStorage.getItem("username");

  const { uniqueTags, uniqueUsers } = useMemo(() => {
    const tags = new Set<string>();
    const users = new Set<string>();

    posts.forEach((post) => {
      if (post.attributes?.tags) {
        post.attributes.tags.forEach((tag) => tags.add(tag));
      }
      if (post.relationships?.author?.attributes?.username) {
        users.add(post.relationships.author.attributes.username);
      }
    });

    return {
      uniqueTags: Array.from(tags).sort(),
      uniqueUsers: Array.from(users).sort(),
    };
  }, [posts]);

  useEffect(() => {
    const tagFilter = document.getElementById("tagFilter") as HTMLSelectElement;
    const userFilter = document.getElementById(
      "userFilter"
    ) as HTMLSelectElement;
    const searchInput = document.getElementById("search") as HTMLInputElement;
    const ownPostsCheckbox = document.getElementById(
      "ownPosts"
    ) as HTMLInputElement;

    if (tagFilter) {
      while (tagFilter.options.length > 1) {
        tagFilter.remove(1);
      }
      uniqueTags.forEach((tag) => {
        const option = new Option(tag, tag);
        tagFilter.add(option);
      });
    }

    if (userFilter) {
      while (userFilter.options.length > 1) {
        userFilter.remove(1);
      }
      uniqueUsers.forEach((username) => {
        const option = new Option(username, username);
        userFilter.add(option);
      });
    }

    if (searchInput) {
      searchInput.value = searchText;
      searchInput.addEventListener("input", (e) => {
        setSearchText((e.target as HTMLInputElement).value);
      });
    }

    if (tagFilter) {
      tagFilter.value = selectedTag;
      tagFilter.addEventListener("change", (e) => {
        setSelectedTag((e.target as HTMLSelectElement).value);
      });
    }

    if (userFilter) {
      userFilter.value = selectedUser;
      userFilter.addEventListener("change", (e) => {
        setSelectedUser((e.target as HTMLSelectElement).value);
      });
    }

    if (ownPostsCheckbox) {
      ownPostsCheckbox.checked = showOwnPosts;
      ownPostsCheckbox.addEventListener("change", (e) => {
        setShowOwnPosts((e.target as HTMLInputElement).checked);
      });
    }

    return () => {
      if (searchInput) searchInput.removeEventListener("input", () => {});
      if (tagFilter) tagFilter.removeEventListener("change", () => {});
      if (userFilter) userFilter.removeEventListener("change", () => {});
      if (ownPostsCheckbox)
        ownPostsCheckbox.removeEventListener("change", () => {});
    };
  }, [
    uniqueTags,
    uniqueUsers,
    searchText,
    selectedTag,
    selectedUser,
    showOwnPosts,
  ]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (
        searchText &&
        !post.attributes.title.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return false;
      }

      if (selectedTag) {
        const postTags = post.attributes.tags || [];
        if (!postTags.includes(selectedTag)) return false;
      }

      if (selectedUser && post.relationships.author) {
        const postUsername = post.relationships.author.attributes.username;
        if (postUsername !== selectedUser) {
          return false;
        }
      }

      if (showOwnPosts && post.relationships.author) {
        if (post.relationships.author.attributes.username !== currentUsername) {
          return false;
        }
      }

      return true;
    });
  }, [
    posts,
    searchText,
    selectedTag,
    selectedUser,
    showOwnPosts,
    currentUsername,
  ]);

    return (
        <MainLayout>
            <div className="my-4 max-w-xl mx-auto px-4">
                <PostForm
                    setMessage={setMessage}
                    setType={setAlertType}
                    submitButtonText="Post"
                    textareaSize={3}
                    titlePlaceholder="What's happening?"
                    postParentId={null}
                />

              <div className="flex flex-col w-full gap-4 mt-4">
                {filteredPosts.map((post) => (
                  <a href={"/posts/" + post.id} key={post.id}>
                    <PostCard
                      post={post}
                      setMessage={setMessage}
                      setType={setAlertType}
                    />
                  </a>))}
              </div>

                <AlertDestructive className="fixed bottom-4 right-0 w-[95%] mr-[2.5%] md:w-80 md:mr-0 md:right-4" message={message} type={alertType}/>
            </div>
        </MainLayout>
    );
}
