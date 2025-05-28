import type { User } from "./user";
import type { Tag } from "./tag";
import type { Vote } from "./vote";

export interface Post {
    type: string;
    id: number;
    attributes: PostAttributes;
    relationships: PostRelationships;
    links: PostLinks;
    votes: Vote[];
    tags: Tag[];
}

export interface PostAttributes {
    title: string;
    text: string;
    status: "NEW" | "ACTIVE" | "FIRST_REACTION" | "OUTDATED";
    imagePath: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    is_commentable: boolean;
}

export interface PostRelationships {
    author: User|null;
    comments: Post[];
    post: Post;
}

export interface PostLinks {
    self: string;
    parent: string;
}

